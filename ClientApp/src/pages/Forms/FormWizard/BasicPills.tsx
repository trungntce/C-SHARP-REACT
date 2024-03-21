import React, { useState } from "react";
import {
  CardBody,
  Col,
  Input,
  Label,
  Row,
  TabContent,
  TabPane,
  Button,
  Tooltip
} from "reactstrap";

import classnames from "classnames";

const BasicPills = () => {

  const [activeTab, setactiveTab] = useState(1);

  function toggleTab(tab: any) {
    if (activeTab !== tab) {
      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
      }
    }
  }

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const [tooltipOpen2, setTooltipOpen2] = useState(false);
  const toggle2 = () => setTooltipOpen2(!tooltipOpen2);
  const [tooltipOpen3, setTooltipOpen3] = useState(false);
  const toggle3 = () => setTooltipOpen3(!tooltipOpen3);
  const [modal_standard, setmodal_standard] = useState(false);

  return (
    <React.Fragment>
      <CardBody>
        <div>
          <ul className="wizard-nav mb-5">
            <li className="wizard-list-item">
              <div
                className={classnames({ active: activeTab === 1 }, "list-item")}
                id={"Tooltip-1"}
              >
                <div className="step-icon">
                  <i className="uil uil-list-ul"></i>
                </div>
              </div>
              <Tooltip
                placement="top"
                isOpen={tooltipOpen}
                target={"Tooltip-1"}
                toggle={toggle}
              >
                Seller Details
              </Tooltip>
            </li>
            <li className="wizard-list-item">
              <div
                className={classnames({ active: activeTab === 2 }, "list-item")}
                id={"Tooltip-2"}
              >
                <div className="step-icon">
                  <i className="uil uil-clipboard-notes"></i>
                </div>
              </div>
              <Tooltip
                placement="top"
                isOpen={tooltipOpen2}
                target={"Tooltip-2"}
                toggle={toggle2}
              >
                Company Document
              </Tooltip>
            </li>

            <li className="wizard-list-item">
              <div
                className={classnames({ active: activeTab === 3 }, "list-item")}
                id={"Tooltip-3"}
              >
                <div className="step-icon">
                  <i className="uil uil-university"></i>
                </div>
              </div>
              <Tooltip
                placement="top"
                isOpen={tooltipOpen3}
                target={"Tooltip-3"}
                toggle={toggle3}
              >
                Attached Files
              </Tooltip>
            </li>
          </ul>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              <div className="text-center mb-4">
                <h5>Seller Details</h5>
                <p className="card-title-desc">Fill all information below</p>
              </div>
              <div>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-firstname-input"
                        className="form-label"
                      >
                        First name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-firstname-input"
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-lastname-input"
                        className="form-label"
                      >
                        Last name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-lastname-input"
                      />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-phoneno-input"
                        className="form-label"
                      >
                        Phone
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-phoneno-input"
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-email-input"
                        className="form-label"
                      >
                        Email
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="basicpill-email-input"
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <label
                        htmlFor="basicpill-address-input"
                        className="form-label"
                      >
                        Address
                      </label>
                      <textarea
                        id="basicpill-address-input"
                        className="form-control"
                        rows={2}
                      ></textarea>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
            <TabPane tabId={2}>
              <div className="text-center mb-4">
                <h5>Company Document</h5>
                <p className="card-title-desc">Fill all information below</p>
              </div>

              <div>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-pancard-input"
                        className="form-label"
                      >
                        PAN Card
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-pancard-input"
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-vatno-input"
                        className="form-label"
                      >
                        VAT/TIN No.
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-vatno-input"
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-cstno-input"
                        className="form-label"
                      >
                        CST No.
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-cstno-input"
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-servicetax-input"
                        className="form-label"
                      >
                        Service Tax No.
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-servicetax-input"
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-companyuin-input"
                        className="form-label"
                      >
                        Company UIN
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-companyuin-input"
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Label
                        htmlFor="basicpill-declaration-input"
                        className="form-label"
                      >
                        Declaration
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="basicpill-declaration-input"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
            <TabPane tabId={3}>
              <div>
                <div className="text-center mb-4">
                  <h5>Bank Details</h5>
                  <p className="card-title-desc">Fill all information below</p>
                </div>
                <div>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="basicpill-namecard-input"
                          className="form-label"
                        >
                          Name on Card
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-namecard-input"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label className="form-label">Credit Card Type</Label>
                        <Input
                          type="select"
                          className="form-select"
                          defaultValue="select card type"
                        >
                          <option value="select card type">
                            Select Card Type
                          </option>
                          <option value="AE">American Express</option>
                          <option value="VI">Visa</option>
                          <option value="MC">MasterCard</option>
                          <option value="DI">Discover</option>
                        </Input>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="basicpill-cardno-input"
                          className="form-label"
                        >
                          Credit Card Number
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-cardno-input"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="basicpill-card-verification-input"
                          className="form-label"
                        >
                          Card Verification Number
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-card-verification-input"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="basicpill-expiration-input"
                          className="form-label"
                        >
                          Expiration Date
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="basicpill-expiration-input"
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </TabPane>
          </TabContent>

          <div className="d-flex align-items-start gap-3 mt-4">
            {activeTab !== 1 &&
              <Button type="button"
                color="primary"
                className="w-sm"
                id="prevBtn"
                onClick={() => {
                  toggleTab(activeTab - 1);
                }}>Previous</Button>
            }


            {activeTab !== 3 &&
              <Button type="button"
                color="primary"
                className="w-sm ms-auto"
                id="nextBtn"
                onClick={() => {
                  toggleTab(activeTab + 1);
                }}>Next</Button>
            }

            {activeTab === 3 &&
              <Button type="button"
                color="primary"
                className="btn btn-primary w-sm ms-auto"
                id="nextBtn">Submit</Button>
            }

          </div>
        </div>
      </CardBody>
    </React.Fragment>
  );
};

export default BasicPills;
