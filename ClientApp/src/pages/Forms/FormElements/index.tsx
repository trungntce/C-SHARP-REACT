import React from "react";
import { Col, Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//import Components
import Switches from "./Switches";
import Checkboxes from "./Checkboxes";
import Formlayouts from "./Formlayouts";
import RangeInputs from "./RangeInputs";
import SizingInput from "./SizingInput";
import TextualInputs from "./Textual-inputs";
import InlineForm from "./InlineForm";
import Radios from "./Radios";
import FileBrowser from "./FileBrowser";
import FormFloat from "./FormFloat";
import Floationg from "./Floationg"

const FormElements = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Forms" breadcrumbItem="Basic Elements" />

          <Row>
            <Col xs={12}>
              {/* import TextualInputs */}
              <TextualInputs />
            </Col>
          </Row>

          <Row>
            <Formlayouts />
          </Row>

          <Row>
            <InlineForm />
          </Row>

          <Row>
            <Col xl={6}>
              <SizingInput />
            </Col>
            <Col xl={6}>
              <Switches />
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Checkboxes />
            </Col>
            <Col xl={6}>
              <Radios />
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <RangeInputs />
            </Col>
            <Col xl={6}>
              <FileBrowser />
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <FormFloat />
            </Col>
            <Col xl={6}>
              <Floationg />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormElements;
