import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiTypography = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Typography" />
          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 ms-3 me-4">
                      <h1 className="display-4 mb-0 ff-primary">Aa</h1>
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <p className="mb-2">Font Family Primary</p>
                      <h5 className="mb-0 ff-primary">
                        &quot;system-ui, -apple-system&quot;
                      </h5>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 ms-3 me-4">
                      <h1 className="display-4 mb-0">Aa</h1>
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <p className="mb-2">Font Family Secondary</p>
                      <h5 className="mb-0">&quot;Roboto&quot;, sans-serif</h5>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Headings</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <h1 className="mb-3">
                    h1. Bootstrap heading{" "}
                    <small className="text-muted">2.25rem (36px)</small>
                  </h1>

                  <h2 className="mb-3">
                    h2. Bootstrap heading{" "}
                    <small className="text-muted">1.8rem (28.8px)</small>
                  </h2>

                  <h3 className="mb-3">
                    h3. Bootstrap heading{" "}
                    <small className="text-muted">1.575rem (25.2px)</small>
                  </h3>

                  <h4 className="mb-3">
                    h4. Bootstrap heading{" "}
                    <small className="text-muted">1.35rem (21.6px)</small>
                  </h4>

                  <h5 className="mb-3">
                    h5. Bootstrap heading{" "}
                    <small className="text-muted">1.125rem (18px)</small>
                  </h5>

                  <h6>
                    h6. Bootstrap heading{" "}
                    <small className="text-muted">0.9rem (14.4px)</small>
                  </h6>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Display Headings</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <h1 className="display-1">Display 1</h1>
                  <h1 className="display-2">Display 2</h1>
                  <h1 className="display-3">Display 3</h1>
                  <h1 className="display-4">Display 4</h1>
                  <h1 className="display-5">Display 5</h1>
                  <h1 className="display-6 mb-0">Display 6</h1>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Blockquotes</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <div className="col-xl-6">
                      <div>
                        <blockquote className="blockquote font-size-16 mb-0">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer posuere erat a ante.
                          </p>
                          <footer className="blockquote-footer mt-2">
                            Someone famous in{" "}
                            <cite title="Source Title">Source Title</cite>
                          </footer>
                        </blockquote>
                      </div>
                    </div>
                    <div className="col-xl-6">
                      <div className="mt-4 mt-lg-0">
                        <blockquote className="blockquote  blockquote-reverse font-size-16 mb-0">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer posuere erat a ante.
                          </p>
                          <footer className="blockquote-footer mt-2">
                            Someone famous in{" "}
                            <cite title="Source Title">Source Title</cite>
                          </footer>
                        </blockquote>
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <div className="col-12">
              <div className="mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Blockquote Background Color
                </h5>
              </div>
              <Row>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Primary</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-primary rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Success</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-success rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Danger</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-danger rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Info</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-info rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Warning</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-warning rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Secondary</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-secondary rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Dark</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-dark rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Light</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-light rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer text-dark font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">Blockquotes Purple</h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-purple rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <div className="mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Blockquote Border Color
                </h5>
              </div>
              <Row>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Primary
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-primary rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Success
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-success rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Danger
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-danger rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Info
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-info rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Warning
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-warning rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Secondary
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-secondary rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Dark
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-dark rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Light
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-light rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer text-dark font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4} md={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title mb-0">
                        Blockquotes Outline Purple
                      </h4>
                      <p className="m-0 badge badge-soft-primary py-2">
                        Dashonic Only
                      </p>
                    </CardHeader>
                    <CardBody>
                      <blockquote className="blockquote custom-blockquote blockquote-outline-purple rounded mb-0">
                        <p className="font-size-14 text-dark mb-2">
                          At vero eos et accusamus dignissimos ducimus
                          blanditiis.
                        </p>
                        <footer className="blockquote-footer font-size-13 mt-2">
                          {" "}
                          Angie Burt <cite title="Source Title">Designer</cite>
                        </footer>
                      </blockquote>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Description List Alignment</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <dl className="row mb-0">
                    <dt className="col-sm-3">Description lists</dt>
                    <dd className="col-sm-9">
                      A description list is perfect for defining terms.
                    </dd>

                    <dt className="col-sm-3">Euismod</dt>
                    <dd className="col-sm-9">
                      Vestibulum id ligula porta felis euismod semper eget
                      lacinia odio sem nec elit.
                    </dd>
                    <dd className="col-sm-9 offset-sm-3">
                      Donec id elit non mi porta gravida at eget metus.
                    </dd>

                    <dt className="col-sm-3">Malesuada porta</dt>
                    <dd className="col-sm-9">
                      Etiam porta sem malesuada magna mollis euismod.
                    </dd>

                    <dt className="col-sm-3 text-truncate">
                      Truncated term is truncated
                    </dt>
                    <dd className="col-sm-9">
                      Fusce dapibus, tellus ac cursus commodo, tortor mauris
                      condimentum nibh, ut fermentum massa justo sit amet risus.
                    </dd>

                    <dt className="col-sm-3">Nesting</dt>
                    <dd className="col-sm-9 mb-0">
                      <dl className="row mb-0">
                        <dt className="col-sm-4">Nested definition list</dt>
                        <dd className="col-sm-8">
                          Aenean posuere, tortor sed cursus feugiat, nunc augue
                          blandit nunc.
                        </dd>
                      </dl>
                    </dd>
                  </dl>
                </CardBody>
              </Card>
            </div>
          </Row>

          <Row>
            <div className="col-xl-6">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Inline Text Elements</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="lead">
                    Vivamus sagittis lacus vel augue laoreet rutrum faucibus
                    dolor auctor.
                  </p>
                  <p>
                    You can use the mark tag to <mark>highlight</mark> text.
                  </p>
                  <p>
                    <del>
                      This line of text is meant to be treated as deleted text.
                    </del>
                  </p>
                  <p>
                    <s>
                      This line of text is meant to be treated as no longer
                      accurate.
                    </s>
                  </p>
                  <p>
                    <ins>
                      This line of text is meant to be treated as an addition to
                      the document.
                    </ins>
                  </p>
                  <p>
                    <u>This line of text will render as underlined</u>
                  </p>
                  <p>
                    <small>
                      This line of text is meant to be treated as fine print.
                    </small>
                  </p>
                  <p>
                    <strong>This line rendered as bold text.</strong>
                  </p>
                  <p className="mb-0">
                    <em>This line rendered as italicized text.</em>
                  </p>
                </CardBody>
              </Card>
            </div>
            <div className="col-xl-6">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Unstyled List</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <ul className="list-unstyled mb-0">
                    <li>Integer molestie lorem at massa</li>
                    <li>
                      Nulla volutpat aliquam velit
                      <ul>
                        <li>Phasellus iaculis neque</li>
                        <li>Purus sodales ultricies</li>
                        <li>Vestibulum laoreet porttitor sem</li>
                      </ul>
                    </li>
                    <li>Faucibus porta lacus fringilla vel</li>
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Inline List</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <ul className="list-inline mb-0">
                    <li className="list-inline-item">Lorem ipsum</li>
                    <li className="list-inline-item">Phasellus iaculis</li>
                    <li className="list-inline-item">Nulla volutpat</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiTypography;
