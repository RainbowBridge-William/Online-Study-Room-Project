let handlefail = function (err) {
  console.log(err);
};

let count = 1;

function addVideoStream(streamId) {
  if (count > 5) {
    alert("There's no available seat");
    return;
  }
  let id = `block${count}`;
  let remoteContainer = document.getElementById(id);
  let streamDiv = document.createElement("div");
  streamDiv.id = streamId;
  streamDiv.style.transform = "rotateY(180deg)";
  streamDiv.style.height = "20vh";
  streamDiv.style.width = "20vw";
  remoteContainer.appendChild(streamDiv);
  streamDiv.classList.add("video-border");
  count++;
}

function removeVideoStream(streamId) {
  let streamDiv = document.getElementById(streamId);
  console.log(streamDiv.parentNode);
  streamDiv.remove();
}

let globalStream;
let isVideoEnable = true;
let isAudioEnable = true;

document.getElementById("MAudio").onclick = function () {
  if (isAudioEnable) {
    isAudioEnable = false;
    globalStream.muteAudio();
    alert("Mic OFF");
  } else {
    isAudioEnable = true;
    globalStream.unmuteAudio();
    alert("Mic ON");
  }
};

document.getElementById("MVideo").onclick = function () {
  if (isVideoEnable) {
    isVideoEnable = false;
    globalStream.muteVideo();
  } else {
    isVideoEnable = true;
    globalStream.unmuteVideo();
  }
};

let client;

document.getElementById("join").onclick = function () {
  let channelName = document.getElementById("channelName").value;
  let Username = document.getElementById("userName").value;
  let appId = "2efe191143764189bcb44d62b0003a98";

  client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264",
  });

  client.init(
    appId,
    () => console.log("AgoraRTC Client Connected"),
    handlefail
  );

  client.join(null, channelName, Username, () => {
    var localStream = AgoraRTC.createStream({
      video: true,
      audio: true,
    });

    globalStream = localStream;

    localStream.init(function () {
      localStream.play("SelfStream");
      document.getElementById("SelfStream").classList.add("video-border");
      console.log(`App id: ${appId}\nChannel id: ${channelName}`);
      client.publish(localStream);
    }, handlefail);
  });

  client.on("stream-added", function (evt) {
    console.log("Added Stream");
    client.subscribe(evt.stream, handlefail);
  });

  client.on("stream-subscribed", function (evt) {
    console.log("Subscribed Stream");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });

  client.on("stream-removed", function (evt) {
    let stream = evt.stream;
    stream.close();
    removeVideoStream(stream.getId());
  });

  client.on("peer-leave", function (evt) {
    let stream = evt.stream;
    stream.close();
    removeVideoStream(stream.getId());
    count--;
  });
  location.href = "#study-room";
};

document.getElementById("leave").onclick = function () {
  client.leave(function () {
    globalStream.stop();
    document.getElementById("SelfStream").classList.remove("video-border");
    client.unpublish(globalStream);
    globalStream.close();
  });

  let remoteContainers = document.querySelectorAll(".remoteStream");
  console.log(remoteContainers);
  remoteContainers.forEach(function (e) {
    if (e.firstElementChild) {
      // have to check existence then multiple multiplate
      e.firstElementChild.remove();
    }
  });
  count = 1;
};
