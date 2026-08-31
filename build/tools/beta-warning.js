/* Beta acknowledgement for the Entropy Workshop. This classic script is
   inlined into both builds and stores only the accepted release string; it
   never reads or writes entropy input. */

'use strict';

const EntropyBetaWarning = (() => {
  const STORAGE_KEY = 'selfcustody-entropy-beta-accepted';

  const initGate = version => {
    const overlay = document.getElementById('beta-disclaimer');
    const accept = document.getElementById('beta-disclaimer-accept');
    if (!overlay || !accept) return false;

    let accepted = false;
    try {
      accepted = localStorage.getItem(STORAGE_KEY) === version;
    } catch (error) {
      /* Some file:// origins and private modes deny storage. Re-showing the
         warning on every load is the safe fallback. */
    }
    if (accepted) {
      overlay.remove();
      return false;
    }

    const gateRoot = document.querySelector('.sc-workshop') || document.body;
    const previousBodyOverflow = document.body.style.overflow;
    overlay.hidden = false;
    gateRoot.classList.add('beta-gate-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
      accept.focus();
    }));

    /* The acknowledgement is the modal's only focusable control. Keep Tab on
       it so keyboard users cannot move into the covered page. */
    accept.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      accept.focus();
    });

    accept.addEventListener('click', () => {
      try { localStorage.setItem(STORAGE_KEY, version); } catch (error) {}
      gateRoot.classList.remove('beta-gate-open');
      document.body.style.overflow = previousBodyOverflow;
      overlay.classList.add('is-dismissed');
      const remove = () => overlay.remove();
      const reducedMotion = typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) remove();
      else setTimeout(remove, 260);
    });
    return true;
  };

  const init = ({ version }) => {
    if (typeof version !== 'string' || !version) throw new Error('beta release version is required');
    return initGate(version);
  };

  return { init };
})();
