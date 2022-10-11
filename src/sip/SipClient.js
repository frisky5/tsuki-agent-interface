import JsSIP from "jssip";

let socket;
let configuration;
let phone;
var session;

function init(props) {
  if (socket != null || configuration != null || phone != null)
    console.error("phone already initialized");
  console.log("initializeing phone");
  JsSIP.debug.enable("JsSIP:*");
  socket = new JsSIP.WebSocketInterface("wss://" + props.socketAddress);

  configuration = {
    sockets: [socket],
    uri: "sip:" + props.username + "@" + props.domain,
    authorization_user: "1000",
    password: props.password,
    display_name: "Mahmood over WSS",
    realm: "sip.tsuki.local",
  };
  phone = new JsSIP.UA(configuration);
  phone.on("connected", onConnected);
  phone.on("disconnected", onDisconnected);
  phone.on("newRTCSession", onRtcSession);
  phone.on("registered", onRegistered);
  phone.on("unregistered", onUnregistered);
  phone.on("registrationFailed", onRegistrationFailed);
}

function start(props) {
  if (phone != null) phone.start();
  else return;
}

function onConnected(e) {
  console.log("onConnected");
}
function onDisconnected(e) {
  console.log("onDisconnected");
}
function onRtcSession(e) {
  e.session.connection.addEventListener("track", (e) => {
    console.log("onRtcSession : track event ", e);
    document.getElementById("phoneaudio").srcObject = e.streams[0];
  }, false);

}

function onRegistered(e) {
  console.log("onRegistered");


  var eventHandlers = {
    progress: function (e) {
      console.log("call is in progress");
    },
    failed: function (e) {
      console.log("call failed with cause: " + e.data.cause);
    },
    ended: function (e) {
      console.log("call ended with cause: " + e.data.cause);
    },
    confirmed: function (e) {
      console.log("call confirmed : ", e);
    },
    newRTCSession: function (e) {
      console.log("newRTCSession : ", e);
    }
  };

  navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
    .then((stream) => {
      var options = {
        eventHandlers: eventHandlers,
        mediaStream: stream,
        mediaConstraints: { audio: true, video: true },
        sessionTimersExpires: 120
      };

      session = phone.call("sip:3700@sip.tsuki.local", options);
    })
    .catch((err) => {

    });
}
function onUnregistered(e) {
  console.log("onUnregistered");
}
function onRegistrationFailed(e) {
  console.log("onRegistrationFailed");
}

function dropCall() {
  session.terminate();
}

export { init, start, dropCall };
