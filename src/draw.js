import splitAndKeep from "./npm/color.js";

// TODO: if items.timesFont then ${times-font} resolves to CSS class

export let draw = (items) => {
  let char = "";
  let drawObject = ""; // to call insertAdjacentHTML only once


  //  let data = testType.words[rand];
  let data = items.cache;
  console.log(items.fontType)

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
  } else if (!items.zhuyin) {
    title = `title="${data.zhuyin}"`;
  } else if (!items.translation) {
    title = `title="${data.english}"`;
  }

  // // IDEA what if not to draw it? 
  // // show translation
  // if (items.translation) {
  //   drawObject += `<p class="english" align="center">${data.english}</p>`;
  // }

  // draw colors, works only for HSK3
  // TODO: add TOCFL support
  if (items.testType !== "tocfl" && items.color) {
    // TODO: move to color.js, remove splitAndKeep import
    let result = data.pinyinNumbered.splitAndKeep(["1", "2", "3", "4", "5"]);
    let length = result.length / 2 - 1;
    let coloredChar = "";

    for (let i = 0; i < length; i++) {
      if (char[i] !== undefined) {
        coloredChar += `<span class="tone${result[i * 2 + 1]}">${char[i]
          }</span>`;
      }
    }

    // drawObject += `<p class="${classChar}" align="center">${coloredChar}</p>`;
    // drawObject += `<p class="${classChar}" align="center" ${title}>${coloredChar}</p>`;
    // drawObject += `<p class="${classChar} times-font" align="center" ${title}> ${coloredChar} </p>`;
    drawObject += `<p class="${classChar} ${items.fontType}-font" align="center" ${title}>${coloredChar}</p>`;
  } else {
    // just draw characters
    // drawObject += `<p class="${classChar}" align="center"">${char}</p>`;
    // drawObject += `<p class="${classChar}" align="center" ${title}>${char}</p>`;
    // drawObject += `<p class="${classChar} times-font" align="center" ${title}> ${char} </p>`;
    drawObject += `<p class="${classChar} ${items.fontType}-font" align="center" ${title}>${char}</p>`;
  }

  // add sentence examples link
  // BETA: or deeplink to pleco, taken from https://stackoverflow.com/a/29509267
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (items.sentenceExamples) {
    let url;
    // /*OLD*/ if (window.innerWidth < window.innerHeight) {
    // untested
    if (isMobile) {
      // console.log('mobile')
      url = `plecoapi://x-callback-url/df?hw=${char}&sec=dict`;
      // dict|stroke|chars|words|sents
    } else {
      // console.log('desktop')
      // url = `https://context.reverso.net/translation/chinese-english/${char}`;
      if (items.char == "simplified") {
        // url = `https://www.mdbg.net/chinese/dictionary?wdqb=c%3A%2A${char}%2A&wdrst=0`;
        url = `https://www.mdbg.net/chinese/dictionary?wdqb=%2A${char}%2A&wdrst=0`;
      } else {
        // url = `https://www.mdbg.net/chinese/dictionary?wdqb=c%3A%2A${char}%2A&wdrst=1`;
        url = `https://www.mdbg.net/chinese/dictionary?wdqb=%2A${char}%2A&wdrst=1`;
      }
    }
    // drawObject = `<a href="${url}" class="link">${drawObject}</a>`;
    drawObject = `<a href="${url}" class="link" target="_blank">${drawObject}</a>`;
  }

  // IDEA what if not to draw it? 
  // show translation
  if (items.translation) {
    drawObject = `<p class="english ${items.fontType}-font" align="center">${data.english}</p>` + drawObject;
  }

  // show zhuyin
  if (items.zhuyin) {
    // drawObject += `<p class="zhuyin" align="center">${data.zhuyin}</p>`;
    // drawObject += `<p class="zhuyin times-font" align="center">${data.zhuyin}</p>`;
    drawObject += `<p class="zhuyin ${items.fontType}-font" align="center">${data.zhuyin}</p>`;
  }

  // show pinyin
  if (items.pinyin) {
    drawObject += `<p class="pinyin ${items.fontType}-font" align="center">${data.pinyin}</p>`;
  }

  // draw everything
  app.insertAdjacentHTML("beforeend", drawObject);

  // if (items.zhuyin) {
  //   return `${l} ${char} ${r} ${data.zhuyin}`;
  // } else if (items.pinyin) {
  //   return `${l} ${char} ${r} ${data.pinyin}`;
  // } else {
  //   return char;
  // }
  return char
};
