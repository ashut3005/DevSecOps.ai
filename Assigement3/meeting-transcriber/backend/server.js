require("dotenv").config();
const express = require("express");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/meetingDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const Transcript = mongoose.model("Transcript", {
  speaker: String,
  text: String,
  time: Date
});

const server = app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  console.log("Extension Connected");

  ws.on("message", async audioData => {
    try {
      console.log("Receiving audio...");

      // Upload audio to AssemblyAI
      const uploadRes = await axios({
        method: "post",
        url: "https://api.assemblyai.com/v2/upload",
        headers: {
          authorization: process.env.ASSEMBLY_API_KEY,
          "transfer-encoding": "chunked"
        },
        data: audioData
      });

      const audioUrl = uploadRes.data.upload_url;

      // Request transcription with speaker labels
      const transcriptRes = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: audioUrl,
          speaker_labels: true
        },
        {
          headers: {
            authorization: process.env.ASSEMBLY_API_KEY
          }
        }
      );

      const transcriptId = transcriptRes.data.id;

      // Poll for result
      let completed = false;
      let finalData;

      while (!completed) {
        const polling = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: process.env.ASSEMBLY_API_KEY
            }
          }
        );

        if (polling.data.status === "completed") {
          completed = true;
          finalData = polling.data;
        }
      }

      if (finalData.utterances) {
        for (let u of finalData.utterances) {
          const speaker = "Speaker " + u.speaker;
          const text = u.text;

          await new Transcript({
            speaker,
            text,
            time: new Date()
          }).save();

          ws.send(JSON.stringify({ speaker, text }));
        }
      }

    } catch (error) {
      console.log("Error:", error.message);
    }
  });
});