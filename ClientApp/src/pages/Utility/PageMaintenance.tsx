import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row, CardBody, Card } from "reactstrap";

//import images
import maintenance from "../../assets/images/maintenance.png";

const PageMaintenance = () => {
    return (
        <React.Fragment>
            <div className="authentication-bg min-vh-100">
                <div className="bg-overlay bg-white"></div>
                <Container>
                    <Row>
                        <Col md={12}>
                            <div className="d-flex flex-column min-vh-100">
                                <div className="text-center my-auto py-5">
                                    <Row className="justify-content-center mb-5">
                                        <Col sm={4}>
                                            <div className="maintenance-img">
                                                <img src={maintenance} alt="" className="img-fluid mx-auto d-block" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="text-muted mb-5">
                                        <h4>Site is Under Maintenance</h4>
                                        <p>Please check back in sometime.</p>
                                    </div>

                                    <Row>
                                        <Col md={4}>
                                            <Card className="mt-4 maintenance-box shadow-none">
                                                <CardBody>
                                                    <div className="mb-4">
                                                        <i className="uil uil-rss-alt h1 text-primary"></i>
                                                    </div>

                                                    <h5 className="font-size-15 text-uppercase">Why is the Site Down?</h5>
                                                    <p className="text-muted mb-0">There are many variations of passages of
                                                        Lorem Ipsum available, but the majority have suffered alteration.</p>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col md={4}>
                                            <Card className="mt-4 maintenance-box shadow-none">
                                                <CardBody>
                                                    <div className="mb-4">
                                                        <i className="uil uil-clock-eight h1 text-primary"></i>
                                                    </div>

                                                    <h5 className="font-size-15 text-uppercase">
                                                        What is the Downtime?</h5>
                                                    <p className="text-muted mb-0">Contrary to popular belief, Lorem Ipsum is not
                                                        simply random text. It has roots in a piece of classical.</p>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                        <Col md={4}>
                                            <Card className="mt-4 maintenance-box shadow-none">
                                                <CardBody>
                                                    <div className="mb-4">
                                                        <i className="uil uil-envelope-alt h1 text-primary"></i>
                                                    </div>

                                                    <h5 className="font-size-15 text-uppercase">
                                                        Do you need Support?</h5>
                                                    <p className="text-muted mb-0">If you are going to use a passage of Lorem
                                                        Ipsum, you need to be sure there isn&apos;t anything embar..
                                                        <Link to="mailto:no-reply@domain.com" className="text-decoration-underline">no-reply@domain.com</Link>
                                                    </p>
                                                </CardBody>
                                            </Card>
                                        </Col>

                                    </Row>

                                </div>

                                <div className="text-center p-4">
                                    <p className="mb-0">&copy; {new Date().getFullYear()} Dashonic. Crafted with <i className="mdi mdi-heart text-danger"></i> by Pichforest</p>
                                </div>
                            </div>
                        </Col>

                    </Row>

                </Container>

            </div>
        </React.Fragment>
    );
};

export default PageMaintenance;
