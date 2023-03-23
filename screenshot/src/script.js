// Listen for clicks on the extension icon
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(tab.id, { file: "src/content.js" }, function() {
    chrome.runtime.lastError ? console.error(chrome.runtime.lastError.message) : setTimeout(function() { takeScreenshot(tab.id); }, 2000);
  });
});


// Take a screenshot of the visible part or the full page, depending on user settings
function takeScreenshot(tabId) {
  chrome.storage.local.get(["captureOption", "formatOption"], function(data) {
    var format = data.formatOption || "png";
    var options = {};
      options.format = format;
      chrome.tabs.captureVisibleTab(null, options, function(image) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }
  
        chrome.tabs.create({ url: "html/screenshot.html" }, function(tab) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
  
          chrome.tabs.executeScript(tab.id, {
            code: 'var img = document.createElement("img"); img.src = "' + image + '"; document.getElementById("screenshot-container").appendChild(img);'
          }, function(results) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              return;
            }
  
            console.log(results);
          });
        });
      });
    });
  }

// Upload the screenshot to the server
function uploadScreenshot() {
  // Code to upload the screenshot to the server
}

// Edit the screenshot in a new tab
function editScreenshot() {
  chrome.tabs.create({ url: "html/screenshot.html" });
}

// Create context menu items
chrome.contextMenus.create({
  "title": "Edit screenshot",
  "contexts": ["browser_action"],
  "onclick": editScreenshot
});

chrome.contextMenus.create({
  "title": "Upload screenshot",
  "contexts": ["browser_action"],
  "onclick": uploadScreenshot
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "takeScreenshot") {
    takeScreenshot();
  }
});

// Store the screenshot URL in a variable
var screenshotUrl = null;

// Listen for changes in capture option radio buttons
var optionRadio = document.getElementsByName("option");
for (var i = 0; i < optionRadio.length; i++) {
  optionRadio[i].addEventListener("change", function() {
    chrome.storage.local.set({ "captureOption": this.value });
  });
}

// Listen for changes in format radio buttons
var formatRadio = document.getElementsByName("format");
for (var i = 0; i < formatRadio.length; i++) {
  formatRadio[i].addEventListener("change", function() {
    chrome.storage.local.set({ "formatOption": this.value });
  });
}

// Listen for clicks on the "Take Screenshot" button
document.addEventListener("DOMContentLoaded", function () {
  var captureButton = document.getElementById("capture");
  if (captureButton) {
    captureButton.addEventListener("click", function () {
      takeScreenshot();
    });
  }
});