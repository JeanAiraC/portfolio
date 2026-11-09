// User profile information
const profile = {
  name: 'Jean Aira Canillo',
  email: 'canillojeanairaworkmail@gmail.com',
  location: 'Bulacan, Philippines',
  title: 'Senior Android Developer',
};

// Theme Management System
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'portfolio-theme';
    this.LIGHT_THEME = 'light';
    this.DARK_THEME = 'dark';
    this.init();
  }

  init() {
    // Check for saved preference first
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedTheme) {
      // Use saved preference
      this.setTheme(savedTheme, false);
    } else {
      // Auto-detect based on time
      const theme = this.detectThemeByTime();
      this.setTheme(theme, false);
    }

    this.setupToggle();
  }

  detectThemeByTime() {
    const hour = new Date().getHours();
    // Day mode: 6 AM to 6 PM (6-17), Night mode: 6 PM to 6 AM (18-5)
    return (hour >= 6 && hour < 18) ? this.LIGHT_THEME : this.DARK_THEME;
  }

  setTheme(theme, save = true) {
    const htmlElement = document.documentElement;
    
    // Add fade-out effect
    document.body.style.transition = 'opacity 0.3s ease';
    
    // Set theme after a tiny delay for smoother transition
    setTimeout(() => {
      htmlElement.setAttribute('data-theme', theme);
      
      // Update toggle button if it exists
      const toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-checked', theme === this.DARK_THEME);
        toggleBtn.title = theme === this.DARK_THEME ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        toggleBtn.textContent = theme === this.DARK_THEME ? '☀️' : '🌙';
      }
      
      // Update phone mockup colors
      this.updatePhoneMockupColors(theme);
      
      if (save) {
        localStorage.setItem(this.STORAGE_KEY, theme);
      }
    }, 10);
  }

  updatePhoneMockupColors(theme) {
    const svgElements = document.querySelectorAll('.android-phone rect, .android-phone text, .android-phone circle');
    
    if (theme === this.LIGHT_THEME) {
      // Light mode colors
      const phoneFrame = document.querySelector('.android-phone rect:nth-of-type(1)');
      const screen = document.querySelector('.android-phone rect:nth-of-type(2)');
      
      if (phoneFrame) phoneFrame.setAttribute('fill', '#1a1a1a');
      if (screen) screen.setAttribute('fill', '#ffffff');
      
      // Update text colors for light mode
      document.querySelectorAll('.android-phone text').forEach(text => {
        if (text.textContent === 'Tasks') return; // Header stays white
        if (text.getAttribute('fill') === '#ffffff') return; // Keep white text
        text.setAttribute('fill', '#1a1a1a'); // Dark text
      });
    } else {
      // Dark mode colors
      const phoneFrame = document.querySelector('.android-phone rect:nth-of-type(1)');
      const screen = document.querySelector('.android-phone rect:nth-of-type(2)');
      
      if (phoneFrame) phoneFrame.setAttribute('fill', '#0f172a');
      if (screen) screen.setAttribute('fill', '#1e293b');
      
      // Update text colors for dark mode
      document.querySelectorAll('.android-phone text').forEach(text => {
        if (text.textContent === 'Tasks') return; // Header stays white
        if (text.getAttribute('fill') === '#ffffff') return; // Keep white text
        text.setAttribute('fill', '#cbd5e1'); // Light gray text
      });
      
      // Update strokes for dark mode
      document.querySelectorAll('.android-phone rect[stroke="#e5e7eb"]').forEach(rect => {
        rect.setAttribute('stroke', '#334155');
      });
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
    this.setTheme(newTheme, true);
  }

  setupToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// Current Time Display in Phone Mockup
class TimeUpdater {
  constructor() {
    this.init();
  }

  init() {
    this.updateTime();
    // Update time every minute
    setInterval(() => this.updateTime(), 60000);
  }

  updateTime() {
    const timeElement = document.getElementById('phone-time');
    if (timeElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      timeElement.textContent = timeString;
    }
  }
}

// Initialize when DOM is ready
function initializePortfolio() {
  new ThemeManager();
  new TimeUpdater();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}


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
