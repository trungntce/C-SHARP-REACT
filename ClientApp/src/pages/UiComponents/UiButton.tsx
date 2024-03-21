import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
  CardTitle,
  Button,
  ButtonGroup,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiButton = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Ui Elements" breadcrumbItem="Buttons" />
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="card-header justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Default Buttons</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" color="primary">
                      Primary
                    </Button>
                    <Button type="button" color="secondary">
                      Secondary
                    </Button>
                    <Button type="button" color="success">
                      Success
                    </Button>
                    <Button type="button" color="info">
                      Info
                    </Button>
                    <Button type="button" color="warning">
                      Warning
                    </Button>
                    <Button type="button" color="danger">
                      Danger
                    </Button>
                    <Button type="button" color="purple">
                      Purple
                    </Button>
                    <Button type="button" color="dark">
                      Dark
                    </Button>
                    <Button type="button" color="link">
                      Link
                    </Button>
                    <Button type="button" color="light">
                      Light
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Outline Buttons</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" outline color="primary">
                      Primary
                    </Button>
                    <Button type="button" outline color="secondary">
                      Secondary
                    </Button>
                    <Button type="button" outline color="success">
                      Success
                    </Button>
                    <Button type="button" outline color="info">
                      Info
                    </Button>
                    <Button type="button" outline color="warning">
                      Warning
                    </Button>
                    <Button type="button" outline color="danger">
                      Danger
                    </Button>
                    <Button type="button" outline color="purple">
                      Purple
                    </Button>
                    <Button type="button" outline color="dark">
                      Dark
                    </Button>
                    <Button type="button" outline color="light">
                      Light
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Soft Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-soft-primary">
                      Primary
                    </button>
                    <button type="button" className="btn btn-soft-secondary">
                      Secondary
                    </button>
                    <button type="button" className="btn btn-soft-success">
                      Success
                    </button>
                    <button type="button" className="btn btn-soft-info">
                      Info
                    </button>
                    <button type="button" className="btn btn-soft-warning">
                      Warning
                    </button>
                    <button type="button" className="btn btn-soft-danger">
                      Danger
                    </button>
                    <button type="button" className="btn btn-soft-purple">
                      Purple
                    </button>
                    <button type="button" className="btn btn-soft-dark">
                      Dark
                    </button>
                    <button type="button" className="btn btn-soft-light">
                      Light
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Rounded Default Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      type="button"
                      color="primary"
                      className="btn-rounded"
                    >
                      Primary
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      className="btn-rounded"
                    >
                      Secondary
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      className="btn-rounded"
                    >
                      Success
                    </Button>
                    <Button type="button" color="info" className="btn-rounded">
                      Info
                    </Button>
                    <Button
                      type="button"
                      color="warning"
                      className="btn-rounded"
                    >
                      Warning
                    </Button>
                    <Button
                      type="button"
                      color="danger"
                      className="btn-rounded"
                    >
                      Danger
                    </Button>
                    <Button
                      type="button"
                      color="purple"
                      className="btn-rounded"
                    >
                      Purple
                    </Button>
                    <Button type="button" color="dark" className="btn-rounded">
                      Dark
                    </Button>
                    <Button type="button" color="link" className="btn-rounded">
                      Link
                    </Button>
                    <Button type="button" color="light" className="btn-rounded">
                      Light
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Rounded Outline Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      type="button"
                      color="primary"
                      outline
                      className="btn-rounded"
                    >
                      Primary
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      outline
                      className="btn-rounded"
                    >
                      Secondary
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      outline
                      className="btn-rounded"
                    >
                      Success
                    </Button>
                    <Button
                      type="button"
                      color="info"
                      outline
                      className="btn-rounded"
                    >
                      Info
                    </Button>
                    <Button
                      type="button"
                      color="warning"
                      outline
                      className="btn-rounded"
                    >
                      Warning
                    </Button>
                    <Button
                      type="button"
                      color="danger"
                      outline
                      className="btn-rounded"
                    >
                      Danger
                    </Button>
                    <Button
                      type="button"
                      color="purple"
                      outline
                      className="btn-rounded"
                    >
                      Purple
                    </Button>
                    <Button
                      type="button"
                      color="dark"
                      outline
                      className="btn-rounded"
                    >
                      Dark
                    </Button>
                    <Button
                      type="button"
                      color="light"
                      outline
                      className="btn-rounded"
                    >
                      Light
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Rounded Soft Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-soft-primary btn-rounded"
                    >
                      Primary
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-secondary btn-rounded"
                    >
                      Secondary
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-success btn-rounded"
                    >
                      Success
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-info btn-rounded"
                    >
                      Info
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-warning btn-rounded"
                    >
                      Warning
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-danger btn-rounded"
                    >
                      Danger
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-purple btn-rounded"
                    >
                      Purple
                    </button>
                    <button
                      type="button"
                      className="btn btn-soft-dark btn-rounded"
                    >
                      Dark
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">
                    Default Buttons with Icon
                  </CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" color="primary">
                      <i className="uil uil-user me-2"></i> Primary
                    </Button>
                    <Button type="button" color="success">
                      <i className="uil uil-check me-2"></i> Success
                    </Button>
                    <Button type="button" color="warning">
                      <i className="uil uil-exclamation-triangle me-2"></i>{" "}
                      Warning
                    </Button>
                    <Button type="button" color="info">
                      <i className="uil uil-info-circle me-2"></i> Info
                    </Button>
                    <Button type="button" color="danger">
                      <i className="uil uil-exclamation-octagon me-2"></i>{" "}
                      Danger
                    </Button>
                    <Button type="button" color="purple">
                      <i className="uil uil-exclamation-octagon me-2"></i>{" "}
                      Purple
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">
                    Outline Buttons with Icon
                  </CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" outline color="primary">
                      <i className="uil uil-user me-2"></i> Primary
                    </Button>
                    <Button type="button" outline color="success">
                      <i className="uil uil-check me-2"></i> Success
                    </Button>
                    <Button type="button" outline color="warning">
                      <i className="uil uil-exclamation-triangle me-2"></i>{" "}
                      Warning
                    </Button>
                    <Button type="button" outline color="info">
                      <i className="uil uil-info-circle me-2"></i> Info
                    </Button>
                    <Button type="button" outline color="danger">
                      <i className="uil uil-exclamation-octagon me-2"></i>{" "}
                      Danger
                    </Button>
                    <Button type="button" outline color="purple">
                      <i className="uil uil-exclamation-octagon me-2"></i>{" "}
                      Purple
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Soft Buttons with Icon</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-soft-primary">
                      <i className="uil uil-user me-2"></i>Primary
                    </button>
                    <button type="button" className="btn btn-soft-success">
                      <i className="uil uil-check me-2"></i>Success
                    </button>
                    <button type="button" className="btn btn-soft-warning">
                      <i className="uil uil-exclamation-triangle me-2"></i>{" "}
                      Warning
                    </button>
                    <button type="button" className="btn btn-soft-info">
                      <i className="uil uil-info-circle me-2"></i> Info
                    </button>
                    <button type="button" className="btn btn-soft-danger">
                      <i className="uil uil-exclamation-octagon me-2"></i>{" "}
                      Danger
                    </button>
                    <button type="button" className="btn btn-soft-purple">
                      <i className="uil uil-exclamation-octagon me-2"></i>{" "}
                      Purple
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Default Icon Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" color="primary">
                      <i className="uil uil-user"></i>
                    </Button>
                    <Button type="button" color="success">
                      <i className="uil uil-check-circle"></i>
                    </Button>
                    <Button type="button" color="warning">
                      <i className="uil uil-exclamation-triangle"></i>
                    </Button>
                    <Button type="button" color="info">
                      <i className="uil uil-exclamation-octagon"></i>
                    </Button>
                    <Button type="button" color="purple">
                      <i className="uil uil-bag-alt"></i>
                    </Button>
                    <Button type="button" color="danger">
                      <i className="uil uil-ban"></i>
                    </Button>
                    <Button type="button" color="secondary">
                      <i className="uil uil-location-arrow-alt"></i>
                    </Button>
                    <Button type="button" color="light">
                      <i className="uil uil-moon"></i>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Outline Icon Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" outline color="primary">
                      <i className="uil uil-user"></i>
                    </Button>
                    <Button type="button" outline color="success">
                      <i className="uil uil-check-circle"></i>
                    </Button>
                    <Button type="button" outline color="warning">
                      <i className="uil uil-exclamation-triangle"></i>
                    </Button>
                    <Button type="button" outline color="info">
                      <i className="uil uil-exclamation-octagon"></i>
                    </Button>
                    <Button type="button" outline color="purple">
                      <i className="uil uil-bag-alt"></i>
                    </Button>
                    <Button type="button" outline color="danger">
                      <i className="uil uil-ban"></i>
                    </Button>
                    <Button type="button" outline color="secondary">
                      <i className="uil uil-location-arrow-alt"></i>
                    </Button>
                    <Button type="button" outline color="light">
                      <i className="uil uil-moon"></i>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Soft Icon Buttons</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-soft-primary">
                      <i className="uil uil-user"></i>
                    </button>
                    <button type="button" className="btn btn-soft-success">
                      <i className="uil uil-check-circle"></i>
                    </button>
                    <button type="button" className="btn btn-soft-warning">
                      <i className="uil uil-exclamation-triangle"></i>
                    </button>
                    <button type="button" className="btn btn-soft-info">
                      <i className="uil uil-exclamation-octagon"></i>
                    </button>
                    <button type="button" className="btn btn-soft-purple">
                      <i className="uil uil-bag-alt"></i>
                    </button>
                    <button type="button" className="btn btn-soft-danger">
                      <i className="uil uil-ban"></i>
                    </button>
                    <button type="button" className="btn btn-soft-secondary">
                      <i className="uil uil-location-arrow-alt"></i>
                    </button>
                    <button type="button" className="btn btn-soft-light">
                      <i className="uil uil-moon"></i>
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Button Tags</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <div className="button-items">
                      <Link className="btn btn-primary" to="#" role="button">
                        Link
                      </Link>{" "}
                      <Button color="success" type="submit">
                        Button
                      </Button>{" "}
                      <input
                        className="btn btn-info"
                        type="button"
                        value="Input"
                      />{" "}
                      <input
                        className="btn btn-danger"
                        type="submit"
                        value="Submit"
                      />{" "}
                      <input
                        className="btn btn-warning"
                        type="reset"
                        value="Reset"
                      />{" "}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Toggle States</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <Button type="button" color="primary">
                      Single toggle
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Button Toolbar</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <div
                      className="btn-toolbar"
                      role="toolbar"
                      aria-label="Toolbar with button groups"
                    >
                      <div
                        className="btn-group me-2"
                        role="group"
                        aria-label="First group"
                      >
                        <Button type="button" color="light">
                          1
                        </Button>
                        <Button type="button" color="light">
                          2
                        </Button>
                        <Button type="button" color="light">
                          3
                        </Button>
                        <Button type="button" color="light">
                          4
                        </Button>
                      </div>
                      <div
                        className="btn-group me-2"
                        role="group"
                        aria-label="Second group"
                      >
                        <Button type="button" color="light">
                          5
                        </Button>
                        <Button type="button" color="light">
                          6
                        </Button>
                        <Button type="button" color="light">
                          7
                        </Button>
                      </div>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Third group"
                      >
                        <Button type="button" color="light">
                          8
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Button Group</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <Button type="button" color="primary">
                          Left
                        </Button>
                        <Button type="button" color="primary">
                          Middle
                        </Button>
                        <Button type="button" color="primary">
                          Right
                        </Button>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div
                        className="btn-group mt-4 mt-md-0"
                        role="group"
                        aria-label="Basic example"
                      >
                        <Button type="button" color="light">
                          <i className="uil uil-align-left"></i>
                        </Button>
                        <Button type="button" color="light">
                          <i className="uil uil-align-center-alt"></i>
                        </Button>
                        <Button type="button" color="light">
                          <i className="uil uil-align-right"></i>
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Buttons Width</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="button" color="primary" className="w-xs">
                      Xs
                    </Button>
                    <Button type="button" color="danger" className="w-sm">
                      Small
                    </Button>
                    <Button type="button" color="warning" className="w-md">
                      Medium
                    </Button>
                    <Button type="button" color="success" className="w-lg">
                      Large
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Buttons Sizes</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <Button type="button" color="primary" className="btn-lg">
                      Large button
                    </Button>
                    <Button type="button" color="light" className="btn-lg">
                      Large button
                    </Button>
                    <Button type="button" color="primary" className="btn-sm">
                      Small button
                    </Button>
                    <Button type="button" color="light" className="btn-sm">
                      Small button
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Sizing</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-2">
                    <ButtonGroup
                      className="btn-group-lg"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Button type="button" color="primary">
                        Left
                      </Button>
                      <Button type="button" color="primary">
                        Middle
                      </Button>
                      <Button type="button" color="primary">
                        Right
                      </Button>
                    </ButtonGroup>

                    <br />

                    <ButtonGroup
                      className="mt-2"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Button type="button" color="light">
                        Left
                      </Button>
                      <Button type="button" color="light">
                        Middle
                      </Button>
                      <Button type="button" color="light">
                        Right
                      </Button>
                    </ButtonGroup>

                    <br />

                    <ButtonGroup
                      className="btn-group-sm mt-2"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Button type="button" color="danger">
                        Left
                      </Button>
                      <Button type="button" color="danger">
                        Middle
                      </Button>
                      <Button type="button" color="danger">
                        Right
                      </Button>
                    </ButtonGroup>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Block Buttons</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      color="primary"
                      className="btn-lg btn-block mb-1"
                    >
                      Block level button
                    </Button>
                    <Button
                      type="button"
                      color="light"
                      className="btn-sm btn-block"
                    >
                      Block level button
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Checkbox & Radio Buttons</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic checkbox toggle button group"
                    >
                      <input
                        type="checkbox"
                        className="btn-check"
                        id="btncheck1"
                        defaultChecked
                      />
                      <label className="btn btn-primary" htmlFor="btncheck1">
                        Checkbox 1
                      </label>

                      <input
                        type="checkbox"
                        className="btn-check"
                        id="btncheck2"
                      />
                      <label className="btn btn-primary" htmlFor="btncheck2">
                        Checkbox 2
                      </label>

                      <input
                        type="checkbox"
                        className="btn-check"
                        id="btncheck3"
                      />
                      <label className="btn btn-primary" htmlFor="btncheck3">
                        Checkbox 3
                      </label>
                    </div>

                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio1"
                        defaultChecked
                      />
                      <label
                        className="btn btn-outline-secondary"
                        htmlFor="btnradio1"
                      >
                        Radio 1
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio2"
                      />
                      <label
                        className="btn btn-outline-secondary"
                        htmlFor="btnradio2"
                      >
                        Radio 2
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio3"
                      />
                      <label
                        className="btn btn-outline-secondary"
                        htmlFor="btnradio3"
                      >
                        Radio 3
                      </label>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Vertical Variation</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/buttons/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div
                    className="btn-group-vertical"
                    role="group"
                    aria-label="Vertical button group"
                  >
                    <button type="button" className="btn btn-light">
                      Button
                    </button>
                    <UncontrolledDropdown>
                      <DropdownToggle type="button" className="btn btn-light">
                        Dropdown <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem to="#">Dropdown link</DropdownItem>
                        <DropdownItem to="#">Dropdown link</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <button type="button" className="btn btn-light">
                      Button
                    </button>
                    <button type="button" className="btn btn-light">
                      Button
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Disabled state</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/button-group/#disabled-state"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        className="btn btn-primary"
                        disabled
                      >
                        Primary button
                      </Button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled
                      >
                        Button
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        disabled
                      >
                        Primary button
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled
                      >
                        Button
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        to=""
                        className="btn btn-primary disabled"
                        role="button"
                        aria-disabled="true"
                      >
                        Primary link
                      </Link>
                      <Link
                        to=""
                        className="btn btn-secondary disabled"
                        role="button"
                        aria-disabled="true"
                      >
                        Link
                      </Link>
                      <Link
                        to=""
                        className="btn btn-outline-primary disabled"
                        role="button"
                        aria-disabled="true"
                      >
                        Primary link
                      </Link>
                      <Link
                        to=""
                        className="btn btn-outline-secondary disabled"
                        role="button"
                        aria-disabled="true"
                      >
                        Link
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Close Button</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/close-button/#example"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <button
                    type="button"
                    className="btn-close btn-close-white text-bg-info"
                    disabled
                    aria-label="Close"
                  ></button>
                  <button
                    type="button"
                    className="btn-close text-bg-secondary"
                    aria-label="Close"
                  ></button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiButton;
