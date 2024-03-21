import React from "react";
import {Link} from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import avatar10 from "../../assets/images/users/avatar-10.jpg";
import img3 from "../../assets/images/small/img-3.jpg";

const Utilities = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs folder="UI Elements" breadcrumbItem="Utilities" />
                    <Row>
                        <Col xl={6}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Background Colors</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="p-3 mb-2 bg-primary text-white">.bg-primary</div>
                                    <div className="p-3 mb-2 bg-secondary text-white">.bg-secondary</div>
                                    <div className="p-3 mb-2 bg-success text-white">.bg-success</div>
                                    <div className="p-3 mb-2 bg-danger text-white">.bg-danger</div>
                                    <div className="p-3 mb-2 bg-warning text-dark">.bg-warning</div>
                                    <div className="p-3 mb-2 bg-info text-dark">.bg-info</div>
                                    <div className="p-3 mb-2 bg-light text-dark">.bg-light</div>
                                    <div className="p-3 mb-2 bg-dark text-white">.bg-dark</div>
                                    <div className="p-3 mb-2 bg-white text-black-50">.bg-white</div>
                                    <div className="p-3 bg-transparent text-dark">.bg-transparent</div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Background Gradient</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="p-3 mb-2 bg-primary bg-gradient text-white">.bg-primary .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-secondary bg-gradient text-white">.bg-secondary .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-success bg-gradient text-white">.bg-success .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-danger bg-gradient text-white">.bg-danger .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-warning bg-gradient text-dark">.bg-warning .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-info bg-gradient text-dark">.bg-info .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-light bg-gradient text-dark">.bg-light .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-dark bg-gradient text-white">.bg-dark .bg-gradient</div>
                                    <div className="p-3 mb-2 bg-white bg-gradient text-black-50">.bg-white .bg-gradient</div>
                                    <div className="p-3 bg-transparent bg-gradient text-dark">.bg-transparent .bg-gradient</div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Additive Border</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-top border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-end border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-bottom border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border-start border-primary bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Subtractive Border</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-top-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-end-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-bottom-0 border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-start-0 border-primary bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Border Colors</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-primary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-secondary bg-light p-5 d-inline-block"></span>
                                        <span className="border border-success bg-light p-5 d-inline-block"></span>
                                        <span className="border border-purple bg-light p-5 d-inline-block"></span>
                                        <span className="border border-warning bg-light p-5 d-inline-block"></span>
                                        <span className="border border-danger bg-light p-5 d-inline-block"></span>
                                        <span className="border border-info bg-light p-5 d-inline-block"></span>
                                        <span className="border border-dark bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Border Width</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="border border-1 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-2 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-3 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-4 bg-light p-5 d-inline-block"></span>
                                        <span className="border border-5 bg-light p-5 d-inline-block"></span>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Border Radius</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-3 align-items-center">
                                        <img src={avatar10} className="rounded avatar-xl" alt=" " />
                                        <img src={avatar10} className="rounded-top avatar-xl" alt="" />
                                        <img src={avatar10} className="rounded-end avatar-xl" alt="" />
                                        <img src={avatar10} className="rounded-bottom avatar-xl" alt="" />
                                        <img src={avatar10} className="rounded-start avatar-xl" alt="" />
                                        <img src={avatar10} className="rounded-circle avatar-xl" alt="" />
                                        <img src={img3} alt="" className="rounded-pill w-25 h-auto" />
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Rounded Sizes</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-wrap gap-2">
                                        <img src={avatar10} className="rounded-0 avatar-xl" alt=" " />
                                        <img src={avatar10} className="rounded-1 avatar-xl" alt="" />
                                        <img src={avatar10} className="rounded-2 avatar-xl" alt="" />
                                        <img src={avatar10} className="rounded-3 avatar-xl" alt="" />
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl="12">
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Colors</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xl={4}>
                                            <p className="text-primary">.text-primary</p>
                                            <p className="text-secondary">.text-secondary</p>
                                            <p className="text-success">.text-success</p>
                                            <p className="text-danger mb-3 mb-lg-0">.text-danger</p>
                                        </Col>
                                        <Col xl={4}>
                                            <p className="text-info">.text-info</p>
                                            <p className="text-muted">.text-muted</p>
                                            <p className="text-dark">.text-dark</p>
                                            <p className="text-black-50 mb-3 mb-lg-0">.text-black-50</p>
                                        </Col>
                                        <Col xl={4}>
                                            <p className="text-warning bg-dark">.text-warning</p>
                                            <p className="text-light bg-dark">.text-light</p>
                                            <p className="text-white bg-dark">.text-white</p>
                                            <p className="text-white-50 bg-dark mb-0">.text-white-50</p>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Direction of Flex Row & Reverse</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-row border bg-light mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex flex-row-reverse bg-light border ">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Grow and Shrink</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex bg-light">
                                        <div className="p-2 flex-grow-1 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Third flex item</div>
                                    </div>
                                    <div className="d-flex bg-light mt-3">
                                        <div className="p-2 w-100 border">Flex item</div>
                                        <div className="p-2 flex-shrink-1 border">Flexitem</div>
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Enable Flex Behaviors</h4>
                                    <Link to="https://getbootstrap.com/docs/5.0/utilities/flex/#enable-flex-behaviors" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex p-2 border bg-light mb-2">I&apos;m a flexbox container!</div>
                                    <div className="d-inline-flex p-2 border bg-light">I&apos;m an inline flexbox container!</div>
                                </CardBody>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Justify Content</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex justify-content-start bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex justify-content-end bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex justify-content-center bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex justify-content-between bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex justify-content-around bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex justify-content-evenly bg-light border mb-0">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Wrap</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-nowrap bg-light border mb-3" style={{ width: "16rem" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                    </div>
                                    <div className="d-flex flex-wrap bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div className="d-flex flex-wrap-reverse bg-light border mb-0">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                </CardBody>
                            </div>
                        </Col>

                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Direction of Flex Column & Reverse</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-column bg-light border mb-3">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex flex-column-reverse bg-light border">
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Align Self</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="align-self-start p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="align-self-end p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="align-self-center p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="align-self-baseline p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex bg-light border mb-0" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="align-self-stretch p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Align Items</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex align-items-start bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex align-items-end bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex align-items-center bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex align-items-baseline bg-light border mb-3" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                    <div className="d-flex align-items-stretch bg-light border mb-0" style={{ height: "104px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">With Alignitems</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex align-items-start flex-column bg-light border mb-3" style={{ height: "200px" }}>
                                        <div className="mb-auto p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                    </div>

                                    <div className="d-flex align-items-end flex-column bg-light border mb-0" style={{ height: "200px" }}>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="mt-auto p-2 border">Flex item</div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Fill</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex border bg-light">
                                        <div className="p-2 flex-fill border">Flex item with a lot of content</div>
                                        <div className="p-2 flex-fill border">Flex item</div>
                                        <div className="p-2 flex-fill border">Flex item</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Auto Margins</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex border bg-light mb-3">
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                    </div>

                                    <div className="d-flex border bg-light mb-3">
                                        <div className="me-auto p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                    </div>

                                    <div className="d-flex border bg-light mb-0">
                                        <div className="p-2 border">Flex item</div>
                                        <div className="p-2 border">Flex item</div>
                                        <div className="ms-auto p-2 border">Flex item</div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Gap</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-grid gap-3">
                                        <div className="p-2 bg-light border">Grid item 1</div>
                                        <div className="p-2 bg-light border">Grid item 2</div>
                                        <div className="p-2 bg-light border">Grid item 3</div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Wrapping and Overflow</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="badge bg-primary text-wrap" style={{ width: "6rem" }}>
                                        This text should wrap.
                                    </div>
                                </CardBody>
                                <div className="card-body pt-0">
                                    <div className="text-nowrap border bg-light" style={{ width: "8rem" }}>
                                        This text should overflow the parent.
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Word Break</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-break mb-0">mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm</p>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Font Size</h4>
                                    <Link to="https://getbootstrap.com/docs/5.0/utilities/text/#font-size" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                                </CardHeader>
                                <CardBody>
                                    <p className="fs-1 mb-1">.fs-1 text</p>
                                    <p className="fs-2 mb-1">.fs-2 text</p>
                                    <p className="fs-3 mb-1">.fs-3 text</p>
                                    <p className="fs-4 mb-1">.fs-4 text</p>
                                    <p className="fs-5 mb-1">.fs-5 text</p>
                                    <p className="fs-6 mb-0">.fs-6 text</p>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Align Content</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex align-content-start flex-wrap bg-light border mb-3" style={{ minHeight: "182px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                    </div>
                                    <div className="d-flex align-content-end flex-wrap bg-light border mb-3" style={{ minHeight: "182px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div className="d-flex align-content-center flex-wrap bg-light border mb-3" style={{ minHeight: "182px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div className="d-flex align-content-between flex-wrap bg-light border mb-3" style={{ minHeight: "182px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div className="d-flex align-content-around flex-wrap bg-light border mb-3" style={{ minHeight: "182px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                    <div className="d-flex align-content-stretch flex-wrap bg-light border mb-0" style={{ minHeight: "182px" }}>
                                        <div className="p-2 border">Flex item 1</div>
                                        <div className="p-2 border">Flex item 2</div>
                                        <div className="p-2 border">Flex item 3</div>
                                        <div className="p-2 border">Flex item 4</div>
                                        <div className="p-2 border">Flex item 5</div>
                                        <div className="p-2 border">Flex item 6</div>
                                        <div className="p-2 border">Flex item 7</div>
                                        <div className="p-2 border">Flex item 8</div>
                                        <div className="p-2 border">Flex item 9</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Order</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-flex flex-nowrap border bg-light">
                                        <div className="order-3 p-2 border">First flex item</div>
                                        <div className="order-2 p-2 border">Second flex item</div>
                                        <div className="order-1 p-2 border">Third flex item</div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Float</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="float-start">Float start on all viewport sizes</div><br />
                                    <div className="float-end">Float end on all viewport sizes</div><br />
                                    <div className="float-none">Don&apos;t float on all viewport sizes</div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Selection</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="user-select-all">This paragraph will be entirely selected when clicked by the user.</p>
                                    <p className="user-select-auto">This paragraph has default select behavior.</p>
                                    <p className="user-select-none">This paragraph will not be selectable when clicked by the user.</p>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Pointer Events</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p><Link to="#" className="pe-none" aria-disabled="true">This link</Link> can not be clicked.</p>
                                    <p><Link to="#" className="pe-auto">This link</Link> can be clicked (this is default behavior).</p>
                                    <p className="pe-none"><Link to="#" aria-disabled="true">This link</Link> can not be clicked because the <code>pointer-events</code> property is inherited from its parent. However, <Link to="#" className="pe-auto">this link</Link> has a <code>pe-auto</code> class and can be clicked.</p>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Alignment</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-start">Start aligned text on all viewport sizes.</p>
                                    <p className="text-center">Center aligned text on all viewport sizes.</p>
                                    <p className="text-end">End aligned text on all viewport sizes.</p>
                                    <p className="text-sm-start">Start aligned text on viewports sized SM (small) or wider.</p>
                                    <p className="text-md-start">Start aligned text on viewports sized MD (medium) or wider.</p>
                                    <p className="text-lg-start">Start aligned text on viewports sized LG (large) or wider.</p>
                                    <p className="text-xl-start mb-0">Start aligned text on viewports sized XL (extra-large) or wider.</p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col lg="12">
                            <div>
                                <h5 className="pb-1 text-decoration-underline">Stacks</h5>
                            </div>

                            <Row>
                                <Col xl={6}>
                                    <Card>
                                        <CardHeader className="justify-content-between d-flex align-items-center">
                                            <h4 className="card-title">Vertical</h4>
                                            <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="vstack gap-3">
                                                <div className="bg-light border p-1 px-2">First item</div>
                                                <div className="bg-light border p-1 px-2">Second item</div>
                                                <div className="bg-light border p-1 px-2">Third item</div>
                                            </div>

                                            <div className="mt-5">
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-chevron-right text-primary me-1"></i>Vertical Stacks Examples</h5>
                                                <div className="vstack gap-2 col-md-5 mx-auto">
                                                    <button type="button" className="btn btn-primary">Save changes</button>
                                                    <button type="button" className="btn btn-outline-secondary">Cancel</button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xl={6}>
                                    <Card>
                                        <CardHeader className="justify-content-between d-flex align-items-center">
                                            <h4 className="card-title">Horizontal</h4>
                                            <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="hstack gap-3">
                                                <div className="bg-light border p-1 px-2">First item</div>
                                                <div className="bg-light border p-1 px-2">Second item</div>
                                                <div className="bg-light border p-1 px-2">Third item</div>
                                            </div>

                                            <div className="mt-4">
                                                <p className="card-title-desc mb-3">Using horizontal margin utilities like <code>.ms-auto</code> as spacers:</p>

                                                <div className="hstack gap-3">
                                                    <div className="bg-light border p-1 px-2">First item</div>
                                                    <div className="bg-light border p-1 px-2 ms-auto">Second item</div>
                                                    <div className="bg-light border p-1 px-2">Third item</div>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <h5 className="font-size-14 mb-3"><i className="mdi mdi-chevron-right text-primary me-1"></i> Horizontal Stacks Examples</h5>
                                                <div className="hstack gap-3">
                                                    <input className="form-control me-auto" type="text" placeholder="Add your item here..." />
                                                    <button type="button" className="btn btn-primary">Submit</button>
                                                    <div className="vr"></div>
                                                    <button type="button" className="btn btn-outline-secondary">Reset</button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                            </Row>

                        </Col>

                    </Row>

                    <Row>
                        <div className="col-xl-3">
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Auto</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div className="overflow-auto p-3 mb-0 me-md-3 bg-light" style={{ height: "100px" }}>
                                            This is an example of using <code>.overflow-auto</code> on an element with set width and height dimensions. By design, this content will vertically scroll.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-xl-3">
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Hidden</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div className="overflow-hidden p-3 mb-0 me-md-3 bg-light" style={{ maxHeight: "100px" }}>
                                            This is an example of using <code>.overflow-hidden</code> on an element with set width and height dimensions. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-xl-3">
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Visible</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div className="overflow-visible p-3 mb-0 me-md-3 bg-light" style={{ maxHeight: "100px" }}>
                                            This is an example of using <code>.overflow-visible</code> on an element with set width and height dimensions.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-xl-3">
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Overflow Scroll</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-md-flex bg-light">
                                        <div className="overflow-scroll mb-0 p-3 bg-light" style={{ maxHeight: "100px" }}>
                                            This is an example of using <code>.overflow-scroll</code> on an element with set width and height dimensions. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Arrange Elements</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="position-relative p-5 bg-light m-3 border rounded" style={{ height: "180px" }}>
                                        <div className="position-absolute top-0 start-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 end-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-50 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-50 end-50 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 start-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 end-0 avatar-sm bg-dark rounded"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Center Elements</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="position-relative m-3 bg-light border rounded" style={{ height: "180px" }}>
                                        <div className="position-absolute top-0 start-0 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 start-100 translate-middle avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute top-50 start-0 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-100 translate-middle avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute top-100 start-0 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-100 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-100 start-100 translate-middle avatar-sm bg-dark rounded"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Center Elements</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="position-relative m-3 bg-light border rounded" style={{ height: "180px" }}>
                                        <div className="position-absolute top-0 start-0 avatar-sm bg-dark rounded "></div>
                                        <div className="position-absolute top-0 start-50 translate-middle-x avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-0 end-0 avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute top-50 start-0 translate-middle-y avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 start-50 translate-middle avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute top-50 end-0 translate-middle-y avatar-sm bg-dark rounded"></div>

                                        <div className="position-absolute bottom-0 start-0 avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 start-50 translate-middle-x avatar-sm bg-dark rounded"></div>
                                        <div className="position-absolute bottom-0 end-0 avatar-sm bg-dark rounded"></div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Shadows</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="shadow-none p-3 mb-3 bg-light rounded">No shadow</div>
                                    <div className="shadow-sm p-3 mb-3 bg-body rounded">Small shadow</div>
                                    <div className="shadow p-3 mb-3 bg-body rounded">Regular shadow</div>
                                    <div className="shadow-lg p-3 mb-0 bg-body rounded">Larger shadow</div>
                                </CardBody>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Width</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="w-25 p-3 bg-light">Width 25%</div>
                                    <div className="w-50 p-3 bg-light">Width 50%</div>
                                    <div className="w-75 p-3 bg-light">Width 75%</div>
                                    <div className="w-100 p-3 bg-light">Width 100%</div>
                                    <div className="w-auto p-3 bg-light">Width auto</div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Height</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="" style={{ height: "264px" }}>
                                        <div className="h-25 p-3 bg-light d-inline-block" style={{ width: "92px" }}>Height25%</div>{" "}
                                        <div className="h-50 p-3 bg-light d-inline-block" style={{ width: "92px" }}>Height 50%</div>{" "}
                                        <div className="h-75 p-3 bg-light d-inline-block" style={{ width: "92px" }}>Height 75%</div>{" "}
                                        <div className="h-100 p-3 bg-light d-inline-block" style={{ width: "92px" }}>Height 100%</div>{" "}
                                        <div className="h-auto p-3 bg-light d-inline-block" style={{ width: "92px" }}>Height auto</div>{" "}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Line Height</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="lh-1">This is a long paragraph written to show how the line-height of an element is affected by our utilities.</p>
                                    <p className="lh-sm">This is a long paragraph written to show how the line-height of an element is affected by our utilities.</p>
                                    <p className="lh-base">This is a long paragraph written to show how the line-height of an element is affected by our utilities.</p>
                                    <p className="lh-lg mb-0">This is a long paragraph written to show how the line-height of an element is affected by our utilities.</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Font Weight and Italics</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="fw-bold mb-2">Bold text.</p>
                                    <p className="fw-bolder mb-2">Bolder weight text (relative to the parent element).</p>
                                    <p className="fw-normal mb-2">Normal weight text.</p>
                                    <p className="fw-light mb-2">Light weight text.</p>
                                    <p className="fw-lighter mb-2">Lighter weight text (relative to the parent element).</p>
                                    <p className="fst-italic mb-2">Italic text.</p>
                                    <p className="fst-normal mb-0">Text with normal font style</p>
                                </CardBody>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Display Property</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="d-inline p-2 bg-primary text-white">d-inline</div>{" "}
                                    <div className="d-inline p-2 bg-dark text-white">d-inline</div>
                                </CardBody>

                                <CardBody>
                                    <span className="d-block p-2 bg-primary text-white">d-block</span>
                                    <span className="d-block p-2 bg-dark text-white">d-block</span>
                                </CardBody>
                            </div>
                        </Col>

                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Transform</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-lowercase">Lowercased text.</p>
                                    <p className="text-uppercase">Uppercased text.</p>
                                    <p className="text-capitalize mb-0">CapiTaliZed text.</p>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Text Decoration</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-decoration-underline">This text has a line underneath it.</p>
                                    <p className="text-decoration-line-through">This text has a line going through it.</p>
                                    <Link to="#" className="text-decoration-none mb-0">This link has its text decoration removed</Link>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Visibility</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <div className="visible">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                                    <div className="invisible">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                                </CardBody>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={4}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Vertical Alignment</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <table style={{ height: "100px" }}>
                                        <tbody>
                                            <tr>
                                                <td className="align-baseline">baseline</td>
                                                <td className="align-top">top</td>
                                                <td className="align-middle">middle</td>
                                                <td className="align-bottom">bottom</td>
                                                <td className="align-text-top">text-top</td>
                                                <td className="align-text-bottom">text-bottom</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={4}>
                            <div className="card card-h-100">
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Monospace & Reset Color</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="font-monospace mb-0">This is in monospace</p>
                                </CardBody>
                                <div className="card-body pt-0">
                                    <p className="text-muted mb-0">
                                        Muted text with a <Link to="#" className="text-reset text-decoration-underline">reset link</Link>.
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default Utilities;