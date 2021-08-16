// reference: https://docs.agora.io/cn/Video/start_call_web_ng?platform=Web
let urlParams = new URL(location.href).searchParams;
let muteVideoButton = document.getElementById("muteVideo");
let back = document.getElementById("back");
let count = 1;
let video = true;
document.querySelector("header h1").textContent =
  "Room " + urlParams.get("channel");

let rtc = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

let options = {
  appId: "2efe191143764189bcb44d62b0003a98",
  channel: urlParams.get("channel"),
  token: null,
};

muteVideoButton.addEventListener("click", () => {
  if (video == true) {
    muteVideoButton.firstElementChild.className = "fas fa-video-slash";
    rtc.localVideoTrack.setMuted(true);
    video = false;
  } else {
    muteVideoButton.firstElementChild.className = "fas fa-video";
    rtc.localVideoTrack.setMuted(false);
    video = true;
  }
});

back.addEventListener("click", () => {
  leaveCall();
  location.href = "./index.html";
});

async function startCall() {
  // 创建本地客户端
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // 订阅远端用户
  rtc.client.on("user-published", async (user, mediaType) => {
    count++;
    const uid = user.uid.toString();
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    if (mediaType === "video") {
      const remoteVideoTrack = user.videoTrack;

      if (!document.getElementById(`player-wrapper-${uid}`)) {
        const playerWrapper = document.createElement("div");
        playerWrapper.id = `player-wrapper-${uid}`;
        playerWrapper.style.width = "95%";
        playerWrapper.style.height = "95%";
        document.getElementById("videoContainer").append(playerWrapper);
        const player = document.createElement("div");
        player.id = `player-${uid}`;
        player.style.width = "100%";
        player.style.height = "100%";
        player.style.transform = "rotateY(180deg)";
        document.getElementById(`player-wrapper-${uid}`).append(player);
      }

      remoteVideoTrack.play(`player-${uid}`);
    }
    // if (mediaType === "audio") {
    //   const remoteAudioTrack = user.audioTrack;
    //   remoteAudioTrack.play();
    // }
  });

  // 远端用户离开，销毁div节点
  rtc.client.on("user-left", (user) => {
    console.log(`user left ${user.uid}`);
    let playerContainer = document.getElementById(
      `player-wrapper-${user.uid.toString()}`
    );
    console.log(playerContainer);
    playerContainer.remove();
    count--;
  });

  // 加入目标频道
  const uid = await rtc.client.join(
    options.appId,
    options.channel,
    options.token,
    null //uid
  );

  // 创建并发布本地音视频轨道
  // rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  if (count >= 6) {
    alert("房间人满，当前为观众");
  } else {
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: "180p",
    });
    const localContainer = document.createElement("div");
    localContainer.id = uid.toString();
    localContainer.style.width = "95%";
    localContainer.style.height = "95%";
    document.getElementById("videoContainer").append(localContainer);
    rtc.localVideoTrack.play(localContainer);
    await rtc.client.publish([rtc.localVideoTrack]);
    // await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
    console.log("publish success!");
  }
}

startCall();

async function leaveCall() {
  // 销毁本地音视频轨道。
  // rtc.localAudioTrack.close();
  rtc.localVideoTrack.close();

  // 遍历远端用户。
  rtc.client.remoteUsers.forEach((user) => {
    // 销毁动态创建的 DIV 节点。
    const playerContainer = document.getElementById(user.uid);
    playerContainer && playerContainer.remove();
  });

  // 离开频道。
  await rtc.client.leave();
}
