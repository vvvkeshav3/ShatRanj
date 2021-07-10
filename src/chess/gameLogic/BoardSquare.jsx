import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { move } from './Game'
import { gameSubject } from './Game'
import useSound from 'use-sound'
import moveAudio from '../sound/moveAudio.mp3'
import Promote from './Promote'
import { socket, playerNumber } from '../../connection/socket'
import { useParams } from 'react-router-dom'


let roomName;


// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
export default function BoardSquare({piece,black,position,turn}) {

  const params = useParams();
  roomName = params.gameid;

  const [promotion, setPromotion] = useState(null)
  const [play] = useSound(moveAudio);
  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item) => {
      // console.log("pos",position)
      const pieceDetailArray = item.id.split('_')
      if( (playerNumber===1 && turn === 'w') || (playerNumber===2 && turn === 'b')) {
        // handleMove(pieceDetailArray[0], position)
        play()
        socket.emit('validMove', {from: pieceDetailArray[0],to: position, roomName})
      }
    },
  })

  useEffect(() => {
    const subscribe = gameSubject.subscribe(
      ({ pendingPromotion }) =>
        pendingPromotion && pendingPromotion.to === position
          ? setPromotion(pendingPromotion)
          : setPromotion(null)
    )
    return () => subscribe.unsubscribe()
  }, [position])

  useEffect(()=> {
        socket.on('validPromoteMove', (detailsObject)=> {
          move(detailsObject.from, detailsObject.to, detailsObject.p)
        })
  })
  
  return (
    <div className="board-square" ref={drop}>
      <Square black={black}>
        {promotion && (((playerNumber===1 && turn === 'w') || (playerNumber===2 && turn === 'b'))) ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
  )
}