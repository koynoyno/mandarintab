export let postUpdate = () => {
  console.log("script.js updated");
  // ?TODO: track previous version
  // ?TODO: open "what's new" page
  chrome.storage.local.set({ updated: false });
};
