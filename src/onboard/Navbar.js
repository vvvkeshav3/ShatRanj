import React from "react";
import "./css/Navbar.css";
import M from "materialize-css";
import {useParams} from "react-router-dom";
const socket  = require('../connection/socket').socket;

const Navbar = ({userName,isCreator}) => {

  const {gameid} = useParams()
  const idData = {
     gameId : gameid,
     userName : userName,
     isCreator: isCreator
  }

  socket.emit("playerJoinGame", idData)

  return (
    <div>
      <nav>
        <div className="nav-wrapper">
          <h3 style={{color:"white"}}> ShatRanj - Shay aur Maat </h3>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
