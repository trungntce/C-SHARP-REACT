import React from "react";
import { Container, Row, Col, Form, Input, Label } from "reactstrap";
import { Link, useLocation } from "react-router-dom";

//import images
import logolight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";
import { useSubmitHandler, useSubmitRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import { alertBox } from "../../components/MessageBox/Alert";

const Login = () => {

  const loginHandler = async (_?: Dictionary, data?: Dictionary) => {
    try{
      const result = await api<any>("get", "/user/login", data!);
      if(result.data){
        const user = result.data;
        localStorage.setItem("user-id", user.userId);
        localStorage.setItem("user-name", user.userName);
        localStorage.setItem("user-lang", user.nationCode);
        localStorage.setItem("user-email", user.email);
        localStorage.setItem("user-login", user.loginDt);
        localStorage.setItem("auth-token", user.token);
        localStorage.setItem("auth-usergroup", user.usergroupJson);
        window.location.reload();
      }
    }catch(ex: any){
      if(ex.response.data?.detail){
        alertBox(ex.response.data?.detail);
      }else{
        alertBox("오류가 발생했습니다.");
      }
    }
  };

  const [formRef, setForm] = useSubmitRef();
  const submitHandler = useSubmitHandler(loginHandler);

  return (
    <>
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
                  <div className="mb-4">
                    <h5>Welcome Back !</h5>
                    <p>Sign in to continue to SIFLEX MES System.</p>
                  </div>
                  <Form
                    className="login-wrap"
                    innerRef={formRef}
                    onSubmit={submitHandler}
                    >
                    <div className="form-floating form-floating-custom text-start mb-3">
                      <Input type="text" className="form-control" id="userId" name="userId" placeholder="Enter User Name" />
                      <Label htmlFor="userid">Username</Label>
                      <div className="form-floating-icon">
                        <i className="uil uil-users-alt"></i>
                      </div>
                    </div>
                    <div className="form-floating form-floating-custom text-start mb-3">
                      <Input type="password" className="form-control" id="password" name="password" placeholder="Enter Password" />
                      <Label htmlFor="password">Password</Label>
                      <div className="form-floating-icon">
                        <i className="uil uil-padlock"></i>
                      </div>
                    </div>

                    <div className="form-check form-check-info font-size-16">
                      <Input className="form-check-input" type="checkbox" id="remember-check" />
                      <Label className="form-check-label font-size-14" htmlFor="remember-check">
                        Remember me
                      </Label>
                    </div>

                    <div className="mt-3">
                      <button className="btn btn-info w-100" type="submit">Log In</button>
                    </div>

                    {/* <div className="mt-4">
                      <Link to="/password" className="text-muted text-decoration-underline">Forgot your password?</Link>
                    </div> */}
                  </Form>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xl={12}>
                <div className="text-center text-muted p-4">
                  <p className="mb-0">&copy; {" "}{new Date().getFullYear()} ©SIFLEX.</p>
                </div>
              </Col>
            </Row>

          </div>
        </Container>
      </div>
    </>
  );
};

export default Login;
