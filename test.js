 // Install the axios and fs-extra package by executing the command "npm install axios fs-extra"
import axios from "axios";
import fs from "fs-extra";

// 95e024db5ba14f1885f00696e3045fff

const baseUrl = "https://api.assemblyai.com";

const headers = {
  authorization: "95e024db5ba14f1885f00696e3045fff",
};

// You can upload a local file using the following code
// const path = "./my-audio.mp3";
// const audioData = await fs.readFile(path);
// const uploadResponse = await axios.post(`${baseUrl}/v2/upload`, audioData, {
//   headers,
// });
// const audioUrl = uploadResponse.data.upload_url;

const audioUrl = "https://assembly.ai/wildfires.mp3";

const data = {
  audio_url: audioUrl,
  speech_model: "universal",
};

const url = `${baseUrl}/v2/transcript`;
const response = await axios.post(url, data, { headers: headers });

const transcriptId = response.data.id;
const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

while (true) {
  const pollingResponse = await axios.get(pollingEndpoint, {
    headers: headers,
  });
  const transcriptionResult = pollingResponse.data;

  if (transcriptionResult.status === "completed") {
    console.log(transcriptionResult.text);
    break;
  } else if (transcriptionResult.status === "error") {
    throw new Error(`Transcription failed: ${transcriptionResult.error}`);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}


// const express = require('express')
// const router = express.Router()

// // Imports the Google Cloud client library
// const speech = require('@google-cloud/speech');

// // Creates a client
// const client = new speech.SpeechClient();

// async function quickstart() {
//   // The path to the remote LINEAR16 file
//   const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

//   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
//   const audio = {
//     uri: gcsUri,
//   };
//   const config = {
//     encoding: 'LINEAR16',
//     sampleRateHertz: 16000,
//     languageCode: 'en-US',
//   };
//   const request = {
//     audio: audio,
//     config: config,
//   };

//   // Detects speech in the audio file
//   const [response] = await client.recognize(request);
//   const transcription = response.results
//     .map(result => result.alternatives[0].transcript)
//     .join('\n');
//   console.log(`Transcription: ${transcription}`);
// }

// quickstart()