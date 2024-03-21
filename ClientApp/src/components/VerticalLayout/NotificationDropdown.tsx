import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import Icons
import Icon from "@ailibs/feather-react-ts";

//i18n
import { withTranslation } from "react-i18next";
import withRouter from "./withRouter";

const NotificationDropdown = (props: any) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <Icon name="bell" className="icon-sm" />
          <span className="noti-dot bg-danger"></span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0" dir="left">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h5 className="m-0 font-size-15"> {props.t("Notifications")} </h5>
              </Col>
              <div className="col-auto">
                <Link to="#" className="small">
                  {" "}
                  View All
                </Link>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            <Link to="" className="text-reset notification-item">
              <div className="d-flex border-bottom align-items-start">
                <div className="flex-shrink-0">
                  img
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">Justin Verduzco</h6>
                  <div className="text-muted">
                    <p className="mb-1 font-size-13">Your task changed an issue from &quot;In Progress&quot; to <span className="badge badge-soft-success">Review</span></p>
                    <p className="mb-0 font-size-10 text-uppercase fw-bold"><i className="mdi mdi-clock-outline"></i> 1 hour ago</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="" className="text-reset notification-item">
              <div className="d-flex border-bottom align-items-start">
                <div className="flex-shrink-0">
                  <div className="avatar-sm me-3">
                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                      <i className="uil-shopping-basket"></i>
                    </span>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">New order has been placed</h6>
                  <div className="text-muted">
                    <p className="mb-1 font-size-13">Open the order confirmation or shipment confirmation.</p>
                    <p className="mb-0 font-size-10 text-uppercase fw-bold"><i className="mdi mdi-clock-outline"></i> 5 hour ago</p>
                  </div>
                </div>
              </div>
            </Link>
            <h6 className="dropdown-header bg-light">Earlier</h6>
            <Link to="" className="text-reset notification-item">
              <div className="d-flex border-bottom align-items-start">
                <div className="flex-shrink-0">
                  <div className="avatar-sm me-3">
                    <span className="avatar-title bg-soft-success text-success rounded-circle font-size-16">
                      <i className="uil-truck"></i>
                    </span>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">Your item is shipped</h6>
                  <div className="text-muted">
                    <p className="mb-1 font-size-13">Here is somthing that you might light like to know.</p>
                    <p className="mb-0 font-size-10 text-uppercase fw-bold"><i className="mdi mdi-clock-outline"></i> 1 day ago</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="" className="text-reset notification-item">
              <div className="d-flex border-bottom align-items-start">
                <div className="flex-shrink-0">
                  img
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">Salena Layfield</h6>
                  <div className="text-muted">
                    <p className="mb-1 font-size-13">Yay ! Everything worked!</p>
                    <p className="mb-0 font-size-10 text-uppercase fw-bold"><i className="mdi mdi-clock-outline"></i> 3 days ago</p>
                  </div>
                </div>
              </div>
            </Link>
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="#"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>{" "}
              {props.t("View all")}{" "}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(withRouter(NotificationDropdown));