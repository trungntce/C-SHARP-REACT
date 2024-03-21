import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { withTranslation } from "react-i18next";

//i18n
import i18n from 'i18next';
import { globalContext } from "./Menu";

import enUS from "../../assets/images/flags/en-US.png";
import koKR from "../../assets/images/flags/ko-KR.png";
import viVN from "../../assets/images/flags/vi-VN.png";
import { Dictionary } from "../../common/types";

const flags: Dictionary = {
  "en-US": enUS,
  "ko-KR": koKR,
  "vi-VN": viVN
}

const LanguageDropdown = (props :any) => {
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    const userLang = localStorage.getItem("user-lang") || "ko-KR";
    setSelectedLang(userLang);
  }, []);

  const changeLanguageAction = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("user-lang", lang);
    setSelectedLang(lang);
  };

  const toggle = () => {
    setMenu(!menu);
  };

  const languages = globalContext.languages;

  globalContext.refreshLang = changeLanguageAction;

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block language-switch">
        <DropdownToggle className="btn header-item " tag="button">
          <img
            src={flags[selectedLang]}
            alt={selectedLang}
            height="16"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {
            Object.keys(languages).map(key => {
              return (
              <DropdownItem
                key={key}
                onClick={() => changeLanguageAction(key)}
                className={`notify-item ${
                  selectedLang === key ? "active" : "none"
                }`}
              >
                <img
                  src={flags[key]}
                  alt={key}
                  className="me-1"
                  height="12"
                />
                <span className="align-middle">
                  { props.t(languages[key]) }
                </span>
              </DropdownItem>
              )
            })
          }
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(LanguageDropdown);