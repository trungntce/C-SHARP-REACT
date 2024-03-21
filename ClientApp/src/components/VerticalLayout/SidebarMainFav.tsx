import React, { useCallback, useEffect, useRef, useState } from "react";

//Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation, useNavigate } from "react-router-dom";

//WithRouter
import withRouter from "../Common/withRouter";

import { favoriteList, favoriteListToMenuItemList, getFavorite, globalContext, menuItemsAll, menuItemsDb, menuItemsFavorite, MenuItemsProps, refreshFavorite } from "./Menu";

//i18n
import { withTranslation } from "react-i18next";
import classNames from "classnames";

import Icon from "@ailibs/feather-react-ts";

import Sortable, { SortableEvent } from 'sortablejs';
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import { executeIdle } from "../../common/utility";
import * as ReactDOMClient from 'react-dom/client';
import { ReactSortable } from "react-sortablejs";
import AutoCombo from "../Common/AutoCombo";

interface HeaderMenuItemProps {
  item: any;
}

export const HeaderMenuItem = ({ item }: HeaderMenuItemProps) => {
  return (
      <div >
          <div className='widthtop'>
              <div className='circle'>  </div>
              <li className="menu-title itext" data-key="t-layouts" id={item.label == "Favorite" ?"favoritea":item.menuId}>{item.label}</li>
          </div>
          <div className="bagtriangle">
              <div className="triangle">
              </div>
          </div>
      </div>
  );
};

export const MenuItem = ({ item, props }: any) => {
  const hasChildren = item["subItems"] && item["subItems"].length;
  const url = item["link"] ? item["link"] : "/#";
  const hasExtra = item["novidade"];
  const arrowclass = (item['label'] == 'Authentication') ? true : false;
  return (
    <li className={item["className"]} data-menuid={item["menuId"]}>
      <Link to={url} target={item["target"]} data-menuid={item["menuId"]} className={classNames(
        { "has-arrow": hasChildren && !hasExtra && !arrowclass },
        { "waves-effect": hasChildren },
        item["classNameLink"]
      )}>
        {
          item["icon"] && <Icon name={item["icon"]} className="icon nav-icon" />
        }
        <span className="menu-item">{props.t(item["label"])}</span>
        {item.badge &&
          <span className={"badge rounded-pill " + item.badgecolor}>{item.badge}</span>
        }
      </Link>
      {
        hasChildren &&
        <Menu item={item} props={props} />
      }
    </li>
  );
};

export const Menu = ({ item, props }: any) => {
  const menuItems = item["subItems"] && item["subItems"];
  return (
    <ul className="sub-menu">
      {
        (menuItems || []).map((item: any, key: number) =>
          <MenuItem item={item} key={key} props={props} />
        )
      }
    </ul>
  );
};

const SidebarContent = (props: any) => {

  const ref = useRef<any>();
  const menuSearchRef = useRef<any>();
  const sortableRef = useRef<MenuItemsProps[]>([]);
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState(menuItemsFavorite);

  const activateParentDropdown = useCallback((item: any, isScroll: boolean = false) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }
    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement.closest("ul");
      if (parent2 && parent2.id !== "side-menu") {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;
        if (parent3) {
          parent3.classList.add("mm-active");
          const childAnchor = parent3.querySelector(".has-arrow");
          const childDropdown = parent3.querySelector(".has-dropdown");
          if (childAnchor) childAnchor.classList.add("mm-active");
          if (childDropdown) childDropdown.classList.add("mm-active");

          const parent4 = parent3.parentElement;
          if (parent4 && parent4.id !== "side-menu") {
            parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;
            if (parent5 && parent5.id !== "side-menu") {
              parent5.classList.add("mm-active");
              const childanchor = parent5.querySelector(".is-parent");
              if (childanchor && parent5.id !== "side-menu") {
                childanchor.classList.add("mm-active");
              }
            }
          }
        }
      }
      if(isScroll)
        scrollElement(item);
      return false;
    }

    if(isScroll)
      scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items: any) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes &&
            parent.childNodes.lenght &&
            parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback((isScroll: boolean = true) => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    let secondMatchingMenuItem = null;
    const ul: any = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (items[i].classList.contains('menu-favorite-link'))
        continue;

      if(pathName == "/")
        return;

      const itemPath = items[i].pathname;

      if(itemPath == "" || itemPath == "/")
        continue;

      if (pathName === itemPath) {
        matchingMenuItem = items[i];
        break;
      }

      if(pathName.startsWith(itemPath)){
        secondMatchingMenuItem = items[i];
      }
    }
    
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem, isScroll);

      globalContext.activeMenu = matchingMenuItem;
    }else if (secondMatchingMenuItem) { // 파라미터 등으로 매칭 url이 없는 경우
      activateParentDropdown(secondMatchingMenuItem, isScroll);

      globalContext.activeMenu = secondMatchingMenuItem;
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  const scrollElement = useCallback(
    (item: any) => {
      if (item && ref && ref.current) {
        const height = document.getElementById('side-menu-favorite')?.offsetHeight || 0;

        // console.log("favorite height", height);
        // console.log("item.offsetTop", item.offsetTop);
        // console.log("window.innerHeight", window.innerHeight);

        const currentPosition = item.offsetTop;
        // if (currentPosition > window.innerHeight) {
        //   ref.current.getScrollElement().scrollTop = currentPosition + 300;
        //   window.scrollTo(0, currentPosition + 300);
        // } else if (currentPosition - height < height!) {
        //   ref.current.getScrollElement().scrollTop = 0;
        //   window.scrollTo(0, 0);
        // }
      }
    },
    [ref],
  );

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  //useEffect(() => {
  //  window.scrollTo({ top: 0, behavior: "smooth" });
  //  activeMenu();
  //}, [activeMenu]);

  globalContext.refreshFavorite = async () => {
    await refreshFavorite();
    sortableRef.current = menuItemsFavorite;
    setMenuList(sortableRef.current);
    
    executeIdle(() => {
      activeMenu(false);
    });
  }

  return (
      <React.Fragment key={"otherkeydat1"}>      
      <SimpleBar ref={ref} className="sidebar-menu-scroll1" id="nav-scroll1">
      
        <div id="sidebar-menu1">
          <ReactSortable tag="ul" className="metismenu list-unstyled1" id="side-menu-favorite1" list={menuList} setList={(newState: MenuItemsProps[]) => {
            sortableRef.current = newState;
          }}
          onSort={(e:Sortable.SortableEvent) => {
            setMenuList(sortableRef.current);
            
            const favMenuList = sortableRef.current.filter(x => x.className == "menu-favorite1");
            const favoriteList: Dictionary[] = [];
        
            for(let i = 0; i < favMenuList.length; i++){
              const menu = favMenuList[i];
              favoriteList.push({
                menuId: menu.menuId,
                sort: i + 1
              });
            }
    
            api<any>("post", "favorite", favoriteList).then(result => {        
              globalContext.refreshFavorite();
            });
          }}
          animation={300}
                  >
       <div className={"width16"}>  
          {
            (menuList || []).map((item, key) => {
              return (
                <React.Fragment key={key}>
                  {/* Menu Item render */}
                  {item["isHeader"] ? (
                          <HeaderMenuItem item={item}  />
                  ) : (
                              <MenuItem item={item} props={props} />
                  )}
                </React.Fragment>
              );
            })
                          }
       </div>
          </ReactSortable>
                  <ul className="metismenu list-unstyled1" id="side-menu1">
                     
                  </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

export default withTranslation()(withRouter(SidebarContent));