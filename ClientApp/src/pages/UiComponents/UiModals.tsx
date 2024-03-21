import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  Container,
  CardHeader,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Tooltip,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiModal = () => {
  const [modal_standard, setmodal_standard] = useState(false);
  const [modal_large, setmodal_large] = useState(false);
  const [modal_xlarge, setmodal_xlarge] = useState(false);
  const [modal_small, setmodal_small] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [modal_fullscreen, setmodal_fullscreen] = useState(false);
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [toggle_between_modal, settoggle_between_modal] = useState(false);
  const [toggle_between_modal1, settoggle_between_modal1] = useState(false);
  const [tooltip_modal, settooltip_modal] = useState(false);
  const [popovertop, setpopovertop] = useState(false);
  const [ttop, setttop] = useState(false);
  const [ttop1, setttop1] = useState(false);


  function tog_between_modal() {
    settoggle_between_modal1(false);
    settoggle_between_modal(!toggle_between_modal);
    removeBodyCss();
  }

  function tog_between_modal1() {
    settoggle_between_modal(false);
    settoggle_between_modal1(!toggle_between_modal1);
    removeBodyCss();
  }

  function tog_tooltip_modal() {
    settooltip_modal(!tooltip_modal);
    removeBodyCss();
  }

  function tog_standard() {
    setmodal_standard(!modal_standard);
    removeBodyCss();
  }

  function tog_fullscreen() {
    setmodal_fullscreen(!modal_fullscreen);
    removeBodyCss();
  }

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop);
    removeBodyCss();
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }

  function tog_xlarge() {
    setmodal_xlarge(!modal_xlarge);
    removeBodyCss();
  }

  function tog_small() {
    setmodal_small(!modal_small);
    removeBodyCss();
  }

  function tog_center() {
    setmodal_center(!modal_center);
    removeBodyCss();
  }

  function tog_scroll() {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  }


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Modals" />

          <Row>
            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Default Modals</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        tog_standard();
                      }}
                      className="btn btn-primary"
                      data-toggle="modal"
                      data-target="#myModal"
                    >
                      Standard Modal
                    </button>
                    <Modal
                      isOpen={modal_standard}
                      toggle={() => {
                        tog_standard();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title" id="myModalLabel">
                          Modal Heading
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setmodal_standard(false);
                          }}
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <h5>Overflowing text to show scroll behavior</h5>
                        <p>Cras mattis consectetur purus sit amet fermentum.
                          Cras justo odio, dapibus ac facilisis in,
                          egestas eget quam. Morbi leo risus, porta ac
                          consectetur ac, vestibulum at eros.</p>
                        <p>Praesent commodo cursus magna, vel scelerisque
                          nisl consectetur et. Vivamus sagittis lacus vel
                          augue laoreet rutrum faucibus dolor auctor.</p>
                        <p>Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque
                          nisl consectetur et. Donec sed odio dui. Donec
                          ullamcorper nulla non metus auctor
                          fringilla.</p>
                        <p>Cras mattis consectetur purus sit amet fermentum.
                          Cras justo odio, dapibus ac facilisis in,
                          egestas eget quam. Morbi leo risus, porta ac
                          consectetur ac, vestibulum at eros.</p>
                        <p>Praesent commodo cursus magna, vel scelerisque
                          nisl consectetur et. Vivamus sagittis lacus vel
                          augue laoreet rutrum faucibus dolor auctor.</p>
                        <p>Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque
                          nisl consectetur et. Donec sed odio dui. Donec
                          ullamcorper nulla non metus auctor
                          fringilla.</p>
                        <p>Cras mattis consectetur purus sit amet fermentum.
                          Cras justo odio, dapibus ac facilisis in,
                          egestas eget quam. Morbi leo risus, porta ac
                          consectetur ac, vestibulum at eros.</p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            tog_standard();
                          }}
                          className="btn btn-light"
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary">
                          Save changes
                        </button>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Vertically Centered</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      tog_center();
                    }}
                    data-toggle="modal"
                    data-target=".bs-example-modal-center"
                  >
                    Center modal
                  </button>
                  <Modal
                    isOpen={modal_center}
                    toggle={() => {
                      tog_center();
                    }}
                    centered={true}
                  >
                    <div className="modal-header">
                      <h5 className="modal-title mt-0">Center Modal</h5>
                      <button
                        type="button"
                        onClick={() => {
                          setmodal_center(false);
                        }}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p className="mb-0">
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>
                    </div>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Scrollable Modal</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <button
                    type="button"
                    className="btn btn-primary "
                    onClick={() => {
                      tog_scroll();
                    }}
                    data-toggle="modal"
                  >
                    Scrollable modal
                  </button>
                  <Modal
                    isOpen={modal_scroll}
                    toggle={() => {
                      tog_scroll();
                    }}
                    scrollable={true}
                  >
                    <div className="modal-header">
                      <h5 className="modal-title mt-0">Scrollable modal</h5>
                      <button
                        type="button"
                        onClick={() => setmodal_scroll(false)}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p>
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p>
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p>
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p>
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p>
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>
                      <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras
                        justo odio, dapibus ac facilisis in, egestas eget
                        quam. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros.
                      </p>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Vivamus sagittis lacus vel augue
                        laoreet rutrum faucibus dolor auctor.
                      </p>
                      <p>
                        Aenean lacinia bibendum nulla sed consectetur.
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Donec sed odio dui. Donec ullamcorper
                        nulla non metus auctor fringilla.
                      </p>

                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setmodal_scroll(false)}
                      >
                        Close
                      </button>
                      <button type="button" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Static Backdrop</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <button
                    type="button"
                    className="btn btn-primary "
                    onClick={() => {
                      tog_backdrop();
                    }}
                    data-toggle="modal"
                  >
                    Static backdrop modal
                  </button>
                  <Modal
                    isOpen={modal_backdrop}
                    toggle={() => {
                      tog_backdrop();
                    }}
                    backdrop={"static"}
                    id="staticBackdrop"
                  >
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Modal title
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setmodal_backdrop(false);
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>
                        I will not close if you click outside me. Don&apos;t even
                        try to press escape key.
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => {
                          setmodal_backdrop(false);
                        }}
                      >
                        Close
                      </button>
                      <button type="button" className="btn btn-primary">
                        Understood
                      </button>
                    </div>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Toggle Between Modals</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <button
                    type="button"
                    onClick={() => {
                      tog_between_modal();
                    }}
                    className="btn btn-primary "
                  >
                    Open First Modal
                  </button>
                  <div>
                    <Modal
                      isOpen={toggle_between_modal}
                      toggle={() => {
                        tog_between_modal();
                      }}>
                      <div className="modal-header">
                        <h5 className="modal-title">Modal 1</h5>
                        <button type="button" className="btn-close"
                          onClick={() => {
                            settoggle_between_modal(false);
                            
                          }}></button>
                      </div>
                      <div className="modal-body">
                        <p>Show a second modal and hide this one with the button below.</p>
                      </div>
                      <div className="modal-footer">

                        <button className="btn btn-primary"
                          onClick={() => {
                            tog_between_modal1();
                          }}>Open Second
                          Modal</button>
                      </div>
                    </Modal>

                    <Modal
                      isOpen={toggle_between_modal1}
                      toggle={() => {
                        tog_between_modal1();
                      }}>
                      <div className="modal-header">
                        <h5 className="modal-title">Modal 2</h5>
                        <button type="button" className="btn-close"
                          onClick={() => {
                            settoggle_between_modal1(false);
                          }}></button>
                      </div>
                      <div className="modal-body">
                        <p>Hide this modal and show the first with the button below.</p>
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-primary"
                          onClick={() => {
                            tog_between_modal();
                          }}>Back to
                          First</button>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Tooltips and Popovers</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <button
                    type="button"
                    onClick={() => {
                      tog_tooltip_modal();
                    }}
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target=".bs-example-modal-demo"
                  >
                    Launch demo modal
                  </button>
                  <Modal
                    isOpen={tooltip_modal}
                    toggle={() => {
                      tog_tooltip_modal();
                    }}>
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalPopoversLabel">Modal title</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          settooltip_modal(false);
                        }}
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <h5>Popover in a modal</h5>
                      <p>This{" "}
                        <Button
                          id="Popovertop"
                          color="secondary"
                          onClick={() => {
                            setpopovertop(!popovertop);
                          }}
                          className="popover-test"
                        >
                          Button
                        </Button>{" "}
                        <Popover
                          placement="right"
                          isOpen={popovertop}
                          target="Popovertop"
                          toggle={() => {
                            setpopovertop(!popovertop);
                          }}
                        >
                          <PopoverHeader>Popover Title</PopoverHeader>
                          <PopoverBody>
                            Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
                          </PopoverBody>
                        </Popover>triggers a popover on click.
                      </p>
                      <hr />
                      <h5>Tooltips in a modal</h5>
                      <p>
                        <Tooltip
                          placement="top"
                          isOpen={ttop}
                          target="TooltipTop"
                          toggle={() => {
                            setttop(!ttop);
                          }}
                          className="tooltip-test text-decoration-underline"
                        >
                          Tooltip title
                        </Tooltip>
                        <a
                          type="button"
                          className="btn btn-primary"
                          id="TooltipTop"
                        >
                          {" "}
                          This link
                        </a> and{" "}
                        <Tooltip
                          placement="top"
                          isOpen={ttop1}
                          target="TooltipTop"
                          toggle={() => {
                            setttop1(!ttop1);
                          }}
                          className="tooltip-test text-decoration-underline"
                        >
                          Tooltip title
                        </Tooltip>
                        <a
                          type="button"
                          className="btn btn-primary"
                          id="TooltipTop"
                        >
                          {" "}
                          that link
                        </a> {" "}
                        have tooltips on
                        hover.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          settooltip_modal(false);
                        }}>Close</button>
                      <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4} sm={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Optional Sizes</h4>
                  <Link to="//reactstrap.github.io/components/modals/"
                    target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                      className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          tog_fullscreen();
                        }}
                        className="btn btn-primary"
                        data-toggle="modal"
                      >
                        Fullscreen Modal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          tog_xlarge();
                        }}
                        className="btn btn-info"
                        data-toggle="modal"
                        data-target=".bs-example-modal-xl"
                      >
                        Extra Large Modal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          tog_large();
                        }}
                        className="btn btn-success"
                        data-toggle="modal"
                        data-target=".bs-example-modal-lg"
                      >
                        Large Modal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          tog_small();
                        }}
                        className="btn btn-danger"
                        data-toggle="modal"
                        data-target=".bs-example-modal-sm"
                      >
                        Small Modal
                      </button>
                    </div>

                    <Modal
                      size="xl"
                      isOpen={modal_fullscreen}
                      toggle={() => {
                        tog_fullscreen();
                      }}
                      className="modal-fullscreen"
                    >
                      <div className="modal-header">
                        <h5
                          className="modal-title mt-0"
                          id="exampleModalFullscreenLabel"
                        >
                          Fullscreen Modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_fullscreen(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <h5>Overflowing text to show scroll behavior</h5>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p>
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p>
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            tog_fullscreen();
                          }}
                          className="btn btn-secondary "
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary ">
                          Save changes
                        </button>
                      </div>
                    </Modal>
                    <Modal
                      size="xl"
                      isOpen={modal_xlarge}
                      toggle={() => {
                        tog_xlarge();
                      }}
                    >
                      <div className="modal-header">
                        <h5
                          className="modal-title mt-0"
                          id="myExtraLargeModalLabel"
                        >
                          Extra large modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_xlarge(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                    <Modal
                      size="lg"
                      isOpen={modal_large}
                      toggle={() => {
                        tog_large();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myLargeModalLabel">
                          Large Modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_large(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                    <Modal
                      size="sm"
                      isOpen={modal_small}
                      toggle={() => {
                        tog_small();
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="mySmallModalLabel">
                          Small Modal
                        </h5>
                        <button
                          onClick={() => {
                            setmodal_small(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras
                          justo odio, dapibus ac facilisis in, egestas eget
                          quam. Morbi leo risus, porta ac consectetur ac,
                          vestibulum at eros.
                        </p>
                        <p>
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Vivamus sagittis lacus vel augue
                          laoreet rutrum faucibus dolor auctor.
                        </p>
                        <p className="mb-0">
                          Aenean lacinia bibendum nulla sed consectetur.
                          Praesent commodo cursus magna, vel scelerisque nisl
                          consectetur et. Donec sed odio dui. Donec ullamcorper
                          nulla non metus auctor fringilla.
                        </p>
                      </div>
                    </Modal>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiModal;
