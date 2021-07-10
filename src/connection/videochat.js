import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";
import "./css/videochat.css"
const socket  = require('../connection/socket').socket


const Container = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-left: 4vw
  color: white;
`;

const Video = styled.video`
  border: 2px solid blue;
`;

const VideoChatApp = (props) => {
  ///player 2 ignores player 1 call - nothing happens. Wait until the connection times out. 

  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false)
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    },[])

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    setIsCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: props.mySocketId})
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  function rejectCall() {
    setIsCalling(false);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal();
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <div style={{display:'flex', height:"90%", width:"60%"}}>
        <Video style={{display:'flex', height:"100%", width:"100%"}} playsInline muted ref={userVideo} autoPlay />
      </div>
    );
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <div style={{display:'flex', height:"90%", width:"40%"}}>
        <Video style={{display:'flex', height:"100%", width:"100%"}}  playsInline ref={partnerVideo} autoPlay />
      </div>
    );
  } else if (receivingCall) {
    mainView = (
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <h1>{props.opponentUserName} is calling you</h1>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button className='callButton' onClick={acceptCall}><h3>Accept</h3></button>
          <button className='rejectButton' onClick={rejectCall}><h3>Reject</h3></button>
        </div>
      </div>
    )
  } else if (isCalling) {
    mainView = (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <h1>Currently calling {props.opponentUserName}...</h1>
      </div>
    )
  } else {
    mainView = (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <button className='callButton' onClick = {() => {callPeer(props.opponentSocketId)}}>
          <h3>Video-Call</h3>
        </button>
      </div>
    )
  }



  return (
    <Container>
        <div style = {{display:'flex', height: "60%",width: "100%", justifyContent:"center", alignItems:"center"}}> {mainView} </div>
        <div style = {{display:'flex', marginTop:"3%" , height: "37%",width: "100%",justifyContent:"center", alignItems:"center"}}> {UserVideo} </div>
    </Container>
  );
}

export default VideoChatApp;
