const videoElem = document.getElementById("video");
// const logElem = document.getElementById("log");
// const startElem = document.getElementById("start");
// const stopElem = document.getElementById("stop");
const toggleElem = document.getElementById("recordingToggle");

const recordedChunks = [];

let desktopStream;
let mic;
let combineTrack;
let mediaRecorder;
let combAudioCtx; // audioContext for combining audio tracks
let micGain;
let deskGain;

const audioControls = document.getElementById('audioControls')
const micVolume = document.getElementById('micVolume')
const deskVolume = document.getElementById('deskVolume')

let startTimeStr = "";
let saveTime = "";
var intervalID;
var recording = false;

var volInterval = [];
const micVisualizer = document.querySelector('#mic-visualizer.volume-visualizer');
const deskVisualizer = document.querySelector('#desk-visualizer.volume-visualizer');

const splitPeriod = 24*3600; // splitting period in seconds
const fps = 60;
// Options for getDisplayMedia()
const displayMediaOptions = {
  video: {
    displaySurface: "tab",
    frameRate: {ideal: fps, max: fps}
  },
  audio: true,
  
};

// Options for getUserMedia()
const userMediaOptions = {
    video: false,
    audio: true,
  };

const vidTrackConstraints = {
    frameRate: {exact: fps}
}

// Options for MediaRecorder()
const options = { 
    mimeType: "video/mp4;codecs=avc1,mp4a.40.2" 
};

// Set event listeners for the start and stop buttons
// startElem.addEventListener( "click", 
//     (evt) => { startCapture(); }, 
//     false,
// );

// stopElem.addEventListener("click",
//     (evt) => { stopCapture(); },
//     false,
// );
toggleElem.addEventListener("click",
    (evt) => { 
        if (!recording) {
            startCapture();
        } else {
            stopCapture(); 
        }
    },
    false,
);

// console.log = (msg) => (logElem.textContent = `${logElem.textContent}\n${msg}`);
// console.error = (msg) => (logElem.textContent = `${logElem.textContent}\nError: ${msg}`);
// console.clear = () => (logElem.textContent = "");

function startAnalyser(streamSrcNode, audioCtx, volumeVisualizer = document.querySelector('#mic-visualizer.volume-visualizer')){
    const analyser = audioCtx.createAnalyser();
    const micStream = streamSrcNode

    analyser.fftSize = 512;
    analyser.minDecibels = -127;
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = 0.4;

    micStream.connect(analyser)
    const volumes = new Uint8Array(analyser.frequencyBinCount);
    volumeCallback = () => {
        analyser.getByteFrequencyData(volumes);
        let volumeSum = 0;
        for (const volume of volumes)
            volumeSum += volume;
        const averageVolume = volumeSum / volumes.length;
        // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
        // console.log('--volume', (averageVolume * 100 / 127) + '%');
        volumeVisualizer.style.setProperty('height', (averageVolume * 100 / 127) + '%')
        volumePercentage = Math.round(averageVolume * 100 / 127)
        if (volumePercentage > 70){
            volumeVisualizer.style.setProperty('background-color', "var(--colour-bad)")
        } else if (volumePercentage > 50){
            volumeVisualizer.style.setProperty('background-color', "var(--colour-warn)")
        } else {
            volumeVisualizer.style.setProperty('background-color', "var(--colour-good)")
        }
        
    };

    volInterval.push(setInterval(volumeCallback, 50));

}


async function startCapture() {
    console.clear();
    recordedChunks.length = 0;
    try {
        window.onbeforeunload = (event) => {
            return "You may loose important data when leaving!"
        }

        // screen capture stream
        desktopStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        
        desktopStream.oninactive = stopCapture; // stop capturing when the stream becomes inactive
        
        const videoTrack = desktopStream.getVideoTracks()[0];
        videoTrack.applyConstraints(vidTrackConstraints); // apply exact constraint 
        
        // audio capture stream
        mic = await navigator.mediaDevices.getUserMedia(userMediaOptions);
        
        // audio context to combine audio
        combAudioCtx = new AudioContext();
        dest = combAudioCtx.createMediaStreamDestination()

        try{
            desktopAudioSrc = combAudioCtx.createMediaStreamSource(desktopStream)
            deskGain = combAudioCtx.createGain()
            desktopAudioSrc.connect(deskGain)
            deskGain.gain.setValueAtTime(deskVolume.value, combAudioCtx.currentTime)
            deskGain.connect(dest)
        } catch (err){console.log(err)}
        try{
            micAudioSrc = combAudioCtx.createMediaStreamSource(mic)
            micGain = combAudioCtx.createGain()
            micGain.gain.setValueAtTime(micVolume.value, combAudioCtx.currentTime)
            micAudioSrc.connect(micGain)
            micGain.connect(dest)
        } catch (err){ console.log(err)}
        
        // Combine both video/audio stream with MediaStream object
        combineTrack = new MediaStream([...desktopStream.getVideoTracks(), ...dest.stream.getTracks()])
        
        
        videoElem.srcObject = combineTrack;
        // recording the screen capture stream
        mediaRecorder = new MediaRecorder(combineTrack, options);
        mediaRecorder.ondataavailable = handleDataAvailable;
        saveTime = ""
        // get start time of the video
        mediaRecorder.onstart = ()=>{
            startTimeStr = getDateTimeString(); 
            startAnalyser(micGain, combAudioCtx)
            startAnalyser(deskGain, combAudioCtx, deskVisualizer)
            audioControls.style.visibility = 'visible'
        }
        
        // save video when the recording stops
        mediaRecorder.onstop = postVideo
        
        mediaRecorder.start();
        // set the button text
        recording = true
        toggleElem.innerText = "Stop Recording"


        // send clip to backend periodically
        intervalID = setInterval(splitRecording, splitPeriod * 1000);

        dumpOptionsInfo();
    } catch (err) {
        console.error(err);
    }
}

function stopCapture(evt) {
    desktopStream.oninactive = null;

    // stop checking the volume
    volInterval.forEach((interval)=>{clearInterval(interval)})
    volInterval.length = 0

    micVisualizer.style.setProperty('height', '0%')
    deskVisualizer.style.setProperty('height', '0%')
    audioControls.style.visibility = 'hidden'
    // close audio context
    combAudioCtx.close()

    // allow reloads
    window.onbeforeunload = null;
    try {
        // let tracks = videoElem.srcObject.getTracks();
        let tracks = combineTrack.getTracks();
        tracks.forEach((track) => track.stop());
        
        desktopStream.getTracks().forEach((track) => track.stop());
        mic.getTracks().forEach((track) => track.stop());

        // stop periodic function call
        clearInterval(intervalID); 
        
        saveTime = startTimeStr;
        mediaRecorder.stop();
        
        videoElem.srcObject = null;

        recording = false
        toggleElem.innerText = "Start Recording"
    } catch (err){
        console.error(err);
    }
}

function splitRecording() {
    if (videoElem.srcObject != null){ // is recording
        mediaRecorder.requestData();
        // saveTime = startTimeStr;
        // startTimeStr = getDateTimeString();
        // mediaRecorder.stop();
        // mediaRecorder.start();
    }
}

// handle audio gain for mic
micVolume.addEventListener('input', (event)=>{
    micGain.gain.setValueAtTime(event.target.value, combAudioCtx.currentTime)
})
// handle audio gain for desktop
deskVolume.addEventListener('input', (event)=>{
    deskGain.gain.setValueAtTime(event.target.value, combAudioCtx.currentTime)
})



function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];
    // const videoTrack = combineTrack.getVideoTracks()[0];

    console.log("Track settings:");
    console.log(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.log("Track constraints:");
    console.log(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

function handleDataAvailable(event) {
    console.log("data-available");
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
        console.log(recordedChunks);
    } else {
      // …
    }
}

function postVideo() {
    const blob = new Blob(recordedChunks, {
        type: "video/mp4;codecs=avc1,mp4a.40.2",
    });
    
    const urlParams = new URLSearchParams(window.location.search);

    if (saveTime == ""){
        alert("An Error occured, please restart the recording. \n(If possible, please use different audio input and output devices)")
        stopCapture(null)
        window.location.reload()
        // startCapture()
        return
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `${saveTime}.mp4`;
    a.click();
    window.URL.revokeObjectURL(url);

    

    // saveFile(JSON.stringify(vidJSON), "test", "json")

}

// returns the current date and time as a string
function getDateTimeString() {
    const date = new Date();
    return date.getFullYear() + "-" 
            + (date.getMonth()+1).toLocaleString('en', {minimumIntegerDigits: 2}) + "-" // javascript's Date goes from 0 to 11 instead of 1 to 12
            + date.getDate().toLocaleString('en', {minimumIntegerDigits: 2}) + " " 
            + date.getHours().toLocaleString('en', {minimumIntegerDigits: 2}) + "." 
            + date.getMinutes().toLocaleString('en', {minimumIntegerDigits: 2}) + "." 
            + date.getSeconds().toLocaleString('en', {minimumIntegerDigits: 2})
}

// returns the current date and time as a string
function getDateString() {
    const date = new Date();
    return date.getFullYear() + "-" 
            + (date.getMonth()+1).toLocaleString('en', {minimumIntegerDigits: 2}) + "-" // javascript's Date goes from 0 to 11 instead of 1 to 12
            + date.getDate().toLocaleString('en', {minimumIntegerDigits: 2})
}