/**
 * Prayer Times Logic & Countdown Engine
 */

const PrayersManager = {
  selectedCity: 'Al-Hofuf,SA',
  coords: null,
  selectedDate: new Date(),
  nextPrayerTime: null,
  nextPrayerName: '',
  timerInterval: null,
  adhanAudio: new Audio('https://cdn.islamicfinder.org/athan/makkah.mp3'),
  isPlayingAdhan: false,

  cities: [
    { name: 'الهفوف (الأحساء) - السعودية', value: 'Al-Hofuf,SA' },
    { name: 'مكة المكرمة - السعودية', value: 'Makkah,SA' },
    { name: 'المدينة المنورة - السعودية', value: 'Madinah,SA' },
    { name: 'الرياض - السعودية', value: 'Riyadh,SA' },
    { name: 'جدة - السعودية', value: 'Jeddah,SA' },
    { name: 'الدمام - السعودية', value: 'Dammam,SA' },
    { name: 'الخبر - السعودية', value: 'Khobar,SA' },
    { name: 'المبرز - السعودية', value: 'Al Mubarraz,SA' },
    { name: 'الطائف - السعودية', value: 'Taif,SA' },
    { name: 'أبها - السعودية', value: 'Abha,SA' },
    { name: 'تبوك - السعودية', value: 'Tabuk,SA' },
    { name: 'القصيم / بريدة - السعودية', value: 'Buraydah,SA' },
    { name: 'عنيزة - السعودية', value: 'Unaizah,SA' },
    { name: 'حائل - السعودية', value: 'Hail,SA' },
    { name: 'خميس مشيط - السعودية', value: 'Khamis Mushait,SA' },
    { name: 'نجران - السعودية', value: 'Najran,SA' },
    { name: 'جازان - السعودية', value: 'Jizan,SA' },
    { name: 'الباحة - السعودية', value: 'Al Baha,SA' },
    { name: 'سكاكا - السعودية', value: 'Sakakah,SA' },
    { name: 'عرعر - السعودية', value: 'Arar,SA' },
    { name: 'القاهرة - مصر', value: 'Cairo,EG' },
    { name: 'دبي - الإمارات', value: 'Dubai,AE' },
    { name: 'الكويت - الكويت', value: 'Kuwait City,KW' },
    { name: 'عمان - الأردن', value: 'Amman,JO' },
    { name: 'الدوحة - قطر', value: 'Doha,QA' },
    { name: 'المنامة - البحرين', value: 'Manama,BH' },
    { name: 'مسقط - عمان', value: 'Muscat,OM' },
    { name: 'بغداد - العراق', value: 'Baghdad,IQ' },
    { name: 'دمشق - سوريا', value: 'Damascus,SY' },
    { name: 'بيروت - لبنان', value: 'Beirut,LB' },
    { name: 'القدس - فلسطين', value: 'Jerusalem,PS' },
    { name: 'إسطنبول - تركيا', value: 'Istanbul,TR' },
    { name: 'لندن - المملكة المتحدة', value: 'London,GB' }
  ],

  prayerNamesAr: {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  },

  prayerIcons: {
    Fajr: 'fa-cloud-moon',
    Sunrise: 'fa-sun',
    Dhuhr: 'fa-sun-plant-wilt',
    Asr: 'fa-cloud-sun',
    Maghrib: 'fa-sun-arrow-down',
    Isha: 'fa-moon'
  },

  init() {
    this.setupCityDropdown();
    this.loadSavedSettings();
    this.bindEvents();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.fetchPrayerTimes();
  },

  setupCityDropdown() {
    const select = document.getElementById('citySelect');
    if (!select) return;

    select.innerHTML = '';
    this.cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city.value;
      opt.textContent = city.name;
      select.appendChild(opt);
    });
  },

  loadSavedSettings() {
    const savedCity = App.storage.get('city', 'Al-Hofuf,SA');
    this.selectedCity = savedCity;
    const select = document.getElementById('citySelect');
    if (select) select.value = savedCity;

    // Date input default to today
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  },

  bindEvents() {
    const select = document.getElementById('citySelect');
    if (select) {
      select.addEventListener('change', (e) => {
        this.selectedCity = e.target.value;
        this.coords = null;
        App.storage.set('city', this.selectedCity);
        this.fetchPrayerTimes();
      });
    }

    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        if (e.target.value) {
          this.selectedDate = new Date(e.target.value);
          this.fetchPrayerTimes();
        }
      });
    }

    const locateBtn = document.getElementById('btnLocate');
    if (locateBtn) {
      locateBtn.addEventListener('click', () => this.detectGPS());
    }

    const notifyBtn = document.getElementById('btnNotifyPermission');
    if (notifyBtn) {
      notifyBtn.addEventListener('click', () => this.requestNotificationPermission());
    }

    const testAdhanBtn = document.getElementById('btnTestAdhan');
    if (testAdhanBtn) {
      testAdhanBtn.addEventListener('click', () => this.toggleAdhanSound());
    }
  },

  detectGPS() {
    if (!navigator.geolocation) {
      App.showToast('خاصية تحديد الموقع غير مدعومة في متصفحك', 'error');
      return;
    }

    App.showToast('جاري تحديد موقعك الجغرافي...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        App.showToast('تم تحديد الموقع بنجاح! جاري جلب المواقيت...', 'success');
        this.fetchPrayerTimes();
      },
      (err) => {
        App.showToast('تعذر الوصول إلى الموقع الجغرافي', 'error');
      }
    );
  },

  updateClock() {
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  },

  formatDateForApi(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  },

  fetchPrayerTimes() {
    const grid = document.getElementById('prayersGrid');
    if (grid) {
      grid.innerHTML = '<div class="loader-spinner"></div>';
    }

    const formattedDate = this.formatDateForApi(this.selectedDate);
    let url = `https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(this.selectedCity)}&method=4`;
    
    if (this.coords) {
      url = `https://api.aladhan.com/v1/timings/${Math.floor(this.selectedDate.getTime() / 1000)}?latitude=${this.coords.lat}&longitude=${this.coords.lng}&method=4`;
    }

    axios.get(url)
      .then(res => {
        const data = res.data.data;
        this.displayHijriDate(data.date.hijri);
        this.renderPrayerCards(data.timings);
        this.calculateNextPrayer(data.timings);
      })
      .catch(err => {
        console.error(err);
        App.showToast('عذرًا، تعذر تحميل مواقيت الصلاة. تحقق من الاتصال.', 'error');
      });
  },

  displayHijriDate(hijri) {
    const dateEl = document.getElementById('hijriDateText');
    if (dateEl) {
      dateEl.textContent = `${hijri.weekday.ar} ، ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
    }
  },

  formatTime12(time24) {
    if (!time24) return { time: '', period: '' };
    const cleanTime = time24.split(' ')[0];
    let [h, m] = cleanTime.split(':').map(Number);
    const period = h >= 12 ? 'مساءً' : 'صباحًا';
    h = h % 12 || 12;
    const formattedH = String(h).padStart(2, '0');
    return { time: `${formattedH}:${m}`, period };
  },

  renderPrayerCards(timings) {
    const grid = document.getElementById('prayersGrid');
    if (!grid) return;

    const mainPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    grid.innerHTML = '';

    mainPrayers.forEach(key => {
      const rawTime = timings[key];
      const { time, period } = this.formatTime12(rawTime);
      const nameAr = this.prayerNamesAr[key];
      const icon = this.prayerIcons[key];

      const card = document.createElement('div');
      card.className = `pray-card pray-${key.toLowerCase()}`;
      card.dataset.prayer = key;

      card.innerHTML = `
        <span class="pray-card-status">القادمة</span>
        <div class="pray-card-icon">
          <i class="fa-solid ${icon}"></i>
        </div>
        <h3>${nameAr}</h3>
        <div class="pray-time">
          <span>${time}</span>
          <span class="pray-period">${period}</span>
        </div>
      `;

      grid.appendChild(card);
    });
  },

  calculateNextPrayer(timings) {
    const now = new Date();
    const mainPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let foundNext = null;

    for (let key of mainPrayers) {
      const timeStr = timings[key].split(' ')[0];
      const [h, m] = timeStr.split(':').map(Number);
      const pDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), h, m, 0);

      if (pDate > now) {
        foundNext = { key, date: pDate, name: this.prayerNamesAr[key] };
        break;
      }
    }

    // If all prayers today passed, next is Fajr tomorrow
    if (!foundNext) {
      const fajrStr = timings['Fajr'].split(' ')[0];
      const [h, m] = fajrStr.split(':').map(Number);
      const tomorrow = new Date(this.selectedDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const pDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), h, m, 0);
      foundNext = { key: 'Fajr', date: pDate, name: 'الفجر' };
    }

    this.nextPrayerTime = foundNext.date;
    this.nextPrayerName = foundNext.name;

    // Highlight card
    document.querySelectorAll('.pray-card').forEach(c => c.classList.remove('active-next'));
    const activeCard = document.querySelector(`.pray-card[data-prayer="${foundNext.key}"]`);
    if (activeCard) activeCard.classList.add('active-next');

    // Update Hero UI
    const nameEl = document.getElementById('nextPrayerName');
    const targetEl = document.getElementById('nextPrayerTargetTime');
    if (nameEl) nameEl.textContent = foundNext.name;
    if (targetEl) {
      const { time, period } = this.formatTime12(timings[foundNext.key]);
      targetEl.textContent = `الساعة ${time} ${period}`;
    }

    this.startCountdown();
  },

  startCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const updateTimer = () => {
      if (!this.nextPrayerTime) return;

      const now = new Date();
      const diffMs = this.nextPrayerTime - now;

      if (diffMs <= 0) {
        clearInterval(this.timerInterval);
        this.triggerAdhanAlert(this.nextPrayerName);
        setTimeout(() => this.fetchPrayerTimes(), 2000);
        return;
      }

      const diffSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;

      const hEl = document.getElementById('countHours');
      const mEl = document.getElementById('countMinutes');
      const sEl = document.getElementById('countSeconds');

      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  },

  triggerAdhanAlert(prayerName) {
    App.showToast(`حان الآن موعد أذان صلاة ${prayerName}`, 'success', 8000);
    this.playAdhan();

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`الله أكبر - حان الآن موعد أذان ${prayerName}`, {
        body: 'فَذَكِّرْ - أقم الصلاة',
        icon: './assets/images/favicon/android-chrome-512x512.png'
      });
    }
  },

  requestNotificationPermission() {
    if (!('Notification' in window)) {
      App.showToast('متصفحك لا يدعم الإشعارات المباشرة', 'error');
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        App.showToast('تم تفعيل إشعارات الأذان بنجاح!', 'success');
      } else {
        App.showToast('لم يتم منح إذن الإشعارات', 'error');
      }
    });
  },

  playAdhan() {
    this.adhanAudio.currentTime = 0;
    this.adhanAudio.play()
      .then(() => {
        this.isPlayingAdhan = true;
        this.updateAudioBtnUI();
      })
      .catch(() => {
        App.showToast('اضغط لتفعيل صوت الأذان', 'info');
      });
  },

  toggleAdhanSound() {
    if (this.isPlayingAdhan) {
      this.adhanAudio.pause();
      this.isPlayingAdhan = false;
    } else {
      this.playAdhan();
    }
    this.updateAudioBtnUI();
  },

  updateAudioBtnUI() {
    const btn = document.getElementById('btnTestAdhan');
    if (btn) {
      if (this.isPlayingAdhan) {
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>إيقاف الأذان</span>';
        btn.classList.replace('btn-secondary', 'btn-gold');
      } else {
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>استماع للأذان</span>';
        btn.classList.replace('btn-gold', 'btn-secondary');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('prayersGrid')) {
    PrayersManager.init();
  }
});
