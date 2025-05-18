import { toChineseNumber } from "./npm/toChineseNumber.js";
// import { confetti2 } from "./npm/confetti2.js";
import { addStyle } from "./npm/addStyle.js";

export let showSeenWords = async (wordsSeen, color, char, fontType) => {

  // check whether tone colors are turned on
     // TODO: random panda position, not optimized
     addStyle(`
     #panda {
       left: ${ Math.floor(Math.random() * (document.documentElement.clientWidth - 240)) }px;
     }
   `);
  // document.getElementById('panda').mousedown = '';

  let message;
  let wordsSeenNumber = toChineseNumber(wordsSeen, color)

  // TODO: get the message from _locales
  if (char == "simplified" ) { message = `您打开了<span id="wordsSeenNumber">${wordsSeenNumber}</span>个标签页`} 
  else { message =`您打開了<span id="wordsSeenNumber">${wordsSeenNumber}</span>個標籤頁`}

  // let jiayou = color
  //   ? '<br/><span class="tone1 times-font">加</span>' +
  //     '<span class="tone2 times-font">油</span>！</strong>'
  //   : '<br/><span class="times-font">加油</span>！</strong>';
  let jiayou=''
 
  app.insertAdjacentHTML(
    // "beforeend",
    "afterbegin",
    '<img src="images/panda_easter.png" id="panda" draggable="false" title="酷酷酷！"/>' +
      `<p id="wordsSeen" class="${fontType}-font invisible" align="center">${message}</p>` 
      // `<strong>${jiayou}</p>`
  );

  // document.getElementById('panda').mousedown = '';

  // document.getElementById('panda').removeAttribute("mousedown");

  // replace current word with number of tabs
  // document.getElementByClassName("char");


  // hide on click
  panda.addEventListener("click", () => {
    // SPOILER ALERT
    panda.classList.add("fade");

    // OLD EFFECT, WORKING
        // yellow-green and red-violet
        let colors = [
          "#cb0074",
          "#feb1dd",
          "#e9ffbf",
          "#9fee00",
          "#7f4c6a",
          "#35001e",
          "#8a9e61",
          "#2a4000",
        ];
    // confetti({
    //   // left
    //   particleCount: 30,
    //   startVelocity: 60,
    //   angle: 32,
    //   origin: { x: 0 },
    //   colors: colors,
    //   spread: 130,
    //   ticks: 300
    // });
    // confetti({
    //   // right
    //   particleCount: 30,
    //   startVelocity: 55,
    //   angle: 153,
    //   origin: { x: 1 },
    //   colors: colors,
    //   spread: 140,
    //   ticks: 400
    // });

    // DOESN't WORK PROPERLY FOR SOME REASON
    // let canvas = document.createElement('canvas');
    // canvas.id = "confetti2";
    // canvas.width = document.body.clientWidth;
    // canvas.height = document.body.clientHeight;
    // canvas.style.zIndex = 8;
    // canvas.style.position = "absolute";
    // document.getElementById("app").appendChild(canvas);
    // confetti2();

    // UNUSED, 30s CYCLE

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
  }
    var duration = Math.floor(getRandomArbitrary(15, 25)) * 1000;
      var end = Date.now() + duration;
    
    (function frame() {
      confetti({
        particleCount: Math.floor(getRandomArbitrary(2,4)),
        startVelocity: Math.floor(getRandomArbitrary(0,20)),
        spread: 360,
        colors: colors,
        ticks: 1000,
        origin: {
          x: Math.random(),
          // since they fall down, start a bit higher than random
          y:  Math.random() - 1
        }
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // window.addEventListener("mousedown", (e) => {
    //   chrome.tabs.reload();
    // }) 

    setTimeout(function () {
      panda.remove();
      document.querySelector("#wordsSeen").classList.remove("invisible");
    }, 200); // hide panda after 195ms (see css/style.css:#panda)
  });
};
