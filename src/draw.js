import splitAndKeep from "./npm/color.js";

// TODO: if items.timesFont then ${times-font} resolves to CSS class

export let draw = (items) => {
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

    drawObject += `<p id="char" class="char ${items.fontType}-font" align="center" ${title}>${coloredChar}</p>`;
  } else {
    // just draw characters
    drawObject += `<p id="char" class="char ${items.fontType}-font" align="center" ${title}>${char}</p>`;
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

    // drawObject = `<p class="english" align="center">${english}</p>` + drawObject;
    // drawObject = `<p class="english ${items.fontType}-font" align="center">${english}</p>` + drawObject;
    
    // OLD just draw everything, but `hsk3` has too many words
    // drawObject = `<p class="english ${items.fontType}-font" align="center">${data.english}</p>` + drawObject;
  }

  // show zhuyin
  if (items.zhuyin) {
    // drawObject += `<p class="zhuyin" align="center">${data.zhuyin}</p>`;
    // drawObject += `<p class="zhuyin times-font" align="center">${data.zhuyin}</p>`;
    drawObject += `<p class="zhuyin ${items.fontType}-font" align="center">${data.zhuyin}</p>`;
  }

  // show pinyin
  if (items.pinyin) {
    minHeight += 2;
    // drawObject += `<p class="pinyin ${items.fontType}-font" align="center">${data.pinyin}</p>`;
    drawObject += `<p class="pinyin" align="center">${data.pinyin}</p>`;
  }

  // show AI output
  if (items.ai) {
    // drawObject += `<button id="example">Example</button><div class="ai"><pre id="output"></pre></div>`
     // BETA for AI to prevent jumping text
    drawObject += `<div id="ai" style="min-height: ${minHeight}rem;"></div>`
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
