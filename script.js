(() => {
  const trigger = document.getElementById('open-envelope');
  const gate = document.getElementById('letter-gate');
  const invitation = document.getElementById('invitation');
  const heading = document.getElementById('couple-names');
  invitation.inert = true;
  invitation.setAttribute('aria-hidden', 'true');
  let opened = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  trigger.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    trigger.disabled = true;
    document.body.classList.add('is-opening', 'is-revealing');
    window.setTimeout(() => {
      invitation.inert = false;
      invitation.removeAttribute('aria-hidden');
      document.body.classList.add('is-revealed');
      window.scrollTo({ top: 0, behavior: 'instant' });
      heading.focus({ preventScroll: true });
      gate.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => { gate.hidden = true; }, reducedMotion ? 0 : 950);
    }, reducedMotion ? 20 : 2250);
  });

  const countdownSection = document.querySelector('[data-wedding-date]');
  const weddingTime = Date.parse(countdownSection.dataset.weddingDate);
  const countdownFields = ['days', 'hours', 'minutes', 'seconds'].map(unit => document.getElementById(`countdown-${unit}`));
  const countdownHeading = document.getElementById('countdown-heading');
  const countdownNote = document.getElementById('countdown-note');
  let countdownFinished = false;
  function updateCountdown() {
    const total = Math.max(0, Math.ceil((weddingTime - Date.now()) / 1000));
    const values = [Math.floor(total / 86400), Math.floor(total % 86400 / 3600), Math.floor(total % 3600 / 60), total % 60];
    countdownFields.forEach((field, index) => {
      const nextValue = String(values[index]).padStart(2, '0');
      if (field.textContent !== nextValue) field.textContent = nextValue;
    });
    if (total === 0 && !countdownFinished) {
      countdownFinished = true;
      countdownHeading.textContent = 'Наш день настал';
      countdownNote.textContent = 'Спасибо, что разделяете с нами эту радость.';
      countdownSection.classList.add('countdown-complete');
    }
    return total;
  }
  updateCountdown();
  const countdownTimer = window.setInterval(() => {
    if (updateCountdown() === 0) window.clearInterval(countdownTimer);
  }, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateCountdown(); });

  const photoDialog = document.getElementById('venue-photo-dialog');
  const photoButton = document.getElementById('open-venue-photo');
  const photoClose = document.getElementById('close-venue-photo');
  photoButton.addEventListener('click', () => {
    photoDialog.showModal();
    document.body.classList.add('photo-open');
    photoClose.focus();
  });
  photoClose.addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
  photoDialog.addEventListener('close', () => {
    document.body.classList.remove('photo-open');
    photoButton.focus({ preventScroll: true });
  });
})();
