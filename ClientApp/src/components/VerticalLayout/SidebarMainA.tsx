import React, { useEffect } from "react";
import { Link } from "react-router-dom";

//import components
import SidebarContent from "./SidebarContent";
import SidebarMainpage from "./SidebarMainpage";

import Header from "./Header";
import SimpleBar from "simplebar-react";

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";
import { clickToggle } from "./SidebarMainpagejs";

const Sidebar = (props: any) => {

    useEffect(() => {
        document.body.setAttribute("data-sidebar-size", "sm");
    }, []);

  return (
      <React.Fragment>
         
          <div className="vertical-menu">

              <Header />

              {/* <div className="snowflake1s" aria-hidden="true">
                  <div className="snowflake1">❅</div> <div className="snowflake1">❆</div>
                  <div className="snowflake1">❅</div> <div className="snowflake1">❆</div>
                  <div className="snowflake1">❅</div> <div className="snowflake1">❆</div>
                  <div className="snowflake1">❅</div> <div className="snowflake1">❆</div>
                  <div className="snowflake1">❅</div> <div className="snowflake1">❆</div>
                  <div className="snowflake1">❅</div> <div className="snowflake1">❆</div>
              </div> */}
              <div className="navbar-brand-box">
                  <Link to="/" className="logo logo-dark">
                      <span className="logo-sm">
                          <img src={logoSm} alt="" height="20" />
                      </span>
                      <span className="logo-lg" style={{ fontSize: "16px", fontWeight: "700" }}>
                          <img src={logoSm} alt="" height="22" />&nbsp; MES
                      </span>
                  </Link>

                  <Link to="/" className="logo logo-light">
                      <span className="logo-sm">
                          <img src={logoSm} alt="" height="20" />
                      </span>
                      <span className="logo-lg" style={{ fontSize: "16px", fontWeight: "700" }}>
                          <img src={logoSm} alt="" height="22" />&nbsp; MES
                      </span>
                  </Link>
                  <button
                      onClick={clickToggle} 
                      type="button" className="btn btn-sm px-2 font-size-16 header-item vertical-menu-btn1" id="vertical-menu-btn1">
                      <i className="fa fa-fw fa-bars" />
                  </button>
        </div>

  
              <div className="h-100">
                  {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
          </div>
          </div>
          <div>
              {props.type !== "condensed" ? <SidebarMainpage /> : <SidebarMainpage />}
          </div>
        
    </React.Fragment>
  );
};

export default Sidebar;