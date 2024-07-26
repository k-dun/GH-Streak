chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getContributionData") {
    fetch("https://github.com/users/k-dun/contributions")
      .then((response) => response.text())
      .then((data) => {
        sendResponse({ contributionData: data });
      })
      .catch((error) => {
        console.error("Error fetching contribution data:", error);
        sendResponse({ error: error.message });
      });
    return true;
  }
});