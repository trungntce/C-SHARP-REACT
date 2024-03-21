import React from "react";
import { Card, CardBody, CardHeader, Input } from "reactstrap";

const RangeInputs = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="justify-content-between d-flex align-items-center">
          <h4 className="card-title">Range Inputs</h4>
          <a
            href="//reactstrap.github.io/components/form/"
            target="_blank" rel="noreferrer"
            className="btn btn-sm btn-soft-secondary"
          >
            Docs <i className="mdi mdi-arrow-right align-middle"></i>
          </a>
        </CardHeader>
        <CardBody>
          <div>
            <h5 className="font-size-14">Example</h5>
            <Input type="range" className="form-range" id="formControlRange" />
          </div>
          <div className="mt-4">
            <h5 className="font-size-14">Disabled</h5>
            <Input
              type="range"
              className="form-range"
              id="disabledRange"
              disabled
            />
          </div>
          <div className="mt-4">
            <h5 className="font-size-14">Custom Range</h5>
            <Input type="range" className="form-range" id="customRange1" />
            <Input
              type="range"
              className="form-range mt-2"
              min="0"
              max="5"
              id="customRange2"
            />
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RangeInputs;
