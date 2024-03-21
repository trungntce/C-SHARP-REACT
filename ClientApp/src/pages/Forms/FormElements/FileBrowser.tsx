import React from "react";
import { Card, CardBody, CardHeader, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";

const FileBrowser = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader className="justify-content-between d-flex align-items-center">
          <h4 className="card-title">File Browser</h4>
          <Link
            to="//reactstrap.github.io/components/form/"
            target="_blank" rel="noreferrer"
            className="btn btn-sm btn-soft-secondary"
          >
            Docs <i className="mdi mdi-arrow-right align-middle"></i>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="mb-3">
            <Label htmlFor="formFile" className="form-label">
              Default file input example
            </Label>
            <Input className="form-control" type="file" id="formFile" />
          </div>
          <div className="mb-3">
            <Label htmlFor="formFileSm" className="form-label">
              Small file input example
            </Label>
            <Input
              className="form-control form-control-sm"
              id="formFileSm"
              type="file"
            />
          </div>
          <div>
            <Label htmlFor="formFileLg" className="form-label">
              Large file input example
            </Label>
            <Input
              className="form-control form-control-lg"
              id="formFileLg"
              type="file"
            />
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default FileBrowser;
