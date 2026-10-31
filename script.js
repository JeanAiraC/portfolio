// Personalize the sample identity here and in index.html before publishing.
const profile = {
  name: 'Jean Aira Canillo',
  email: 'canillojeanairaworkmail@gmail.com',
  location: 'Bulacan, Philippines',
  title: 'Senior Android Developer',
};

const projects = {
  pocket: {
    title: 'Pocket',
    category: '01 / FINTECH - CONCEPT PROJECT',
    description: 'An offline-first personal finance app that makes budgeting feel approachable, with a clear balance overview, savings pockets, and expense insights.',
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'Coroutines', 'Clean Architecture'],
    role: 'Lead Android developer concept: responsible for the app architecture, accessible Compose components, local persistence, and the transaction synchronization design.',
    features: ['Expense categorization and monthly spending insights', 'Savings goals with visual progress tracking', 'Offline access to balances and transaction history', 'Adaptive UI with accessible contrast and touch targets'],
    challenge: 'Keeping financial records consistent when connectivity drops. The proposed solution uses Room as the single source of truth, a persistent sync queue, and idempotent transaction identifiers to prevent duplicate records after retries.',
    screenshots: [
      { src: 'assets/pocket-overview.svg', caption: 'Balance overview', alt: 'Pocket concept screen showing a balance, savings pockets, and recent activity.' },
      { src: 'assets/pocket-insights.svg', caption: 'Spending insights', alt: 'Pocket concept screen with a spending chart and categorized expenses.' },
      { src: 'assets/pocket-goals.svg', caption: 'Savings goals', alt: 'Pocket concept screen with progress toward travel and home savings goals.' },
    ],
  },
  basil: {
    title: 'Basil',
    category: '02 / LIFESTYLE - CONCEPT PROJECT',
    description: 'A food delivery experience designed around discovery, effortless checkout, and clear order status updates.',
    tags: ['Kotlin', 'MVVM', 'Retrofit', 'Firebase', 'Google Maps'],
    role: 'Android developer concept: designed the restaurant discovery flow, cart state management, order tracking, and lifecycle-aware real-time subscriptions.',
    features: ['Restaurant discovery with dietary and cuisine filters', 'Persistent cart and clear checkout summary', 'Real-time order status and delivery tracking', 'Saved favourites and personalized recommendations'],
    challenge: 'Receiving real-time updates without leaking listeners or wasting battery. The proposed implementation wraps Firebase listeners in callbackFlow, unsubscribes on cancellation, and collects updates only while the screen is active.',
    screenshots: [
      { src: 'assets/basil-discover.svg', caption: 'Discover something delicious', alt: 'Basil concept screen with cuisine filters and a featured healthy bowl.' },
      { src: 'assets/basil-checkout.svg', caption: 'A clear checkout', alt: 'Basil concept screen showing a basket, delivery address, and order total.' },
      { src: 'assets/basil-tracking.svg', caption: 'Follow your delivery', alt: 'Basil concept screen with an illustrative delivery route and order status.' },
    ],
  },
  daylight: {
    title: 'Daylight',
    category: '03 / OPEN SOURCE - CONCEPT PROJECT',
    description: 'A calm, lightweight task manager that brings a little intention to each day. Designed as an open-source learning project for modern Android practices.',
    tags: ['Jetpack Compose', 'Hilt', 'Kotlin Flow', 'Room', 'JUnit'],
    role: 'Independent developer concept: planned the complete product, reusable design system, reactive task storage, and unit testing strategy.',
    features: ['Daily focus view with completion progress', 'Personal and work task categories', 'Local reminders and recurring tasks', 'Dark theme and screen reader-friendly controls'],
    challenge: 'Preserving task state across configuration changes and process recreation. The proposed architecture combines persistent Room storage, ViewModel state exposed through StateFlow, and SavedStateHandle for temporary filters.',
    screenshots: [
      { src: 'assets/daylight-today.svg', caption: 'Your intentional day', alt: 'Daylight concept screen showing daily tasks and completion progress.' },
      { src: 'assets/daylight-focus.svg', caption: 'One thing at a time', alt: 'Daylight concept screen with an illustrative focus timer.' },
      { src: 'assets/daylight-week.svg', caption: 'Celebrate small steps', alt: 'Daylight concept screen showing weekly task completion and a progress chart.' },
    ],
  },
};

const toast = document.querySelector('.toast');
let toastTimer;
function notify(message, suffix = '') {
  toast.textContent = message + suffix;
  const openDialog = document.querySelector('#project-dialog[open]');
  if (openDialog) openDialog.querySelector('.dialog-status').textContent = message + suffix;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

const themeButton = document.querySelector('.theme-toggle');
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
  themeButton.setAttribute('aria-label', label);
  themeButton.setAttribute('title', label);
  themeButton.querySelector('use').setAttribute('href', dark ? '#sun' : '#moon');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#101624' : '#f8fafc';
}
// Use the visitor's local time on first launch: day is 06:00 through 17:59.
const localHour = new Date().getHours();
let initialDark = localHour < 6 || localHour >= 18;
try {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    initialDark = savedTheme === 'dark';
  } else if (savedTheme !== null) {
    console.warn('Unrecognized theme preference; using the local time.');
  }
} catch (error) {
  console.warn('Theme preference could not be read:', error);
}
setTheme(initialDark);
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  setTheme(dark);
  try {
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  } catch (error) {
    console.warn('Theme preference could not be saved:', error);
    notify('Theme changed. Your browser could not save this preference.');
  }
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    const openDialog = document.querySelector('#project-dialog[open]');
    if (openDialog) openDialog.close();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);

function filterProjects(category) {
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter.dataset.filter === category;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = category !== 'all' && !card.dataset.category.split(' ').includes(category);
  });
}
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => filterProjects(button.dataset.filter));
});

const dialog = document.querySelector('#project-dialog');
let selectedProjectId;
let returnHash = '#projects';
const gallery = document.querySelector('.gallery-track');
const galleryPrevious = document.querySelector('.gallery-previous');
const galleryNext = document.querySelector('.gallery-next');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let galleryIndex = 0;
function updateGallery() {
  const slides = [...gallery.children];
  if (!slides.length || !gallery.clientWidth) return;
  galleryIndex = slides.reduce((closest, slide, index) => (
    Math.abs(slide.offsetLeft - gallery.scrollLeft) < Math.abs(slides[closest].offsetLeft - gallery.scrollLeft) ? index : closest
  ), 0);
  galleryPrevious.disabled = galleryIndex === 0;
  galleryNext.disabled = galleryIndex === slides.length - 1;
  document.querySelector('.gallery-count').textContent = `${galleryIndex + 1} / ${slides.length} · ${projects[selectedProjectId].screenshots[galleryIndex].caption}`;
}
function moveGallery(index, smooth = true) {
  const nextIndex = Math.max(0, Math.min(index, gallery.children.length - 1));
  const slide = gallery.children[nextIndex];
  if (!slide) return;
  galleryIndex = nextIndex;
  gallery.scrollTo({ left: slide.offsetLeft, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
}
galleryPrevious.addEventListener('click', () => moveGallery(galleryIndex - 1));
galleryNext.addEventListener('click', () => moveGallery(galleryIndex + 1));
gallery.addEventListener('scroll', updateGallery, { passive: true });
gallery.addEventListener('keydown', event => {
  const destinations = { ArrowLeft: galleryIndex - 1, ArrowRight: galleryIndex + 1, Home: 0, End: gallery.children.length - 1 };
  if (Object.hasOwn(destinations, event.key)) {
    event.preventDefault();
    moveGallery(destinations[event.key]);
  }
});
new ResizeObserver(() => {
  if (dialog.open) moveGallery(galleryIndex, false);
}).observe(gallery);

function renderProject(project) {
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-role').textContent = project.role;
  document.querySelector('#dialog-challenge').textContent = project.challenge;
  const highlights = document.querySelector(`[data-project="${selectedProjectId}"]`).closest('.project-card').querySelector('.project-highlights');
  document.querySelector('#dialog-highlights').replaceChildren(...[...highlights.children].map(item => item.cloneNode(true)));
  document.querySelector('.share-fallback').hidden = true;
  document.querySelector('.dialog-status').textContent = '';
  galleryIndex = 0;
  gallery.replaceChildren(...project.screenshots.map((screen, index) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-slide';
    figure.setAttribute('role', 'group');
    figure.setAttribute('aria-roledescription', 'slide');
    figure.setAttribute('aria-label', `${index + 1} of ${project.screenshots.length}: ${screen.caption}`);
    const image = document.createElement('img');
    image.src = screen.src;
    image.alt = screen.alt;
    image.width = 360;
    image.height = 640;
    image.addEventListener('error', () => {
      console.error(`Project screenshot could not be loaded: ${screen.src}`);
      const error = document.createElement('p');
      error.className = 'screenshot-error';
      error.setAttribute('role', 'alert');
      error.textContent = `Unable to load ${screen.caption}. Please try reloading the page.`;
      figure.append(error);
    }, { once: true });
    const caption = document.createElement('figcaption');
    caption.textContent = screen.caption;
    figure.append(image, caption);
    return figure;
  }));
  const storeLink = document.querySelector(`[data-play-store="${selectedProjectId}"]`);
  const dialogStoreLink = document.querySelector('#dialog-play-store');
  dialogStoreLink.href = storeLink.href;
  dialogStoreLink.setAttribute('aria-label', storeLink.getAttribute('aria-label'));
  document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  document.querySelector('#dialog-features').replaceChildren(...project.features.map(feature => {
    const item = document.createElement('li');
    item.textContent = feature;
    return item;
  }));
}
const dialogStoreLink = document.createElement('a');
dialogStoreLink.id = 'dialog-play-store';
dialogStoreLink.className = 'button button-outline dialog-store-link';
dialogStoreLink.target = '_blank';
dialogStoreLink.rel = 'noopener noreferrer nofollow';
dialogStoreLink.textContent = 'Google Play (sample)';
document.querySelector('.dialog-inner').append(dialogStoreLink);
function openProject(id, updateHistory = true) {
  if (!Object.hasOwn(projects, id)) {
    console.warn(`Unknown project link: ${id}`);
    notify('That project could not be found. Please choose one of the featured projects.');
    return;
  }
  const card = document.querySelector(`[data-project="${id}"]`).closest('.project-card');
  if (card.hidden) filterProjects('all');
  if (!dialog.open) {
    returnHash = location.hash.startsWith('#project-') ? '#projects' : location.hash;
  }
  selectedProjectId = id;
  renderProject(projects[id]);
  if (updateHistory && location.hash !== `#project-${id}`) {
    const url = new URL(location.href);
    url.hash = `project-${id}`;
    history.pushState(null, '', url);
  }
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden';
  dialog.scrollTop = 0;
  moveGallery(0, false);
  updateGallery();
}
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => openProject(button.dataset.project));
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  // A close event can arrive after Back/Forward has already opened another dialog.
  if (dialog.open) return;
  document.body.style.overflow = '';
  if (location.hash === `#project-${selectedProjectId}`) {
    const url = new URL(location.href);
    url.hash = returnHash;
    history.replaceState(null, '', url);
  }
});
function synchronizeProjectLink() {
  if (location.hash.startsWith('#project-')) {
    const id = location.hash.slice('#project-'.length);
    if (Object.hasOwn(projects, id)) {
      if (!dialog.open || id !== selectedProjectId) openProject(id, false);
    } else {
      if (dialog.open) dialog.close();
      console.warn(`Unknown project link: ${id}`);
      notify('That project could not be found. Please choose one of the featured projects.');
    }
  } else if (dialog.open) {
    dialog.close();
  }
}
window.addEventListener('hashchange', synchronizeProjectLink);
synchronizeProjectLink();

async function shareProject(id) {
  const url = new URL(location.href);
  url.hash = `project-${id}`;
  try {
    if (!navigator.clipboard) throw new Error('Clipboard access is unavailable in this browser context.');
    await navigator.clipboard.writeText(url.href);
    notify(location.protocol === 'file:' ? 'Link copied. Local file links only work on this computer; publish the site to share with recruiters.' : 'Project link copied. Share it with a recruiter!');
  } catch (error) {
    console.warn('Project link could not be copied:', error);
    openProject(id);
    const fallback = document.querySelector('.share-fallback');
    const input = document.querySelector('#project-share-url');
    fallback.hidden = false;
    input.value = url.href;
    input.focus();
    input.select();
    notify('Clipboard access was blocked. Copy the selected project link manually.');
  }
}
document.querySelectorAll('[data-share]').forEach(button => {
  button.addEventListener('click', () => shareProject(button.dataset.share));
});
document.querySelector('.dialog-share').addEventListener('click', () => shareProject(selectedProjectId));

document.querySelector('.copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    notify('Email address copied to clipboard.');
  } catch (error) {
    console.warn('Email could not be copied:', error);
    notify('Unable to copy. Please select the email address:', ` ${profile.email}`);
  }
});

function buildContactEmail({ fullName, mobile, email, message }) {
  const body = [
    `Full name: ${fullName}`,
    `Mobile: ${mobile || 'Not provided'}`,
    `Email: ${email}`,
    '',
    'Message / feedback:',
    message,
  ].join('\r\n');
  return `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio enquiry / feedback')}&body=${encodeURIComponent(body)}`;
}
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const nameInput = document.querySelector('#contact-name');
  const messageInput = document.querySelector('#contact-message');
  for (const input of [nameInput, messageInput]) {
    input.setCustomValidity(input.value.trim() ? '' : 'Please enter more than just spaces.');
  }
  if (!contactForm.reportValidity()) return;
  const details = {
    fullName: nameInput.value.trim(),
    mobile: document.querySelector('#contact-mobile').value.trim(),
    email: document.querySelector('#contact-email').value.trim(),
    message: messageInput.value.trim(),
  };
  document.querySelector('.contact-form-status').textContent = 'Email draft requested—not sent. If your email app did not open, use Email me or copy the address above. Your message stays here.';
  window.location.href = buildContactEmail(details);
});
contactForm.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.setCustomValidity('');
    document.querySelector('.contact-form-status').textContent = '';
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navigation.querySelectorAll('a').forEach(link => {
        link.classList.toggle('current', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-15% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

const readingProgress = document.querySelector('.reading-progress');
let progressFrame;
function updateReadingProgress() {
  progressFrame = null;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  readingProgress.value = maxScroll <= 0 ? 100 : Math.max(0, Math.min(100, window.scrollY / maxScroll * 100));
}
function scheduleReadingProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateReadingProgress);
}
window.addEventListener('scroll', scheduleReadingProgress, { passive: true });
window.addEventListener('resize', scheduleReadingProgress);
new ResizeObserver(scheduleReadingProgress).observe(document.body);
updateReadingProgress();
