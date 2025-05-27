let defaultSettings = {
  testType: "hsk3",
  level: "1",
  char: "simplified",
  dayLimit: "0",
  fontType: "PingFang",
  // date: new Date().getDate(),
  randomWords: [],
  sentenceExamples: true,
  color: true,
  pinyin: true,
  zhuyin: false,
  translation: true,
  ai: false,
  firstLaunch: true,
  // ua: "", // you can detect it at runtime
  game: {
    // get from cookie? .sync isn't supported on Safari
    wordsSeen: 1,
  },
  cache: {
    english: "Hello~",
    pinyinNumbered: "ni3hao3",
    pinyin: "nǐhǎo",
    simplified: "你好",
  },
};
    // TODO: version tracking
    // version: "0.3"

chrome.runtime.onInstalled.addListener(function (details) {

  let ua = parseUserAgent();
  let pinyinText, simplifiedText;

  // run only on install
  if (details.reason === "install") {
    // BETA fix Safari encoding issue omg, see https://stackoverflow.com/a/42096487
    if (ua.browser == "Safari") {
      defaultSettings.cache.pinyin = "ni3hao3"; 
      // TODO: fix Safari encoding issue
      defaultSettings.cache.simplified = ":)";
    }

    // TODO sync after install, leave only cache
    chrome.storage.local.set({
      ...defaultSettings,
      // date: new Date().getMinutes() }); // debug
      date: new Date().getDate(),
      ua: ua,
    });

    chrome.tabs.create({
      url: "index.html", // works in Safari 
    });
    console.log("installed!")

  } else if (details.reason === "update") {
        console.log("verifying data...")
        let updatedData = defaultSettings;
        chrome.storage.local.get(null, (items) => {
          updatedData = { ...updatedData, ...items };
          console.log(updatedData)
          chrome.storage.local.set(updatedData);
        });

    chrome.storage.local.set({
      updated: true,
      ua: parseUserAgent(),
    });

    console.log("background updated!")
  }




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
);


/* BETA 080924 | to launch new page instantly */
async function createOffscreen() {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['BLOBS'],
    justification: 'speed up new page opening',
  }).catch(() => { });
}

chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => { }; // keepAlive
createOffscreen();
/* BETA 150525 | to launch new page instantly without `offscreen` */
// to prevent Firefox from throwing warnings 
// I think it doesn't work, REMOVE!
// const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
// chrome.runtime.onStartup.addListener(keepAlive);
// keepAlive();


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



// BETA workaround for Safari ignoring Origin header rule
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ollama-fetch") {
    (async () => {
      try {
        const response = await fetch(message.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message.body)
        });
        const data = await response.json();
        sendResponse({ success: true, data });
      } catch (error) {
        sendResponse({ success: false, error: error.toString() });
      }
    })();
    return true;
  }
});


// BETA, check for browser
parseUserAgent = (uaString = navigator.userAgent) => {
  const ua = uaString.toLowerCase();

  // 檢查平台
  const os = (() => {
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('macintosh') || ua.includes('mac os x')) return 'macOS';
    if (ua.includes('windows')) return 'Windows';
    return 'other';
  })();

  // 檢查是否為手機
  const mobile = /mobile|iphone|android/.test(ua);

  // 檢查瀏覽器
  const browser = (() => {
    if (/edga\//.test(ua)) return 'Edge'; // Edge on Android
    if (/edg\//.test(ua)) return 'Edge'; // Edge on Windows
    if (/firefox\//.test(ua)) return 'Firefox';
    if (/safari/.test(ua) && /version/.test(ua) && !/chrome|crios|edg\//.test(ua)) return 'Safari';
    if (/chrome\//.test(ua) && !/edg\//.test(ua)) return 'Chrome';
    return 'other';
  })();

  return { os, browser, mobile };
}


