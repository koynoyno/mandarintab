chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // TODO sync after install, leave only cache
    chrome.storage.local.set({
      testType: "hsk3",
      level: "1", // string for easier convertation
      char: "simplified",
      dayLimit: "0",
      fontType: "PingFang", // TODO implement .woff2 fonts?
      date: new Date().getDate(),
      // date: new Date().getMinutes() }); // debug
      randomWords: [],
      sentenceExamples: true,
      color: true,
      pinyin: true,
      zhuyin: false,
      translation: true,
      // darkMode: true, // TODO: detect darkMode on install
      // qr: true,
      firstLaunch: true,
      game: {
        wordsSeen: 1, // :(
        // get from cookie? .sync isn't supported on Safari
      },
      cache: {
        english: "Hello~",
        pinyinNumbered: "ni3hao3",
        pinyin: "nǐhǎo",
        zhuyin: "ㄋㄧˇ ㄏㄠˇ",
        simplified: "你好",
        traditional: "你好",
        "漢語拼音": "nǐhǎo",
        "注音": "ㄋㄧˇ ㄏㄠˇ",
        "展開表": "你好",
      },
    });

    chrome.tabs.create({
      url: "index.html", // works in Safari
    });
  } else if (details.reason === "update") {
    chrome.storage.local.set({ updated: true });
    console.log("updated!")
    // TODO: messaging instead of storage?
  }
  // } else if (details.reason === "chrome_update") {
  // When browser is updated
  // Not supported by Safari
  // } else if (details.reason === "shared_module_update") {
  // When a shared module is updated
  // Probably not supported by Safari 
  // }

  // localStorage is the synchronous, this way white flash can be avoided
  // TODO: implement messaging to localStorage approach
});

/* BETA 150525 | to launch new page instantly without `offscreen` */
// to prevent Firefox from throwing warnings 
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();


// DEV logger to monitor storage changes
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });

// DISABLED: uninstall survey
// TODO: typeform
// not supported in Safari
// chrome.runtime.setUninstallURL("https://forms.gle/A2j7TKjXwUfuALqz7");
