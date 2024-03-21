import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { globalContext, menuItemsDb, menuList } from "./Menu";
import { executeIdle } from "../../common/utility";
import { useTranslation } from "react-i18next";

let footerRef: any = null;
export const setFooter = (html: string) => {
  if(footerRef && footerRef.current){
    footerRef.current.innerHTML = html;
  }
};

const Footer = () => {
  const { t } = useTranslation();

  footerRef = useRef<any>();

  const location = useLocation();
  const [menuInfo,setMenuInfo] = useState<any>({
    manager:""
  });

  useEffect(()=> {
    executeIdle(()=>{
      const menuId = globalContext.activeMenu.getAttribute('data-menuid');
      const menu = menuList.find((x:any)=> x.menuId == menuId);
      if(menu){
        setMenuInfo({
          manager : menu.manager
        })
      }
      else{
        setMenuInfo({
          manager : ""
        })
      }
    })
  },[location])
  
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={5}>{new Date().getFullYear()} ©SIFLEX.</Col>
            <Col md={6}>
              <div ref={footerRef} className="text-sm-end d-none d-sm-block">

              </div>
            </Col>
            <Col md={1}>{menuInfo.manager ? `${t("@OFFICER")} : ${menuInfo.manager}` : ""}</Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;