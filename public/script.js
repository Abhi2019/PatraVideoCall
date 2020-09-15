const socket = io('/'); 
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;

let peer = new Peer(undefined, {
    path: '/peerjs',
    host:'/',
    port: 3000
})
var constraints = window.constraints = {
    audio: true,
    video: true
  };
  let myVideoStream;
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    addVideoStream(myVideo, stream);
    myVideoStream = stream;
    peer.on('call', function(call) {
        call.answer(stream);
        let anothervideo = document.createElement('video');
        call.on('stream', function(remoteStream) {
            addVideoStream(anothervideo, remoteStream);
          });
    });
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    });
    let message = $('input');
    $('html').keydown((e) => {
        if (e.which === 13 && message.length !== 0) {
            console.log(message.val());
            socket.emit('message', message.val());
            message.val('');
        }
    });

    socket.on('get-message', message => {
        console.log('Message from the user: ', message);
        $('.messages').append(`<li style="message"><b>User :</b><br/>${message}</li>`);
        console.log('From the server', message);
    });
});
peer.on('open', (id)=>{
    console.log('PeerId', id);
    socket.emit('join-chat', chatId, id);
});


const connectToNewUser = (userId, stream)=>{
    console.log("New user connected");
    var call = peer.call(userId, stream);
    let anothervideo = document.createElement('video');
    call.on('stream', function(remoteStream) {
        addVideoStream(anothervideo, remoteStream);
  });
}
const addVideoStream = (video, stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    videoGrid.append(video);
}
const scrollToBottom =()=>{
    let d = $('main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}

const muteUnmute = ()=> {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnMuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setUnMuteButton = ()=>{
    const html = `<i class="fas fa-microphone-slash"></i><span>Unmute</span>`;
    document.querySelector(".mute_button").innerHTML = html;
}

const setMuteButton = ()=> {
    const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
    document.querySelector(".mute_button").innerHTML = html;
}
// window.on('beforeunload', function(){
//     socket.close();
// });

const playStop =()=>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setplayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setplayVideo =()=>{
    const html = `<i class="fas fa-video-slash"></i><span>Play Video</span>`
    document.querySelector(".stop_button").innerHTML = html;
}
const  setStopVideo = ()=>{
    const html = `<i class="fas fa-video"></i><span>Stop Video</span>`
    document.querySelector(".stop_button").innerHTML = html;
}