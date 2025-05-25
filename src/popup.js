// darkMode
// document.body.classList.add(localStorage.getItem("darkMode"));
let userAgent = navigator.userAgent;
if (userAgent.indexOf('Mac') > -1) {
  document.getElementById('fontTypeLabel').removeAttribute("hidden")
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    document.getElementById('fontType').removeAttribute("hidden")
    // document.getElementById('fontTypeSafari').removeAttribute("hidden")
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    document.getElementById('fontTypeSafari').removeAttribute("hidden")
  }
}

// hide AI checkbox on mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
if (!isMobile) {
  document.getElementById('ai').removeAttribute("hidden")
  document.getElementById('aiLabel').removeAttribute("hidden")
}

// ==========================================
// apply settings
let saveSettings = (id, checkbox = false) => {
  let value;
  if (checkbox) {
    value = document.querySelector(`#${id}`).checked;
  } else {
    value = document.querySelector(`#${id}`).value;
  }

  // DELETE if settings are stable
  // remove cache if level or day limit is changed
  // if (id == "level" || id == "dayLimit") {
  //   chrome.storage.local.set({ [id]: value, randomWords: [], cache: {} });
  // } else {
  //   // otherwise just apply id (minimize sync.set calls)
  //   chrome.storage.local.set({ [id]: value });
  // }

  switch (id) {
    // remove cache if level or day limit is changed
    case "level":
    case "dayLimit":
      chrome.storage.local.set({ [id]: value, randomWords: [], cache: {} });
      chrome.tabs.reload();
      break;

    // remove cache and redraw #level options if test type is toggled
    case "testType":
      // reset cache
      chrome.storage.local.set({ [id]: value, randomWords: [], cache: {} });
      let level = document.querySelector("#level");
      let levelValue = level.value;
      while (level.lastElementChild) {
        level.removeChild(level.lastElementChild);
      }
      redrawTestLevels(value);
      if (value == "tocfl" && levelValue > 5) {
        chrome.storage.local.set({ level: "5" });
        level.value = "5";
      } else {
        level.value = levelValue;
      }

      // BETA
      // Automatically switch char type
      let char = document.querySelector("#char");
      if (value == "tocfl") {
        char.value = "traditional";
        chrome.storage.local.set({ char: "traditional" });
      } else if (value == "hsk3") {
        char.value = "simplified";
    chrome.storage.local.set({ char: "simplified" });
  }
      
      // BETA
      // hide 'translationLabel' and 'colorLabel' when switching to TOCFL
      if (value == "tocfl") {
        document.getElementById('char').hidden = true;
        document.getElementById('charLabel').hidden = true;
        document.getElementById('colorLabel').hidden = true;
        document.getElementById('translationLabel').hidden = true;
      // display them back when switching to HSK
      } else {
        document.getElementById('char').hidden = false;
        document.getElementById('charLabel').hidden = false;
        document.getElementById('colorLabel').hidden = false;
        document.getElementById('translationLabel').hidden = false;
      }

      // TODO: switch to traditional if tocfl
      // if (value == "tocfl") {
      //   chrome.storage.local.set({ char: "traditional" });
      // }

      chrome.tabs.reload();
      break;

    // redraw popup if darkMode is toggled
    // case "darkMode":
    //   chrome.storage.local.set({ [id]: value });
    //   document.body.classList.toggle("darkMode");
    //   if (value) {
    //     // document.body.classList.add("darkMode");
    //     localStorage.setItem("darkMode", "darkMode");

    //   } else {
    //     // document.body.classList.remove("darkMode");
    //     localStorage.removeItem("darkMode");
    //   }
    //   break;
    // TODO: disable Simplified when TOCFL is selected?
    case "fontTypeSafari":
      chrome.storage.local.set({ fontType: value });
      chrome.tabs.reload();
      break;
    default:
      chrome.storage.local.set({ [id]: value });
      chrome.tabs.reload();
  }
};

// =============================================
// get settings on window load
let restoreSettings = () => {
  chrome.storage.local.get(
    {
      testType: testType,
      level: level,
      char: char,
      dayLimit: dayLimit,
      fontType: fontType,
      sentenceExamples: sentenceExamples,
      color: color,
      pinyin: pinyin,
      zhuyin: zhuyin,
      translation: translation,
      ai: ai
      // darkMode: darkMode
    },
    (items) => {
      redrawTestLevels(items.testType);
      testType.value = items.testType;
      level.value = items.level;
      // char.value = items.char;
      dayLimit.value = items.dayLimit;
      fontType.value = items.fontType;
      sentenceExamples.checked = items.sentenceExamples;
      // color.checked = items.color;
      pinyin.checked = items.pinyin;
      zhuyin.checked = items.zhuyin;
      ai.checked = items.ai;
      // translation.checked = items.translation;
      // darkMode.checked = items.darkMode;
      // BETA show translation and colors only if HSK selected
      if (testType.value === "hsk3") {
        document.getElementById('colorLabel').hidden = false;
        document.getElementById('translationLabel').hidden = false;
        document.getElementById('charLabel').hidden = false;
        document.getElementById('char').hidden = false;
        
        color.checked = items.color;
        translation.checked = items.translation;
        char.value = items.char;
      }
    }
  );
};

// TODO: it takes 250ms, can I optimize it?
let redrawTestLevels = (testType) => {
  if (testType == "hsk3") {
    level.insertAdjacentHTML(
      "afterbegin",
      "<option disabled>~11000 words 😱</option>" +
      '<option value="1">[HSK 1] 500 words</option>' +
      '<option value="2">[HSK 2] 772 words</option>' +
      '<option value="3">[HSK 3] 973 words</option>' +
      '<option value="4">[HSK 4] 1000 words</option>' +
      '<option value="5">[HSK 5] 1071 words</option>' +
      '<option value="6">[HSK 6] 1140 words</option>' +
      '<option value="7">[HSK 7-9] 5636 words</option>'
    );
  } else if (testType == "tocfl") {
    level.insertAdjacentHTML(
      "afterbegin",
      "<option disabled>8000 words 🙀</option>" +
      '<option value="1">[A1] 500 words</option>' +
      '<option value="2">[A2] 500 words</option>' +
      '<option value="3">[B1] 1500 words</option>' +
      '<option value="4">[B2] 2500 words</option>' +
      '<option value="5">[C1+] 3000 words</option>'
    );
  }
};

// multiple size="6"

// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  // document.body.classList.add(localStorage.getItem("darkMode"));
  restoreSettings();
});

window.addEventListener("load", async () => {
  // TODO: optimize with event delegation
  // https://davidwalsh.name/event-delegate


  // selects

  testType.addEventListener("change", () => {
    saveSettings("testType");
  });

  level.addEventListener("change", () => {
    saveSettings("level");
  });

  char.addEventListener("change", () => {
    saveSettings("char");
  });

  dayLimit.addEventListener("change", () => {
    saveSettings("dayLimit");
  });

  fontType.addEventListener("change", () => {
    saveSettings("fontType");
  });

  fontTypeSafari.addEventListener("change", () => {
    saveSettings("fontTypeSafari");
  });



  // checkboxes

  sentenceExamples.addEventListener("click", () => {
    saveSettings("sentenceExamples", { checkbox: true });
  });

  // qr.addEventListener("click", () => {
  //   saveSettings("qr", { checkbox: true });
  // });

  color.addEventListener("click", () => {
    saveSettings("color", { checkbox: true });
  });

  pinyin.addEventListener("click", () => {
    saveSettings("pinyin", { checkbox: true });
  });

  zhuyin.addEventListener("click", () => {
    saveSettings("zhuyin", { checkbox: true });
  });

  translation.addEventListener("click", () => {
    saveSettings("translation", { checkbox: true });
  });

  ai.addEventListener("click", () => {
    saveSettings("ai", { checkbox: true });
  });

  // darkMode.addEventListener("click", () => {
  //   saveSettings("darkMode", { checkbox: true });
  // });

  // button event listeners
  // feedback.addEventListener("click", () => {
  //   chrome.tabs.update({
  //     // TODO: replace, google forms sucks with popups and stuff
  //     url: "https://forms.gle/A2j7TKjXwUfuALqz7",
  //   });
  //   window.close();
  // });

  support.addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://chinesetab.com",
    });
    // window.close();
  });

  // kofi.addEventListener("click", () => {
  //   chrome.tabs.update({
  //     // url: "https://ko-fi.com/chinesetab",
  //     url: "https://github.com/sponsors/koynoyno",
  //   });
  //   window.close();
  // });
});
