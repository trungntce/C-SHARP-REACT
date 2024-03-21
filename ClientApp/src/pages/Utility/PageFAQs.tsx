import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader, Collapse } from "reactstrap";
import classnames from "classnames";

const PageFaqs = () => {
  const [col1, setcol1] = useState(true);
  const [col2, setcol2] = useState(false);
  const [col3, setcol3] = useState(false);

  const [col4, setcol4] = useState(false);
  const [col5, setcol5] = useState(false);
  const [col6, setcol6] = useState(true);
  const [col7, setcol7] = useState(false);

  const [col8, setcol8] = useState(false);
  const [col9, setcol9] = useState(true);

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

  const t_col4 = () => {
    setcol4(!col4);
    setcol5(false);
    setcol6(false);
    setcol7(false);
  };

  const t_col5 = () => {
    setcol5(!col5);
    setcol4(false);
    setcol6(false);
    setcol7(false);
  };

  const t_col6 = () => {
    setcol6(!col6);
    setcol4(false);
    setcol5(false);
    setcol7(false);
  };
  const t_col7 = () => {
    setcol7(!col7);
    setcol4(false);
    setcol5(false);
    setcol6(false);
  };


  const t_col8 = () => {
    setcol8(!col8);
    setcol9(false);
  };

  const t_col9 = () => {
    setcol9(!col9);
    setcol8(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <div className="mx-n4 mt-n4">
            <Row>
              <Col lg="12">
                <Card>
                  <div className="faq-bg position-relative p-5">
                    <div className="bg-overlay bg-dark bg-gradient"></div>
                    <div className="row justify-content-center">
                      <Col lg={5}>
                        <div className="text-center text-white-50">
                          <h3 className="text-white">How can we help you?</h3>
                          <p>If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual</p>

                          <div>
                            <button type="button" className="btn btn-primary mt-2 me-2"><i className="uil uil-envelope-alt me-1"></i> Email Us</button>{" "}
                            <button type="button" className="btn btn-info mt-2"><i className="uil uil-twitter me-1"></i> Send us a tweet</button>
                          </div>

                          <div className="input-group my-5">
                            <input type="text" className="form-control" placeholder="Type keywords to find answers" aria-label="search result" aria-describedby="button-search" />
                            <button className="btn btn-primary" type="button" id="button-search">Search</button>
                          </div>
                        </div>
                      </Col>
                    </div>
                  </div>

                </Card>
              </Col>
            </Row>
          </div>
          <div className="mt-n5">
            <Row>
              <Col xl={4} md={6}>
                <Card className="card-h-100 border shadow-none mb-0">
                  <CardHeader>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle font-size-20">
                            <i className="uil uil-question-circle"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-14 mb-0">General Questions</h5>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-4">
                    <div className="accordion accordion-flush" id="accordion-gen-ques">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="gen-ques-headingOne">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col1 }
                            )}
                            type="button"
                            onClick={t_col1}
                            style={{ cursor: "pointer" }}
                          >
                            What is Lorem Ipsum ?
                          </button>
                        </h2>
                        <Collapse isOpen={col1} className="accordion-collapse">
                          <div className="accordion-body text-muted">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages</div>
                        </Collapse>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="gen-ques-headingTwo">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col2 }
                            )}
                            type="button"
                            onClick={t_col2}
                            style={{ cursor: "pointer" }}
                          >
                            Why do we use it ?
                          </button>
                        </h2>
                        <Collapse isOpen={col2} className="accordion-collapse">
                          <div className="accordion-body text-muted">To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what occidental separate existence.</div>
                        </Collapse>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="gen-ques-headingThree">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col3 }
                            )}
                            type="button"
                            onClick={t_col3}
                            style={{ cursor: "pointer" }}
                          >
                            Where does it come from ?
                          </button>
                        </h2>
                        <Collapse isOpen={col3} className="accordion-collapse">
                          <div className="accordion-body text-muted">For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation.</div>
                        </Collapse>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={4} md={6}>
                <Card className="card-h-100 border shadow-none mb-0">
                  <CardHeader>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle font-size-20">
                            <i className="uil uil-keyhole-circle"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-14 mb-0">Privacy Policy</h5>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-4">
                    <div className="accordion accordion-flush" id="accordion-privacypolicy">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="privacypolicy-headingOne">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col4 }
                            )}
                            type="button"
                            onClick={t_col4}
                            style={{ cursor: "pointer" }}>
                            Where can I get some ?
                          </button>
                        </h2>
                        <Collapse isOpen={col4} className="accordion-collapse">
                          <div className="accordion-body text-muted">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages</div>
                        </Collapse>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="privacypolicy-headingTwo">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col5 }
                            )}
                            type="button"
                            onClick={t_col5}
                            style={{ cursor: "pointer" }}>
                            Why do we use it ?
                          </button>
                        </h2>
                        <Collapse isOpen={col5} className="accordion-collapse">
                          <div className="accordion-body text-muted">To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what occidental separate existence.</div>
                        </Collapse>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="privacypolicy-headingThree">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col6 }
                            )}
                            type="button"
                            onClick={t_col6}
                            style={{ cursor: "pointer" }}>
                            Where does it come from ?
                          </button>
                        </h2>
                        <Collapse isOpen={col6} className="accordion-collapse">
                          <div className="accordion-body text-muted">For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation.</div>
                        </Collapse>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="privacypolicy-headingFour">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col7 }
                            )}
                            type="button"
                            onClick={t_col7}
                            style={{ cursor: "pointer" }}>
                            What is Lorem Ipsum ?
                          </button>
                        </h2>
                        <Collapse isOpen={col7} className="accordion-collapse">
                          <div className="accordion-body text-muted">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages</div>
                        </Collapse>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={4} md={6}>
                <Card className="card-h-100 border shadow-none mb-0">
                  <CardHeader>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle font-size-20">
                            <i className="uil uil-usd-circle"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-14 mb-0">Pricing & Plans</h5>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-4">
                    <div className="accordion accordion-flush" id="accordion-pricingplans">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="pricingplans-headingOne">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col8 }
                            )}
                            type="button"
                            onClick={t_col8}
                            style={{ cursor: "pointer" }}>
                            Where does it come from ?
                          </button>
                        </h2>
                        <Collapse isOpen={col8} className="accordion-collapse">
                          <div className="accordion-body text-muted">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages</div>
                        </Collapse>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="pricingplans-headingTwo">
                          <button
                            className={classnames(
                              "accordion-button",
                              { collapsed: !col9 }
                            )}
                            type="button"
                            onClick={t_col9}
                            style={{ cursor: "pointer" }}>
                            Why do we use it ?
                          </button>
                        </h2>
                        <Collapse isOpen={col9} className="accordion-collapse">
                          <div className="accordion-body text-muted">To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what occidental separate existence.</div>
                        </Collapse>
                      </div>
                    </div>
                  </CardBody>
                </Card>

              </Col>

            </Row>

          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PageFaqs;
