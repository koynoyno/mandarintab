export let ifFirstLaunch = (char) => {
  const ua = navigator.userAgent
  let shortcut;
  let desktop = true;
  if (ua.indexOf('Windows') > -1 || ua.indexOf('Linux') > -1) {
    shortcut = 'Alt+S'
  }
  else if (ua.indexOf('Mac') > -1) {
    shortcut = 'Opt+S'
  }
  if (ua.indexOf('iPhone') > -1) {
    desktop = false;
  }
  if (ua.indexOf('iPad') > -1) {
    desktop = false;
  }
  if (ua.indexOf('iPod') > -1) {
    desktop = false;
  }

  let message = `Press ${shortcut} to open settings 🐼`;

  // document
  //   .querySelector(".app")

  // if mobile
  // app.insertAdjacentHTML(
  //   "afterbegin",
  //   '<p id="welcome" align="center">Press "aA" and check Chinese Tab settings</strong> 🐼</p>'
  // );


  // TODO i18n
  //  if (char == "simplified" ) { message = `继续浏览`} else { message =`繼續瀏覽`}

  // if desktop
  if (desktop) {
    app.insertAdjacentHTML(
      "afterbegin",
      // `<p id="welcome" align="center">${message}</p>`
      `<p id="pinyin" align="center">${message}</p>`
    );
  }


  // app.insertAdjacentHTML(
  //   // "beforeend",
  //   "afterbegin",
  //   // '<img src="images/panda_easter.png" id="panda" draggable="false" title="酷酷酷！"/>' +
  //     `<p id="welcome" class="" align="center">${message}</p>`
  // );
  // hide forever
  chrome.storage.local.set({ firstLaunch: false });

  // open settings
  // Firefox prohibits it's as "no surprises policy"
  // chrome.action.openPopup();
};
