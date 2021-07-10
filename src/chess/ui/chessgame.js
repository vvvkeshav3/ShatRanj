import React, {useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { ColorContext } from '../../context/colorcontext' 
import VideoChatApp from '../../connection/videochat'
import LaunchGame from '../gameLogic/launchGame'
const socket  = require('../../connection/socket').socket


const ChessGameWrapper = (props) => {
    
    const color = React.useContext(ColorContext)
    const { gameid } = useParams()
    const [opponentSocketId, setOpponentSocketId] = React.useState('')
    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false)
    const [opponentUserName, setUserName] = React.useState('')
    const [gameSessionDoesNotExist, doesntExist] = React.useState(false)

    React.useEffect(() => {
        socket.on("playerJoinedRoom", statusUpdate => {
            console.log("A new player has joined the room! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })
    
        socket.on("status", statusUpdate => {
            console.log(statusUpdate)
            alert(statusUpdate)
            if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
                doesntExist(true)
            }
        })
        
    
        socket.on('start game', (opponentUserName) => {
            console.log("START!")
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName)
                didJoinGame(true) 
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy. 
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit('request username', gameid)
            }
        })
    
    
        socket.on('give userName', (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.myUserName)
                socket.emit('recieved userName', {userName: props.myUserName, gameId: gameid})
            }
        })
    
        socket.on('get Opponent UserName', (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName)
                console.log('data.socketId: data.socketId')
                setOpponentSocketId(data.socketId)
                didJoinGame(true) 
            }
        })
    }, [])


    return (
      <React.Fragment>
        {opponentDidJoinTheGame ? (
          <div style={{backgroundColor:'rgb(102, 51, 0)', height:"100vh", width:"100vw", display:'flex', flexDirection:'column'}}>
            <div style={{textAlign:'center', height:"4vh", width:"100vw" }}>
              <h3 style={{color:'white'}}> Opponent: {opponentUserName} | You: {props.myUserName} </h3>
            </div>
            <div style={{ display: "flex", height:"96vh", width:"100vw" }}>
              <LaunchGame />
              <VideoChatApp
                mySocketId={socket.id}
                opponentSocketId={opponentSocketId}
                myUserName={props.myUserName}
                opponentUserName={opponentUserName}
              />
            </div>
          </div>
        ) : gameSessionDoesNotExist ? (
          <div style={{height:"53.8vh", width:"100vw", display:"flex", justifyContent:"center", alignItems:"center", overflowX:"hidden" }}>
            <button className="btn btn-primary">
                <a href="/" style={{textDecoration:"none", textAlign: "center", color:"white" }}> 
                    Click here to go back to home page.  
                </a>
            </button>
          </div>
        ) : (
            <div style={{height:"53.8vh", width:"100vw", display:"flex", justifyContent:"center", alignItems:"center", overflowX:"hidden" }}>
            <div style={{height:"30vh", width:"60vw",border:'3px solid black',display:"flex", flexDirection:'column', justifyContent:"space-around", alignItems:"center", overflowX:"hidden"  }}>
            <h1
              style={{
                textAlign: "center",
              }}
            >
              Hey <strong>{props.myUserName}</strong>, send the code
              to your friend :
            </h1>
            <textarea
              style={{width: "200px", height: "30px"}}
              onFocus={(event) => {
                  console.log('sd')
                  event.target.select()
              }}
              value = {gameid}
              type = "text">
              </textarea>
            </div>
          </div>
        )}
      </React.Fragment>
    );
};

export default ChessGameWrapper