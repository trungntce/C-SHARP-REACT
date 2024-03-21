import React from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
} from "reactstrap";

// Carousel
import Slide from "./CarouselTypes/slide";
import Slidewithcontrol from "./CarouselTypes/slidewithcontrol";
import Slidewithindicator from "./CarouselTypes/slidewithindicator";
import Slidewithcaption from "./CarouselTypes/slidewithcaption";
import Slidewithfade from "./CarouselTypes/slidewithfade";
import Darkvariant from "./CarouselTypes/darkvariant";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiCarousel = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Carousel" />

          <Row>
            <Col xl={4} lg={6}>
              <Card>

                <CardBody>
                  <div className="justify-content-between d-flex align-items-center mb-4">
                    <h4 className="card-title">Carousel with Slides Only</h4>
                    <Link to="//reactstrap.github.io/components/carousel/"
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                        className="mdi mdi-arrow-right align-middle"></i></Link>
                  </div>
                  <Slide />
                </CardBody>

              </Card>
            </Col>
            <Col xl={4} lg={6}>
              <Card>

                <CardBody>
                  <div className="justify-content-between d-flex align-items-center mb-4">
                    <h4 className="card-title">Carousel with Controls</h4>
                    <Link to="//reactstrap.github.io/components/carousel/"
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                        className="mdi mdi-arrow-right align-middle"></i></Link>
                  </div>
                  <Slidewithcontrol />
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} lg={6}>
              <Card>

                <CardBody>
                  <div className="justify-content-between d-flex align-items-center mb-4">
                    <h4 className="card-title">Carousel with Captions</h4>
                    <Link to="//reactstrap.github.io/components/carousel/"
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                        className="mdi mdi-arrow-right align-middle"></i></Link>
                  </div>
                  <Slidewithcaption />
                </CardBody>
              </Card>
            </Col>

            <Col xl={4} lg={6}>
              <Card>
                <CardBody>
                  <div className="justify-content-between d-flex align-items-center mb-4">
                    <h4 className="card-title">Carousel with Indicators</h4>
                    <Link to="//reactstrap.github.io/components/carousel/"
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                        className="mdi mdi-arrow-right align-middle"></i></Link>
                  </div>
                  <Slidewithindicator />
                </CardBody>
              </Card>
            </Col>

            <Col xl={4} lg="6">
              <Card>
                <CardBody>
                  <div className="justify-content-between d-flex align-items-center mb-4">
                    <h4 className="card-title">Crossfade</h4>
                    <Link to="//reactstrap.github.io/components/carousel/"
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                        className="mdi mdi-arrow-right align-middle"></i></Link>
                  </div>
                  <Slidewithfade />
                </CardBody>
              </Card>
            </Col>

            <Col xl={4} lg="6">
              <Card>
                <CardBody>
                  <div className="justify-content-between d-flex align-items-center mb-4">
                    <h4 className="card-title">Dark Variant</h4>
                    <Link to="//reactstrap.github.io/components/carousel/"
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i
                        className="mdi mdi-arrow-right align-middle"></i></Link>
                  </div>
                  <Darkvariant />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiCarousel;
