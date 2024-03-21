import React from "react";
//import images
import logosm from "../../assets/images/logo-sm.png";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Error1 = () => {
    return (
        <React.Fragment>
            <div className="authentication-bg min-vh-100">
                <div className="bg-overlay bg-white"></div>
                <Container>
                    <Row>
                        <Col md={12}>
                            <div className="text-center py-5">
                                <h1 className="display-1 fw-normal error-text">404</h1>
                                <h4 className="text-uppercase text-muted">Opps, page not found</h4>
                                <div className="mt-5 text-center">
                                    <Link className="btn btn-primary" to="/sales">Back to Dashboard</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Error1;