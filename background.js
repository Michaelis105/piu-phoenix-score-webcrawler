browser.action.onClicked.addListener((tab) => {
  // Check if we are on the right site
  if (tab.url.includes("piugame.com/my_page/my_best_score.php")) {
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["jquery.min.js", "content.js"]
    });
  } else {
    console.log("Not on the PIU scores page!");
  }
});