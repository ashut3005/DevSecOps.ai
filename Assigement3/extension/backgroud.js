chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startCapture") {
    chrome.tabCapture.capture({ audio: true, video: false }, stream => {

      const mediaRecorder = new MediaRecorder(stream);
      const socket = new WebSocket("ws://localhost:5000");

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0 && socket.readyState === 1) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(1000);

      sendResponse({ status: "capturing" });
    });

    return true;
  }
});