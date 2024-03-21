import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//imoprt images
import img4 from "../../assets/images/small/img-4.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar10 from "../../assets/images/users/avatar-10.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";

const UiImages = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Ui Elements" breadcrumbItem="Images" />
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Image Thumbnails</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <img className="img-thumbnail" alt="200x200" width="200" src={img3} data-holder-rendered="true" />
                      <p className="mt-2 mb-lg-0"><code>.img-thumbnail</code></p>
                    </Col>
                    <Col md={6}>
                      <div className="mt-4 mt-md-0">
                        <img className="img-thumbnail rounded-circle avatar-xl" alt="200x200" src={avatar3} data-holder-rendered="true" />
                        <p className="mt-2 mb-lg-0"><code>.img-thumbnail</code></p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Image Rounded & Circle</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <img className="rounded mr-2" alt="200x200" width="200" src={img4} data-holder-rendered="true" />
                      <p className="mt-2 mb-lg-0"><code>.rounded</code></p>
                    </Col>
                    <Col md={6}>
                      <div className="mt-4 mt-md-0">
                        <img className="rounded-circle avatar-xl" alt="200x200" src={avatar4} data-holder-rendered="true" />
                        <p className="mt-2 mb-lg-0"><code>.rounded-circle</code></p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <div className="col-12">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Rounded Image Sizes</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={2}>
                      <div>
                        <img src={avatar2} alt="" className="rounded avatar-xs" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-xs</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar4} alt="" className="rounded avatar-sm" />
                        <p className="mt-2  mb-lg-0"><code>.avatar-sm</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar5} alt="" className="rounded avatar" />
                        <p className="mt-2 mb-lg-0"><code>.avatar</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar2} alt="" className="rounded avatar-md" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-md</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar8} alt="" className="rounded avatar-lg" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-lg</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={img2} alt="" className="rounded avatar-xl" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-xl</code></p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Rounded Circle Image Sizes</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={2}>
                      <div>
                        <img src={avatar2} alt="" className="rounded-circle avatar-xs" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-xs</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar4} alt="" className="rounded-circle avatar-sm" />
                        <p className="mt-2  mb-lg-0"><code>.avatar-sm</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar5} alt="" className="rounded-circle avatar" />
                        <p className="mt-2 mb-lg-0"><code>.avatar</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar2} alt="" className="rounded-circle avatar-md" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-md</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar8} alt="" className="rounded-circle avatar-lg" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-lg</code></p>
                      </div>
                    </Col>
                    <Col lg={2}>
                      <div>
                        <img src={avatar10} alt="" className="rounded-circle avatar-xl" />
                        <p className="mt-2 mb-lg-0"><code>.avatar-xl</code></p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Responsive Images</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <img src={img2} className="img-fluid" alt="Responsive image" />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Media Object Default</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <img src={avatar10} className="avatar-lg img-fluid" alt="" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      This is some content from a media component. You can replace this with any content and adjust it as needed.
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Media Object Center</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <img src={avatar10} className="avatar-lg img-fluid" alt="" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      This is some content from a media component. You can replace this with any content and adjust it as needed.
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Media Object Bottom</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="d-flex align-items-end">
                    <div className="flex-shrink-0">
                      <img src={avatar10} className="avatar-lg img-fluid" alt="" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      This is some content from a media component. You can replace this with any content and adjust it as needed.
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row></Container>
      </div>
    </React.Fragment>
  );
};

export default UiImages;
