import React from "react";
import { Link } from "react-router-dom";
//import images
import logosm from "../../assets/images/logo-sm-light.png";
import { Container, Col, Row, Card, } from "reactstrap";

const Error2 = () => {
    return (
        <React.Fragment>
            <div className="authentication-bg min-vh-100">
                <div className="bg-overlay bg-white"></div>

                <Container>
                    <div className="d-flex flex-column min-vh-100 px-3 pt-4">
                        <Row className="justify-content-center my-auto">
                            <Col lg={10}>
                                <div className="py-5">
                                    <Card className="auth-cover-card overflow-hidden">
                                        <Row className="g-0">
                                            <Col lg={6}>
                                                <div className="auth-img">
                                                </div>
                                            </Col>
                                            <Col lg={6}>
                                                <div className="p-4 p-lg-5 bg-primary h-100 d-flex align-items-center justify-content-center">
                                                    <div className="w-100 text-center">
                                                        <h1 className="display-1 fw-normal error-text text-white">404</h1>
                                                        <h4 className="text-uppercase text-white-50">Opps, page not found</h4>
                                                        <div className="mt-5 text-center">
                                                            <Link className="btn btn-info w-100" to="/sales">Back to Dashboard</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>

            </div>
        </React.Fragment>
    );
};

export default Error2;