'use strict';
(() => {
  const key = 'cpp-labs-lab7-v1';
  let saved = { answers: {}, done: {} };
  let toastTimer;
  try { const data = JSON.parse(localStorage.getItem(key)); if (data && typeof data === 'object') saved = { answers: data.answers || {}, done: data.done || {} }; } catch { /* Storage may be disabled. */ }
  const persist = () => { try { localStorage.setItem(key, JSON.stringify(saved)); } catch { /* The lesson still works without storage. */ } };
  const notify = text => { const el = document.querySelector('#global-status'); el.replaceChildren(); const span = document.createElement('span'); span.textContent = text; el.append(span); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.replaceChildren(), 4500); };
  const source = step => { const code = step.querySelector('[data-source]'); const template = code.dataset.source; const value = step.querySelector('.answer-input')?.value.trim(); return value ? template.replace('____', value) : template; };
  const updateProgress = () => {
    const count = document.querySelectorAll('.done-check:checked').length;
    document.querySelector('#progress-count').textContent = `${count} / 6`;
    document.querySelector('.progress-fill').style.width = `${count / 6 * 100}%`;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(count));
    document.querySelectorAll('.step').forEach(step => { document.querySelector(`.lesson-nav a[href="#${step.id}"]`)?.classList.toggle('is-done', step.querySelector('.done-check').checked); });
    const next = [...document.querySelectorAll('.step')].find(step => !step.querySelector('.done-check').checked);
    const start = document.querySelector('#continue-link'); start.href = next ? `#${next.id}` : '#words'; start.textContent = count === 6 ? 'Review the words' : count ? 'Continue learning' : 'Start Step 1';
  };
  async function copy(text, message) {
    try { await navigator.clipboard.writeText(text); notify(message); }
    catch { notify('Copy is not available. Select the code and copy it.'); }
  }
  document.querySelectorAll('.step').forEach(step => {
    const number = step.dataset.step;
    const input = step.querySelector('.answer-input');
    const code = step.querySelector('[data-source]');
    const feedback = step.querySelector('.feedback');
    const renderCode = () => {
      const parts = code.dataset.source.split('____');
      const mark = document.createElement('mark'); const value = input.value.trim();
      mark.className = `code-gap${value ? ' is-filled' : ''}`; mark.textContent = value || '____';
      code.replaceChildren(document.createTextNode(parts[0]), mark, document.createTextNode(parts[1] || ''));
    };
    input.value = typeof saved.answers[number] === 'string' ? saved.answers[number].slice(0, 120) : '';
    renderCode();
    input.addEventListener('input', () => { saved.answers[number] = input.value; persist(); renderCode(); feedback.textContent = ''; feedback.className = 'feedback'; input.removeAttribute('aria-invalid'); });
    step.querySelector('form').addEventListener('submit', event => {
      event.preventDefault(); const answer = input.value.replace(/\s+/g, '');
      const expected = step.dataset.answer;
      if (!answer) { feedback.textContent = 'Write one answer first. You can open the hint.'; feedback.className = 'feedback error'; input.setAttribute('aria-invalid', 'true'); input.focus(); return; }
      if (answer === expected) { feedback.textContent = 'The gap is correct. Copy the code and run it in your C++ compiler.'; feedback.className = 'feedback success'; input.setAttribute('aria-invalid', 'false'); }
      else { feedback.textContent = 'Try again. Read the task and open the hint. Write only the missing part.'; feedback.className = 'feedback error'; input.setAttribute('aria-invalid', 'true'); }
    });
    step.querySelector('[data-copy]').addEventListener('click', () => copy(source(step), input.value.trim() ? 'Full code copied. Run it in your C++ compiler.' : 'Code copied. Replace ____ before you compile.'));
    step.querySelector('[data-download]').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([source(step)], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `step-${number}.cpp`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
    const check = step.querySelector('.done-check'); check.checked = saved.done[number] === true;
    check.addEventListener('change', () => { saved.done[number] = check.checked; persist(); updateProgress(); });
  });
  document.querySelectorAll('[data-copy-example]').forEach(button => button.addEventListener('click', () => copy(document.querySelector('#function-example').textContent, 'Example copied.')));
  document.querySelector('[data-reset]').addEventListener('click', () => { saved = { answers: {}, done: {} }; persist(); document.querySelectorAll('.answer-input').forEach(input => { input.value = ''; input.dispatchEvent(new Event('input')); }); document.querySelectorAll('.done-check').forEach(check => { check.checked = false; }); updateProgress(); notify('Answers and progress reset.'); });
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  const menu = document.querySelector('#lesson-menu'); const toggle = document.querySelector('#menu-toggle');
  const closeMenu = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Lesson menu'; };
  toggle.addEventListener('click', () => { const open = menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close menu' : 'Lesson menu'; });
  document.querySelectorAll('.lesson-nav a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio); if (!visible.length) return; const id = visible[0].target.id; document.querySelectorAll('.lesson-nav a').forEach(a => { if (a.hash === `#${id}`) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }); }, { rootMargin: '-10% 0px -55% 0px', threshold: [0, .1, .3] });
    document.querySelectorAll('#start, .step, #words').forEach(section => observer.observe(section));
  }
  updateProgress();
})();
