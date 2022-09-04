import JsSIP from "jssip";

let socket;
let configuration;
let phone;
//"wss://sip.myhost.com";
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
  console.log("onRtcSession");
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
      console.log("call confirmed");
    },
  };

  var options = {
    eventHandlers: eventHandlers,
    mediaConstraints: { audio: true, video: false },
  };

  var session = phone.call("sip:5000@sip.tsuki.local", options);
}
function onUnregistered(e) {
  console.log("onUnregistered");
}
function onRegistrationFailed(e) {
  console.log("onRegistrationFailed");
}

export { init, start };
