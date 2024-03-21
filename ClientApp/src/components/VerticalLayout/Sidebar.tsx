import React from "react";
import { Link } from "react-router-dom";

//import components
import SidebarContent from "./SidebarContent";
import SimpleBar from "simplebar-react";

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

const Sidebar = (props: any) => {

  function tToggle() {
    document.body.setAttribute("data-sidebar-size", "sm");
  }

  return (
    <React.Fragment>
      <div className="vertical-menu">

      <div className="navbar-brand-box" onClick={tToggle}>
          <Link to="/" className="logo logo-dark">
                      <span className="logo-sm">
                          <img src={logoSm} alt="" height="20"  />
                      </span>
                      <span className="logo-lg" style={{ fontSize: "16px", fontWeight:"700" }}>
                          <img src={logoSm} alt="" height="22" />&nbsp; MES
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
                          <img src={logoSm} alt="" height="20"  />
            </span>
                      <span className="logo-lg" style={{ fontSize: "16px", fontWeight: "700" }}>
                          <img src={logoSm} alt="" height="22" />&nbsp; MES
            </span>
          </Link>
        </div>

        <button
          onClick={() => {
            tToggle();
          }}
          type="button" className="btn btn-sm px-2 font-size-16 header-item vertical-menu-btn" id="vertical-menu-btn">
          <i className="fa fa-fw fa-bars" />
        </button>

        <div className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;