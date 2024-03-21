import React from "react";
import {
  Container,
  Row,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import NormalValidation from "./NormalValidation";
import TooltipsValidation from "./TooltipsValidation";

const FormValidation = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Forms" breadcrumbItem="Form Validation" />

          <Row>
            {/* import NormalValidation */}
            <NormalValidation />

            {/* import TooltipsValidation */}
            <TooltipsValidation />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormValidation;
