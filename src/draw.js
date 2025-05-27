// import splitAndKeep from "./npm/color.js";

// TODO: if items.timesFont then ${times-font} resolves to CSS class

export let draw = (items) => {

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
