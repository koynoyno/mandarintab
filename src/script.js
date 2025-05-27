chrome.storage.local.get(null, async (items) => {

  const luck = 88;

  // if extension is updated
  // TODO verify chrome.storage integrity on update
  if (items.updated) {
    const { postUpdate } = await import("./npm/postUpdate.js");
    await postUpdate();
  }

  // update empty cache
  try {
    if (Object.keys(items.cache).length === 0) {
      items.cache = await cacheUpdate(items);
    }
  } catch (e) {
    // console.log(e)
    // // BETA repopulate if new session
    // //  chrome.storage.local.get( {items} )
    // chrome.storage.local.get(["localItem"]).then(async (result) => {
    //   items = result.localItem
    //   char = draw(items);
    //   // console.log(items)
    // });
  }

  // draw characters, pinyin, tones, translation, QR
  let char = draw(items);

  // BETA UNOPTIMIZED update title
  document.title = char;

  // BETA unoptimized
  // window.addEventListener("mousedown", (e) => {
  //   chrome.tabs.reload();
  // }) 
  // document.getElementsByClassName('char').mousedown = '';


  // display first launch greeting or seen words message
  // items.firstLaunch = true;
  if (items.firstLaunch) {

    // to apply darkMode for popup
    if (items.darkMode) {
      localStorage.setItem("darkMode", "darkMode");
    }

    const { ifFirstLaunch } = await import("./firstLaunch.js");
    await ifFirstLaunch(items.char, items.ua);
  } else if (Math.floor(Math.random() * luck) % luck == 0) {
    const { confetti } = await import("./npm/confetti.browser.js");
    const { showSeenWords } = await import("./showSeenWords.js");
    await showSeenWords(items.game.wordsSeen, items.color, items.char, items.fontType);
  } else {
    // ...
  }


  // repopulate cache and update counter
  // items.game.wordsSeen++;
  chrome.storage.local.set({
    cache: await cacheUpdate(items),
    // game: { wordsSeen: items.game.wordsSeen },
    game: { wordsSeen: ++items.game.wordsSeen },
  });

  // mouse and keyboard events

  window.addEventListener("mousedown", (e) => {
    if (e.button == 2) {
      chrome.tabs.reload();
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      chrome.tabs.reload();
    }
  });

  // BETA reload tabs with right-click
  // hack to hide context menu
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  })

  if (items.ai) {
    const { ollamaPrompt } = await import("./ollama.js");
    await ollamaPrompt(items)
    document.getElementsByClassName("ai")[0].addEventListener("mousedown", async (e) => {
      if (e.button == 2) {
        e.stopPropagation();
        document.getElementsByClassName("ai")[0].innerHTML = "";
        await ollamaPrompt(items)
      }
    });
  }
});


// apply dark mode beautiful way
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     switch (key) {
//       case "darkMode":
//         document.body.classList.toggle("darkMode");
//       default:
//       // console.log(
//       //   `Storage key "${key}" in namespace "${namespace}" changed.`,
//       //   `Old value was "${JSON.stringify(oldValue, undefined, 4)}", new value is "${JSON.stringify(newValue, undefined, 4)}".`
//       // );
//     }
//   }
// });

// -------------------------------

let cacheUpdate = async (items) => {
  const { default: testType } = await import(
    `../tests/${items.testType}/${items.testType}_${items.level}.js`
  );

  let rand;
  let testTypeLength = testType.words.length;

  // select a random word if dayLimit is set
  if (parseInt(items.dayLimit) !== 0) {
    rand = getRandomWord(testTypeLength, items);
  } else {
    rand = getRandomNumber(testTypeLength);
  }

  // update and return items
  return testType.words[rand];
};

let getRandomWord = (testTypeLength, items) => {
  let randomWords = [];
  const newDate = new Date().getDate();
  // const newDate = new Date().getMinutes(); // for debugging purposes

  if (items.randomWords.length !== parseInt(items.dayLimit)) {
    for (let i = 0; i < parseInt(items.dayLimit); i++) {
      randomWords[i] = getRandomNumber(testTypeLength);
    }
    chrome.storage.local.set({ randomWords: randomWords });
  } else if (items.date !== newDate) {
    for (let i = 0; i < parseInt(items.dayLimit); i++) {
      randomWords[i] = getRandomNumber(testTypeLength);
    }
    chrome.storage.local.set({ randomWords: randomWords, date: newDate });
  } else {
    randomWords = items.randomWords;
  }

  return randomWords[getRandomNumber(randomWords.length)];
};

// TODO: omg please optimize this
let getRandomNumber = (data) => {
  return Math.floor(Math.random() * data);
};

// -----------------------------------

let draw = (items) => {

  // debug
  // console.log(items)

  let char = "";
  let drawObject = ""; // to call insertAdjacentHTML only once
  let minHeight = 3.5; // BETA for AI to prevent jumping text
  if (items.ua.browser == "Safari" || items.ua.browser == "Firefox") {
    minHeight += 2.5; // BETA for Safari to prevent jumping text   
  }

  //  let data = testType.words[rand];
  let data = items.cache;
  // console.log(items.fontType)

  // adapter for TOCFL dictionaries...
  if (items.testType === "tocfl") {
    char = data["展開表"];
    data.pinyin = data["漢語拼音"];
    data.zhuyin = data["注音"];
    data.english = "";
  } else {
    // ...or just retrieve word from HSK dictionary
    char = data[items.char]; // why items.char and not data.char? 
  }

  // whether the word should be clickable or not
  let classChar = items.sentenceExamples ? "char charClickable" : "char";

  // DEV show pinyin and english on hover
  let title = ""; // hover suggestion if pinyin or translation are turned off
  if (!items.pinyin && !items.translation) {
    title = `title="${data.pinyin}\n\n${data.english}"`;
  } else if (!items.pinyin) {
    title = `title="${data.pinyin}"`;
  // zhuyin shouldn't be displayed when `hsk3` is used 
  } else if (!items.zhuyin && items.testType === "tocfl") {
    title = `title="${data.zhuyin}"`;
  } else if (!items.translation) {
    title = `title="${data.english}"`;
  }


  // draw colors, works only for HSK3
  // TODO: add TOCFL support
  if (items.testType !== "tocfl" && items.color) {
    // TODO: move to color.js, remove splitAndKeep import

    String.prototype.splitAndKeep = function (separator, method) {
      let str = this;
      let splitAndKeep = (str, separator, method = "separate") => {
        if (method == "separate") {
          str = str.split(new RegExp(`(${separator})`, "g"));
        } else if (method == "infront") {
          str = str.split(new RegExp(`(?=${separator})`, "g"));
        } else if (method == "behind") {
          str = str.split(new RegExp(`(.*?${separator})`, "g"));
          str = str.filter(function (el) {
            return el !== "";
          });
        }
        return str;
      };
    
      if (Array.isArray(separator)) {
        let parts = splitAndKeep(str, separator[0], method);
        for (let i = 1; i < separator.length; i++) {
          let partsTemp = parts;
          parts = [];
          for (let p = 0; p < partsTemp.length; p++) {
            parts = parts.concat(splitAndKeep(partsTemp[p], separator[i], method));
          }
        }
        return parts;
      } else {
        return splitAndKeep(str, separator, method);
      }
    };
    
    let result = data.pinyinNumbered.splitAndKeep(["1", "2", "3", "4", "5"]);
    let length = result.length / 2 - 1;
    let coloredChar = "";

    for (let i = 0; i < length; i++) {
      if (char[i] !== undefined) {
        coloredChar += `<span class="tone${result[i * 2 + 1]}">${char[i]
          }</span>`;
      }
    }

    drawObject += `<p class="${classChar} ${items.fontType}-font" align="center" ${title}>${coloredChar}</p>`;
  } else {
    drawObject += `<p class="${classChar} ${items.fontType}-font" align="center" ${title}>${char}</p>`;
  }

  // add sentence examples link
  if (items.sentenceExamples) {
    let url;
    if (items.ua.mobile) {
      // console.log('mobile')
      url = `plecoapi://x-callback-url/df?hw=${char}&sec=dict`;
      // dict|stroke|chars|words|sents
    } else { // desktop
      // console.log('desktop')
      if (items.char == "simplified") {
        url = `https://www.mdbg.net/chinese/dictionary?wdqb=%2A${char}%2A&wdrst=0`;
      } else {
        url = `https://www.mdbg.net/chinese/dictionary?wdqb=%2A${char}%2A&wdrst=1`;
      }
    }
    drawObject = `<a href="${url}" class="link" target="_blank">${drawObject}</a>`;
  }

  // IDEA what if not to draw it? 
  // show translation
  if (items.translation) {
    minHeight += 2;
    // BETA 180525 display up to 3 words
    // TODO should I cut only `hsk3`? currently it cut's `tocfl` as well
    let english = data.english;

    // Trim to max 3 words separated by commas
    let words = english.split(',').map(word => word.trim());
    if (words.length > 3) {
      english = words.slice(0, 3).join(', ');
      drawObject = `<p class="english" align="center" title="${data.english}">${english},</p>` + drawObject;
    } else {
      drawObject = `<p class="english" align="center">${data.english}</p>` + drawObject;
    }
    // OLD just draw everything, but `hsk3` has too many words
    // drawObject = `<p class="english ${items.fontType}-font" align="center">${data.english}</p>` + drawObject;
  }

  // show zhuyin
  if (items.zhuyin) {
    drawObject += `<p class="zhuyin ${items.fontType}-font" align="center">${data.zhuyin}</p>`;
  }

  // show pinyin
  if (items.pinyin) {
    minHeight += 2;
    drawObject += `<p class="pinyin align="center">${data.pinyin}</p>`;
  }

  // show AI output
  if (items.ai) {
     // BETA for AI to prevent jumping text
    drawObject += `<div class="ai" style="min-height: ${minHeight}rem;"></div>`
  }

  // draw everything
  app.insertAdjacentHTML("beforeend", drawObject);
  return char
};