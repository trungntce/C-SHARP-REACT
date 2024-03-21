import React from "react";
import { Link } from "react-router-dom";
import {
    Table,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
  } from "reactstrap";
  import Breadcrumb from "../components/Common/Breadcrumb";
  

const Dashboard = () => {
    return (
      <>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumb 
              folder="Analytics Dashboard" 
              breadcrumbItem="Analytics Dashboard" 
              icon="pie-chart" />
  
            <Row>
              <Col xl={12}>
                <Card>
                  <CardHeader className="justify-content-between d-flex align-items-center">
                    <CardTitle className="h4">Dashboard</CardTitle>
                    <Link
                      to="//reactstrap.github.io/components/tables/"
                      target="_blank" rel="noreferrer"
                      className="btn btn-sm btn-soft-secondary"
                    >
                      Docs <i className="mdi mdi-arrow-right align-middle"></i>
                    </Link>
                  </CardHeader>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>  
            </Row>
          </div>
        </div>
      </>
    );
}

export default Dashboard;