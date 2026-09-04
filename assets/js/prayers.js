/**
 * Prayer Times Logic & Countdown Engine with Qibla Direction
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
    { name: 'الهفوف (الأحساء) - السعودية', value: 'Al-Hofuf,SA', lat: 25.3833, lng: 49.5833 },
    { name: 'مكة المكرمة - السعودية', value: 'Makkah,SA', lat: 21.4225, lng: 39.8262 },
    { name: 'المدينة المنورة - السعودية', value: 'Madinah,SA', lat: 24.4672, lng: 39.6108 },
    { name: 'الرياض - السعودية', value: 'Riyadh,SA', lat: 24.7136, lng: 46.6753 },
    { name: 'جدة - السعودية', value: 'Jeddah,SA', lat: 21.5433, lng: 39.1728 },
    { name: 'الدمام - السعودية', value: 'Dammam,SA', lat: 26.4207, lng: 50.0888 },
    { name: 'الخبر - السعودية', value: 'Khobar,SA', lat: 26.2172, lng: 50.1971 },
    { name: 'المبرز - السعودية', value: 'Al Mubarraz,SA', lat: 25.4125, lng: 49.5932 },
    { name: 'الطائف - السعودية', value: 'Taif,SA', lat: 21.2854, lng: 40.4244 },
    { name: 'أبها - السعودية', value: 'Abha,SA', lat: 18.2164, lng: 42.5053 },
    { name: 'تبوك - السعودية', value: 'Tabuk,SA', lat: 28.3835, lng: 36.5662 },
    { name: 'القصيم / بريدة - السعودية', value: 'Buraydah,SA', lat: 26.3260, lng: 43.9750 },
    { name: 'عنيزة - السعودية', value: 'Unaizah,SA', lat: 26.0844, lng: 43.9936 },
    { name: 'حائل - السعودية', value: 'Hail,SA', lat: 27.5219, lng: 41.6961 },
    { name: 'خميس مشيط - السعودية', value: 'Khamis Mushait,SA', lat: 18.3000, lng: 42.7333 },
    { name: 'نجران - السعودية', value: 'Najran,SA', lat: 17.4924, lng: 44.1277 },
    { name: 'جازان - السعودية', value: 'Jizan,SA', lat: 16.8892, lng: 42.5511 },
    { name: 'الباحة - السعودية', value: 'Al Baha,SA', lat: 20.0129, lng: 41.4676 },
    { name: 'سكاكا - السعودية', value: 'Sakakah,SA', lat: 29.9697, lng: 40.2064 },
    { name: 'عرعر - السعودية', value: 'Arar,SA', lat: 30.9753, lng: 41.0381 },
    { name: 'القاهرة - مصر', value: 'Cairo,EG', lat: 30.0444, lng: 31.2357 },
    { name: 'دبي - الإمارات', value: 'Dubai,AE', lat: 25.2048, lng: 55.2708 },
    { name: 'الكويت - الكويت', value: 'Kuwait City,KW', lat: 29.3759, lng: 47.9774 },
    { name: 'عمان - الأردن', value: 'Amman,JO', lat: 31.9454, lng: 35.9284 },
    { name: 'الدوحة - قطر', value: 'Doha,QA', lat: 25.2854, lng: 51.5310 },
    { name: 'المنامة - البحرين', value: 'Manama,BH', lat: 26.2285, lng: 50.5860 },
    { name: 'مسقط - عمان', value: 'Muscat,OM', lat: 23.5880, lng: 58.3829 },
    { name: 'بغداد - العراق', value: 'Baghdad,IQ', lat: 33.3152, lng: 44.3661 },
    { name: 'دمشق - سوريا', value: 'Damascus,SY', lat: 33.5138, lng: 36.2765 },
    { name: 'بيروت - لبنان', value: 'Beirut,LB', lat: 33.8938, lng: 35.5018 },
    { name: 'القدس - فلسطين', value: 'Jerusalem,PS', lat: 31.7683, lng: 35.2137 },
    { name: 'إسطنبول - تركيا', value: 'Istanbul,TR', lat: 41.0082, lng: 28.9784 },
    { name: 'لندن - المملكة المتحدة', value: 'London,GB', lat: 51.5074, lng: -0.1278 }
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

        // Update Qibla Compass
        const cityData = this.cities.find(c => c.value === this.selectedCity);
        const lat = this.coords ? this.coords.lat : (cityData ? cityData.lat : 25.3833);
        const lng = this.coords ? this.coords.lng : (cityData ? cityData.lng : 49.5833);
        this.updateQiblaDirection(lat, lng);
      })
      .catch(err => {
        console.error(err);
        App.showToast('عذرًا، تعذر تحميل مواقيت الصلاة. تحقق من الاتصال.', 'error');
      });
  },

  updateQiblaDirection(lat, lng) {
    const angle = App.calculateQiblaBearing(lat, lng);
    const needle = document.getElementById('qiblaNeedle');
    const angleText = document.getElementById('qiblaAngleText');

    if (needle) needle.style.transform = `rotate(${angle}deg)`;
    if (angleText) angleText.textContent = `${angle}° من اتجاه الشمال`;
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

    document.querySelectorAll('.pray-card').forEach(c => c.classList.remove('active-next'));
    const activeCard = document.querySelector(`.pray-card[data-prayer="${foundNext.key}"]`);
    if (activeCard) activeCard.classList.add('active-next');

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
