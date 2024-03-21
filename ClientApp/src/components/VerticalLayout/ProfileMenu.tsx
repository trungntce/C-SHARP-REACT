import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { Link } from "react-router-dom";
import withRouter from "./withRouter";
import { dateFormat } from "../../common/utility";
import { globalContext } from "./Menu";
import { Dictionary } from "../../common/types";

const ProfileMenu = (props: any) => {
  const [profile, setProfile] = useState<Dictionary>({
    userName: localStorage.getItem("user-name"),
    userEmail: localStorage.getItem("user-email"),
    groupList: JSON.parse(localStorage.getItem("auth-usergroup") as string)
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = () => {
    localStorage.removeItem("auth-token");
    window.location.href = "/";
  }

  globalContext.refreshProfile = async () => {
    setProfile({
      userName: localStorage.getItem("user-name"),
      userEmail: localStorage.getItem("user-email"),
      groupList: JSON.parse(localStorage.getItem("auth-usergroup") as string)
    });
  }

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item user text-start d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="ms-2 d-none d-sm-block user-item-desc">
            <span className="user-name">{profile.userName}</span>
            <span className="user-sub-title">{localStorage.getItem("user-id")}</span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end pt-0" dir="left">
          <div className="p-3 bg-primary border-bottom">
            <h6 className="mb-0 text-white">{profile.userName}</h6>
            <p className="mb-0 font-size-11 text-white-50 fw-semibold">
            {profile.userEmail}
            </p>
          </div>
          <DropdownItem>
            <i className="mdi mdi-account-circle text-muted font-size-16 align-middle me-1"></i>{" "}
            <span className="align-middle">
              <Link to="/profile"> {props.t("Profile")}</Link>
            </span>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <i className="mdi mdi-account-group text-muted font-size-16 align-middle me-1"></i>{" "}
            <span className="align-middle">
              User Group
              <ul className="profile-usergroup-list">
              {
                profile.groupList.map((x: string, i: number) => (
                  <React.Fragment key={i}>
                    <li>{x}</li>
                    </React.Fragment>
                ))
              }
              </ul>
            </span>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <i className="mdi mdi-wallet text-muted font-size-16 align-middle me-1"></i>{" "}
            <span className="align-middle">
              Prev Login : <b>{
                localStorage.getItem("user-login") == "null" ? 
                  "First time" : 
                  dateFormat(localStorage.getItem("user-login"), "MM/DD HH:mm")
                }</b>
            </span>
          </DropdownItem>
          <DropdownItem>
            <a onClick={logoutHandler}>
              <i className="mdi mdi-logout text-muted font-size-16 align-middle me-1"></i>{" "}
              <span className="align-middle">
                {props.t("Logout")}
              </span>
            </a>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default withTranslation()(withRouter(ProfileMenu));
