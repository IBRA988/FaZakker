/**
 * Quran Page SVG Reader & Audio Reciter Engine
 */

const QuranManager = {
  currentPage: 1,
  suwarList: [],
  zoomLevel: 1,
  bookmarkedPage: null,

  // Audio reciters list
  reciters: [
    { name: 'مشاري راشد العفاسي', server: 'https://server8.mp3quran.net/afs' },
    { name: 'عبد الباسط عبد الصمد (المجود)', server: 'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad' },
    { name: 'محمود خليل الحصري', server: 'https://server13.mp3quran.net/hussary' },
    { name: 'ماهر المعيقلي', server: 'https://server12.mp3quran.net/maher' },
    { name: 'سعد الغامدي', server: 'https://server7.mp3quran.net/s_gmd' }
  ],
  selectedReciter: null,
  audioPlayer: new Audio(),
  isPlayingAudio: false,

  init() {
    this.selectedReciter = this.reciters[0];
    this.loadBookmark();
    this.setupReciterDropdown();
    this.bindEvents();
    this.fetchSuwar();
  },

  loadBookmark() {
    this.bookmarkedPage = App.storage.get('quran_bookmark', 1);
    const savedPage = App.storage.get('quran_last_page', this.bookmarkedPage || 1);
    this.currentPage = parseInt(savedPage) || 1;
  },

  setupReciterDropdown() {
    const select = document.getElementById('reciterSelect');
    if (!select) return;

    select.innerHTML = '';
    this.reciters.forEach((r, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = r.name;
      select.appendChild(opt);
    });
  },

  bindEvents() {
    // Page Number Input
    const pageInput = document.getElementById('pageInput');
    if (pageInput) {
      pageInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 604) val = 604;
        this.renderPage(val);
      });
    }

    // Surah Dropdown
    const surahSelect = document.getElementById('surahSelect');
    if (surahSelect) {
      surahSelect.addEventListener('change', (e) => {
        const startPage = parseInt(e.target.selectedOptions[0].dataset.startpage);
        if (startPage) this.renderPage(startPage);
      });
    }

    // Reciter Dropdown
    const reciterSelect = document.getElementById('reciterSelect');
    if (reciterSelect) {
      reciterSelect.addEventListener('change', (e) => {
        this.selectedReciter = this.reciters[parseInt(e.target.value)];
        if (this.isPlayingAudio) {
          this.playSurahAudio();
        }
      });
    }

    // Prev / Next Buttons
    const btnNext = document.getElementById('btnNextPage');
    const btnPrev = document.getElementById('btnPrevPage');
    const btnBottomNext = document.getElementById('btnBottomNextPage');
    const btnBottomPrev = document.getElementById('btnBottomPrevPage');

    if (btnNext) btnNext.addEventListener('click', () => this.nextPage());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevPage());
    if (btnBottomNext) btnBottomNext.addEventListener('click', () => this.nextPage());
    if (btnBottomPrev) btnBottomPrev.addEventListener('click', () => this.prevPage());

    // Bookmark Toggle Button
    const btnBookmark = document.getElementById('btnBookmarkPage');
    if (btnBookmark) {
      btnBookmark.addEventListener('click', () => this.toggleBookmark());
    }

    // Zoom Buttons
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnZoomReset = document.getElementById('btnZoomReset');

    if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.adjustZoom(0.1));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.adjustZoom(-0.1));
    if (btnZoomReset) btnZoomReset.addEventListener('click', () => this.resetZoom());

    // Audio Play/Pause Button
    const btnPlayAudio = document.getElementById('btnPlayAudio');
    if (btnPlayAudio) {
      btnPlayAudio.addEventListener('click', () => this.toggleAudio());
    }

    // Keyboard Shortcuts (Arrow Left = Next, Arrow Right = Prev in RTL)
    window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
      if (e.key === 'ArrowLeft') this.nextPage();
      if (e.key === 'ArrowRight') this.prevPage();
    });

    // Audio end event
    this.audioPlayer.addEventListener('ended', () => {
      this.isPlayingAudio = false;
      this.updateAudioBtnUI();
    });
  },

  fetchSuwar() {
    axios.get('https://www.mp3quran.net/api/v3/suwar')
      .then(res => {
        this.suwarList = res.data.suwar;
        this.renderSurahOptions();
        this.renderPage(this.currentPage);
      })
      .catch(err => {
        console.error(err);
        App.showToast('تعذر تحميل قائمة السور، جاري التحميل بالوضع المباشر...', 'info');
        this.renderPage(this.currentPage);
      });
  },

  renderSurahOptions() {
    const select = document.getElementById('surahSelect');
    if (!select) return;

    select.innerHTML = '';
    this.suwarList.forEach((surah, idx) => {
      const opt = document.createElement('option');
      opt.value = idx + 1;
      opt.dataset.startpage = surah.start_page;
      opt.dataset.endpage = surah.end_page;
      opt.textContent = `${idx + 1}. سورة ${surah.name}`;
      select.appendChild(opt);
    });
  },

  renderPage(pageNum) {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > 604) pageNum = 604;

    this.currentPage = pageNum;
    App.storage.set('quran_last_page', pageNum);

    const paper = document.getElementById('quranPaper');
    if (paper) {
      paper.innerHTML = '<div class="loader-spinner"></div>';
    }

    const pageStr = String(pageNum).padStart(3, '0');
    const url = `https://www.mp3quran.net/api/quran_pages_svg/${pageStr}.svg`;

    axios.get(url)
      .then(res => {
        if (paper) {
          paper.innerHTML = res.data;
          this.updateBookmarkRibbon();
        }
        this.updateUIControls();
      })
      .catch(err => {
        if (paper) {
          paper.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-secondary);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:40px; color:var(--gold-light); margin-bottom:12px;"></i>
            <p>تعذر جلب صفحة المصحف رقم ${pageNum}</p>
          </div>`;
        }
      });
  },

  updateUIControls() {
    // Page Input
    const pageInput = document.getElementById('pageInput');
    if (pageInput) pageInput.value = this.currentPage;

    // Bottom Badge
    const pageBadge = document.getElementById('bottomPageBadge');
    if (pageBadge) pageBadge.textContent = `صفحة ${this.currentPage} من 604`;

    // Match Surah Dropdown with current page
    if (this.suwarList.length > 0) {
      const currentSurah = this.suwarList.find(s => this.currentPage >= s.start_page && this.currentPage <= s.end_page);
      if (currentSurah) {
        const select = document.getElementById('surahSelect');
        if (select) select.value = currentSurah.id || this.suwarList.indexOf(currentSurah) + 1;
        
        const audioSurahName = document.getElementById('audioSurahName');
        if (audioSurahName) audioSurahName.textContent = `سورة ${currentSurah.name}`;
      }
    }
  },

  nextPage() {
    if (this.currentPage < 604) {
      this.renderPage(this.currentPage + 1);
    } else {
      App.showToast('أنت في الصفحة الأخيرة من المصحف الشريف', 'info');
    }
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.renderPage(this.currentPage - 1);
    } else {
      App.showToast('أنت في الصفحة الأولى من المصحف الشريف', 'info');
    }
  },

  toggleBookmark() {
    if (this.bookmarkedPage === this.currentPage) {
      this.bookmarkedPage = null;
      App.storage.set('quran_bookmark', null);
      App.showToast('تم إزالة العلامة المرجعية', 'info');
    } else {
      this.bookmarkedPage = this.currentPage;
      App.storage.set('quran_bookmark', this.currentPage);
      App.showToast(`تم حفظ العلامة المرجعية عند الصفحة ${this.currentPage}`, 'success');
    }
    this.updateBookmarkRibbon();
  },

  updateBookmarkRibbon() {
    let ribbon = document.querySelector('.bookmark-ribbon');
    if (this.bookmarkedPage === this.currentPage) {
      if (!ribbon) {
        ribbon = document.createElement('div');
        ribbon.className = 'bookmark-ribbon';
        ribbon.title = 'علامة مرجعية محفوظة';
        ribbon.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
        const paper = document.getElementById('quranPaper');
        if (paper) paper.appendChild(ribbon);
      }
    } else if (ribbon) {
      ribbon.remove();
    }
  },

  adjustZoom(delta) {
    this.zoomLevel = Math.min(Math.max(this.zoomLevel + delta, 0.7), 1.6);
    const paper = document.getElementById('quranPaper');
    if (paper) {
      paper.style.transform = `scale(${this.zoomLevel})`;
    }
  },

  resetZoom() {
    this.zoomLevel = 1;
    const paper = document.getElementById('quranPaper');
    if (paper) {
      paper.style.transform = 'scale(1)';
    }
  },

  getCurrentSurah() {
    if (!this.suwarList.length) return { number: 1, name: 'الفاتحة' };
    const currentSurah = this.suwarList.find(s => this.currentPage >= s.start_page && this.currentPage <= s.end_page);
    return currentSurah ? { number: currentSurah.id || (this.suwarList.indexOf(currentSurah) + 1), name: currentSurah.name } : { number: 1, name: 'الفاتحة' };
  },

  playSurahAudio() {
    const surah = this.getCurrentSurah();
    const surahPadded = String(surah.number).padStart(3, '0');
    const audioUrl = `${this.selectedReciter.server}/${surahPadded}.mp3`;

    this.audioPlayer.src = audioUrl;
    this.audioPlayer.play()
      .then(() => {
        this.isPlayingAudio = true;
        this.updateAudioBtnUI();
        App.showToast(`جاري تشغيل تلاوة سورة ${surah.name}`, 'success');
      })
      .catch(err => {
        App.showToast('تعذر تشغيل التلاوة الصوتية', 'error');
      });
  },

  toggleAudio() {
    if (this.isPlayingAudio) {
      this.audioPlayer.pause();
      this.isPlayingAudio = false;
    } else {
      this.playSurahAudio();
    }
    this.updateAudioBtnUI();
  },

  updateAudioBtnUI() {
    const btn = document.getElementById('btnPlayAudio');
    if (!btn) return;
    if (this.isPlayingAudio) {
      btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      btn.title = 'إيقاف مؤقت';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      btn.title = 'تشغيل التلاوة الصوتية';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quranPaper')) {
    QuranManager.init();
  }
});
