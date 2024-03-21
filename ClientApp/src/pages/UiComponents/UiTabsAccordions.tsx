import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiTabsAccordions = () => {
  const [defaultTab, setDefaultTab] = useState("1");
  const [navPillTab, setnavPillTab] = useState("1");
  const [navPillJuastifyTab, setnavPillJuastifyTab] = useState("1");
  const [customTab, setcustomTab] = useState("1");
  const [customJustifyTab, setcustomJustifyTab] = useState("1");
  const [navJustifyTab, setnavJustifyTab] = useState("1");
  const [verticalLeftTab, setverticalLeftTab] = useState("1");
  const [verticalRightTab, setverticalRightTab] = useState("1");


  const [col1, setcol1] = useState(true);
  const [col2, setcol2] = useState(false);
  const [col3, setcol3] = useState(false);

  const [col5, setcol5] = useState(true);
  const [col6, setcol6] = useState(true);
  const [col7, setcol7] = useState(false);

  const [col9, setcol9] = useState(true);
  const [col10, setcol10] = useState(false);
  const [col11, setcol11] = useState(false);


  const t_col1 = () => {
    setcol1(!col1);
    setcol2(false);
    setcol3(false);
  };

  const t_col2 = () => {
    setcol2(!col2);
    setcol1(false);
    setcol3(false);
  };

  const t_col3 = () => {
    setcol3(!col3);
    setcol1(false);
    setcol2(false);
  };

  const t_col5 = () => {
    setcol5(!col5);
  };

  const t_col6 = () => {
    setcol7(false);
    setcol6(!col6);
  };

  const t_col7 = () => {
    setcol6(false);
    setcol7(!col7);
  };

  const t_col8 = () => {
    setcol6(!col6);
    setcol7(!col7);
  };

  const t_col9 = () => {
    setcol9(!col9);
    setcol10(false);
    setcol11(false);
  };

  const t_col10 = () => {
    setcol10(!col10);
    setcol9(false);
    setcol11(false);
  };

  const t_col11 = () => {
    setcol11(!col11);
    setcol10(false);
    setcol9(false);
  };

  const defaulttoggle = (tab: any) => {
    if (defaultTab !== tab) setDefaultTab(tab);
  };

  const navPilltoggle = (tab: any) => {
    if (navPillTab !== tab) setnavPillTab(tab);
  };

  const navPillJuastifytoggle = (tab: any) => {
    if (navPillJuastifyTab !== tab) setnavPillJuastifyTab(tab);
  };
  const customTabtoggle = (tab: any) => {
    if (customTab !== tab) setcustomTab(tab);
  };
  const customJustifyTabtoggle = (tab: any) => {
    if (customJustifyTab !== tab) setcustomJustifyTab(tab);
  };
  const navJustifyTabtoggle = (tab: any) => {
    if (navJustifyTab !== tab) setnavJustifyTab(tab);
  };
  const verticalLeftTabtoggle = (tab: any) => {
    if (verticalLeftTab !== tab) setverticalLeftTab(tab);
  };
  const verticalRightTabtoggle = (tab: any) => {
    if (verticalRightTab !== tab) setverticalRightTab(tab);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Tabs & Accordions" />

          <Row>
            <Col xl={6} className="col-xxl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Default Tabs</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: defaultTab === "1" })}
                        onClick={() => {
                          defaulttoggle("1");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Home</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: defaultTab === "2" })}
                        onClick={() => {
                          defaulttoggle("2");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Profile</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: defaultTab === "3" })}
                        onClick={() => {
                          defaulttoggle("3");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Messages</span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={defaultTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <p className="mb-0">
                        Raw denim you probably haven&quot;t heard of them jean shorts
                        Austin. Nesciunt tofu stumptown aliqua, retro synth
                        master cleanse. Mustache cliche tempor, williamsburg
                        carles vegan helvetica. Reprehenderit butcher retro
                        keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                        qui irure terry richardson ex squid. Aliquip placeat
                        salvia cillum iphone. Seitan aliquip quis cardigan
                        american, voluptate nisi qui.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      <p className="mb-0">
                        Food truck fixie locavore, accusamus mcsweeney&quot;s marfa
                        nulla single-origin coffee squid. Exercitation +1 labore
                        velit, blog sartorial PBR leggings next level wes
                        anderson artisan four loko farm-to-table craft beer
                        twee. Qui photo booth letterpress, commodo enim craft
                        beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                        PBR. Homo nostrud organic, assumenda labore aesthetic
                        magna delectus.
                      </p>
                    </TabPane>
                    <TabPane tabId="3">
                      <p className="mb-0">
                        Etsy mixtape wayfarers, ethical wes anderson tofu before
                        they sold out mcsweeney&quot;s organic lomo retro fanny pack
                        lo-fi farm-to-table readymade. Messenger bag gentrify
                        pitchfork tattooed craft beer, iphone skateboard
                        locavore carles etsy salvia banksy hoodie helvetica. DIY
                        synth PBR banksy irony. Leggings gentrify squid 8-bit
                        cred pitchfork. Williamsburg banh mi whatever gluten yr.
                      </p>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6} className="col-xxl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Nav Pills</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Nav tabs pills>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillTab === "1" })}
                        onClick={() => {
                          navPilltoggle("1");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Home</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillTab === "2" })}
                        onClick={() => {
                          navPilltoggle("2");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Profile</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillTab === "3" })}
                        onClick={() => {
                          navPilltoggle("3");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Messages</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={navPillTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <p className="mb-0">
                        Raw denim you probably haven&quot;t heard of them jean shorts
                        Austin. Nesciunt tofu stumptown aliqua, retro synth
                        master cleanse. Mustache cliche tempor, williamsburg
                        carles vegan helvetica. Reprehenderit butcher retro
                        keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                        qui irure terry richardson ex squid. Aliquip placeat
                        salvia cillum iphone. Seitan aliquip quis cardigan
                        apparel, voluptate nisi qui.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      <p className="mb-0">
                        Food truck fixie locavore, accusamus mcsweeney&quot;ss marfa
                        nulla single-origin coffee squid. Exercitation +1 labore
                        velit, blog sartorial PBR leggings next level wes
                        anderson artisan four loko farm-to-table craft beer
                        twee. Qui photo booth letterpress, commodo enim craft
                        beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                        PBR. Homo nostrud organic, assumenda labore aesthetic
                        magna 8-bit.
                      </p>
                    </TabPane>
                    <TabPane tabId="3">
                      <p className="mb-0">
                        Etsy mixtape wayfarers, ethical wes anderson tofu before
                        they sold out mcsweeney&quot;ss organic lomo retro fanny pack
                        lo-fi farm-to-table readymade. Messenger bag gentrify
                        pitchfork tattooed craft beer, iphone skateboard
                        locavore carles etsy salvia banksy hoodie helvetica. DIY
                        synth PBR banksy irony. Leggings gentrify squid 8-bit
                        cred pitchfork. Williamsburg banh mi whatever
                        gluten-free.
                      </p>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6} className="col-xxl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Nav Pills Justify</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Nav pills justified className="bg-light">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillJuastifyTab === "1" })}
                        onClick={() => { navPillJuastifytoggle("1"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Home</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillJuastifyTab === "2" })}
                        onClick={() => { navPillJuastifytoggle("2"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Profile</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillJuastifyTab === "3" })}
                        onClick={() => { navPillJuastifytoggle("3"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Messages</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navPillJuastifyTab === "4" })}
                        onClick={() => { navPillJuastifytoggle("4"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Settings</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={navPillJuastifyTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <p className="mb-0">
                        Raw denim you probably haven&quot;t heard of them jean shorts
                        Austin. Nesciunt tofu stumptown aliqua, retro synth
                        master cleanse. Mustache cliche tempor, williamsburg
                        carles vegan helvetica. Reprehenderit butcher retro
                        keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                        qui irure terry richardson ex squid. Aliquip placeat
                        salvia cillum iphone. Seitan quis cardigan american
                        apparel, voluptate nisi qui.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      <p className="mb-0">
                        Food truck fixie locavore, accusamus mcsweeney&quot;ss marfa
                        nulla single-origin coffee squid. Exercitation +1 labore
                        velit, blog sartorial PBR leggings next level wes
                        anderson artisan four loko farm-to-table craft beer
                        twee. Qui photo booth letterpress, commodo enim craft
                        beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                        PBR. Homo nostrud organic, assumenda labore aesthetic
                        magna 8-bit.
                      </p>
                    </TabPane>
                    <TabPane tabId="3">
                      <p className="mb-0">
                        Etsy mixtape wayfarers, ethical wes anderson tofu before
                        they sold out mcsweeney&quot;ss organic lomo retro fanny pack
                        lo-fi farm-to-table readymade. Messenger bag gentrify
                        pitchfork tattooed craft beer, iphone skateboard
                        locavore carles etsy salvia banksy hoodie helvetica. DIY
                        synth PBR banksy irony. Leggings gentrify squid 8-bit
                        cred pitchfork. Williamsburg banh mi whatever
                        gluten-free.
                      </p>
                    </TabPane>
                    <TabPane tabId="4">
                      <p className="mb-0">
                        Trust fund seitan letterpress, keytar raw denim keffiyeh etsy
                        art party before they sold out master cleanse gluten-free squid
                        scenester freegan cosby sweater. Fanny pack portland seitan DIY,
                        art party locavore wolf cliche high life echo park Austin. Cred
                        vinyl keffiyeh DIY salvia PBR, banh mi bag before banksy hoodie
                        helvetica they sold out farm-to-table.
                      </p>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6} className="col-xxl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Custom Tabs</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customTab === "1" })}
                        onClick={() => { customTabtoggle("1"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Home</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customTab === "2" })}
                        onClick={() => { customTabtoggle("2"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Profile</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customTab === "3" })}
                        onClick={() => { customTabtoggle("3"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Messages</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customTab === "4" })}
                        onClick={() => { customTabtoggle("4"); }}
                      >
                        <span className="d-block d-sm-none"><i className="fas fa-cog"></i></span>
                        <span className="d-none d-sm-block">Settings</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={customTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <p className="mb-0">
                        Raw denim you probably haven&quot;t heard of them jean shorts
                        Austin. Nesciunt tofu stumptown aliqua, retro synth
                        master cleanse. Mustache cliche tempor, williamsburg
                        carles vegan helvetica. Reprehenderit butcher retro
                        keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                        qui irure terry richardson ex squid. Aliquip placeat
                        salvia cillum iphone. Seitan quis cardigan american
                        apparel, voluptate nisi qui.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      <p className="mb-0">
                        Food truck fixie locavore, accusamus mcsweeney&quot;ss marfa
                        nulla single-origin coffee squid. Exercitation +1 labore
                        velit, blog sartorial PBR leggings next level wes
                        anderson artisan four loko farm-to-table craft beer
                        twee. Qui photo booth letterpress, commodo enim craft
                        beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                        PBR. Homo nostrud organic, assumenda labore aesthetic
                        magna 8-bit.
                      </p>
                    </TabPane>
                    <TabPane tabId="3">
                      <p className="mb-0">
                        Etsy mixtape wayfarers, ethical wes anderson tofu before
                        they sold out mcsweeney&quot;ss organic lomo retro fanny pack
                        lo-fi farm-to-table readymade. Messenger bag gentrify
                        pitchfork tattooed craft beer, iphone skateboard
                        locavore carles etsy salvia banksy hoodie helvetica. DIY
                        synth PBR banksy irony. Leggings gentrify squid 8-bit
                        cred pitchfork. Williamsburg banh mi whatever
                        gluten-free.
                      </p>
                    </TabPane>
                    <TabPane tabId="4">
                      <p className="mb-0">
                        Trust fund seitan letterpress, keytar raw denim keffiyeh etsy
                        art party before they sold out master cleanse gluten-free squid
                        scenester freegan cosby sweater. Fanny pack portland seitan DIY,
                        art party locavore wolf cliche high life echo park Austin. Cred
                        vinyl keffiyeh DIY salvia PBR, banh mi bag before banksy hoodie
                        helvetica they sold out farm-to-table.
                      </p>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6} className="col-xxl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Custom Justify Tabs</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>

                  <Nav tabs justified className="nav-tabs-custom">
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customJustifyTab === "1" })}
                        onClick={() => { customJustifyTabtoggle("1"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Home</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customJustifyTab === "2" })}
                        onClick={() => { customJustifyTabtoggle("2"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Profile</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customJustifyTab === "3" })}
                        onClick={() => { customJustifyTabtoggle("3"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Messages</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: customJustifyTab === "4" })}
                        onClick={() => { customJustifyTabtoggle("4"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Settings</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={customJustifyTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <p className="mb-0">
                        Raw denim you probably haven&quot;t heard of them jean shorts
                        Austin. Nesciunt tofu stumptown aliqua, retro synth
                        master cleanse. Mustache cliche tempor, williamsburg
                        carles vegan helvetica. Reprehenderit butcher retro
                        keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                        qui irure terry richardson ex squid. Aliquip placeat
                        salvia cillum iphone. Seitan aliquip quis cardigan
                        american apparel, voluptate nisi qui.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      <p className="mb-0">
                        Food truck fixie locavore, accusamus mcsweeney&quot;ss marfa
                        nulla single-origin coffee squid. Exercitation +1 labore
                        velit, blog sartorial PBR leggings next level wes
                        anderson artisan four loko farm-to-table craft beer
                        twee. Qui photo booth letterpress, commodo enim craft
                        beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                        PBR. Homo nostrud organic, assumenda labore aesthetic
                        magna delectus.
                      </p>
                    </TabPane>
                    <TabPane tabId="3">
                      <p className="mb-0">
                        Etsy mixtape wayfarers, ethical wes anderson tofu before
                        they sold out mcsweeney&quot;ss organic lomo retro fanny pack
                        lo-fi farm-to-table readymade. Messenger bag gentrify
                        pitchfork tattooed craft beer, iphone skateboard
                        locavore carles etsy salvia banksy hoodie helvetica. DIY
                        synth PBR banksy irony. Leggings gentrify squid 8-bit
                        cred pitchfork. Williamsburg banh mi whatever
                        gluten-free carles.
                      </p>
                    </TabPane>
                    <TabPane tabId="4">
                      <p className="mb-0">
                        Trust fund seitan letterpress, keytar raw denim keffiyeh
                        etsy art party before they sold out master cleanse
                        gluten-free squid scenester freegan cosby sweater. Fanny
                        pack portland seitan DIY, art party locavore wolf cliche
                        high life echo park Austin. Cred vinyl keffiyeh DIY
                        salvia PBR, banh mi before they sold out farm-to-table
                        VHS viral locavore cosby sweater viral, mustache
                        readymade keffiyeh craft.
                      </p>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6} className="col-xxl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Nav Tabs Justify</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Nav tabs justified>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navJustifyTab === "1" })}
                        onClick={() => { navJustifyTabtoggle("1"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Home</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navJustifyTab === "2" })}
                        onClick={() => { navJustifyTabtoggle("2"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">Profile</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navJustifyTab === "3" })}
                        onClick={() => { navJustifyTabtoggle("3"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-envelope"></i>
                        </span>
                        <span className="d-none d-sm-block">Messages</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: navJustifyTab === "4" })}
                        onClick={() => { navJustifyTabtoggle("4"); }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-cog"></i>
                        </span>
                        <span className="d-none d-sm-block">Settings</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={navJustifyTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <p className="mb-0">
                        Raw denim you probably haven&quot;t heard of them jean shorts
                        Austin. Nesciunt tofu stumptown aliqua, retro synth
                        master cleanse. Mustache cliche tempor, williamsburg
                        carles vegan helvetica. Reprehenderit butcher retro
                        keffiyeh dreamcatcher synth. Cosby sweater eu banh mi,
                        qui irure terry richardson ex squid. Aliquip placeat
                        salvia cillum iphone.
                      </p>
                    </TabPane>
                    <TabPane tabId="2">
                      Food truck fixie locavore, accusamus mcsweeney&quot;ss marfa
                      nulla single-origin coffee squid. Exercitation +1 labore
                      velit, blog sartorial PBR leggings next level wes
                      anderson artisan four loko farm-to-table craft beer
                      twee. Qui photo booth letterpress, commodo enim craft
                      beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                      PBR.
                    </TabPane>
                    <TabPane tabId="3">
                      Etsy mixtape wayfarers, ethical wes anderson tofu before
                      they sold out mcsweeney&quot;ss organic lomo retro fanny pack
                      lo-fi farm-to-table readymade. Messenger bag gentrify
                      pitchfork tattooed craft beer, iphone skateboard
                      locavore carles etsy salvia banksy hoodie helvetica. DIY
                      synth PBR banksy irony. Leggings squid 8-bit cred
                      pitchfork.
                    </TabPane>
                    <TabPane tabId="4">
                      Trust fund seitan letterpress, keytar raw denim keffiyeh
                      etsy art party before they sold out master cleanse
                      gluten-free squid scenester freegan cosby sweater. Fanny
                      pack portland seitan DIY, art party locavore wolf cliche
                      high life echo park Austin. Cred vinyl keffiyeh DIY
                      salvia PBR, banh mi before they sold out farm-to-table
                      VHS.
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Vertical Nav Left Tabs</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <Nav className="flex-column nav-pills">
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalLeftTab === "1" }, "mb-2")}
                            onClick={() => { verticalLeftTabtoggle("1"); }}
                          >
                            Home
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalLeftTab === "2" }, "mb-2")}
                            onClick={() => { verticalLeftTabtoggle("2"); }}
                          >
                            Profile
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalLeftTab === "3" }, "mb-2")}
                            onClick={() => { verticalLeftTabtoggle("3"); }}
                          >
                            Messages
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalLeftTab === "4" }, "mb-2")}
                            onClick={() => { verticalLeftTabtoggle("4"); }}
                          >
                            Settings
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col>
                    <Col md={9}>
                      <TabContent activeTab={verticalLeftTab} className="text-muted mt-4 mt-md-0">
                        <TabPane tabId="1">
                          <p>
                            Raw denim you probably haven&quot;t heard of them jean
                            shorts Austin. Nesciunt tofu stumptown aliqua, retro
                            synth master cleanse. Mustache cliche tempor,
                            williamsburg carles vegan helvetica. Reprehenderit
                            butcher retro keffiyeh dreamcatcher synth. Cosby
                            sweater eu banh mi, qui irure terry richardson ex
                            squid. Aliquip placeat salvia cillum iphone. Seitan
                            aliquip quis cardigan.
                          </p>
                          <p>
                            Reprehenderit butcher retro keffiyeh dreamcatcher
                            synth. Cosby sweater eu banh mi, qui irure terry
                            richardson ex squid.
                          </p>
                        </TabPane>
                        <TabPane tabId="2">
                          <p>
                            Food truck fixie locavore, accusamus mcsweeney&quot;ss
                            marfa nulla single-origin coffee squid. Exercitation
                            +1 labore velit, blog sartorial PBR leggings next
                            level wes anderson artisan four loko farm-to-table
                            craft beer twee. Qui photo booth letterpress,
                            commodo enim craft beer mlkshk.
                          </p>
                          <p className="mb-0">
                            {" "}
                            Qui photo booth letterpress, commodo enim craft beer
                            mlkshk aliquip jean shorts ullamco ad vinyl cillum
                            PBR. Homo nostrud organic, assumenda labore
                            aesthetic magna 8-bit
                          </p>
                        </TabPane>
                        <TabPane tabId="3">
                          <p>
                            Etsy mixtape wayfarers, ethical wes anderson tofu
                            before they sold out mcsweeney&quot;ss organic lomo retro
                            fanny pack lo-fi farm-to-table readymade. Messenger
                            bag gentrify pitchfork tattooed craft beer, iphone
                            skateboard locavore carles etsy salvia banksy hoodie
                            helvetica. DIY synth PBR banksy irony. Leggings
                            gentrify squid 8-bit cred.
                          </p>
                          <p className="mb-0">
                            DIY synth PBR banksy irony. Leggings gentrify squid
                            8-bit cred pitchfork. Williamsburg banh mi whatever
                            gluten-free.
                          </p>
                        </TabPane>
                        <TabPane tabId="4">
                          <p>
                            Trust fund seitan letterpress, keytar raw denim
                            keffiyeh etsy art party before they sold out master
                            cleanse gluten-free squid scenester freegan cosby
                            sweater. Fanny pack portland seitan DIY, art party
                            locavore wolf cliche high life echo park Austin.
                            Cred vinyl keffiyeh DIY salvia PBR, banh mi before
                            they sold out farm-to-table.
                          </p>
                          <p className="mb-0">
                            Fanny pack portland seitan DIY, art party locavore
                            wolf cliche high life echo park Austin. Cred vinyl
                            keffiyeh DIY salvia PBR, banh mi before they sold
                            out farm-to-table.
                          </p>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Vertical Nav Right Tabs</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={9}>
                      <TabContent activeTab={verticalRightTab}>
                        <TabPane tabId="1">
                          <p>
                            Raw denim you probably haven&quot;t heard of them jean
                            shorts Austin. Nesciunt tofu stumptown aliqua, retro
                            synth master cleanse. Mustache cliche tempor,
                            williamsburg carles vegan helvetica. Reprehenderit
                            butcher retro keffiyeh dreamcatcher synth. Cosby
                            sweater eu banh mi, qui irure terry richardson ex
                            squid. Aliquip placeat salvia cillum iphone. Seitan
                            aliquip quis cardigan.
                          </p>
                          <p>
                            Reprehenderit butcher retro keffiyeh dreamcatcher
                            synth. Cosby sweater eu banh mi, qui irure terry
                            richardson ex squid.
                          </p>
                        </TabPane>
                        <TabPane tabId="2">
                          <p>
                            Food truck fixie locavore, accusamus mcsweeney&quot;ss
                            marfa nulla single-origin coffee squid. Exercitation
                            +1 labore velit, blog sartorial PBR leggings next
                            level wes anderson artisan four loko farm-to-table
                            craft beer twee. Qui photo booth letterpress,
                            commodo enim craft beer mlkshk.
                          </p>
                          <p className="mb-0">
                            {" "}
                            Qui photo booth letterpress, commodo enim craft beer
                            mlkshk aliquip jean shorts ullamco ad vinyl cillum
                            PBR. Homo nostrud organic, assumenda labore
                            aesthetic magna 8-bit
                          </p>
                        </TabPane>
                        <TabPane tabId="3">
                          <p>
                            Etsy mixtape wayfarers, ethical wes anderson tofu
                            before they sold out mcsweeney&quot;ss organic lomo retro
                            fanny pack lo-fi farm-to-table readymade. Messenger
                            bag gentrify pitchfork tattooed craft beer, iphone
                            skateboard locavore carles etsy salvia banksy hoodie
                            helvetica. DIY synth PBR banksy irony. Leggings
                            gentrify squid 8-bit cred.
                          </p>
                          <p className="mb-0">
                            DIY synth PBR banksy irony. Leggings gentrify squid
                            8-bit cred pitchfork. Williamsburg banh mi whatever
                            gluten-free.
                          </p>
                        </TabPane>
                        <TabPane tabId="4">
                          <p>
                            Trust fund seitan letterpress, keytar raw denim
                            keffiyeh etsy art party before they sold out master
                            cleanse gluten-free squid scenester freegan cosby
                            sweater. Fanny pack portland seitan DIY, art party
                            locavore wolf cliche high life echo park Austin.
                            Cred vinyl keffiyeh DIY salvia PBR, banh mi before
                            they sold out farm-to-table.
                          </p>
                          <p className="mb-0">
                            Fanny pack portland seitan DIY, art party locavore
                            wolf cliche high life echo park Austin. Cred vinyl
                            keffiyeh DIY salvia PBR, banh mi before they sold
                            out farm-to-table.
                          </p>
                        </TabPane>
                      </TabContent>
                    </Col>

                    <Col md={3}>
                      <Nav pills className="flex-column">
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalRightTab === "1" }, "mb-2")}
                            onClick={() => { verticalRightTabtoggle("1"); }}
                          >
                            Home
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalRightTab === "2" }, "mb-2")}
                            onClick={() => { verticalRightTabtoggle("2"); }}
                          >
                            Profile
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalRightTab === "3" }, "mb-2")}
                            onClick={() => { verticalRightTabtoggle("3"); }}
                          >
                            Messages
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: verticalRightTab === "4" }, "mb-2")}
                            onClick={() => { verticalRightTabtoggle("4"); }}
                          >
                            Settings
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <div className="col-xl-4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Default Collapse</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2 align-items-start mb-3">
                    <Link
                      to="#"
                      onClick={t_col5}
                      style={{ cursor: "pointer" }}
                      className="btn btn-primary mo-mb-2"
                    >
                      Link with href{" "}
                    </Link>
                    <button
                      onClick={t_col5}
                      className="btn btn-primary mo-mb-2"
                      type="button"
                      style={{ cursor: "pointer" }}
                    >
                      Button with data-target
                    </button>
                  </div>
                  <Collapse isOpen={col5}>
                    <Card className="card-body mb-0">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                    </Card>
                  </Collapse>
                </CardBody>
              </Card>
            </div>

            <div className="col-xl-8">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Multiple Targets</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2 align-items-start mb-3">
                    <Link
                      to="#"
                      onClick={t_col6}
                      style={{ cursor: "pointer" }}
                      className="btn btn-primary"
                    >
                      Toggle first element
                    </Link>
                    <button
                      onClick={t_col7}
                      className="btn btn-primary"
                      type="button"
                      style={{ cursor: "pointer" }}
                    >
                      Toggle second element
                    </button>

                    <button
                      onClick={t_col8}
                      className="btn btn-primary"
                      type="button"
                      style={{ cursor: "pointer" }}
                    >
                      Toggle both elements
                    </button>
                  </div>
                  <Row>
                    <div className="col">
                      <Collapse isOpen={col6} className="multi-collapse">
                        <div className="card card-body mb-0">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. Nihil anim
                          keffiyeh helvetica, craft beer labore wes anderson
                          cred nesciunt sapiente ea proident.
                        </div>
                      </Collapse>
                    </div>

                    <div className="col">
                      <Collapse isOpen={col7}>
                        <Card className="card-body mb-0">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid.Nihil anim
                          keffiyeh helvetica, craft beer labore wes anderson
                          cred nesciunt sapiente ea proident.
                        </Card>
                      </Collapse>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Accordion Example</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className={classnames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !col1 }
                          )}
                          type="button"
                          onClick={t_col1}
                          style={{ cursor: "pointer" }}
                        >
                          Accordion Item #1
                        </button>
                      </h2>
                      <Collapse isOpen={col1} className="accordion-collapse">
                        <div className="accordion-body">
                          <strong>This is the first item&quot;s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It&quot;s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </Collapse>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          className={classnames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !col2 }
                          )}
                          type="button"
                          onClick={t_col2}
                          style={{ cursor: "pointer" }}
                        >
                          Accordion Item #2
                        </button>
                      </h2>
                      <Collapse isOpen={col2} className="accordion-collapse">
                        <div className="accordion-body">
                          <strong>This is the second item&quot;s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It&quot;s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </Collapse>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          className={classnames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !col3 }
                          )}
                          type="button"
                          onClick={t_col3}
                          style={{ cursor: "pointer" }}
                        >
                          Accordion Item #3
                        </button>
                      </h2>
                      <Collapse isOpen={col3} className="accordion-collapse">
                        <div className="accordion-body">
                          <strong>This is the third item&quot;s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It&quot;s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Accordion Example Flush</h4>
                  <Link
                    to="//reactstrap.github.io/components/tabs/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingOne">
                        <button
                          className={classnames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !col9 }
                          )}
                          type="button"
                          onClick={t_col9}
                          style={{ cursor: "pointer" }}
                        >
                          Accordion Item #1
                        </button>
                      </h2>
                      <Collapse
                        isOpen={col9}
                        className="accordion-collapse"
                      >
                        <div className="accordion-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. 3 wolf moon
                          officia aute, non cupidatat skateboard dolor brunch.
                          Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                          wolf moon tempor, sunt aliqua put a bird on it squid
                          single-origin coffee nulla assumenda shoreditch et.
                          Nihil anim keffiyeh helvetica, craft beer labore wes
                          anderson cred nesciunt sapiente ea proident. Ad vegan
                          excepteur butcher vice lomo. Leggings occaecat craft
                          beer farm-to-table, raw denim aesthetic synth nesciunt
                          you probably haven&quot;t heard of them accusamus labore
                          sustainable VHS.
                        </div>
                      </Collapse>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingTwo">
                        <button
                          className={classnames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !col10 }
                          )}
                          type="button"
                          onClick={t_col10}
                          style={{ cursor: "pointer" }}
                        >
                          Accordion Item #2
                        </button>
                      </h2>
                      <Collapse
                        isOpen={col10}
                        className="accordion-collapse"
                      >
                        <div className="accordion-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. 3 wolf moon
                          officia aute, non cupidatat skateboard dolor brunch.
                          Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                          wolf moon tempor, sunt aliqua put a bird on it squid
                          single-origin coffee nulla assumenda shoreditch et.
                          Nihil anim keffiyeh helvetica, craft beer labore wes
                          anderson cred nesciunt sapiente ea proident. Ad vegan
                          excepteur butcher vice lomo. Leggings occaecat craft
                          beer farm-to-table, raw denim aesthetic synth nesciunt
                          you probably haven&quot;t heard of them accusamus labore
                          sustainable VHS.
                        </div>
                      </Collapse>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingThree">
                        <button
                          className={classnames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !col11 }
                          )}
                          type="button"
                          onClick={t_col11}
                          style={{ cursor: "pointer" }}
                        >
                          Accordion Item #3
                        </button>
                      </h2>
                      <Collapse
                        isOpen={col11}
                        className="accordion-collapse"
                      >
                        <div className="accordion-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. 3 wolf moon
                          officia aute, non cupidatat skateboard dolor brunch.
                          Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                          wolf moon tempor, sunt aliqua put a bird on it squid
                          single-origin coffee nulla assumenda shoreditch et.
                          Nihil anim keffiyeh helvetica, craft beer labore wes
                          anderson cred nesciunt sapiente ea proident. Ad vegan
                          excepteur butcher vice lomo. Leggings occaecat craft
                          beer farm-to-table, raw denim aesthetic synth nesciunt
                          you probably haven&quot;t heard of them accusamus labore
                          sustainable VHS.
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container >
      </div >
    </React.Fragment >
  );
};

export default UiTabsAccordions;
