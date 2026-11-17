'use strict';
(() => {
  const lesson = document.body.dataset.lesson || 'lab7';
  const key = `cpp-labs-${lesson}-v1`;
  const languageKey = 'cpp-labs-language-v1';
  const catalogs = window.CPPLabsTranslations;
  const languages = { en: 'English', ru: 'Русский', fr: 'Français', ar: 'العربية' };
  let language = 'en';
  let saved = { answers: {}, done: {} };
  let toastTimer;
  let toastMessage;
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && typeof data === 'object') saved = { answers: data.answers || {}, done: data.done || {} };
    const stored = localStorage.getItem(languageKey);
    if (Object.hasOwn(languages, stored)) language = stored;
  } catch { /* Reading lessons does not require browser storage. */ }
  const requested = new URL(location.href).searchParams.get('lang');
  if (Object.hasOwn(languages, requested)) language = requested;
  const t = (message, values = {}) => (catalogs[language]?.[message] ?? catalogs.en[message] ?? message)
    .replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  const persist = () => { try { localStorage.setItem(key, JSON.stringify(saved)); } catch { /* Storage may be disabled. */ } };
  const notify = message => {
    toastMessage = message;
    const el = document.querySelector('#global-status');
    const span = document.createElement('span'); span.textContent = t(message); el.replaceChildren(span);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.replaceChildren(); toastMessage = null; }, 4500);
  };
  const source = step => {
    const template = step.querySelector('[data-source]').dataset.source;
    const value = step.querySelector('.answer-input').value.trim();
    return value ? template.replace('____', value) : template;
  };
  const updateProgress = () => {
    const count = document.querySelectorAll('.done-check:checked').length;
    document.querySelector('#progress-count').textContent = `${count} / 6`;
    document.querySelector('.progress-fill').style.width = `${count / 6 * 100}%`;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(count));
    document.querySelectorAll('.step').forEach(step => {
      document.querySelector(`.lesson-nav a[href="#${step.id}"]`)?.classList.toggle('is-done', step.querySelector('.done-check').checked);
    });
    const next = [...document.querySelectorAll('.step')].find(step => !step.querySelector('.done-check').checked);
    const start = document.querySelector('#continue-link'); start.href = next ? `#${next.id}` : '#words';
    start.textContent = t(count === 6 ? 'review' : count ? 'continue' : 'start_step1');
  };
  const menu = document.querySelector('#lesson-menu');
  const toggle = document.querySelector('#menu-toggle');
  const pickers = [...document.querySelectorAll('.language-picker')];
  const closeLanguages = except => pickers.forEach(picker => {
    if (picker === except) return;
    picker.querySelector('.language-options').hidden = true;
    picker.querySelector('.language-toggle').setAttribute('aria-expanded', 'false');
  });
  const closeMenu = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = t('menu_open'); };
  const applyLanguage = (next, remember = true) => {
    if (!Object.hasOwn(languages, next)) return;
    language = next;
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    const values = el => ({ step: el.dataset.i18nStep });
    // HTML comes only from the authored local catalog, never from an answer field.
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml, values(el)); });
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n, values(el)); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria, values(el))); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('.feedback').forEach(el => { el.textContent = el.dataset.message ? t(el.dataset.message) : ''; });
    document.querySelectorAll('pre, code, kbd, .answer-input').forEach(el => { el.dir = 'ltr'; el.translate = false; });
    pickers.forEach(picker => {
      const caption = picker.querySelector('.language-current'); caption.textContent = languages[language]; caption.lang = language;
      picker.querySelector('.language-toggle').title = t('language_choose');
      picker.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
    });
    document.querySelectorAll('.lesson-switch a, .closing a[href^="lab"]').forEach(link => {
      const url = new URL(link.href); url.searchParams.set('lang', language);
      link.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
    });
    toggle.textContent = t(menu.classList.contains('is-open') ? 'menu_close' : 'menu_open');
    updateProgress();
    if (toastMessage) document.querySelector('#global-status span').textContent = t(toastMessage);
    if (remember) {
      try { localStorage.setItem(languageKey, language); } catch { /* The URL also carries the choice. */ }
      try { const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url); } catch { /* File previews may not support history. */ }
    }
  };
  pickers.forEach(picker => {
    const button = picker.querySelector('.language-toggle');
    const options = picker.querySelector('.language-options');
    const open = () => { closeLanguages(picker); options.hidden = false; button.setAttribute('aria-expanded', 'true'); };
    button.addEventListener('click', () => { const wasOpen = !options.hidden; closeLanguages(); if (!wasOpen) open(); });
    button.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); open(); const choices = [...options.querySelectorAll('button')];
        choices[e.key === 'ArrowDown' ? 0 : choices.length - 1].focus();
      }
    });
    options.addEventListener('keydown', e => {
      const choices = [...options.querySelectorAll('button')]; const i = choices.indexOf(document.activeElement);
      const next = e.key === 'ArrowDown' ? (i + 1) % choices.length : e.key === 'ArrowUp' ? (i + choices.length - 1) % choices.length : e.key === 'Home' ? 0 : e.key === 'End' ? choices.length - 1 : -1;
      if (next >= 0) { e.preventDefault(); choices[next].focus(); }
    });
    picker.querySelectorAll('[data-language]').forEach(option => option.addEventListener('click', () => {
      applyLanguage(option.dataset.language); closeLanguages(); button.focus();
    }));
    picker.addEventListener('focusout', () => setTimeout(() => { if (!picker.contains(document.activeElement)) { options.hidden = true; button.setAttribute('aria-expanded', 'false'); } }, 0));
  });
  async function copy(text, message) {
    try { await navigator.clipboard.writeText(text); notify(message); }
    catch { notify('copy_fallback'); }
  }
  document.querySelectorAll('.step').forEach(step => {
    const number = step.dataset.step; const input = step.querySelector('.answer-input');
    const code = step.querySelector('[data-source]'); const feedback = step.querySelector('.feedback');
    const renderCode = () => {
      const parts = code.dataset.source.split('____'); const mark = document.createElement('mark'); const value = input.value.trim();
      mark.className = `code-gap${value ? ' is-filled' : ''}`; mark.textContent = value || '____';
      code.replaceChildren(document.createTextNode(parts[0]), mark, document.createTextNode(parts[1] || ''));
    };
    input.value = typeof saved.answers[number] === 'string' ? saved.answers[number].slice(0, 120) : ''; renderCode();
    input.addEventListener('input', () => {
      saved.answers[number] = input.value; persist(); renderCode();
      feedback.dataset.message = ''; feedback.textContent = ''; feedback.className = 'feedback'; input.removeAttribute('aria-invalid');
    });
    step.querySelector('form').addEventListener('submit', event => {
      event.preventDefault(); const answer = input.value.replace(/\s+/g, ''); const correct = answer === step.dataset.answer;
      const message = !answer ? 'feedback_empty' : correct ? 'feedback_correct' : 'feedback_wrong';
      feedback.dataset.message = message; feedback.textContent = t(message); feedback.className = `feedback ${correct ? 'success' : 'error'}`;
      input.setAttribute('aria-invalid', String(!correct)); if (!answer) input.focus();
    });
    step.querySelector('[data-copy]').addEventListener('click', () => copy(source(step), input.value.trim() ? 'copy_filled' : 'copy_gap'));
    step.querySelector('[data-download]').addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([source(step)], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url;
      a.download = lesson === 'lab7' ? `step-${number}.cpp` : `${lesson}-step-${number}.cpp`;
      a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    const check = step.querySelector('.done-check'); check.checked = saved.done[number] === true;
    check.addEventListener('change', () => { saved.done[number] = check.checked; persist(); updateProgress(); });
  });
  document.querySelectorAll('[data-copy-example]').forEach(button => button.addEventListener('click', () => copy(document.querySelector('#function-example').textContent, 'example_copied')));
  document.querySelector('[data-reset]').addEventListener('click', () => {
    saved = { answers: {}, done: {} }; persist();
    document.querySelectorAll('.answer-input').forEach(input => { input.value = ''; input.dispatchEvent(new Event('input')); });
    document.querySelectorAll('.done-check').forEach(check => { check.checked = false; }); updateProgress(); notify('reset_done');
  });
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  toggle.addEventListener('click', () => {
    closeLanguages(); const open = menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = t(open ? 'menu_close' : 'menu_open');
  });
  document.querySelectorAll('.lesson-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const picker = pickers.find(item => !item.querySelector('.language-options').hidden);
    if (picker) { closeLanguages(); picker.querySelector('.language-toggle').focus(); }
    else if (menu.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.language-picker')) closeLanguages();
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio); if (!visible.length) return;
      const id = visible[0].target.id;
      document.querySelectorAll('.lesson-nav a').forEach(a => { if (a.hash === `#${id}`) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: [0, .1, .3] });
    document.querySelectorAll('#start, .step, #words').forEach(section => observer.observe(section));
  }
  applyLanguage(language, false);
})();
