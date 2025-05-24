import { draw } from "./draw.js";
import { cacheUpdate } from "./cacheUpdate.js";

chrome.storage.local.get(null, async (items) => {

  const luck = 88;

  // if extension is updated
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
    await ifFirstLaunch(items.char);
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

  // BETA AI
  ai.addEventListener("click", async () => {
    const { ollama } = await import("./ollama.js");
    let prompt;
    if (items.char == "simplified") {
      // prompt = `explain what is ${items.cache.simplified}`
      prompt = `explain what is ${items.cache.english}`
    } else {
      // prompt = `explain what is ${items.cache.traditional}`
      prompt = `explain what is ${items.cache.english}`
    }
    console.log(prompt)
    await ollama(prompt);
  });

  ask.addEventListener("click", async () => {
    const { ollama } = await import("./ollama.js");
    let prompt = `give me 3 sentence examples for ${items.cache.english}`;
    await ollama(prompt);
  });
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
