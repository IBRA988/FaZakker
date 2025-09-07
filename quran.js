onload = quran();
let arrsuwar = [];

function quran() {
  axios
    .get("https://www.mp3quran.net/api/v3/suwar")
    .then((suwar) => {
      let i = 1;
      for (surah of suwar.data.suwar) {
        document.getElementById("listsuwar").innerHTML += `
            <option value="${i}" id="${i}" data-startpage = "${surah.start_page}" data-endpage = "${surah.end_page}">${surah.name}</option>
            `;
        arrsuwar.push({
          index: i,
          name: surah.name,
          startpage: surah.start_page,
        });
        i++;
      }
      if(localStorage.pagenum != null){
        displaysurah(localStorage.pagenum)
      }
      else{
        displaysurah();
      }
      
    })
    .catch(() => {
      document.getElementById("error").style.opacity = "1";
      document.getElementById("errpr").innerHTML =
        "⚠️ تعذر تحميل أسماء السور، حاول مرة أخرى لاحقًا.";
      setTimeout(() => {
        document.getElementById("error").style.opacity = "0";
      }, 3000);
    });
}
let num = document.getElementById("number");

function displaysurah(startpage = 1) {
  localStorage.pagenum = startpage;
  let num;
  num =
    startpage < 10
      ? "00" + startpage
      : startpage < 100
      ? "0" + startpage
      : startpage;

  document.getElementById("ayat").innerHTML = "<div id='loader'></div>";
  axios
    .get(`https://www.mp3quran.net/api/quran_pages_svg/${num}.svg`)
    .then((page) => {
      document.getElementById("ayat").innerHTML = "";
      document.getElementById("number").value = Number(num);
    
      let n = num;
      document.getElementById("ayat").innerHTML = `
           ${page.data}
           <p onclick = "displaysurah(${++num})" class="arrow" id="arrowleft" title="الى الصفحة التالية"><i class="fa-solid fa-arrow-left" style="color:white"></i></p>
           <p onclick = "displaysurah(${
             num - 2
           })" class="arrow arrowright" id="arrowright" title="الى الصفحة السابقة"><i class="fa-solid fa-arrow-right" style="color:white"></i></p>
           `;

      putsurah(Number(n));     
      if (n == 1) {
        document.getElementById("arrowright").style.display = "none";
      }
      if (n == 604) {
        document.getElementById("arrowleft").style.display = "none";
      }
    })
    .catch(() => {
      setTimeout(() =>{
        document.getElementById("error").style.opacity = "1";
      document.getElementById("errpr").innerHTML =
        "❌ رقم الصفحة غير صحيح، الرجاء إدخال رقم صفحة صحيح  .";
      },1000)
      setTimeout(() => {
        document.getElementById("error").style.opacity = "0";
      }, 2000);
    });
}

function putsurah(pagenum) {

  let select = document.getElementById("listsuwar");
  let selectedOption = select.options[select.selectedIndex];
  selectedOption.removeAttribute("selected");

  for (let j = 0; j < arrsuwar.length; j++) {
    if (pagenum == arrsuwar[j].startpage) {
      document.getElementById(arrsuwar[j].index).setAttribute("selected", "");
      break;
    } else if (pagenum <= arrsuwar[j].startpage) {
      document
        .getElementById(arrsuwar[j - 1].index)
        .setAttribute("selected", "");
      break;
    }
  }
}

