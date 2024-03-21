import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  CardHeader,
  CardGroup,
  CardColumns,
  CardImg,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

//import images
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img7 from "../../assets/images/small/img-7.jpg";
import img6 from "../../assets/images/small/img-6.jpg";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiCard = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Ui Elements" breadcrumbItem="Cards" />
          <Row>
            <Col md={6} xl={3}>
              <Card>
                <img className="card-img-top img-fluid" src={img1} alt="" />
                <CardBody>
                  <h4 className="card-title mb-2">Card title</h4>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                  <Link to="#" className="btn btn-primary">
                    Button
                  </Link>
                </CardBody>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card>
                <img className="card-img-top img-fluid" src={img2} alt="" />
                <CardBody>
                  <h4 className="card-title mb-2">Card title</h4>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Cras justo odio</li>
                  <li className="list-group-item">Dapibus ac facilisis in</li>
                </ul>
                <CardBody>
                  <Link to="#" className="card-link">
                    Card link
                  </Link>{" "}
                  <Link to="#" className="card-link">
                    Another link
                  </Link>
                </CardBody>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card>
                <img className="card-img-top img-fluid" src={img3} alt="" />
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-2">Card title</h4>
                  <h6 className="card-subtitle text-muted">
                    Support card subtitle
                  </h6>
                </CardBody>
                <img className="img-fluid" src={img4} alt="" />
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                  <Link to="#" className="card-link">
                    Card link
                  </Link>{" "}
                  <Link to="#" className="card-link">
                    Another link
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Using Grid Markup
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col md={6}>
                  <Card className="card-body">
                    <h3 className="card-title mb-1">Special title treatment</h3>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <Link to="#" className="btn btn-primary">
                      Go somewhere
                    </Link>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="card-body">
                    <h3 className="card-title mb-1">Special title treatment</h3>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                    <Link to="#" className="btn btn-primary">
                      Go somewhere
                    </Link>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Card Text Alignment
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col lg={4}>
                  <Card>
                    <CardBody>
                      <h4 className="card-title mb-1">
                        Special title treatment
                      </h4>
                      <CardText>
                        With supporting text below as a natural lead-in to
                        additional content.
                      </CardText>
                      <Link
                        to="#"
                        className="btn btn-primary waves-effect waves-light w-100"
                      >
                        Go somewhere
                      </Link>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card>
                    <CardBody className="text-center">
                      <h4 className="card-title mb-1">
                        Special title treatment
                      </h4>
                      <CardText>
                        With supporting text below as a natural lead-in to
                        additional content.
                      </CardText>
                      <Link
                        to="#"
                        className="btn btn-primary waves-effect waves-light w-100"
                      >
                        Go somewhere
                      </Link>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card>
                    <CardBody className="text-end">
                      <h4 className="card-title mb-1">
                        Special title treatment
                      </h4>
                      <CardText>
                        With supporting text below as a natural lead-in to
                        additional content.
                      </CardText>
                      <Link
                        to="#"
                        className="btn btn-primary waves-effect waves-light w-100"
                      >
                        Go somewhere
                      </Link>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Card Header and Footer
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col lg={4}>
                  <Card>
                    <h4 className="card-header">Featured</h4>
                    <CardBody>
                      <h4 className="card-title mb-1">
                        Special title treatment
                      </h4>
                      <CardText>
                        With supporting text below as a natural lead-in to
                        additional content.
                      </CardText>
                      <Link to="#" className="btn btn-primary">
                        Go somewhere
                      </Link>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card>
                    <div className="card-header">Featured</div>
                    <CardBody>
                      <h4 className="card-title mb-1">
                        Special title treatment
                      </h4>
                      <CardText>
                        With supporting text below as a natural lead-in to
                        additional content.
                      </CardText>
                    </CardBody>
                    <div className="card-footer text-muted">2 days ago</div>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card>
                    <div className="card-header">Quote</div>
                    <CardBody>
                      <blockquote className="card-blockquote mb-0">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Integer posuere erat a ante.
                        </p>
                        <footer className="blockquote-footer mt-0 font-size-12 mt-0">
                          Someone famous in{" "}
                          <cite title="Source Title">Source Title</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <div className="card-header">
                  <h4 className="card-title mb-0">Basic Card</h4>
                </div>
                <CardBody>
                  <p className="text-muted">
                    Nemo enim ipsam voluptatem quia voluptas site that
                    aspernatur aut odit aut fugit sed quia consequunture magni
                    that is dolores qui ratione voluptateme sequiit nesciunte
                    eque porro quisquam.
                  </p>
                  <p className="text-muted mb-0">
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum.
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <div className="card-header">
                  <h4 className="card-title mb-1">Card Sub Title</h4>
                  <p className="card-text text-muted mb-0 text-muted">
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </p>
                </div>
                <CardBody>
                  <p className="text-muted mb-0">
                    Nemo enim ipsam voluptatem quia voluptas site that
                    aspernatur aut odit aut fugit sed quia consequunture magni
                    that is dolores qui ratione voluptateme sequiit nesciunte
                    eque porroquaerat that dolores eos qui voluptatem.
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <div className="card-header">
                  <h4 className="card-title mb-0">
                    <i className="mdi mdi-emoticon-wink-outline me-1"></i> Icon
                    In Heading
                  </h4>
                </div>
                <CardBody>
                  <p className="text-muted mb-0">
                    Nemo enim ipsam voluptatem quia voluptas site that
                    aspernatur aut odit aut voluptas site that aspernatur aut
                    odit aut fugit sed quia consequunture magni that is dolores
                    fugit sed quia quaerat that dolores eos qui voluptatem.
                  </p>
                </CardBody>
                <div className="card-footer">
                  <p className="text-muted mb-0">Card Footer</p>
                </div>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Navigation
                </h5>
                <Link
                  to="https://getbootstrap.com/docs/5.2/components/card/#navigation"
                  target="_blank"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col xl="6">
                  <div className="text-center">
                    <Card>
                      <CardHeader>
                        <Nav tabs className="nav nav-tabs card-header-tabs">
                          <NavItem>
                            <NavLink active>Active</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink>Link</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink disabled>Disabled</NavLink>
                          </NavItem>
                        </Nav>
                      </CardHeader>
                      <CardBody>
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">
                          With supporting text below as a natural lead-in to
                          additional content.
                        </p>
                        <Link to="#" className="btn btn-primary">
                          Go somewhere
                        </Link>
                      </CardBody>
                    </Card>
                  </div>
                </Col>

                <Col xl="6">
                  <div className="text-center">
                    <Card>
                      <CardHeader>
                        <Nav className="nav nav-pills card-header-pills">
                          <NavItem>
                            <NavLink active>Active</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink>Link</NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink disabled>Disabled</NavLink>
                          </NavItem>
                        </Nav>
                      </CardHeader>
                      <CardBody>
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">
                          With supporting text below as a natural lead-in to
                          additional content.
                        </p>
                        <Link to="#" className="btn btn-primary">
                          Go somewhere
                        </Link>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Card Image Caps & Overlays
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col lg={4}>
                  <Card>
                    <img className="card-img img-fluid" src={img6} alt="" />

                    <CardBody>
                      <h5 className="card-title mb-1">Card title</h5>
                      <CardText>
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </CardText>
                      <CardText>
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-1">Card title</h5>
                      <CardText>
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </CardText>
                      <CardText>
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </CardText>
                    </CardBody>
                    <img className="card-img img-fluid" src={img7} alt="" />
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card>
                    <img className="card-img img-fluid" src={img1} alt="" />

                    <div className="card-img-overlay">
                      <h4 className="card-title text-white mb-1">Card title</h4>
                      <p className="card-text text-light">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <CardText>
                        <small className="text-white">
                          Last updated 3 mins ago
                        </small>
                      </CardText>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Horizontal Card
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col lg={6}>
                  <Card>
                    <Row className="no-gutters align-items-center">
                      <Col md={4}>
                        <img
                          className="card-img img-fluid"
                          src={img2}
                          alt="Card image"
                        />
                      </Col>
                      <Col md={8}>
                        <CardBody>
                          <h5 className="card-title mb-1">Card title</h5>
                          <CardText className="card-text">
                            This is a wider card with supporting text below as a
                            natural lead-in to additional content.
                          </CardText>
                          <CardText className="card-text">
                            <small className="text-muted">
                              Last updated 3 mins ago
                            </small>
                          </CardText>
                        </CardBody>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card>
                    <Row className="no-gutters align-items-center">
                      <Col md={8}>
                        <CardBody>
                          <h5 className="card-title mb-1">Card title</h5>
                          <CardText className="card-text">
                            This is a wider card with supporting text below as a
                            natural lead-in to additional content.
                          </CardText>
                          <CardText className="card-text">
                            <small className="text-muted">
                              Last updated 3 mins ago
                            </small>
                          </CardText>
                        </CardBody>
                      </Col>
                      <Col md={4}>
                        <img
                          className="card-img img-fluid"
                          src={img3}
                          alt="Card image"
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Card Background Color
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col lg={4}>
                  <Card className="bg-primary text-white-50">
                    <CardHeader className="h6 bg-primary text-white">
                      Primary Card
                    </CardHeader>
                    <CardBody>
                      <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card&apos;s content.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="bg-success text-white-50">
                    <CardHeader className="h6 bg-success text-white">
                      Success Card
                    </CardHeader>
                    <CardBody>
                      <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card&apos;s content.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="bg-info text-white-50">
                    <CardHeader className="h6 bg-info text-white">
                      Info Card
                    </CardHeader>
                    <CardBody>
                      <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card&apos;s content.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <Col lg={4}>
              <Card className="bg-warning text-white-50">
                <h6 className="card-header bg-warning text-white">
                  Warning Card
                </h6>
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="bg-danger text-white-50">
                <h6 className="card-header bg-danger text-white">
                  Danger Card
                </h6>
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="bg-dark text-white-50">
                <h6 className="card-header bg-dark text-white">Dark Card</h6>
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <Card className="bg-secondary text-white-50">
                <h6 className="card-header bg-secondary text-white">
                  Secondary Card
                </h6>
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="bg-purple text-white-50">
                <h6 className="card-header bg-purple text-white">
                  Purple Card
                </h6>
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="bg-light">
                <h6 className="card-header bg-light">Light Card</h6>
                <CardBody>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Card Border Color
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <Row>
                <Col lg={4}>
                  <Card className="border border-primary">
                    <CardHeader className="bg-transparent border-primary">
                      <h6 className="my-0 text-primary">
                        Primary Outline Card
                      </h6>
                    </CardHeader>
                    <CardBody>
                      <h5 className="card-title mb-1">card title</h5>
                      <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card&apos;s content.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="border border-success">
                    <CardHeader className="bg-transparent border-success">
                      <h6 className="my-0 text-success">
                        Success Outline Card
                      </h6>
                    </CardHeader>
                    <CardBody>
                      <h5 className="card-title mb-1">card title</h5>
                      <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card&apos;s content.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="border border-info">
                    <CardHeader className="bg-transparent border-info">
                      <h6 className="my-0 text-info">Info Outline Card</h6>
                    </CardHeader>
                    <CardBody>
                      <h5 className="card-title mb-1">card title</h5>
                      <CardText>
                        Some quick example text to build on the card title and
                        make up the bulk of the card&apos;s content.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <Col lg={4}>
              <Card className="border border-warning">
                <div className="card-header bg-transparent border-warning">
                  <h6 className="my-0 text-warning">Warning Outline Card</h6>
                </div>
                <CardBody>
                  <h5 className="card-title mb-1">card title</h5>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border border-danger">
                <div className="card-header bg-transparent border-danger">
                  <h6 className="my-0 text-danger">Danger Outline Card</h6>
                </div>
                <CardBody>
                  <h5 className="card-title mb-1">card title</h5>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border border-dark">
                <div className="card-header bg-transparent border-dark">
                  <h6 className="my-0 text-dark">Dark Outline Card</h6>
                </div>
                <CardBody>
                  <h5 className="card-title mb-1">card title</h5>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <Card className="border border-secondary">
                <div className="card-header bg-transparent border-secondary">
                  <h6 className="my-0 text-secondary">
                    Secondary Outline Card
                  </h6>
                </div>
                <CardBody>
                  <h6 className="card-title mb-1">card title</h6>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border border-purple">
                <div className="card-header bg-transparent border-purple">
                  <h6 className="my-0 text-purple">Purple Outline Card</h6>
                </div>
                <CardBody>
                  <h6 className="card-title mb-1">card title</h6>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border border-light">
                <div className="card-header bg-transparent border-light">
                  <h6 className="my-0">Light Outline Card</h6>
                </div>
                <CardBody>
                  <h6 className="card-title mb-1">card title</h6>
                  <CardText>
                    Some quick example text to build on the card title and make
                    up the bulk of the card&apos;s content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <div className="col-12">
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Card Groups
                </h5>
                <Link
                  to="//reactstrap.github.io/components/card/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-soft-secondary"
                >
                  Docs <i className="mdi mdi-arrow-right align-middle"></i>
                </Link>
              </div>
              <div className="card-deck-wrapper">
                <CardGroup>
                  <Card className="mb-4">
                    <img
                      className="card-img-top img-fluid"
                      src={img4}
                      alt="Card image cap"
                    />
                    <CardBody>
                      <h4 className="card-title mb-1">Card title</h4>
                      <CardText>
                        This is a longer card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </CardText>
                      <CardText>
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card className="mb-4">
                    <img
                      className="card-img-top img-fluid"
                      src={img5}
                      alt="Card image cap"
                    />
                    <CardBody>
                      <h4 className="card-title mb-1">Card title</h4>
                      <CardText>
                        This card has supporting text below as a natural lead-in
                        to additional content.
                      </CardText>
                      <CardText>
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card className="mb-4">
                    <img
                      className="card-img-top img-fluid"
                      src={img6}
                      alt="Card image cap"
                    />
                    <CardBody>
                      <h4 className="card-title mb-1">Card title</h4>
                      <CardText>
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content.This card has even
                        longer content than the first to show that equal height
                        action.
                      </CardText>
                      <CardText>
                        <small className="text-muted">
                          Last updated 3 mins ago
                        </small>
                      </CardText>
                    </CardBody>
                  </Card>
                </CardGroup>
              </div>
            </div>
          </Row>

          <div>
            <Col sm={12}>
              <div className="justify-content-between d-flex align-items-center mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Cards Masonry
                </h5>
                <p className="m-0 badge badge-soft-primary py-2">
                  Dashonic Only
                </p>
              </div>
              <CardColumns>
                <Card>
                  <CardImg top src={img3} alt="Dashonic" />
                  <CardBody>
                    <CardTitle>Card title that wraps to a new line</CardTitle>
                    <CardText>
                      This is a longer card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
                    </CardText>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <blockquote className="card-blockquote mb-0">
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Integer posuere erat a ante.
                      </CardText>
                      <footer className="blockquote-footer font-size-12">
                        Someone famous in{" "}
                        <cite title="Source Title">Source Title</cite>
                      </footer>
                    </blockquote>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg top src={img5} alt="Dashonic" />
                  <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardText>
                      This card has supporting text below as a natural lead-in
                      to additional content.
                    </CardText>
                    <CardText>
                      <small className="text-muted">
                        Last updated 3 mins ago
                      </small>
                    </CardText>
                  </CardBody>
                </Card>
                <Card color="primary" className="text-white text-center p-3">
                  <blockquote className="card-blockquote mb-0">
                    <CardText>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Integer posuere erat.
                    </CardText>
                    <footer className="blockquote-footer text-white font-size-12">
                      Someone famous in{" "}
                      <cite title="Source Title">Source Title</cite>
                    </footer>
                  </blockquote>
                </Card>
                <Card className="text-center">
                  <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardText>
                      This card has a regular title and short paragraphy of text
                      below it.
                    </CardText>
                    <CardText>
                      <small className="text-muted">
                        Last updated 3 mins ago
                      </small>
                    </CardText>
                  </CardBody>
                </Card>
                <Card>
                  <CardImg top src={img7} alt="Dashonic" />
                </Card>
                <Card className="p-3 text-end">
                  <blockquote className="card-blockquote mb-0">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Integer posuere erat a ante.
                    </p>
                    <footer className="blockquote-footer font-size-12 m-0">
                      <small className="text-muted">
                        Someone famous in{" "}
                        <cite title="Source Title">Source Title</cite>
                      </small>
                    </footer>
                  </blockquote>
                </Card>
                <Card>
                  <CardBody>
                    <CardTitle>Card title</CardTitle>
                    <CardText>
                      This is another card with title and supporting text below.
                      This card has some additional content to make it slightly
                      taller overall.
                    </CardText>
                    <CardText>
                      <small className="text-muted">
                        Last updated 3 mins ago
                      </small>
                    </CardText>
                  </CardBody>
                </Card>
              </CardColumns>
            </Col>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiCard;
