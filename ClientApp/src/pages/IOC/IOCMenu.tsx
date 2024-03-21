import moment from "moment";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import { Link, useLocation } from "react-router-dom";
import Icon from "@ailibs/feather-react-ts";
import { useTranslation } from "react-i18next";
import style from "./OvewviewTile.module.scss";
import { favoriteList, globalContext } from "../../components/VerticalLayout/Menu";

const IOCMenu = (props: any) => {
  const { t }  = useTranslation();
  const path = useLocation();

  const currentMenu = useRef<Dictionary>();

  const [iconClass, setIconClass] = useState("");
  
  const [menuList, setMenuList] = useState<Dictionary[]>([]);

  const searchHandler = async () => {
    const result = await api<Dictionary[]>("get", "/menu/list", { parentId: "LdkKCqpDKX" });
    if(result.data){
      setMenuList(result.data);

      currentMenu.current = result.data.find(x => x.menuBody == path.pathname);

      if(currentMenu.current){
        if(favoriteList.find(x => x.menuId == currentMenu.current!.menuId)){
          setIconClass("page-title-icon-active");
        }
      }
    }
  }

  const clickHandler = (e: any) => {
    if(!currentMenu.current)
      return;

    const menuId = currentMenu.current.menuId;
    if(iconClass){
      api<any>("delete", "favorite", { menuId }).then(result => {
        setIconClass("");
      });   
    }else{
      api<any>("put", "favorite", { menuId }).then(result => {
        setIconClass("page-title-icon-active");
      });
    }
  };

  useEffect(() => {    
    searchHandler();
  }, []);
  
  return (
    <>
      <div className={style.iocMenuWrap}>
        <UncontrolledDropdown>
          <DropdownToggle caret>
            <i className="fa fa-fw fa-bars"></i> {' '}{props.title}
          </DropdownToggle>
          <DropdownMenu className={style.iocMenuContainer}>
            <DropdownItem>
              <Link to={"/"}>
                  <Icon name={"home"} className="icon nav-icon" />
                  MES HOME
              </Link>
            </DropdownItem>
            {menuList.map((item, i) => {
              const url = item["menuBody"] ? item["menuBody"] : "/#";

              return (<DropdownItem
                key={i}
                >
                <Link to={url} target={item["target"]}>
                  {
                    item["icon"] && <Icon name={item["icon"]} className="icon nav-icon" />
                  }
                  {t(item["menuName"])}
                </Link>
              </DropdownItem>
              )
            })}
          </DropdownMenu>
        </UncontrolledDropdown>

        <a onClick={clickHandler}>
          <Icon name="bookmark" className={`page-title-icon ${iconClass}`} size={18} />
        </a>
      </div>
    </>
  )
};

export default IOCMenu;
