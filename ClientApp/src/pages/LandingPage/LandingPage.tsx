import React from "react";
// import cube from "../../assets/videos/cube.mp4";
// import world from "../../assets/videos/world.mp4";
//import world2 from "../../assets/videos/world2.mp4";
import myStyle from "./LandingPage.module.scss";

const LandingPage = () => {
  return (
    <div className={myStyle.background}>
      {/* <div className={myStyle.overlay}></div> */}
      <video autoPlay loop muted>
        <source
          src="/Media/cube.mp4"
          type="video/mp4"
        />
      </video>
      <div className={myStyle.content}>INNOVATION SIFLEX</div>
      <div className={myStyle.content2}>SMART FACTORY MES SYSTEM</div>
    </div>
  );
};

export default LandingPage;
