import { Link } from "react-router-dom";
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
import img1 from "../../assets/images/small/img-1.jpg";
import img11 from "../../assets/images/small/img-11.jpg";

const UiPlaceholders = () => {
    return (
        <div className="page-content">
            <Container fluid={true}>
                <Breadcrumbs folder="UI Elements" breadcrumbItem="Placeholders" />

                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="justify-content-between d-flex align-items-center">
                                <h4 className="card-title">Example</h4>
                                <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                            </CardHeader>
                            <CardBody>
                                <Row className="justify-content-center">
                                    <Col xl={7}>
                                        <Row className="justify-content-between">
                                            <Col lg={5} sm={6}>
                                                <Card>
                                                    <img src={img1} className="card-img-top" alt="card img" />

                                                    <CardBody>
                                                        <h5 className="card-title">Card title</h5>
                                                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
                                                        <Link to="#" className="btn btn-primary">Go somewhere</Link>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col lg={5} sm={6}>
                                                <Card>
                                                    <img src={img11} className="card-img-top" alt="card dummy img" />
                                                    <CardBody>
                                                        <h5 className="card-title placeholder-glow">
                                                            <span className="placeholder col-6"></span>
                                                        </h5>
                                                        <p className="card-text placeholder-glow">
                                                            <span className="placeholder col-7"></span>{" "}
                                                            <span className="placeholder col-4"></span>{" "}
                                                            <span className="placeholder col-4"></span>{" "}
                                                            <span className="placeholder col-6"></span>{" "}
                                                        </p>
                                                        <Link to="#" className="btn btn-primary disabled placeholder col-6"></Link>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader className="justify-content-between d-flex align-items-center">
                                <h4 className="card-title">Width</h4>
                                <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                            </CardHeader>
                            <CardBody>
                                <span className="placeholder col-6"></span>{" "}
                                <span className="placeholder w-75"></span>{" "}
                                <span className="placeholder" style={{ width: "25%" }}></span>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="justify-content-between d-flex align-items-center">
                                <h4 className="card-title">Sizing</h4>
                                <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                            </CardHeader>
                            <CardBody>
                                <span className="placeholder col-12 placeholder-lg"></span>
                                <span className="placeholder col-12"></span>
                                <span className="placeholder col-12 placeholder-sm"></span>
                                <span className="placeholder col-12 placeholder-xs"></span>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={6}>
                        <Card>
                            <CardHeader className="justify-content-between d-flex align-items-center">
                                <h4 className="card-title">Color</h4>
                                <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                            </CardHeader>
                            <CardBody>
                                <span className="placeholder col-12 mb-3"></span>
                                <span className="placeholder col-12 mb-3 bg-primary"></span>
                                <span className="placeholder col-12 mb-3 bg-secondary"></span>
                                <span className="placeholder col-12 mb-3 bg-success"></span>
                                <span className="placeholder col-12 mb-3 bg-danger"></span>
                                <span className="placeholder col-12 mb-3 bg-warning"></span>
                                <span className="placeholder col-12 mb-3 bg-info"></span>
                                <span className="placeholder col-12 mb-3 bg-light"></span>
                                <span className="placeholder col-12 bg-dark"></span>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="justify-content-between d-flex align-items-center">
                                <h4 className="card-title">Animation</h4>
                                <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg={6}>
                                        <div>
                                            <h5 className="font-size-14"><i className="mdi mdi-chevron-right text-primary me-1"></i> Placeholder glow</h5>
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-12"></span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div>
                                            <h5 className="font-size-14"><i className="mdi mdi-chevron-right text-primary me-1"></i> Placeholder wave</h5>
                                            <div className="placeholder-wave">
                                                <span className="placeholder col-12"></span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default UiPlaceholders;