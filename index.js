let prays = document.getElementsByClassName("prays")[0];
let date_by_user = document.getElementById("date");
let countrys = document.getElementById("countrys");
let day = document.getElementById("day");

let d = new Date();
let month = d.getMonth() + 1;
if (month < 10) {
  month = "0" + month;
}
let day_date;
if (d.getDate() < 10) {
  day_date = "0" + d.getDate();
}

let date_today = day_date + "-" + month + "-" + d.getFullYear();
let dateForInput = `${d.getFullYear()}-${month}-${day_date}`;
let date_today_for_date_by_user =
  d.getFullYear() + "-" + month + "-" + d.getDate();
date_by_user.value = dateForInput;
if (localStorage.country != null) {
  let option = document.querySelector(
    `#countrys option[value="${localStorage.country}"]`
  );
  option.setAttribute("selected", "");
}

onload = getTime();

function getTime(country = countrys.value, date = date_by_user.value) {
  localStorage.country = country;

  if (date != date_today) {
    let correct_date = date;
    let [year, month, day] = correct_date.split("-");
    // Used to format the date that the API accepcted
    date = `${day}-${month}-${year}`;
  }
  prays.innerHTML = "<div id='loader'></div>";

  let url = `https://api.aladhan.com/v1/timingsByAddress/${date}?address=${country}&method=4`;
  axios
    .get(url)
    .then(function (response) {
      // to add the day in day box
      day.innerHTML = response.data.data.date.hijri.weekday.ar;
      let timings = response.data.data.timings;

      prays.innerHTML += `
        <div class="pray fajr">
              <h3>الفجر</h3>
              <p><span style="font-size:15px">AM</span> ${timings.Fajr} </p>

            </div>
            <div class="pray sunrise">
              <h3>الشروق</h3>
              <p><span style="font-size:15px">AM</span> ${timings.Sunrise}</p>

            </div>
            <div class="pray dhuhr">
              <h3>الظهر</h3>
              <p><span style="font-size:15px" id="pmORamForDhuhr"></span> ${
                timings.Dhuhr
              }</p>

            </div>
            <div class="pray asr">
              <h3>العصر</h3>
              <p><span style="font-size:15px">PM</span> ${convertTo12(
                timings.Asr
              )}</p>

            </div>
            <div class="pray maghrib">
              <h3>المغرب</h3>
              <p><span style="font-size:15px">PM</span> ${convertTo12(
                timings.Maghrib
              )} </p>

            </div>
            <div class="pray isha">
              <h3>العشاء</h3>
              <p><span style="font-size:15px">PM</span> ${convertTo12(
                timings.Isha
              )}</p>

            </div>
      `;
      document.getElementById("loader").style.display = "none";
      document.getElementById("pmORamForDhuhr").innerHTML =
        Number(timings.Dhuhr.slice(0, 2)) >= 12 ? "PM" : "AM";

      nextPray(country, date);
    })
    .catch(function () {
      document.getElementById("error").style.opacity = "1";
      document.getElementById("errpr").innerHTML =
        "⚠️ تعذر تحميل مواقيت الصلاة، الرجاء المحاولة لاحقًا.";
      setTimeout(() => {
        document.getElementById("error").style.opacity = "0";
      }, 3000);
    });
}

function convertTo12(num) {
  let [hours, minutes] = num.split(":");
  return "0" + (hours % 12) + ":" + minutes;
}

function nextPray(country, date) {
  // to make sure the day is today to put the next pray
  if (date_today != date) {
    return;
  }
  let fajr = document.getElementsByClassName("fajr")[0];
  let sunrise = document.getElementsByClassName("sunrise")[0];
  let dhuhr = document.getElementsByClassName("dhuhr")[0];
  let asr = document.getElementsByClassName("asr")[0];
  let maghrib = document.getElementsByClassName("maghrib")[0];
  let isha = document.getElementsByClassName("isha")[0];
  axios
    .get(
      `https://api.aladhan.com/v1/nextPrayerByAddress/${date_today}?address=${country}&method=4`
    )
    .then(function (response) {
      let prayName = response.data.data.timings;
      // will have the name of pary
      let keyPray = String(Object.keys(prayName));

      document.getElementsByClassName(keyPray.toLowerCase())[0].innerHTML +=
        "<p id='timeleft' style='font-size:15px;'></p>";
      let dateofpray = response.data.data.date.readable;
      switch (keyPray) {
        case "Fajr":
          fajr.classList.add("nextPray");
          getFullTimeForPray(Object.values(prayName), "Fajr", dateofpray);
          break;
        case "Sunrise":
          sunrise.classList.add("nextPray");
          getFullTimeForPray(Object.values(prayName), "Sunrise", dateofpray);
          break;
        case "Dhuhr":
          dhuhr.classList.add("nextPray");
          getFullTimeForPray(Object.values(prayName), "Dhuhr", dateofpray);
          break;
        case "Asr":
          asr.classList.add("nextPray");
          getFullTimeForPray(Object.values(prayName), "Asr", dateofpray);
          break;
        case "Maghrib":
          maghrib.classList.add("nextPray");
          getFullTimeForPray(Object.values(prayName), "Maghrib", dateofpray);
          break;
        case "Isha":
          isha.classList.add("nextPray");
          getFullTimeForPray(Object.values(prayName), "Isha", dateofpray);
          break;
      }
    })
    .catch(function () {
      document.getElementById("error").style.opacity = "1";
      document.getElementById("errpr").innerHTML =
        "❌ لم نتمكن من تحديد الصلاة القادمة.";
      setTimeout(() => {
        document.getElementById("error").style.opacity = "0";
      }, 3000);
    });
}

let prayerDate;
let timer;
function getFullTimeForPray(time, pray, dateofprayAPI) {
  let prayerTime = String(time);
  let datefromprayAPI = new Date(dateofprayAPI);
  let [h, m] = prayerTime.split(":").map(Number);
  prayerDate = new Date(
    datefromprayAPI.getFullYear(),
    datefromprayAPI.getMonth(),
    datefromprayAPI.getDate(),
    h,
    m,
    0
  );
  let dateToCompare = new Date();
  dateToCompare.setHours(23);
  dateToCompare.setMinutes(59);
  dateToCompare.setSeconds(59);
  let current = new Date();

  
  if (pray == "Fajr" && current <= dateToCompare) {
    let oneDay = 86400000;
    let tomorrow = new Date(prayerDate.getTime() + oneDay);
    prayerDate = tomorrow;
  }
  updateCountdown(pray);
}

function updateCountdown(prayName) {
  timer = setInterval(() => {
    let current = new Date();
    let diff = prayerDate - current;

    if (diff <= 0) {
      let prayNameinArabic =
        prayName == "Fajr"
          ? "الفجر"
          : prayName == "Sunrise"
          ? "الشروق"
          : prayName == "Dhuhr"
          ? "الظهر"
          : prayName == "Asr"
          ? "العصر"
          : prayName == "Maghrib"
          ? "المغرب"
          : "العشاء";

      new Notification("حان وقت " + prayNameinArabic, {
        icon: "./favicon_io (1)/android-chrome-512x512.png",
      });
      clearInterval(timer);
      setTimeout(getTime, 600000);
      return;
    }

    let diffSec = Math.floor(diff / 1000);
    let hours = Math.floor(diffSec / 3600);
    let minutes = Math.floor((diffSec % 3600) / 60);
    let seconds = diffSec % 60;
    let timeleft = document.getElementById("timeleft");
    if (timeleft != null) {
      timeleft.innerHTML = `يتبقى على رفع الاذان : ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
    }
  }, 1000);
}

let btnNotification = document.getElementById("btnNotification");
btnNotification.addEventListener("click", () => {
  let message = document.getElementById("message");
  message.style.background = "#198754";
  Notification.requestPermission().then((response) => {
    if (response === "granted") {
      message.innerHTML = `<p> 
      ✅ تم تفعيل الإشعارات بنجاح.
      <br>
💡 ملاحظة: لتصلك الإشعارات، يجب أن يظل الموقع مفتوحًا في متصفحك.
      </p>`;
      message.style.opacity = "1";
      setTimeout(() => {
        message.style.opacity = "0";
      }, 3000);
    } else {
      message.style.background = "#b02a37b1";
      message.innerHTML = "<p>❌ لم يتم تفعيل الإشعارات</p>";
      message.style.opacity = "1";
      setTimeout(() => {
        message.style.opacity = "0";
      }, 3000);
    }
  });
});
