import React, { useState } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";
import LanguageDropdown from "./LanguageDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ProfileMenu from "./ProfileMenu";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useTranslation } from "react-i18next";

const Header = (props: any) => {
  const { t } = useTranslation();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function tToggle() {
    const body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    }
    document.body.setAttribute("data-sidebar-size", "lg");
  }

  const manualList = (manual: number) => {
    setAnchorEl(null);
    var src;

    if(manual === 1) {
      src = "/Media/4M.pdf";
    }else if(manual === 2) {
      src = "/Media/Model_Recipe_param.pdf";
    }else if(manual === 3) {
      src = "/Media/Recipe_param.pdf";
    }else{
      src = "/Media/Language.pdf";
    }

    window.open(src, '_blank', 'noopener,noreferrer');
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">

            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="20" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="20" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoSm} alt="" height="20" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="20" />
                </span>
              </Link>
            </div>

            <button
              onClick={() => {
                tToggle();
              }}
              type="button"
              className="btn btn-sm px-1 font-size-16 header-item vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars"></i>
            </button>
          </div>

          <div className="d-flex">
            <IconButton onClick={handleClick} sx={{ color: "#05b" }}>
              <MenuBookIcon sx={{ fontSize: "1.3rem" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              className="top-manual-wrap"
            >
              <MenuItem onClick={(e: any) => {manualList(1)}}>{t("@4M_MANUAL")}</MenuItem>
              <MenuItem onClick={(e: any) => {manualList(2)}}>{t("@MODEL_RECIPE_PARAM_MANUAL")}</MenuItem>
              <MenuItem onClick={(e: any) => {manualList(3)}}>{t("@RECIPE_PARAM_MANUAL")}</MenuItem>
              <MenuItem onClick={(e: any) => {manualList(4)}}>{t("@LANGUAGE_MANUAL")}</MenuItem>
            </Menu>                                           
            
            <LanguageDropdown />

            {/* <NotificationDropdown /> */}

            <ProfileMenu />

          </div>
        </div>
      </header>

    </React.Fragment>
  );
};

export default withTranslation()(Header);