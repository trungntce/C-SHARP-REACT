import React from "react";
import { Card, CardBody, CardHeader, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";

const Floationg = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="justify-content-between d-flex align-items-center">
          <h4 className="card-title">Select Floationg</h4>
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
              id="floatingInputGrid"
              placeholder="name@example.com"
              defaultValue="mdo@example.com"
            />
            <Label htmlFor="floatingInputGrid">Email address</Label>
          </div>

          <div className="form-floating mb-3">
            <Input type="select"
              className="form-select"
              id="floatingSelectGrid"
              aria-label="Floating label select example"
              defaultValue=""
            >
              <option value="">Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Input>
            <Label htmlFor="floatingSelectGrid">Works with selects</Label>
          </div>
          <div className="form-floating">
            <Input type="select"
              className="form-select"
              id="floatingSelect"
              aria-label="Floating label select example"
            >
              <option value="">Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Input>
            <Label htmlFor="floatingSelect">Works with selects</Label>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Floationg;
