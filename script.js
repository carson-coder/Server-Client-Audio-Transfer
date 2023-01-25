
var playing = false
var socket = undefined
var connected = false

function play_pause () {
    const label = document.getElementById("plabel")
    var func = undefined
    if (label.innerHTML === "Paused") { label.innerHTML = "Playing"; func = play}
    else if (label.innerHTML === "Playing") { label.innerHTML = "Paused"; func = pause}
    if (!connected) {connect()}
    wait_for_socket(func)
    return label
}

var settings

function connect() {
    if (connected) {
        console.log("Trying to connect to server while a connection has already started")
        return
    }
    else if (socket != undefined) {
        console.log("Trying to create socket while there is another socket trying to connect. Wait")
        return
    }
    socket = new WebSocket('ws://localhost:5000');
    socket.addEventListener('open', (event) => {
        connected = true
    });
    // Listen for messages
    socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        if (event.data.startsWith("Settings")) {
            settings = JSON.parse(event.data.replace("Settings ", ""))
            console.log(settings)
        } else if (event.data.startsWith("Chunk ")) {
            load_data(settings.channels, settings.sample_rate, settings.length, JSON.parse(event.data.replace("Chunk ", "")))
        }
    });
    socket.onclose = function() {
        disconnect(true)
    }
    console.log("Connected")
}

function disconnect(closed=false) {
    if (!closed) {
        socket.close()
    }
    console.log("Disconnected")
    connected = false
    socket = undefined
}

function play() {
    // Tell Server To Play
    socket.send('play');
    // Playing so lets say we are
    playing = true
}

function pause() {
    // Paused
    socket.send("stop")
    // Paused so lets say we are
    playing = false
}

function wait_for_socket(cb) {
    if(connected === false) {
       window.setTimeout(function() {wait_for_socket(cb)}, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      cb()
    }
}

function load_data(channels, sampleRate, length, data) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Create an empty three-second stereo buffer at the sample rate of the AudioContext
audioCtx.sampleRate = sampleRate
const myArrayBuffer = audioCtx.createBuffer(
  channels,
  audioCtx.sampleRate * length,
  audioCtx.sampleRate
);

// Fill the buffer with white noise;
// just random values between -1.0 and 1.0
for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
  // This gives us the actual array that contains the data
  const nowBuffering = myArrayBuffer.getChannelData(channel);
  for (let i = 0; i < myArrayBuffer.length; i++) {
    // Math.random() is in [0; 1.0]
    // audio needs to be in [-1.0; 1.0]
    nowBuffering[i] = data[i] / 2147483647;
    if (isNaN(nowBuffering[i])) {nowBuffering[i] = 0}
    console.log(nowBuffering[i])
  }
}

// Get an AudioBufferSourceNode.
// This is the AudioNode to use when we want to play an AudioBuffer
const source = audioCtx.createBufferSource();

// set the buffer in the AudioBufferSourceNode
source.buffer = myArrayBuffer;

// connect the AudioBufferSourceNode to the
// destination so we can hear the sound
source.connect(audioCtx.destination);

// start the source playing
source.start();
}