import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiGrid = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Grid" />
          <Row>
            <div className="col-12">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title mb-0">Grid Options</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col" className="text-center">
                            xs<br />
                            <span className="fw-normal">&lt; 576px</span>
                          </th>
                          <th scope="col" className="text-center">
                            sm<br />
                            <span className="fw-normal">≥576px</span>
                          </th>
                          <th scope="col" className="text-center">
                            md<br />
                            <span className="fw-normal">≥768px</span>
                          </th>
                          <th scope="col" className="text-center">
                            lg<br />
                            <span className="fw-normal">≥992px</span>
                          </th>
                          <th scope="col" className="text-center">
                            xl<br />
                            <span className="fw-normal">≥1200px</span>
                          </th>
                          <th scope="col" className="text-center">
                            xxl<br />
                            <span className="fw-normal">≥1400px</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="text-nowrap" scope="row">Grid behavior</th>
                          <td>Horizontal at all times</td>
                          <td colSpan={5}>Collapsed to start, horizontal above breakpoints</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Max container width</th>
                          <td>None (auto)</td>
                          <td>540px</td>
                          <td>720px</td>
                          <td>960px</td>
                          <td>1140px</td>
                          <td>1320px</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Class prefix</th>
                          <td><code>.col-</code></td>
                          <td><code>.col-sm-</code></td>
                          <td><code>.col-md-</code></td>
                          <td><code>.col-lg-</code></td>
                          <td><code>.col-xl-</code></td>
                          <td><code>.col-xxl-</code></td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row"># of columns</th>
                          <td colSpan={6}>12</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Gutter width</th>
                          <td colSpan={6}>24px (12px on each side of a column)</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Custom gutters</th>
                          <td colSpan={6}>Yes</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Nestable</th>
                          <td colSpan={6}>Yes</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Offsets</th>
                          <td colSpan={6}>Yes</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap" scope="row">Column ordering</th>
                          <td colSpan={6}>Yes</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Row>

          <Row>
            <div className="col-12">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Row Columns</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <Row className="g-3">
                    <Col xl={4}>
                      <div>
                        <Row className="row-cols-2 g-0">
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                        </Row>
                      </div>
                    </Col>

                    <Col xl={4}>
                      <div>
                        <Row className="row-cols-3 g-0">
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                        </Row>
                      </div>
                    </Col>

                    <Col xl={4}>
                      <div>
                        <Row className="row-cols-4 g-0">
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col-6">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                        </Row>
                      </div>
                    </Col>

                    <Col xl={4}>
                      <div>
                        <Row className="row-cols-auto g-0">
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                        </Row>
                      </div>
                    </Col>

                    <Col xl={4}>
                      <div>
                        <Row className="row-cols-4 g-0">
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                        </Row>
                      </div>
                    </Col>

                    <Col xl={4}>
                      <div>
                        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 g-0">
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                          <div className="col">
                            <div className="p-3 border bg-light">Column</div>
                          </div>
                        </Row>
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
                  <h4 className="card-title">Equal Width</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>

                  <div>
                    <Row>
                      <div className="col">
                        <div className="p-3 border bg-light">1 of 2</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">2 of 2</div>
                      </div>
                    </Row>
                  </div>

                  <div className="mt-3">
                    <Row>
                      <div className="col">
                        <div className="p-3 border bg-light">1 of 3</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">2 of 3</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">3 of 3</div>
                      </div>
                    </Row>
                  </div>

                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Setting One Column Width</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <div className="col">
                        <div className="p-3 border bg-light">1 of 3</div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 border bg-light">2 of 3 (wider)</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">3 of 3</div>
                      </div>
                    </Row>
                    <Row className="mt-3">
                      <div className="col">
                        <div className="p-3 border bg-light">1 of 3</div>
                      </div>
                      <div className="col-5">
                        <div className="p-3 border bg-light">2 of 3 (wider)</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">3 of 3</div>
                      </div>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Variable Width Content</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="px-2">
                    <Row className="justify-content-md-center">
                      <Col lg={2} className="col">
                        <div className="p-3 px-2 border bg-light">1 of 3</div>
                      </Col>
                      <div className="col-md-auto">
                        <div className="p-3 px-2 border bg-light">Variable width content</div>
                      </div>
                      <Col lg={2} className="col">
                        <div className="p-3 px-2 border bg-light">3 of 3</div>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <div className="col">
                        <div className="p-3 px-2 border bg-light">1 of 3</div>
                      </div>
                      <div className="col-md-auto">
                        <div className="p-3 px-2 border bg-light">Variable width content</div>
                      </div>
                      <Col lg={2} className="col">
                        <div className="p-3 px-2 border bg-light">3 of 3</div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">All Breakpoints</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <div className="col">
                        <div className="p-3 border bg-light">col</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">col</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">col</div>
                      </div>
                      <div className="col">
                        <div className="p-3 border bg-light">col</div>
                      </div>
                    </Row>
                    <Row className="mt-3">
                      <div className="col-8">
                        <div className="p-3 border bg-light">col-8</div>
                      </div>
                      <div className="col-4">
                        <div className="p-3 border bg-light">col-4</div>
                      </div>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Stacked to Horizontal</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Col sm={8}>
                        <div className="p-3 border bg-light">col-sm-8</div>
                      </Col>
                      <Col sm={4}>
                        <div className="p-3 border bg-light">col-sm-4</div>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <div className="col-sm">
                        <div className="p-3 border bg-light">col-sm</div>
                      </div>
                      <div className="col-sm">
                        <div className="p-3 border bg-light">col-sm</div>
                      </div>
                      <div className="col-sm">
                        <div className="p-3 border bg-light">col-sm</div>
                      </div>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Mix and Match</h4>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div>

                    <Row>
                      <Col md={8}>
                        <div className="p-3 border bg-light">.col-md-8</div>
                      </Col>
                      <Col md={4} className="col-6">
                        <div className="p-3 border bg-light">.col-6 .col-md-4</div>
                      </Col>
                    </Row>


                    <Row className="mt-3">
                      <Col md={4} className="col-6">
                        <div className="p-3 border bg-light">.col-6 .col-md-4</div>
                      </Col>
                      <Col md={4} className="col-6">
                        <div className="p-3 border bg-light">.col-6 .col-md-4</div>
                      </Col>
                      <Col md={4} className="col-6">
                        <div className="p-3 border bg-light">.col-6 .col-md-4</div>
                      </Col>
                    </Row>


                    <Row className="mt-3">
                      <div className="col-6">
                        <div className="p-3 border bg-light">.col-6</div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 border bg-light">.col-6</div>
                      </div>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiGrid;