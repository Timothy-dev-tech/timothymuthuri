const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

function setNavigationState(isOpen) {
  navToggle.setAttribute('aria-expanded', String(isOpen));
  siteNav.setAttribute('data-open', String(isOpen));
}

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  setNavigationState(!isOpen);
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setNavigationState(false);
  });
});

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    navToggle.getAttribute('aria-expanded') === 'true'
  ) {
    setNavigationState(false);
    navToggle.focus();
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    const activeEntry = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (activeEntry) {
      const id = activeEntry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  },
  {
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  },
);

sections.forEach((section) => observer.observe(section));

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    submitButton.disabled = true;
    formStatus.dataset.state = 'sending';
    formStatus.textContent = 'Sending your message…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your message.');
      }

      contactForm.reset();
      formStatus.dataset.state = 'success';
      formStatus.textContent = 'Thanks—your message has been sent.';
    } catch (error) {
      formStatus.dataset.state = 'error';
      formStatus.textContent =
        error.message || 'Something went wrong. Please email me directly.';
    } finally {
      submitButton.disabled = false;
    }
  });
}