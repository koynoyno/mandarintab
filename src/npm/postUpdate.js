export let postUpdate = () => {
  console.log("updated");
  // ?TODO: track previous version
  // ?TODO: open "what's new" page
  chrome.storage.local.set({ updated: false });
};
