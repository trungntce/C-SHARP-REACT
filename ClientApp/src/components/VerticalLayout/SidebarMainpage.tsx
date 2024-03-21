import React from "react";
import { Link } from "react-router-dom";

//import components
import SidebarContent from "./SidebarMainFav";
import SidebarMainpageContent from "./SidebarMainpageContent";

import SimpleBar from "simplebar-react";

//import images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";
import { Container, Row, Col } from "reactstrap";
import { newback, newnext } from "./SidebarMainpagejs";
 
const Sidebar = (props: any) => {



  return (
      <React.Fragment>

          <div className="vertical-menu2">

              <div style={{ "textAlign": "center" }}>
              <button className="newback" onClick={newback}>&#10218;</button>
              <button className="newnext" onClick={newnext}>&#10219;</button>
          </div>

              <Container fluid={true}>
                  <Row className="rownewlayout"  >

                      <Col md={2}>
                          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
                      </Col>


                      {props.type !== "condensed" ? <SidebarMainpageContent /> : <SidebarMainpageContent />}


                  </Row>
              </Container>
          </div>
          <br />
      </React.Fragment>
  );
};

export default Sidebar;