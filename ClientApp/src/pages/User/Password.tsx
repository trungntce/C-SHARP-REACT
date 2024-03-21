import React from "react";
import { Container, Row, Col, Form, Input, Label, Alert } from "reactstrap";
import { Link } from "react-router-dom";

import logolight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

const Password = () => {
    return (
        <React.Fragment>
            <div className="authentication-bg min-vh-100">
                <div className="bg-overlay bg-white"></div>
                <Container>
                    <div className="d-flex flex-column min-vh-100 px-3 pt-4">
                        <Row className="justify-content-center my-auto">
                            <Col md={8} lg={6} xl={4}>

                                <div className="text-center py-5">
                                    <div className="mb-4 mb-md-5">
                                        <Link to="/sales" className="d-block auth-logo">
                                            <img src={logoDark} alt="" height="22" className="auth-logo-dark" />
                                            <img src={logolight} alt="" height="22" className="auth-logo-light" />
                                        </Link>
                                    </div>
                                    <div className="text-muted mb-4">
                                        <h5 className="">Reset Password</h5>
                                        <p>Re-Password with Email.</p>
                                    </div>
                                    <Alert color="success" className="text-center mb-4" role="alert">
                                        Enter your Email and instructions will be sent to you!
                                    </Alert>
                                    <Form>
                                        <div className="form-floating form-floating-custom text-start mb-3">
                                            <Input type="email" className="form-control" id="input-email" placeholder="Enter Email" />
                                            <Label htmlFor="input-email">Email</Label>
                                            <div className="form-floating-icon">
                                                <i className="uil uil-envelope-alt"></i>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <Link to="/auth-forgotpassword-basic" className="btn btn-info w-100">Send Request</Link>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={12}>
                                <div className="text-center text-muted p-4">
                                    <p className="mb-0">&copy; {" "}{new Date().getFullYear()} Dashonic. Crafted with <i className="mdi mdi-heart text-danger"></i> by Pichforest</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Password;