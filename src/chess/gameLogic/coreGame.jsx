import React, { useEffect, useState } from 'react'
import '../../App.css'
import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'
import { socket, playerNumber } from '../../connection/socket'
import {useParams} from 'react-router-dom'

let roomName;

function CoreGame() {

  const params = useParams();
  roomName = params.gameid;

  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [turn, setTurn] = useState()
  const [userChecked, setUserChecked] = useState(false)
 
  
  useEffect(() => {
    initGame()
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board)
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setTurn(game.turn)
      setUserChecked(game.isChecked)
    })
    return () => subscribe.unsubscribe()
  }, [])

  useEffect(()=> {
    socket.on('resetGame', resetGame)
  }, [])

  function handleReset() {
    socket.emit('reStartNewGame', {roomName, playerNumber })
  }

  return (
    <div className="container">
      <div>
        {isGameOver && (
          <h2 className="vertical-text">
            GAME OVER
          </h2>
        )}
        <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
          <button style={{height:"5vh",width:"8vw"}} className="btn btn-success mb-4" onClick={handleReset}>Reset Game</button>
          {userChecked && <h2 style={{marginLeft:"4%" , color:'white'}}>Check!!!</h2>}
        </div>
      </div>
      <div className="board-container">
        <Board board={board} turn={turn} />
      </div>
      <div>
        {result && <p className="vertical-text">{result}</p>}
      </div>
    </div>
  )
}

export default CoreGame