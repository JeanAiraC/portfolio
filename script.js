// User profile information
const profile = {
  name: 'Jean Aira Canillo',
  email: 'canillojeanairaworkmail@gmail.com',
  location: 'Bulacan, Philippines',
  title: 'Senior Android Developer',
};

// ============================================
// PHONE TIME UPDATER
// ============================================
class TimeUpdater {
  constructor() {
    this.init();
  }

  init() {
    this.updateTime();
    // Update every minute
    setInterval(() => this.updateTime(), 60000);
  }

  updateTime() {
    const timeElement = document.getElementById('phone-time');
    if (timeElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeElement.textContent = `${hours}:${minutes}`;
      console.log('Phone time updated to:', `${hours}:${minutes}`);
    }
  }
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
console.log('Script.js loaded');

// Store globally
window.timeUpdater = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, initializing time updater...');
    window.timeUpdater = new TimeUpdater();
  });
} else {
  console.log('DOM already loaded, initializing immediately...');
  window.timeUpdater = new TimeUpdater();
}
