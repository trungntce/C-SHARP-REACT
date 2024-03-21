import React from "react";
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

const UiVideo = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs folder="UI Elements" breadcrumbItem="Video" />
                    <Row>
                        <Col xl={6}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Ratio Video 16:9</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>

                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video"></iframe>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Ratio Video 21:9</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>

                                    <div className="ratio ratio-21x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video"></iframe>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={6}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Ratio Video 4:3</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>

                                    <div className="ratio ratio-4x3">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video"></iframe>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xl={6}>
                            <Card>
                                <CardHeader className="justify-content-between d-flex align-items-center">
                                    <h4 className="card-title">Ratio Video 1:1</h4>
                                    <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                                </CardHeader>
                                <CardBody>

                                    <div className="ratio ratio-1x1">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video"></iframe>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
}

export default UiVideo;