/**
 * Common Utility & App Core Utilities (Theme & Nav Engine)
 */

const App = {
  theme: 'dark',
  sidebarCollapsed: false,

  init() {
    this.initTheme();
    this.initSidebarToggle();
    this.initScrollTop();
    this.initActiveNav();
  },

  // Theme Controller (Dark / Light Mode)
  initTheme() {
    const savedTheme = this.storage.get('theme', 'dark');
    this.setTheme(savedTheme);

    // Bind Theme Toggle Buttons across header/sidebar
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.storage.set('theme', theme);
    this.updateThemeBtnUI();
  },

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    this.showToast(newTheme === 'dark' ? 'تم التبديل إلى الوضع الداكن 🌙' : 'تم التبديل إلى الوضع الفاتح ☀️', 'info');
  },

  updateThemeBtnUI() {
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      if (this.theme === 'dark') {
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        btn.title = 'التبديل للوضع الفاتح';
      } else {
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        btn.title = 'التبديل للوضع الداكن';
      }
    });
  },

  // Sidebar Collapse Controller
  initSidebarToggle() {
    this.sidebarCollapsed = this.storage.get('sidebar_collapsed', false);
    this.applySidebarState();

    document.querySelectorAll('.btn-sidebar-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        this.storage.set('sidebar_collapsed', this.sidebarCollapsed);
        this.applySidebarState();
      });
    });
  },

  applySidebarState() {
    if (this.sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  },

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

  // Audio click synthesizer using Web Audio API
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
    } catch (e) {}
  },

  // Haptic feedback
  vibrate(ms = 35) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  },

  // LocalStorage wrapper
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

  initActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const isQuran = path.includes('quran');
    const isAzkar = path.includes('azkar');
    const isPrayers = path.includes('prayers') || path.includes('index') || path.endsWith('/');

    // Sidebar items
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.querySelector('a')?.getAttribute('href');
      item.classList.remove('active');
      if (isQuran && href && href.includes('quran')) item.classList.add('active');
      else if (isAzkar && href && href.includes('azkar')) item.classList.add('active');
      else if (isPrayers && href && (href.includes('prayers') || href.includes('index'))) item.classList.add('active');
    });

    // Mobile nav items
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      const href = item.getAttribute('href');
      item.classList.remove('active');
      if (isQuran && href && href.includes('quran')) item.classList.add('active');
      else if (isAzkar && href && href.includes('azkar')) item.classList.add('active');
      else if (isPrayers && href && (href.includes('prayers') || href.includes('index'))) item.classList.add('active');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
