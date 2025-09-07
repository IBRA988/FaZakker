let containerazkar = document.querySelector(".containerazkar");

onload = getAzkarName();

function getAzkarName() {
  containerazkar.innerHTML = "<div id='loader'></div>";
  axios
    .get(
      "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json"
    )
    .then((response) => {
      containerazkar.innerHTML = "";
      for (let i = 0; i < Object.keys(response.data).length; i++) {
        let azkarName = Object.keys(response.data)[i];
        containerazkar.innerHTML += `
            <div class="azkar" id="${i}"  onclick = 'getAzkar("${azkarName}"); azkarSelected(${i})' >${azkarName} </div>
            `;
      }
    })
    .catch(() => {
      document.getElementById("error").style.opacity="1";
      document.getElementById("errpr").innerHTML = "⚠️ لم نتمكن من جلب أسماء الأذكار، تحقق من الاتصال أو حاول لاحقًا."
      setTimeout(()=>{
        document.getElementById("error").style.opacity="0";
      },3000)
    });
    
}
function azkarSelected(index){
  for(item of document.getElementsByClassName("azkar")){
    document.getElementById(item.id).classList.remove("selected")
  }
  document.getElementById(index).classList.add("selected");
}

let displayAzkar = document.querySelector(".displayAzkar");
function getAzkar(name) {
  displayAzkar.innerHTML = "<div id='loader'></div>";
  axios
    .get(
      "https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json"
    )
    .then((response) => {
      displayAzkar.innerHTML = "";
      let flag = true;
      for (obj of response.data[name]) {
        if (obj.content == "stop") {
          continue;
        }
        if (name == "أذكار الصباح" && flag) {
          for (inner of obj) {
            displayAzkar.innerHTML += `
          <div class="dis">
                  <div>
                    <p class="cont">${inner.content}</p>
                    <p class="countdown" title="عدد مرات التكرار" style="user-select: none;"> 
                     <span class="num" >${Number(
                       inner.count
                     )}</span><span class="num2hidden" style="display:none">${Number(
              inner.count
            )}</span>  </p>  
                      
                             
                  </div>
                    <p class="description">${inner.description}</p>
                </div>
          `;
          }
          flag = false;
          continue;
        }
        displayAzkar.innerHTML += `
                <div class="dis">
                  <div>
                    <p class="cont">${String(obj.content)
                      .replaceAll("\\n", "")
                      .replaceAll(",", "")
                      .replaceAll("'", "").trim()}</p>
                    <p class="countdown" title="عدد مرات التكرار" style="user-select: none;">
                     <span class="num" >${Number(
                       obj.count
                     )}</span><span class="num2hidden" style="display:none">${Number(
          obj.count
        )}</span> </p>         
                  </div>
                    <p class="description">${obj.description}</p>
                </div>
          `;
      }
      document.querySelectorAll(".countdown").forEach(function (btn) {
        btn.addEventListener("click", function () {
          let box = this.closest(".dis");
          let counter = box.querySelector(".num");
          counter.textContent = parseInt(counter.textContent) - 1;
          if (parseInt(counter.textContent) == -1) {
            counter.textContent = Number(
              box.querySelector(".num2hidden").textContent
            );
          }
        });
      });

      document.get;
    })
    .catch(() => {
      document.getElementById("error").style.opacity="1";
      document.getElementById("errpr").innerHTML = "❌ تعذر إضافة الأذكار، الرجاء إعادة المحاولة لاحقًا."
      setTimeout(()=>{
        document.getElementById("error").style.opacity="0";
      },3000)
    });
}

let moveupbtn = document.getElementById("moveup");
window.onscroll = function () {
  if (scrollY >= 10) {
    moveupbtn.style.display = "block";
  } else {
    moveupbtn.style.display = "none";
  }
};
moveupbtn.onclick = function () {
  scroll({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
};
