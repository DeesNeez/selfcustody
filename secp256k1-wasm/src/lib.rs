//! WebAssembly bindings to libsecp256k1 for the SelfCustody.ca Entropy Workshop.
//!
//! Every secp256k1 curve operation in the app goes through this library (the
//! JS side is build/tools/secp256k1-wasm.js). The native boundary is kept
//! byte-for-byte compatible with the merged EntropyLab source it adapts:
//! scalars and hashes cross as fixed 32-byte buffers, public points as their
//! SEC serialization (33 bytes compressed / 65 uncompressed), ECDSA
//! signatures as 64-byte compact (r || s). There are no handles and no
//! strings; a point "object" in JS is just its compressed encoding, re-parsed
//! on each call.
//!
//! Private keys enter WASM linear memory only for the duration of one call,
//! matching the Uint8Array lifetimes of the previous implementation. This
//! library never generates randomness: signing is RFC 6979 with caller-fixed
//! extra entropy, exactly as before.
//!
//! Context: `secp256k1_context_static` ships with an unbuilt ecmult_gen table
//! (libsecp256k1 0.7.x), so signing/key-creation calls reject it. We create
//! one proper preallocated context at first use; it holds no secret state
//! (only precomputed tables) and lives for the page's lifetime.

use secp256k1_sys as ffi;
use std::alloc::{alloc, Layout};
use std::ptr::NonNull;
use std::ptr;
use std::sync::OnceLock;

// From the pinned vendored include/secp256k1.h:
// SECP256K1_CONTEXT_VERIFY = (1<<0)|(1<<8), SECP256K1_CONTEXT_SIGN = (1<<0)|(1<<9).
const CONTEXT_FLAGS: u32 = (1 << 0) | (1 << 8) | (1 << 9);

struct Context(*mut ffi::Context);
// wasm32-unknown-unknown is single-threaded, so sharing the pointer is sound.
unsafe impl Sync for Context {}
unsafe impl Send for Context {}
static CONTEXT: OnceLock<Context> = OnceLock::new();

fn ctx() -> *const ffi::Context {
    CONTEXT
        .get_or_init(|| unsafe {
            let size = ffi::secp256k1_context_preallocated_size(CONTEXT_FLAGS);
            // 16 matches max_align_t for the wasm32 C ABI.
            let layout = Layout::from_size_align(size, 16).expect("valid context layout");
            let mem = alloc(layout);
            assert!(!mem.is_null(), "context allocation failed");
            let cx = ffi::secp256k1_context_preallocated_create(
                NonNull::new(mem.cast()).expect("allocation is non-null"),
                CONTEXT_FLAGS,
            );
            Context(cx.as_ptr())
        })
        .0
}

/// Allocates `len` zero-filled bytes of linear memory for JS to fill. Pair
/// with `secp_free`. The box owns exactly `len` bytes, so the deallocation
/// layout is reproducible from `len` alone.
#[no_mangle]
pub extern "C" fn secp_alloc(len: usize) -> *mut u8 {
    Box::into_raw(vec![0u8; len].into_boxed_slice()) as *mut u8
}

/// # Safety
/// `ptr` must come from `secp_alloc` and `len` must be exactly the length
/// passed there: the box is reconstructed from `len` alone, so any other
/// length deallocates with the wrong layout.
#[no_mangle]
pub unsafe extern "C" fn secp_free(ptr: *mut u8, len: usize) {
    // Zero the buffer before deallocation: inputs can carry private keys and
    // seeds, and freed linear memory must not retain them for a later
    // allocation to expose. Previously this dropped the allocation as it
    // stood, so every scalar the page derived stayed in the heap until some
    // later allocation happened to land on it.
    wipe(ptr, len);
    let slice = ptr::slice_from_raw_parts_mut(ptr, len);
    drop(Box::from_raw(slice));
}

/// Overwrites `len` bytes at `ptr` with zeroes. Volatile stores plus a
/// compiler fence, so the writes survive an optimizer that can see the memory
/// is never read again. The `zeroize` crate does the same thing; the project's
/// dependency policy forbids adding it for this.
///
/// # Safety
/// `ptr` must be null or point to `len` writable bytes.
unsafe fn wipe(ptr: *mut u8, len: usize) {
    if !ptr.is_null() {
        for i in 0..len {
            ptr::write_volatile(ptr.add(i), 0u8);
        }
    }
    std::sync::atomic::compiler_fence(std::sync::atomic::Ordering::SeqCst);
}

/// Serializes `pk` into `out` (which must hold 65 bytes). Returns the byte
/// length (33 or 65), or -1 on failure.
unsafe fn serialize(pk: *const ffi::PublicKey, out: *mut u8, compressed: bool) -> i32 {
    let mut len: usize = if compressed { 33 } else { 65 };
    let flags = if compressed {
        ffi::SECP256K1_SER_COMPRESSED
    } else {
        ffi::SECP256K1_SER_UNCOMPRESSED
    };
    if ffi::secp256k1_ec_pubkey_serialize(ctx(), out, &mut len, pk, flags) != 1 {
        return -1;
    }
    len as i32
}

unsafe fn parse(input: *const u8, input_len: usize) -> Option<ffi::PublicKey> {
    let mut pk = ffi::PublicKey::new();
    if ffi::secp256k1_ec_pubkey_parse(ctx(), &mut pk, input, input_len) != 1 {
        return None;
    }
    Some(pk)
}

/// 1 if the 32 bytes at `seckey` are a valid secp256k1 secret key, else 0.
#[no_mangle]
pub unsafe extern "C" fn secp_seckey_valid(seckey: *const u8) -> i32 {
    ffi::secp256k1_ec_seckey_verify(ctx(), seckey)
}

/// Public key for `seckey`, serialized into `out`. Returns 33/65, or -1 if
/// the key is invalid.
#[no_mangle]
pub unsafe extern "C" fn secp_pubkey_create(seckey: *const u8, out: *mut u8, compressed: i32) -> i32 {
    let mut pk = ffi::PublicKey::new();
    if ffi::secp256k1_ec_pubkey_create(ctx(), &mut pk, seckey) != 1 {
        return -1;
    }
    serialize(&pk, out, compressed != 0)
}

/// Validates a SEC-encoded point and re-serializes it into `out`. Returns
/// 33/65, or -1 if the encoding is not a valid curve point.
#[no_mangle]
pub unsafe extern "C" fn secp_point_validate(
    input: *const u8,
    input_len: usize,
    out: *mut u8,
    compressed: i32,
) -> i32 {
    match parse(input, input_len) {
        Some(pk) => serialize(&pk, out, compressed != 0),
        None => -1,
    }
}

/// Compressed encoding of the sum of two SEC-encoded points. Returns 33, or
/// -1 if either point is invalid or the sum is the point at infinity.
#[no_mangle]
pub unsafe extern "C" fn secp_point_add(
    a: *const u8,
    a_len: usize,
    b: *const u8,
    b_len: usize,
    out: *mut u8,
) -> i32 {
    let (pa, pb) = match (parse(a, a_len), parse(b, b_len)) {
        (Some(pa), Some(pb)) => (pa, pb),
        _ => return -1,
    };
    let ins: [*const ffi::PublicKey; 2] = [&pa, &pb];
    let mut sum = ffi::PublicKey::new();
    if ffi::secp256k1_ec_pubkey_combine(ctx(), &mut sum, ins.as_ptr(), 2) != 1 {
        return -1;
    }
    serialize(&sum, out, true)
}

/// SEC-serializes `point * scalar` into `out`. Returns 33/65, or -1 if the
/// point is invalid, the scalar is out of range, or the result is the point
/// at infinity.
#[no_mangle]
pub unsafe extern "C" fn secp_point_mul(
    point: *const u8,
    point_len: usize,
    scalar: *const u8,
    out: *mut u8,
    compressed: i32,
) -> i32 {
    let mut pk = match parse(point, point_len) {
        Some(pk) => pk,
        None => return -1,
    };
    if ffi::secp256k1_ec_pubkey_tweak_mul(ctx(), &mut pk, scalar) != 1 {
        return -1;
    }
    serialize(&pk, out, compressed != 0)
}

/// RFC 6979 ECDSA over the 32-byte `msg32`, serialized compact (r || s, low-S
/// guaranteed by libsecp256k1) into `out64`. `extra32` is either null (plain
/// RFC 6979) or a pointer to 32 bytes of extra entropy mixed into the nonce
/// exactly like Bitcoin Core's low-r grinding counter. Returns 64, or -1 if
/// the secret key is invalid.
#[no_mangle]
pub unsafe extern "C" fn secp_sign(
    msg32: *const u8,
    seckey: *const u8,
    extra32: *const u8,
    out64: *mut u8,
) -> i32 {
    let mut sig = ffi::Signature::new();
    let noncedata = if extra32.is_null() {
        ptr::null()
    } else {
        extra32.cast()
    };
    if ffi::secp256k1_ecdsa_sign(
        ctx(),
        &mut sig,
        msg32,
        seckey,
        ffi::secp256k1_nonce_function_rfc6979,
        noncedata,
    ) != 1
    {
        return -1;
    }
    if ffi::secp256k1_ecdsa_signature_serialize_compact(ctx(), out64, &sig) != 1 {
        return -1;
    }
    64
}

/// Verifies a compact (r || s) ECDSA signature. Returns 1 for valid, 0 for
/// invalid, -1 if the public key encoding is not a curve point.
#[no_mangle]
pub unsafe extern "C" fn secp_verify(
    msg32: *const u8,
    pubin: *const u8,
    pub_len: usize,
    sig64: *const u8,
) -> i32 {
    let pk = match parse(pubin, pub_len) {
        Some(pk) => pk,
        None => return -1,
    };
    let mut sig = ffi::Signature::new();
    if ffi::secp256k1_ecdsa_signature_parse_compact(ctx(), &mut sig, sig64) != 1 {
        return 0;
    }
    ffi::secp256k1_ecdsa_verify(ctx(), &sig, msg32, &pk)
}

/// Normalizes a compact signature to low-S form in place. Returns 1 if S was
/// flipped, 0 if it was already low, -1 if the input is not a parseable
/// signature.
#[no_mangle]
pub unsafe extern "C" fn secp_sig_normalize(sig64: *mut u8) -> i32 {
    let mut sig_in = ffi::Signature::new();
    if ffi::secp256k1_ecdsa_signature_parse_compact(ctx(), &mut sig_in, sig64) != 1 {
        return -1;
    }
    let mut sig_out = ffi::Signature::new();
    let flipped = ffi::secp256k1_ecdsa_signature_normalize(ctx(), &mut sig_out, &sig_in);
    if ffi::secp256k1_ecdsa_signature_serialize_compact(ctx(), sig64, &sig_out) != 1 {
        return -1;
    }
    flipped
}

#[cfg(test)]
mod tests {
    use super::*;

    // The allocator pair must round-trip exact sizes, including zero length:
    // secp_free reconstructs a Box<[u8]> whose layout comes from `len` alone,
    // so a capacity mismatch corrupts the host allocator. The old pair asked
    // Vec for a capacity and returned the pointer, then freed it as a Vec of
    // length zero -- sound only because the allocator was asked for the same
    // layout by luck of `len` matching capacity.
    //
    // Host-side and free of FFI on purpose, so `cargo test` covers it and
    // `cargo +nightly miri test` can interpret it for undefined behaviour.
    // Nothing here calls libsecp256k1: Miri cannot execute the vendored C.
    #[test]
    fn alloc_free_round_trips_exact_sizes() {
        for len in [0usize, 1, 2, 15, 16, 31, 32, 33, 255, 256, 4096] {
            for cycle in 0..8u8 {
                let ptr = secp_alloc(len);
                assert!(!ptr.is_null(), "allocation of {len} bytes returned null");
                unsafe {
                    for i in 0..len {
                        // A recycled block must never expose stale bytes.
                        assert_eq!(ptr.add(i).read(), 0, "len {len} cycle {cycle} byte {i}");
                        ptr.add(i).write_volatile(cycle ^ i as u8);
                    }
                    secp_free(ptr, len);
                }
            }
        }
    }

    // The wipe itself, observed while the allocation is still live. Checking
    // it after secp_free would be reading freed memory -- undefined behaviour,
    // and the first thing Miri would reject.
    #[test]
    fn wipe_clears_every_byte() {
        for len in [0usize, 1, 32, 33, 4096] {
            let ptr = secp_alloc(len);
            unsafe {
                for i in 0..len {
                    ptr.add(i).write_volatile(0xa5);
                }
                wipe(ptr, len);
                for i in 0..len {
                    assert_eq!(ptr.add(i).read(), 0, "len {len} byte {i} survived the wipe");
                }
                secp_free(ptr, len);
            }
        }
    }

    // A null pointer reaches wipe only through a corrupted call, but it must
    // not be a segfault when it does.
    #[test]
    fn wipe_tolerates_null() {
        unsafe { wipe(ptr::null_mut(), 32) };
    }
}
