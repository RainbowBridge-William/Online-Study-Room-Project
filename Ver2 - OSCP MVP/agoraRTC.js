// reference: https://docs.agora.io/cn/Video/start_call_web_ng?platform=Web
let urlParams = new URL(location.href).searchParams;
document.querySelector("h1").textContent = urlParams.get("channel");

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

async function startCall() {
  // 创建本地客户端
  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // 订阅远端用户
  rtc.client.on("user-published", async (user, mediaType) => {
    await rtc.client.subscribe(user, mediaType);
    console.log("subscribe success");

    if (mediaType === "video") {
      const remoteVideoTrack = user.videoTrack;
      const playerContainer = document.createElement("div");
      playerContainer.id = user.uid.toString();
      playerContainer.style.width = "42vw";
      playerContainer.style.height = "calc(42vw * 3 / 4)";
      playerContainer.style.transform = "rotateY(180deg)";
      document.body.append(playerContainer);

      remoteVideoTrack.play(playerContainer);
    }
    if (mediaType === "audio") {
      const remoteAudioTrack = user.audioTrack;
      remoteAudioTrack.play();
    }
  });

  // 远端用户离开，销毁div节点
  rtc.client.on("user-unpublished", (user, mediaType) => {
    if (mediaType === "video") {
      const playerContainer = document.getElementById(user.uid.toString());
      playerContainer.remove();
    }
  });

  // 加入目标频道
  const uid = await rtc.client.join(
    options.appId,
    options.channel,
    options.token,
    null //uid
  );

  // 创建并发布本地音视频轨道
  rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  const localContainer = document.createElement("div");
  localContainer.id = uid.toString();
  localContainer.style.width = "42vw";
  localContainer.style.height = "calc(42vw * 3 / 4)";
  document.body.append(localContainer);
  rtc.localVideoTrack.play(localContainer);
  await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
  console.log("publish success!");
}

startCall();

async function leaveCall() {
  // 销毁本地音视频轨道。
  rtc.localAudioTrack.close();
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
