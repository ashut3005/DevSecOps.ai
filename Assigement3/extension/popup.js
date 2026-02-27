const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const output = document.getElementById("output");

let socket;

startBtn.onclick = () => {
  socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    socket.send("start");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    output.innerHTML += `<p><b>${data.speaker}:</b> ${data.text}</p>`;
  };
};

stopBtn.onclick = () => {
  if (socket) socket.close();
};