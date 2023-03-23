chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "capture") {
    chrome.runtime.sendMessage({ message: "startCapture" });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "showScreenshot") {
    var imageData = request.data;
    var img = new Image();
    img.src = imageData;
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      var dataURL = canvas.toDataURL();
      var tab = window.open();
      tab.document.write("<img src='" + dataURL + "'/>");
    };
  }
});