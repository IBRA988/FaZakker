/**
 * Azkar & Interactive Electronic Tasbeeh Engine
 */

const AzkarManager = {
  rawAzkarData: {},
  activeCategory: 'أذكار الصباح',
  azkarCountsState: {},
  searchTerm: '',

  // Electronic Tasbeeh State
  tasbeehCount: 0,
  tasbeehTarget: 33,
  selectedDhikrText: 'سبحان الله',

  dhikrPresets: [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله',
    'أستغفر الله وأتوب إليه',
    'لا حول ولا قوة إلا بالله',
    'اللهم صلِّ وسلم على نبينا محمد',
    'سبحان الله وبحمده ، سبحان الله العظيم'
  ],

  init() {
    this.loadCountsState();
    this.setupTasbeeh();
    this.bindEvents();
    this.fetchAzkar();
  },

  loadCountsState() {
    this.azkarCountsState = App.storage.get('azkar_counts_state', {});
    this.tasbeehCount = App.storage.get('tasbeeh_count', 0);
  },

  saveCountsState() {
    App.storage.set('azkar_counts_state', this.azkarCountsState);
    App.storage.set('tasbeeh_count', this.tasbeehCount);
  },

  bindEvents() {
    // Search bar input
    const searchInput = document.getElementById('azkarSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.trim().toLowerCase();
        this.renderAzkarCards();
      });
    }

    // Category Tabs click listener
    document.querySelectorAll('.category-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        this.activeCategory = target.dataset.category;

        const azkarContainer = document.getElementById('azkarGrid');
        const tasbeehContainer = document.getElementById('tasbeehContainer');

        if (this.activeCategory === 'المسبحة الإلكترونية') {
          if (azkarContainer) azkarContainer.style.display = 'none';
          if (tasbeehContainer) tasbeehContainer.classList.add('active');
        } else {
          if (tasbeehContainer) tasbeehContainer.classList.remove('active');
          if (azkarContainer) azkarContainer.style.display = 'grid';
          this.renderAzkarCards();
        }
      });
    });

    // Reset Category Button
    const btnResetCat = document.getElementById('btnResetCategory');
    if (btnResetCat) {
      btnResetCat.addEventListener('click', () => this.resetCategoryCounts());
    }
  },

  fetchAzkar() {
    const grid = document.getElementById('azkarGrid');
    if (grid) grid.innerHTML = '<div class="loader-spinner"></div>';

    axios.get('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json')
      .then(res => {
        this.rawAzkarData = res.data;
        this.renderCategoryChips();
        this.renderAzkarCards();
      })
      .catch(err => {
        console.error(err);
        App.showToast('تعذر جلب بيانات الأذكار من الخادم', 'error');
      });
  },

  renderCategoryChips() {
    const categoriesContainer = document.getElementById('azkarCategories');
    if (!categoriesContainer) return;

    const availableCategories = Object.keys(this.rawAzkarData);
    categoriesContainer.innerHTML = '';

    // Standard category chips
    availableCategories.forEach(cat => {
      const chip = document.createElement('button');
      chip.className = `category-chip ${cat === this.activeCategory ? 'active' : ''}`;
      chip.dataset.category = cat;
      chip.innerHTML = `<i class="fa-solid fa-book-open"></i> <span>${cat}</span>`;

      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeCategory = cat;

        document.getElementById('azkarGrid').style.display = 'grid';
        document.getElementById('tasbeehContainer').classList.remove('active');
        this.renderAzkarCards();
      });

      categoriesContainer.appendChild(chip);
    });

    // Add Electronic Tasbeeh chip at the end
    const tasbeehChip = document.createElement('button');
    tasbeehChip.className = 'category-chip tasbeeh-chip';
    tasbeehChip.dataset.category = 'المسبحة الإلكترونية';
    tasbeehChip.innerHTML = '<i class="fa-solid fa-fingerprint"></i> <span>المسبحة الإلكترونية</span>';

    tasbeehChip.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      tasbeehChip.classList.add('active');
      this.activeCategory = 'المسبحة الإلكترونية';

      document.getElementById('azkarGrid').style.display = 'none';
      document.getElementById('tasbeehContainer').classList.add('active');
    });

    categoriesContainer.appendChild(tasbeehChip);
  },

  renderAzkarCards() {
    const grid = document.getElementById('azkarGrid');
    if (!grid || !this.rawAzkarData[this.activeCategory]) return;

    let items = this.rawAzkarData[this.activeCategory];

    // Handle nested morning azkar case in API format
    if (this.activeCategory === 'أذكار الصباح' && Array.isArray(items[0])) {
      items = items[0];
    }

    grid.innerHTML = '';

    let visibleCount = 0;

    items.forEach((item, index) => {
      if (!item.content || item.content === 'stop') return;

      const cleanContent = String(item.content)
        .replaceAll('\\n', '\n')
        .replaceAll(',', '')
        .replaceAll("'", '')
        .trim();

      // Search filter check
      if (this.searchTerm && !cleanContent.toLowerCase().includes(this.searchTerm) && !(item.description && item.description.toLowerCase().includes(this.searchTerm))) {
        return;
      }

      visibleCount++;

      const itemKey = `${this.activeCategory}_${index}`;
      const originalCount = parseInt(item.count) || 1;
      const currentRemaining = this.azkarCountsState[itemKey] !== undefined ? this.azkarCountsState[itemKey] : originalCount;
      const isCompleted = currentRemaining === 0;

      const card = document.createElement('div');
      card.className = `zikr-card ${isCompleted ? 'completed' : ''}`;
      card.dataset.key = itemKey;

      card.innerHTML = `
        <div class="zikr-content">${cleanContent}</div>
        ${item.description ? `<div class="zikr-description">${item.description}</div>` : ''}
        <div class="zikr-footer">
          ${isCompleted 
            ? `<span class="completion-badge"><i class="fa-solid fa-circle-check"></i> مكتمل</span>`
            : `<span style="font-size:12px; color:var(--text-muted);">التكرار المطلوب: ${originalCount}</span>`
          }
          <button class="btn-counter" ${isCompleted ? 'style="opacity:0.6;"' : ''}>
            <i class="fa-solid fa-hand-pointer"></i>
            <span>${currentRemaining}</span>
          </button>
        </div>
      `;

      // Counter button action
      const btnCounter = card.querySelector('.btn-counter');
      btnCounter.addEventListener('click', () => {
        this.handleZikrClick(itemKey, originalCount, card, btnCounter);
      });

      grid.appendChild(card);
    });

    if (visibleCount === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding: 40px; color:var(--text-secondary);">
        <i class="fa-solid fa-magnifying-glass" style="font-size:36px; color:var(--gold-light); margin-bottom:12px;"></i>
        <p>لا توجد نتائج مطابقة لمصطلح البحث "${this.searchTerm}"</p>
      </div>`;
    }
  },

  handleZikrClick(itemKey, originalCount, card, btnCounter) {
    App.playClickSound();
    App.vibrate(30);

    let currentRemaining = this.azkarCountsState[itemKey] !== undefined ? this.azkarCountsState[itemKey] : originalCount;

    if (currentRemaining > 0) {
      currentRemaining--;
      this.azkarCountsState[itemKey] = currentRemaining;
      this.saveCountsState();

      btnCounter.querySelector('span').textContent = currentRemaining;

      if (currentRemaining === 0) {
        card.classList.add('completed');
        App.showToast('أحسنت! أتممت هذا الذكر بنجاح', 'success');
        this.renderAzkarCards();
      }
    } else {
      // Re-enable / Reset card count on tap after completion
      this.azkarCountsState[itemKey] = originalCount;
      this.saveCountsState();
      this.renderAzkarCards();
    }
  },

  resetCategoryCounts() {
    if (confirm('هل ترغب في إعادة ضبط جميع عدادات الأذكار في هذه القائمة؟')) {
      Object.keys(this.azkarCountsState).forEach(k => {
        if (k.startsWith(this.activeCategory)) {
          delete this.azkarCountsState[k];
        }
      });
      this.saveCountsState();
      this.renderAzkarCards();
      App.showToast('تم إعادة ضبط جميع العدادات', 'info');
    }
  },

  /* Electronic Tasbeeh Setup & Logic */
  setupTasbeeh() {
    const dhikrSelect = document.getElementById('tasbeehDhikrSelect');
    if (dhikrSelect) {
      dhikrSelect.innerHTML = '';
      this.dhikrPresets.forEach(preset => {
        const opt = document.createElement('option');
        opt.value = preset;
        opt.textContent = preset;
        dhikrSelect.appendChild(opt);
      });

      dhikrSelect.addEventListener('change', (e) => {
        this.selectedDhikrText = e.target.value;
      });
    }

    const counterDisplay = document.getElementById('tasbeehDisplay');
    if (counterDisplay) {
      counterDisplay.addEventListener('click', () => this.incrementTasbeeh());
    }

    const btnTapBig = document.getElementById('btnTasbeehTap');
    if (btnTapBig) {
      btnTapBig.addEventListener('click', () => this.incrementTasbeeh());
    }

    const btnResetTasbeeh = document.getElementById('btnResetTasbeeh');
    if (btnResetTasbeeh) {
      btnResetTasbeeh.addEventListener('click', () => {
        this.tasbeehCount = 0;
        this.saveCountsState();
        this.updateTasbeehUI();
        App.showToast('تم تصفير العداد', 'info');
      });
    }

    // Target buttons
    document.querySelectorAll('.btn-target-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-target-preset').forEach(b => b.classList.remove('btn-gold'));
        e.currentTarget.classList.add('btn-gold');
        this.tasbeehTarget = parseInt(e.currentTarget.dataset.target) || 33;
        this.updateTasbeehUI();
      });
    });

    this.updateTasbeehUI();
  },

  incrementTasbeeh() {
    App.playClickSound();
    App.vibrate(40);

    this.tasbeehCount++;
    this.saveCountsState();
    this.updateTasbeehUI();

    if (this.tasbeehTarget > 0 && this.tasbeehCount % this.tasbeehTarget === 0) {
      App.showToast(`تقبل الله! أتممت ${this.tasbeehCount} تسبيحة`, 'success');
      App.vibrate([100, 50, 100]);
    }
  },

  updateTasbeehUI() {
    const numEl = document.getElementById('tasbeehNum');
    const targetLbl = document.getElementById('tasbeehTargetLabel');

    if (numEl) numEl.textContent = this.tasbeehCount;
    if (targetLbl) {
      targetLbl.textContent = this.tasbeehTarget > 0 ? `الهدف الحالي: ${this.tasbeehTarget} تكرار` : 'بدون هدف محدد';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('azkarGrid')) {
    AzkarManager.init();
  }
});
