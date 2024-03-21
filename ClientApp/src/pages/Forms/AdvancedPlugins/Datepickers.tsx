import React from "react";
import { Form, Label, Row, Col, FormGroup, InputGroup } from "reactstrap";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"

const Datepickers = () => {
  return (
    <React.Fragment>
      <Row>
        <Col xl={6}>
          <Form>
            <FormGroup className="mb-4">
              <Label>Default Functionality</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd M,yyyy"
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d"
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-4">
              <Label>Auto Close</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd M,yyyy"
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d"
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-4">
              <label>Multiple Date</label>
              <div className="input-group">
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd M,yyyy"
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    mode: "multiple",
                    dateFormat: "Y-m-d"
                  }}
                />
              </div>
            </FormGroup>
          </Form>

        </Col>
        <Col xl={6}>
          <Form>
            <FormGroup className="mb-4">
              <Label>Date Range</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd M,yyyy"
                  options={{
                    mode: "range",
                    dateFormat: "Y-m-d"
                  }}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup className="mb-0">
              <label>Inline Datepicker</label>
              <Flatpickr
                className="form-control d-block"
                placeholder="dd M,yyyy"
                options={{
                  inline: true,
                  altInput: true,
                  altFormat: "F j, Y",
                  dateFormat: "Y-m-d"
                }}
              />
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Datepickers;
