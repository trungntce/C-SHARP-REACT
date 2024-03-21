import { Col, Container, Row } from "reactstrap";

import React from "react";

//Import Countdown
import Countdown from "react-countdown";

//import images
import logolight from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

import { Link } from "react-router-dom";

const PagesComingsoon = () => {
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      return (
        <React.Fragment>
          <div className="countdownlist">
            <div className="countdownlist-item">
              <div className="count-title">Days</div>
              <div className="count-num">{days}</div>
            </div>{" "}
            <div className="countdownlist-item">
              <div className="count-title">Hours</div>
              <div className="count-num">{hours}</div>
            </div>{" "}
            <div className="countdownlist-item">
              <div className="count-title">Minutes</div>
              <div className="count-num">{minutes}</div>
            </div>{" "}
            <div className="countdownlist-item">
              <div className="count-title">Seconds</div>
              <div className="count-num">{seconds}</div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };


  return (
    <React.Fragment>
      <div className="authentication-bg min-vh-100">
        <div className="bg-overlay bg-white"></div>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="d-flex flex-column min-vh-100 px-3 pt-4">
                <div className="text-center my-auto py-5">
                  <div className="mb-4 mb-md-5">
                    <Link to="/sales" className="d-block auth-logo">
                      <img
                        src={logoDark}
                        alt=""
                        height="22"
                        className="auth-logo-dark"
                      />
                      <img
                        src={logolight}
                        alt=""
                        height="22"
                        className="auth-logo-light"
                      />
                    </Link>
                  </div>
                  <div className="text-muted mb-5">
                    <h4>Let&apos;s get started with Dashonic</h4>
                    <p>
                      It will be as simple as Occidental in fact it will be
                      Occidental.
                    </p>
                  </div>

                  <Countdown date="2030/12/31" renderer={renderer} />

                  <div className="input-group countdown-input-group mx-auto my-5">
                    <input
                      type="email"
                      className="form-control border-light shadow"
                      placeholder="Enter your email address"
                      aria-label="search result"
                      aria-describedby="button-email"
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      id="button-email"
                    >
                      Send <i className="bx bx-paper-plane ms-1"></i>
                    </button>
                  </div>
                </div>

                <div className="text-center p-4">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Dashonic. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Pichforest
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PagesComingsoon;
