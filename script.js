'use strict';

/* Add your real profile and certificate URLs here when ready.
   Leave missing links empty: the page will never send visitors to a fake profile. */
const portfolio = {
  socials: {
    github: { url: 'https://github.com/Aaryan410', label: '@Aaryan410' },
    linkedin: { url: '', label: 'Connect with me' },
    instagram: { url: '', label: 'Follow along' },
  },
  certificates: {
    cs50x: { url: '' },
    cs50p: { url: '' },
  },
};

const projects = {
  truthlens: {
    eyebrow: 'PROJECT 001 · WEB + BROWSER EXTENSION',
    title: 'TruthLens',
    description: 'Hardware shopping comes with a lot of numbers. TruthLens is my attempt to turn those numbers into a more useful comparison.',
    points: [
      'A browser extension that detects hardware on supported product pages.',
      'A Flask website for comparing CPU and GPU benchmarks side by side.',
      'AI summaries on the website to put the selected hardware in context.',
    ],
    note: 'The portfolio artwork is an interface concept. Explore the repository for the current implementation.',
    url: 'https://github.com/Aaryan410/TruthLens',
    linkLabel: 'Explore the source',
  },
  crack: {
    eyebrow: 'PROJECT 002 · WEB APPLICATION',
    title: 'Crack',
    description: 'An interview practice app built around a simple loop: try an interview, understand the feedback, and keep improving.',
    points: [
      'Account login and a personal dashboard.',
      'Interview evaluations, progress graphs, and recent interview history.',
      'Downloadable PDF reports, with interview data stored in Supabase.',
    ],
    note: 'The portfolio artwork is an interface concept. Explore the repository for the current implementation.',
    url: 'https://github.com/Aaryan410/Crack',
    linkLabel: 'Explore the source',
  },
  calculator: {
    eyebrow: 'PROJECT 003 · MACHINE LEARNING · IN PROGRESS',
    title: 'Calculator',
    description: 'What if you could ask a math question in ordinary English? This project is an ongoing exploration of that idea, while I learn machine learning and NLP.',
    points: [
      'The goal: understand high-school math questions written in natural language.',
      'Built around Python, with machine learning and NLP as the learning focus.',
      'Still in development; the card illustration shows the intended experience.',
    ],
    url: 'https://github.com/Aaryan410/Calculator',
    linkLabel: 'Follow the project',
  },
};

const certificates = {
  cs50x: {
    eyebrow: 'COMPLETED COURSE · HARVARD UNIVERSITY',
    title: 'CS50x',
    description: 'Introduction to Computer Science — the course that helped build my foundations in programming and problem solving.',
    points: ['C, algorithms, and data structures.', 'Python, SQL, and the foundations of the web.', 'Learning to break larger problems into smaller, testable pieces.'],
    url: 'https://cs50.harvard.edu/x/',
    linkLabel: 'Explore the course',
  },
  cs50p: {
    eyebrow: 'COMPLETED COURSE · HARVARD UNIVERSITY',
    title: 'CS50P',
    description: 'Introduction to Programming with Python — a deeper dive into the language I use to turn ideas into projects.',
    points: ['Functions, exceptions, libraries, and file I/O.', 'Unit testing, regular expressions, and object-oriented programming.', 'Building confidence writing, testing, and debugging Python.'],
    url: 'https://cs50.harvard.edu/python/',
    linkLabel: 'Explore the course',
  },
};

// Only accept real HTTP(S) links from the configuration above.
function externalUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

Object.entries(portfolio.socials).forEach(([key, profile]) => {
  const card = document.querySelector(`[data-social="${key}"]`);
  const url = externalUrl(profile.url);
  if (!card || !url) return;
  let link = card;
  if (card.tagName !== 'A') {
    link = document.createElement('a');
    link.className = 'social-card';
    link.dataset.social = key;
    while (card.firstChild) link.append(card.firstChild);
    card.replaceWith(link);
  }
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.classList.remove('social-pending');
  link.querySelector('p').textContent = profile.label;
  const pending = link.querySelector('.social-pending-label');
  if (pending) {
    pending.className = 'social-arrow';
    pending.setAttribute('aria-hidden', 'true');
    pending.textContent = '↗';
  }
});

Object.entries(portfolio.certificates).forEach(([key, certificate]) => {
  if (!externalUrl(certificate.url)) return;
  const button = document.querySelector(`[data-certificate="${key}"]`);
  if (button) {
    button.closest('.certificate-card').querySelector('.credential-status').textContent = 'Certificate available';
    button.replaceChildren(document.createTextNode('View certificate ↗'));
  }
});

// Mobile navigation.
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-wrap')) closeMenu();
});
const mobileQuery = matchMedia('(max-width: 600px)');
mobileQuery.addEventListener('change', closeMenu);

// Project filters preserve DOM order and announce the number of visible projects.
const filters = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let visibleCount = 0;
  projectCards.forEach(card => {
    const visible = selected === 'all' || selected === card.dataset.category;
    card.hidden = !visible;
    if (visible) {
      visibleCount++;
      card.classList.add('is-visible');
    }
  });
  document.querySelector('.project-count').textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
}));

// Native dialog provides focus trapping and Escape-to-close behavior.
const dialog = document.querySelector('#detail-dialog');
let dialogTrigger = null;
function showDetails(details, trigger) {
  if (!details) return;
  dialogTrigger = trigger;
  document.querySelector('#dialog-eyebrow').textContent = details.eyebrow;
  document.querySelector('#dialog-title').textContent = details.title;
  document.querySelector('#dialog-description').textContent = details.description;
  document.querySelector('#dialog-points').replaceChildren(...details.points.map(point => {
    const item = document.createElement('li');
    item.textContent = point;
    return item;
  }));
  const note = document.querySelector('#dialog-note');
  note.textContent = details.note || '';
  note.hidden = !details.note;
  const link = document.querySelector('#dialog-link');
  link.href = details.url;
  link.replaceChildren(document.createTextNode(`${details.linkLabel} `));
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  dialog.showModal();
}
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => showDetails(projects[button.dataset.project], button));
});
document.querySelectorAll('[data-certificate]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.certificate;
    const certificateUrl = externalUrl(portfolio.certificates[key].url);
    const details = { ...certificates[key] };
    if (certificateUrl) {
      details.url = certificateUrl;
      details.linkLabel = 'View my certificate';
    } else {
      details.note = 'I’ve completed this course. A personal certificate verification link hasn’t been added yet; the button below opens the official course page.';
    }
    showDetails(details, button);
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => dialogTrigger?.focus({ preventScroll: true }));

// Reveal once, with a fully visible fallback when JS or reduced motion is used.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  if (!reducedMotion.matches) {
    document.documentElement.classList.add('js-motion');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  }
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll('a').forEach(link => {
        const current = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-current', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

const progress = document.querySelector('.reading-progress');
let scrollScheduled = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${available > 0 ? Math.min(100, Math.max(0, scrollY / available * 100)) : 0}%`;
  scrollScheduled = false;
}
addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
addEventListener('resize', updateProgress, { passive: true });
updateProgress();
document.querySelector('#year').textContent = new Date().getFullYear();
