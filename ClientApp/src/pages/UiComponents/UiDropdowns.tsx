import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
  Dropdown,
  ButtonDropdown,
  Button,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiDropdowns = () => {
  const [btnDanger1, setBtnDanger1] = useState(false);
  const [drp_primary1, setDrp_primary1] = useState(false);
  const [drp_light, setDrp_light] = useState(false);
  const [drp_secondary1, setDrp_secondary1] = useState(false);
  const [drp_success1, setDrp_success1] = useState(false);
  const [drp_purple, setDrp_purple] = useState(false);
  const [drp_info1, setDrp_info1] = useState(false);
  const [drp_warning1, setDrp_warning1] = useState(false);
  const [drp_danger1, setDrp_danger1] = useState(false);
  const [drp_secondary, setDrp_secondary] = useState(false);
  const [drp_secondary_lg, setDrp_secondary_lg] = useState(false);
  const [drp_secondary_sm, setDrp_secondary_sm] = useState(false);
  const [drp_secondary_sm1, setDrp_secondary_sm1] = useState(false);
  const [dropup1, setDropup1] = useState(false);
  const [drp_up11, setDrp_up11] = useState(false);
  const [info_dropup1, setInfo_dropup1] = useState(false);
  const [infodrp_up11, setInfodrp_up11] = useState(false);
  const [info_dropup111, setInfo_dropup111] = useState(false);
  const [infodrp_up1111, setInfodrp_up1111] = useState(false);
  const [outside, setoutside] = useState(false);
  const [inside, setinside] = useState(false);
  const [manual, setmanual] = useState(false);

  const [btnvariant1, setBtnvariant1] = useState(false);
  const [btnvariant2, setBtnvariant2] = useState(false);
  const [btnvariant3, setBtnvariant3] = useState(false);
  const [btnvariant4, setBtnvariant4] = useState(false);
  const [btnvariant5, setBtnvariant5] = useState(false);
  const [btnvariant6, setBtnvariant6] = useState(false);
  const [btnvariant7, setBtnvariant7] = useState(false);
  const [btnvariant8, setBtnvariant8] = useState(false);
  const [btnvariant9, setBtnvariant9] = useState(false);
  const [drp_menuform, setDrp_menuform] = useState(false);



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Dropdowns" />
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dropdowns Variant</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant1}
                        toggle={() => setBtnvariant1(!btnvariant1)}
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-primary"
                        >
                          Primary <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant2}
                        toggle={() => setBtnvariant2(!btnvariant2)}
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-success"
                        >
                          Success <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant3}
                        toggle={() => setBtnvariant3(!btnvariant3)}
                      >
                        <DropdownToggle tag="button" className="btn btn-purple">
                          Purple <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant4}
                        toggle={() => setBtnvariant4(!btnvariant4)}
                      >
                        <DropdownToggle tag="button" className="btn btn-light">
                          Light <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant5}
                        toggle={() => setBtnvariant5(!btnvariant5)}
                      >
                        <DropdownToggle tag="button" className="btn btn-info">
                          Info <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant6}
                        toggle={() => setBtnvariant6(!btnvariant6)}
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-secondary"
                        >
                          Secondary <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant7}
                        toggle={() => setBtnvariant7(!btnvariant7)}
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-warning"
                        >
                          Warning <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant8}
                        toggle={() => setBtnvariant8(!btnvariant8)}
                      >
                        <DropdownToggle tag="button" className="btn btn-danger">
                          Danger <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="btn-group">
                      <Dropdown
                        isOpen={btnvariant9}
                        toggle={() => setBtnvariant9(!btnvariant9)}
                      >
                        <DropdownToggle tag="button" className="btn btn-dark">
                          Dark <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Separated link</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Split Button Dropdowns</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex gap-2 flex-wrap">
                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_primary1}
                        toggle={() => setDrp_primary1(!drp_primary1)}
                      >
                        <Button id="caret" color="primary">
                          Primary
                        </Button>
                        <DropdownToggle
                          caret
                          color="primary"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_light}
                        toggle={() => setDrp_light(!drp_light)}
                      >
                        <Button id="caret" color="light">
                          Light
                        </Button>
                        <DropdownToggle
                          caret
                          color="light"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_success1}
                        toggle={() => setDrp_success1(!drp_success1)}
                      >
                        <Button id="caret" color="success">
                          Success
                        </Button>
                        <DropdownToggle
                          caret
                          color="success"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_purple}
                        toggle={() => setDrp_purple(!drp_purple)}
                      >
                        <Button id="caret" color="purple">
                          Purple
                        </Button>
                        <DropdownToggle
                          caret
                          color="purple"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_info1}
                        toggle={() => setDrp_info1(!drp_info1)}
                      >
                        <Button id="caret" color="info">
                          Info
                        </Button>
                        <DropdownToggle
                          caret
                          color="info"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_warning1}
                        toggle={() => setDrp_warning1(!drp_warning1)}
                      >
                        <Button id="caret" color="warning">
                          Warning
                        </Button>
                        <DropdownToggle
                          caret
                          color="warning"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_danger1}
                        toggle={() => setDrp_danger1(!drp_danger1)}
                      >
                        <Button id="caret" color="danger">
                          Danger
                        </Button>
                        <DropdownToggle
                          caret
                          color="danger"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_secondary1}
                        toggle={() => setDrp_secondary1(!drp_secondary1)}
                      >
                        <Button id="caret" color="secondary">
                          Secondary
                        </Button>
                        <DropdownToggle
                          caret
                          color="secondary"
                          className="dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dropdown Buttons Sizing</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <ButtonDropdown
                      isOpen={drp_secondary}
                      toggle={() => setDrp_secondary(!drp_secondary)}
                    >
                      <DropdownToggle
                        caret
                        color="primary"
                        className="btn btn-primary btn-lg"
                      >
                        Large button <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_secondary_lg}
                        toggle={() => setDrp_secondary_lg(!drp_secondary_lg)}
                      >
                        <Button className="btn btn-light btn-lg">
                          {" "}
                          Large split button
                        </Button>
                        <DropdownToggle
                          caret
                          color="light"
                          className="btn btn-light btn-lg dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>

                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_secondary_sm}
                        toggle={() => setDrp_secondary_sm(!drp_secondary_sm)}
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          className="btn btn-primary btn-sm"
                        >
                          Small button <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                    <div className="btn-group">
                      <ButtonDropdown
                        isOpen={drp_secondary_sm1}
                        toggle={() => setDrp_secondary_sm1(!drp_secondary_sm1)}
                      >
                        <Button className="btn btn-light btn-sm">
                          {" "}
                          Small split button
                        </Button>
                        <DropdownToggle
                          caret
                          color="light"
                          className="btn btn-light btn-sm dropdown-toggle-split"
                        >
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Single Buttons Dropdowns</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col sm={6}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className="btn btn-primary"
                          type="button"
                          tag="a"
                        >
                          Dropdown button{" "}
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem to="#">Action</DropdownItem>
                          <DropdownItem to="#">Another action</DropdownItem>
                          <DropdownItem to="#">
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>

                    <Col sm={6}>
                      <UncontrolledDropdown className="mt-4 mt-sm-0">
                        <DropdownToggle tag="a" className="btn btn-light">
                          Dropdown link <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>

                        <DropdownMenu>
                          <DropdownItem to="#">Action</DropdownItem>
                          <DropdownItem to="#">Another action</DropdownItem>
                          <DropdownItem to="#">
                            Something else here
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Menu Alignment</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="btn-group">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        type="button"
                        className="btn btn-secondary"
                        tag="a"
                      >
                        Menu is right-aligned{" "}
                        <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem to="#">Action</DropdownItem>
                        <DropdownItem to="#">Another action</DropdownItem>
                        <DropdownItem to="#">Something else here</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dropup Variation</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Dropdown
                      isOpen={dropup1}
                      toggle={() => setDropup1(!dropup1)}
                    >
                      <DropdownToggle type="button" className="btn btn-light">
                        Dropup <i className="mdi mdi-chevron-up"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem to="#">Action</DropdownItem>
                        <DropdownItem to="#">Another action</DropdownItem>
                        <DropdownItem to="#">Something else here</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem to="#">Separated link</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <ButtonDropdown
                      isOpen={drp_up11}
                      toggle={() => setDrp_up11(!drp_up11)}
                    >
                      <Button id="caret" color="light" tag="a">
                        Split dropup
                      </Button>
                      <DropdownToggle
                        caret
                        color="light"
                        className="dropdown-toggle-split"
                      >
                        <i className="mdi mdi-chevron-up" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dropright Variation</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Dropdown
                      isOpen={info_dropup1}
                      className="btn-group dropend"
                      toggle={() => setInfo_dropup1(!info_dropup1)}
                    >
                      <DropdownToggle className="btn btn-light" caret>
                        Dropright <i className="mdi mdi-chevron-right" />
                      </DropdownToggle>
                      <DropdownMenu data-popper-placement="right-start">
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <ButtonDropdown
                      isOpen={infodrp_up11}
                      className="btn-group dropend"
                      toggle={() => setInfodrp_up11(!infodrp_up11)}
                    >
                      <Button id="caret" color="light">
                        Split dropend
                      </Button>
                      <DropdownToggle
                        caret
                        color="light"
                        className="dropdown-toggle-split"
                      >
                        <i className="mdi mdi-chevron-right" />
                      </DropdownToggle>
                      <DropdownMenu data-popper-placement="right-start">
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dropleft Variation</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Dropdown
                      isOpen={info_dropup111}
                      className="btn-group dropstart"
                      toggle={() => setInfo_dropup111(!info_dropup111)}
                    >
                      <DropdownToggle className="btn btn-light">
                        <i className="mdi mdi-chevron-left" /> Dropleft
                      </DropdownToggle>
                      <DropdownMenu data-popper-placement="left-start">
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <ButtonDropdown
                      isOpen={infodrp_up1111}
                      className="btn-group dropstart"
                      toggle={() => setInfodrp_up1111(!infodrp_up1111)}
                    >
                      <DropdownToggle
                        caret
                        color="light"
                        className="dropdown-toggle-split"
                      >
                        <i className="mdi mdi-chevron-left" />
                      </DropdownToggle>
                      <Button id="caret" color="light">
                        Split Dropstart
                      </Button>
                      <DropdownMenu data-popper-placement="left-start">
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dropdown Menu Dark</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Dropdown
                    isOpen={btnDanger1}
                    toggle={() => setBtnDanger1(!btnDanger1)}
                  >
                    <DropdownToggle tag="button" className="btn btn-secondary">
                      Dropdown button <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Responsive Right Alignment</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="btn-group">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        type="button"
                        className="btn btn-secondary"
                        tag="a"
                      >
                        Left-aligned but right aligned when large screen{" "}
                        <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-lg-end">
                        <DropdownItem to="#">Action</DropdownItem>
                        <DropdownItem to="#">Another action</DropdownItem>
                        <DropdownItem to="#">Something else here</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Responsive Left Alignment</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="btn-group">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        type="button"
                        className="btn btn-secondary"
                        tag="a"
                      >
                        Right-aligned but left aligned when large screen{" "}
                        <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end dropdown-menu-lg-start">
                        <DropdownItem to="#">Action</DropdownItem>
                        <DropdownItem to="#">Another action</DropdownItem>
                        <DropdownItem to="#">Something else here</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Auto Close Outside Behavior</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <div className="btn-group">
                      <Dropdown
                        isOpen={outside}
                        toggle={() => setoutside(!outside)}
                      >
                        <DropdownToggle tag="button" className="btn btn-light">
                          Clickable outside{" "}
                          <i className="mdi mdi-chevron-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Auto Close Inside Behavior</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="btn-group">
                    <Dropdown isOpen={inside} toggle={() => setinside(!inside)}>
                      <DropdownToggle tag="button" className="btn btn-light">
                        Clickable inside <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Manual Close</h4>
                  <Link
                    to="//reactstrap.github.io/components/button-dropdown/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Dropdown isOpen={manual} toggle={() => setmanual(!manual)}>
                    <DropdownToggle tag="button" className="btn btn-light">
                      Manual close <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Menu Content Forms</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/dropdowns/#forms"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <ButtonDropdown
                    isOpen={drp_menuform}
                    toggle={() => setDrp_menuform(!drp_menuform)}
                    className="dropdown-toggle"
                  >
                    <DropdownToggle color="light">
                      Dropdown form <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-md p-4">
                      <form>
                        <div className="mb-2">
                          <label
                            className="form-label"
                            htmlFor="exampleDropdownFormEmail"
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="exampleDropdownFormEmail"
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="mb-2">
                          <label
                            className="form-label"
                            htmlFor="exampleDropdownFormPassword"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="exampleDropdownFormPassword"
                            placeholder="Password"
                          />
                        </div>
                        <div className="mb-2">
                          <div className="form-check custom-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="rememberdropdownCheck"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="rememberdropdownCheck"
                            >
                              Remember me
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Sign in
                        </button>
                      </form>
                    </DropdownMenu>
                  </ButtonDropdown>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiDropdowns;
