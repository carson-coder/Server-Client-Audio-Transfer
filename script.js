
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