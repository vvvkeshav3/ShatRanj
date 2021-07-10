import React, {useState} from 'react'
import { Redirect } from 'react-router-dom'
import makeGameCode from './makeGameCode.js'
import { ColorContext } from '../context/colorcontext' 
import Footer from './Footer'
import Navbar from './Navbar'

const socket  = require('../connection/socket').socket

const CreateNewGame = (props) => {
    const [didGetUserName, setDidGetUserName] = useState(false);
    const [inputText, setInputText] = useState("");
    const [gameId, setGameId] = useState('');
    const [typingRoomName, setTypingRoomName] = useState("");

    const typingUserName = (e) => { 
        const typedText = e.target.value;
        setInputText(typedText);
    }

    const onSubmitHandler = (e) => {
        props.playerDidRedirect() 
        props.setUserName(inputText)  //setInputText and setUserName :// setUserName-->App.js me bhejdega
        setDidGetUserName(true)
        
        //Creating a new room and Emit an event to the server to create a new room
        const newGameRoomId = makeGameCode();
        setGameId(newGameRoomId);

        // const idData = {
        //     gameId : newGameRoomId,
        //     userName : inputText,
        //     isCreator : true
        // }

        socket.emit('createNewGame', newGameRoomId)

        // socket.emit("playerJoinGame", idData);
    }

    function joinSubmitHandler() {
        console.log("Typed Code:", typingRoomName);

        props.setUserName(inputText)
        setDidGetUserName(true)
        // const idData = {
        //     gameId : typingRoomName,
        //     userName : inputText,
        //     isCreator : false
        // }

        // socket.emit("playerJoinGame", idData);
    }

    return ( 
        <React.Fragment>
            {
                didGetUserName ? 
                    gameId!="" ?  
                        <button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}><Redirect to = {"/game/" + gameId}>Start Game</Redirect></button>
                               :
                               <button className="btn btn-success" style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px"}}><Redirect to = {"/game/" + typingRoomName}>Start Game</Redirect></button>
                :

                <div>
    <Navbar />
    <div style={{marginLeft : "33%",marginTop : "5vh",marginBottom : "5vh",border:"3px solid black",height:'50vh', width:"33%", display:'flex', flexDirection:'column', justifyContent:"space-around", alignItems: "center"}}>

    <input style={{width:"50%"}}
           value={inputText}
           placeholder="Enter your username"
           onChange = {typingUserName}>
    </input>

    <button className="btn btn-primary" 
            style={{width:"33%"}}
            disabled = {!(inputText.length > 0)} 
            onClick = {onSubmitHandler}>Start New Game
    </button>
    

    <div>OR</div>
    <div className="form-group">
        <input
            type="text"
            placeholder="Enter Game Code"
            id="gameCodeInput"
            value={typingRoomName}
            onChange={(e) => {
                setTypingRoomName(e.target.value);
            }}
        />
    </div>


    <button
        type="submit"
        className="btn btn-success"
        id="joinGameButton"
        disabled = {!(inputText.length > 0)} 
        onClick={joinSubmitHandler}>Join Game
    </button>


    </div>
    <Footer />
</div>

            }
        </React.Fragment>
    )
}

const Onboard = (props) => {
    const color = React.useContext(ColorContext)
    return <CreateNewGame playerDidRedirect = {color.playerDidRedirect} setUserName = {props.setUserName}/>
}


export default Onboard