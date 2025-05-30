// BETA i18n
// document.querySelectorAll('[data-locale]').forEach(elem => {
//     elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
// })

// BETA i18 
// TODO add support for local call
document.querySelectorAll('[data-locale]').forEach(elem => {
    const message = chrome.i18n.getMessage(elem.dataset.locale)
    switch (elem.tagName.toLowerCase()) {
        case 'span':
            elem.title = message
            break
        case 'input':
        case 'textarea':
            elem.placeholder = message
            break
        default:
            elem.innerText = message
    }
})