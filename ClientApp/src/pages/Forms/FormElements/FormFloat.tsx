import React from "react";
import { Card, CardBody, CardHeader, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";

const FormFloat = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="justify-content-between d-flex align-items-center">
          <h4 className="card-title">Form Floating</h4>
          <Link
            to="//reactstrap.github.io/components/form/"
            target="_blank" rel="noreferrer"
            className="btn btn-sm btn-soft-secondary"
          >
            Docs <i className="mdi mdi-arrow-right align-middle"></i>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="form-floating mb-3">
            <Input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <Label htmlFor="floatingInput">Email address</Label>
          </div>
          <div className="form-floating mb-3">
            <Input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <Label htmlFor="floatingPassword">Password</Label>
          </div>
          <div className="form-floating">
            <Input
              type="textarea"
              style={{ height: "100px" }}
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
            />
            <Label htmlFor="floatingTextarea2">Comments</Label>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default FormFloat;
