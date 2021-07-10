import React from "react";
import logo from "../logo/logo512.png";
import './css/Footer.css';

const Footer = () => {
  return (
    <div style={{display:"flex", width:"100vw", overflowX:"hidden"}}>
      <footer style={{ width:"100%"}}>
        <img src={logo} alt />
        <div className="about_us">
          <h1>About Me</h1>
            <h5>Nitigya Jain</h5>
            <ul>
              <li><a href="https://github.com/Nitigya272001" target="_blank"> Github</a></li>
              <li><a href="https://www.linkedin.com/in/nitigya-jain/" target="_blank"> LinkedIn </a></li>
              {/* <li><a href="https://codeforces.com/profile/nitigya" target="_blank"> Codeforces </a></li> */}
            </ul>
        </div>
        <div className="contact_us">
          <h1>Contact Me</h1>
          <ul>
            <li>Insta Handle :- nitigya__</li>
            <li>Gmail :- nitigyajain123456@gmail.com</li>
          </ul>
        </div>
      </footer>
   
    </div>
  );
};

export default Footer;
