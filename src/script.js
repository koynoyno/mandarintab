import { draw } from "./draw.js";
import { cacheUpdate } from "./cacheUpdate.js";

chrome.storage.local.get(null, async (items) => {

  // const luck = 88;
  // BETA DEBUG always show when ai is active
  let luck;
  if (items.ai) { luck = 1 } else { luck = 88 }

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

  // draw characters, pinyin, tones, translation. TIME CRITICAL.
  let word = draw(items);
  
  // add sentence examples link
  // moved from draw.js to support text selection
  let online = window.navigator.onLine;
  if (items.sentenceExamples) {
    let url;
    if (items.ua.mobile) {
      // console.log('mobile')
      url = `plecoapi://x-callback-url/df?hw=${word}&sec=dict`;
      // dict|stroke|chars|words|sents
      char.addEventListener("click", (e) => {
        window.open(url, '_blank');
      });
      char.classList.add("charClickable");
    } else if (!items.ua.mobile && online) {
      // console.log('desktop')
      if (items.char == "simplified") {
        char.addEventListener("click", (e) => {
          url = `https://www.mdbg.net/chinese/dictionary?wdqb=%2A${word}%2A&wdrst=0`;
          window.open(url, '_blank');
        });
      } else {
        char.addEventListener("click", (e) => {
          url = `https://www.mdbg.net/chinese/dictionary?wdqb=%2A${word}%2A&wdrst=1`;
          window.open(url, '_blank');
        });
      }
      char.classList.add("charClickable");
    }
  }

  // BETA UNOPTIMIZED update title
  document.title = word;

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
    await showSeenWords(items.game.wordsSeen, items.testType, items.color, items.char, items.fontType);
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

  // prevent page from reloading on char right click
  let charOutput = document.querySelector(".char");
  charOutput.addEventListener("mousedown", (e) => {
    if (e.button == 2) {
      e.stopPropagation();
    }
  });

  // prevent context menu being hidden on char right click
  charOutput.addEventListener("contextmenu", (e) => {
    e.stopPropagation();
    return false;
  })

  if (items.ai) {
    const { ollamaPrompt } = await import("./ollama.js");
    await ollamaPrompt(items)
    ai.addEventListener("mousedown", async (e) => {
      if (e.button == 2) {
        e.stopPropagation();
        ai.innerHTML = "";
        await ollamaPrompt(items)
      }
    });
  }
});