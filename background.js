chrome.runtime.onInstalled.addListener(() => {
  console.log("Default background color set to %cgreen");
});

chrome.webRequest.onBeforeRequest.addListener(
  (infoRequest) => {
    console.log(infoRequest);
    chrome.runtime.sendMessage(infoRequest.url);
  },
  {
    urls: [
      "https://mydtu.duytan.edu.vn/sites/index.aspx?p=home_registeredall*",
    ],
  }
);
