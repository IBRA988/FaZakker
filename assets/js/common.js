/**
 * Common Utility & App Core Utilities
 */

const App = {
  // Toast notification engine
  showToast(message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastIn 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Audio click synthesizer using Web Audio API (Zero external mp3 needed!)
  playClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext muted or blocked
    }
  },

  // Haptic feedback for mobile devices
  vibrate(ms = 35) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  },

  // LocalStorage wrapper with JSON fallback
  storage: {
    get(key, defaultValue = null) {
      try {
        const val = localStorage.getItem(`fazakker_${key}`);
        return val ? JSON.parse(val) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`fazakker_${key}`, JSON.stringify(value));
      } catch (e) {}
    }
  },

  // Scroll to top initializer
  initScrollTop() {
    const btn = document.createElement('button');
    btn.className = 'btn-scroll-top';
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.title = 'العودة للأعلى';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // Highlight active menu link based on current page HTML
  initActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const isQuran = path.includes('quran.html');
    const isAzkar = path.includes('azkar.html');

    // Sidebar items
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.querySelector('a')?.getAttribute('href');
      item.classList.remove('active');
      if (isQuran && href && href.includes('quran')) item.classList.add('active');
      else if (isAzkar && href && href.includes('azkar')) item.classList.add('active');
      else if (!isQuran && !isAzkar && href && (href.includes('index') || href === '#' || href === './')) item.classList.add('active');
    });

    // Mobile nav items
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      const href = item.getAttribute('href');
      item.classList.remove('active');
      if (isQuran && href && href.includes('quran')) item.classList.add('active');
      else if (isAzkar && href && href.includes('azkar')) item.classList.add('active');
      else if (!isQuran && !isAzkar && href && (href.includes('index') || href === '#')) item.classList.add('active');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.initScrollTop();
  App.initActiveNav();
});
