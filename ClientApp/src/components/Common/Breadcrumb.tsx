import React, { MouseEventHandler, SyntheticEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";
import Icon from "@ailibs/feather-react-ts";
import { favoriteList, globalContext, menuItemsAll, menuList } from "../VerticalLayout/Menu";
import api from "../../common/api";
import { executeIdle } from "../../common/utility";
import { Dictionary } from "../../common/types";
import { useTranslation } from "react-i18next";

interface BreadcrumbProps {
  breadcrumbItem: any;
  folder: string | string[];
  icon?: any;
}

const Breadcrumb = ({ breadcrumbItem, folder, icon }: BreadcrumbProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState<BreadcrumbProps>({
    breadcrumbItem: "",
    folder: "",
    icon: "",
  });
  const [iconClass, setIconClass] = useState("");

  useEffect(() => {
    executeIdle(() => {
      if(!globalContext.activeMenu)
        return;
      const menuId = globalContext.activeMenu.getAttribute('data-menuid');
      if(favoriteList.find(x => x.menuId == menuId)){
        setIconClass("page-title-icon-active");
      }

      const menu = menuList.find(x => x.menuId == menuId);
      if(menu){
        setTitle({
          breadcrumbItem: menu.menuName,
          folder: menu.menuPathName.split(","),
          icon: menu.icon,
        });
      }else{
        setTitle({
          breadcrumbItem,
          folder,
          icon,
        });
      }
    });
  }, []);

  const clickHandler = (e: any) => {
    if(!globalContext.activeMenu)
      return;

    const menuId = globalContext.activeMenu.getAttribute('data-menuid');
    if(iconClass){
      api<any>("delete", "favorite", { menuId }).then(result => {
        setIconClass("");

        globalContext.refreshFavorite && globalContext.refreshFavorite.apply();
      });   
    }else{
      api<any>("put", "favorite", { menuId }).then(result => {
        setIconClass("page-title-icon-active");

        globalContext.refreshFavorite && globalContext.refreshFavorite.apply();
      });
    }
  };

  return (
    <Row className="page-title">
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0">
            <>
              {title.icon && <Icon name={title.icon} className="icon" />}
              {t(title.breadcrumbItem)}
              <a onClick={clickHandler}>
                <Icon name="bookmark" className={`page-title-icon ${iconClass}`} size={18} />
              </a>
            </>
          </h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              { 
                typeof title.folder == "string" && (
                <>
                  <BreadcrumbItem>
                    <Link to="#">{folder}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <Link to="#">{t(title.breadcrumbItem)}</Link>
                  </BreadcrumbItem>
                </>)
              }
              { 
                Array.isArray(title.folder) && 
                  title.folder.map((item: string, index: number) =>
                  (
                    <BreadcrumbItem key={index}>
                      <Link to="#">{t(item)}</Link>
                    </BreadcrumbItem>
                  )
                )
              }
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Breadcrumb;