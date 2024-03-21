import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Tooltip,
  Col,
  Row,
  Card,
  CardBody,
  Container,
  Spinner,
  Badge,
  UncontrolledPopover,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiGeneral = () => {
  const [popovertop, setpopovertop] = useState(false);
  const [popoverleft, setpopoverleft] = useState(false);
  const [popoverright, setpopoverright] = useState(false);
  const [popoverbottom, setpopoverbottom] = useState(false);
  const [popoverdismiss, setpopoverdismiss] = useState(false);

  const [ttop, setttop] = useState(false);
  const [tbottom, settbottom] = useState(false);
  const [tleft, settleft] = useState(false);
  const [tright, settright] = useState(false);
  const [lefthtml, settlefthtml] = useState(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="UI Elements" breadcrumbItem="General" />

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Default Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Badge color="link" className="bg-primary">
                    Primary
                  </Badge>{" "}
                  <Badge className="bg-secondary">Secondary</Badge>{" "}
                  <Badge className="bg-success">Success</Badge>{" "}
                  <Badge className="bg-info">Info</Badge>{" "}
                  <Badge className="bg-warning">Warning</Badge>{" "}
                  <Badge className="bg-purple">Purple</Badge>{" "}
                  <Badge className="bg-danger">Danger</Badge>{" "}
                  <Badge className="bg-dark">Dark</Badge>{" "}
                  <Badge className="bg-light">Light</Badge>{" "}
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Soft Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Badge color="link" pill className="badge-soft-primary">
                    Primary
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-secondary">
                    Secondary
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-success">
                    Success
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-info">
                    Info
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-warning">
                    Warning
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-purple">
                    Purple
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-danger">
                    Danger
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-dark">
                    Dark
                  </Badge>{" "}
                  <Badge color="link" pill className="badge-soft-light">
                    Light
                  </Badge>{" "}
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Outline Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Badge color="link" className="badge-outline-primary">
                    Primary
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-secondary">
                    Secondary
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-success">
                    Success
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-info">
                    Info
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-warning">
                    Warning
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-purple">
                    Purple
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-danger">
                    Danger
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-dark">
                    Dark
                  </Badge>{" "}
                  <Badge color="link" className="badge-outline-light">
                    Light
                  </Badge>{" "}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Pill Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Badge pill className="rounded-pill bg-primary">
                    Primary
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-secondary">
                    Secondary
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-success">
                    Success
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-purple">
                    purple
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-info">
                    Info
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-warning">
                    Warning
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-danger">
                    Danger
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-dark">
                    Dark
                  </Badge>{" "}
                  <Badge pill className="rounded-pill bg-light">
                    Light
                  </Badge>{" "}
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Rounded Soft Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-primary"
                  >
                    Primary
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-secondary"
                  >
                    Secondary
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-success"
                  >
                    Success
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-info"
                  >
                    Info
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-warning"
                  >
                    Warning
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-purple"
                  >
                    Purple
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-danger"
                  >
                    Danger
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-dark"
                  >
                    Dark
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-soft-light"
                  >
                    Light
                  </Badge>{" "}
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Outline Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-primary"
                  >
                    Primary
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-secondary"
                  >
                    Secondary
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-success"
                  >
                    Success
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-info"
                  >
                    Info
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-warning"
                  >
                    Warning
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-purple"
                  >
                    Purple
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-danger"
                  >
                    Danger
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-dark"
                  >
                    Dark
                  </Badge>{" "}
                  <Badge
                    color="link"
                    pill
                    className="rounded-pill badge-outline-light"
                  >
                    Light
                  </Badge>{" "}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Buttons with Badges</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-3">
                    <Button color="primary">
                      Notifications{" "}
                      <span className="badge bg-success ms-1">4</span>
                    </Button>
                    <Button color="success">
                      Messages <span className="badge bg-danger ms-1">2</span>
                    </Button>
                    <Button outline color="secondary">
                      Draft <span className="badge bg-success ms-1">2</span>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Badges Position Examples</h4>
                  <Link
                    to="//reactstrap.github.io/components/badge/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="d-flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn btn-primary position-relative"
                    >
                      Mails{" "}
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                        +99{" "}
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light position-relative"
                    >
                      Alerts{" "}
                      <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1">
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary position-relative p-0 avatar-sm rounded"
                    >
                      <span className="avatar-title bg-transparent">
                        <i className="bx bxs-envelope"></i>
                      </span>
                      <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1">
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light position-relative p-0 avatar-sm rounded-circle"
                    >
                      <span className="avatar-title bg-transparent text-reset">
                        <i className="bx bxs-bell"></i>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light position-relative p-0 avatar-sm rounded-circle"
                    >
                      <span className="avatar-title bg-transparent text-reset">
                        <i className="bx bx-menu"></i>
                      </span>
                      <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-success p-1">
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <div className="col-12">
              <div className="mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Popovers & Tooltips
                </h5>
              </div>
              <Row>
                <Col xl={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Popovers</h4>
                      <Link
                        to="//reactstrap.github.io/components/popovers/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          id="Popovertop"
                          color="light"
                          onClick={() => {
                            setpopovertop(!popovertop);
                          }}
                        >
                          Popover on top
                        </Button>
                        <Popover
                          placement="top"
                          isOpen={popovertop}
                          target="Popovertop"
                          toggle={() => {
                            setpopovertop(!popovertop);
                          }}
                        >
                          <PopoverBody>
                            Vivamus sagittis lacus vel augue laoreet rutrum
                            faucibus.
                          </PopoverBody>
                        </Popover>{" "}
                        <Button
                          id="Popoverright"
                          onClick={() => {
                            setpopoverright(!popoverright);
                          }}
                          color="light"
                        >
                          Popover on right
                        </Button>
                        <Popover
                          placement="right"
                          isOpen={popoverright}
                          target="Popoverright"
                          toggle={() => {
                            setpopoverright(!popoverright);
                          }}
                        >
                          <PopoverBody>
                            Vivamus sagittis lacus vel augue laoreet rutrum
                            faucibus.
                          </PopoverBody>
                        </Popover>{" "}
                        <Button
                          id="Popoverbottom"
                          onClick={() => {
                            setpopoverbottom(!popoverbottom);
                          }}
                          color="light"
                        >
                          Popover on bottom
                        </Button>
                        <Popover
                          placement="bottom"
                          isOpen={popoverbottom}
                          target="Popoverbottom"
                          toggle={() => {
                            setpopoverbottom(!popoverbottom);
                          }}
                        >
                          <PopoverBody>
                            Vivamus sagittis lacus vel augue laoreet rutrum
                            faucibus.
                          </PopoverBody>
                        </Popover>{" "}
                        <Button
                          id="Popoverleft"
                          onClick={() => {
                            setpopoverleft(!popoverleft);
                          }}
                          color="light"
                        >
                          Popover on left
                        </Button>
                        <Popover
                          placement="left"
                          isOpen={popoverleft}
                          target="Popoverleft"
                          toggle={() => {
                            setpopoverleft(!popoverleft);
                          }}
                        >
                          <PopoverBody>
                            Vivamus sagittis lacus vel augue laoreet rutrum
                            faucibus.
                          </PopoverBody>
                        </Popover>{" "}
                        <Button
                          id="Popoverdismiss"
                          className="btn btn-success"
                          onClick={() => {
                            setpopoverdismiss(!popoverdismiss);
                          }}
                        >
                          Dismissible popover
                        </Button>
                        <UncontrolledPopover
                          trigger="focus"
                          target="Popoverdismiss"
                          placement="right"
                        >
                          <PopoverHeader>Dismissible popover</PopoverHeader>
                          <PopoverBody>
                            Vivamus sagittis lacus vel augue laoreet rutrum
                            faucibus
                          </PopoverBody>
                        </UncontrolledPopover>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Tooltips</h4>
                      <Link
                        to="//reactstrap.github.io/components/tooltips/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex flex-wrap gap-2">
                        <Tooltip
                          placement="top"
                          isOpen={ttop}
                          target="TooltipTop"
                          toggle={() => {
                            setttop(!ttop);
                          }}
                        >
                          Hello world!
                        </Tooltip>
                        <Tooltip
                          placement="right"
                          isOpen={tright}
                          target="TooltipRight"
                          toggle={() => {
                            settright(!tright);
                          }}
                        >
                          Hello world!
                        </Tooltip>
                        <Tooltip
                          placement="bottom"
                          isOpen={tbottom}
                          target="TooltipBottom"
                          toggle={() => {
                            settbottom(!tbottom);
                          }}
                        >
                          Hello world!
                        </Tooltip>
                        <Tooltip
                          placement="left"
                          isOpen={tleft}
                          target="TooltipLeft"
                          toggle={() => {
                            settleft(!tleft);
                          }}
                        >
                          Hello world!
                        </Tooltip>
                        <Tooltip
                          placement="top"
                          isOpen={lefthtml}
                          target="TooltipHtml"
                          toggle={() => {
                            settlefthtml(!lefthtml);
                          }}
                        >
                          <em>Tooltip</em> <u>with</u> <b>HTML</b>
                        </Tooltip>
                        <Button color="light" id="TooltipTop">
                          {" "}
                          Tooltip on top
                        </Button>
                        <Button color="light" id="TooltipBottom">
                          {" "}
                          Tooltip on Bottom
                        </Button>
                        <Button color="light" id="TooltipLeft">
                          {" "}
                          Tooltip on Left
                        </Button>
                        <Button color="light" id="TooltipRight">
                          {" "}
                          Tooltip on Right
                        </Button>
                        <Button color="primary" id="TooltipHtml">
                          {" "}
                          Tooltip with HTML
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <div className="mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Pagination
                </h5>
              </div>
              <Row>
                <Col xl={4}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Default Pagination</h4>
                      <Link
                        to="//reactstrap.github.io/components/pagination/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <Pagination aria-label="Page navigation example">
                        <PaginationItem>
                          <PaginationLink href="#">Previous</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">Next</PaginationLink>
                        </PaginationItem>
                      </Pagination>

                      <Pagination aria-label="Page navigation example">
                        <PaginationItem>
                          <PaginationLink href="#" previous>
                            <i className="mdi mdi-chevron-left" />
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink next>
                            <i className="mdi mdi-chevron-right" />
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={4}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Disabled and Active States</h4>
                      <Link
                        to="//reactstrap.github.io/components/pagination/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>

                    <CardBody>
                      <Pagination aria-label="Page navigation example">
                        <PaginationItem disabled>
                          <PaginationLink href="#" tabIndex={-1}>
                            Previous
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem active>
                          <PaginationLink href="#">
                            2 <span className="sr-only">(current)</span>
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">Next</PaginationLink>
                        </PaginationItem>
                      </Pagination>

                      <Pagination aria-label="Page navigation example">
                        <PaginationItem disabled>
                          <PaginationLink>
                            <i className="mdi mdi-chevron-left" />
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem active>
                          <PaginationLink>
                            2<span className="sr-only">(current)</span>
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">
                            <i className="mdi mdi-chevron-right" />
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={4}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Pagination Alignment</h4>
                      <Link
                        to="//reactstrap.github.io/components/pagination/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                          <PaginationItem className="disabled">
                            <PaginationLink href="#">Previous</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">Next</PaginationLink>
                          </PaginationItem>
                        </ul>
                      </nav>

                      <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-end">
                          <PaginationItem className="disabled">
                            <PaginationLink href="#">Previous</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">Next</PaginationLink>
                          </PaginationItem>
                        </ul>
                      </nav>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Pagination Sizing</h4>
                  <Link
                    to="//reactstrap.github.io/components/pagination/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Pagination size="lg" aria-label="Page">
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>

                  <Pagination size="sm" aria-label="Page">
                    <PaginationItem disabled>
                      <PaginationLink href="#" tabIndex={-1}>
                        Previous
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">Next</PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Pagination Rounded</h4>
                  <Link
                    to="//reactstrap.github.io/components/pagination/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <Pagination className="pagination pagination-rounded">
                    <PaginationItem className="page-item disabled">
                      <PaginationLink className="page-link">
                        <i className="mdi mdi-chevron-left"></i>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="page-item">
                      <Link className="page-link" to="#">
                        1
                      </Link>
                    </PaginationItem>
                    <PaginationItem className="page-item active">
                      <PaginationLink className="page-link">
                        2<span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="page-item">
                      <Link className="page-link" to="#">
                        3
                      </Link>
                    </PaginationItem>
                    <PaginationItem className="page-item">
                      <PaginationLink className="page-link" href="#">
                        <i className="mdi mdi-chevron-right"></i>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}></Col>
          </Row>

          <Row>
            <Col className="col-12">
              <div className="mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Breadcrumb
                </h5>
              </div>
              <Row>
                <Col xl="6">
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Example</h4>
                      <Link
                        to="https://getbootstrap.com/docs/5.2/components/breadcrumb/#example"
                        target="_blank"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Breadcrumb>
                          <BreadcrumbItem active>Home</BreadcrumbItem>
                          <BreadcrumbItem>Library</BreadcrumbItem>
                        </Breadcrumb>

                        <Breadcrumb>
                          <BreadcrumbItem active>Home</BreadcrumbItem>
                          <BreadcrumbItem>Library</BreadcrumbItem>
                          <BreadcrumbItem>Data</BreadcrumbItem>
                        </Breadcrumb>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl="6">
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Dividers</h4>
                      <Link
                        to="https://getbootstrap.com/docs/5.2/components/breadcrumb/#example"
                        target="_blank"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Breadcrumb>
                          <BreadcrumbItem active>Library</BreadcrumbItem>
                        </Breadcrumb>
                        <Breadcrumb>
                          <BreadcrumbItem>
                            <a href="#">Home</a>
                          </BreadcrumbItem>
                          <BreadcrumbItem>
                            <a href="#">Library</a>
                          </BreadcrumbItem>
                          <BreadcrumbItem active>Data</BreadcrumbItem>
                        </Breadcrumb>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <div className="col-12">
              <div className="mt-3 mb-4">
                <h5 className="mb-0 pb-1 text-decoration-underline">
                  Spinners
                </h5>
              </div>
              <Row>
                <Col xl={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Border Spinner</h4>
                      <Link
                        to="//reactstrap.github.io/components/spinners/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Spinner
                          className="spinner-border text-primary m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-secondary m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-success m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-info m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-warning m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-danger m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-purple m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-dark m-1"
                          role="status"
                        ></Spinner>
                        <Spinner
                          className="spinner-border text-light m-1"
                          role="status"
                        ></Spinner>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={6}>
                  <Card>
                    <CardHeader className="justify-content-between d-flex align-items-center">
                      <h4 className="card-title">Growing Spinner</h4>
                      <Link
                        to="//reactstrap.github.io/components/spinners/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-soft-secondary"
                      >
                        Docs{" "}
                        <i className="mdi mdi-arrow-right align-middle"></i>
                      </Link>
                    </CardHeader>
                    <CardBody>
                      <div>
                        <Spinner type="grow" className="m-1" color="primary" />
                        <Spinner
                          type="grow"
                          className="m-1"
                          color="secondary"
                        />
                        <Spinner type="grow" className="m-1" color="success" />
                        <Spinner type="grow" className="m-1" color="danger" />
                        <Spinner type="grow" className="m-1" color="warning" />
                        <Spinner type="grow" className="m-1" color="info" />
                        <Spinner type="grow" className="m-1" color="light" />
                        <Spinner type="grow" className="m-1" color="dark" />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiGeneral;
