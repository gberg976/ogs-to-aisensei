browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "open-aisensei") {
    browser.storage.local.set({ pendingOgsUrl: message.ogsUrl }).then(() => {
      browser.tabs.create({ url: "https://ai-sensei.com/add-game" });
    });
  }
});
