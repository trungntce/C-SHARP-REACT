import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from "reactstrap";
import ReactApexChart from "react-apexcharts";

import illustrator from "../../assets/images/illustrator/2.png";

const EarningReports = (props: any) => {

    const [menu1, setMenu1] = useState<boolean>(false);

    const series = [44, 25, 19];

    const options = {
        dataLabels: {
            enabled: !1,
        },
        labels: ["Revenue", "Expenses", "Profit"],
        colors: ['#038edc', '#dfe2e6', '#5fd0f3'],
        legend: {
            show: !1,
            position: "bottom",
            horizontalAlign: "center",
            verticalAlign: "middle",
            floating: !1,
            fontSize: '14px',
            offsetX: 0
        }
    }

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <Alert
                        color="warning"
                        className="border-0 d-flex align-items-center"
                    >
                        <i className="uil uil-exclamation-triangle font-size-16 text-warning me-2"></i>
                        <div className="flex-grow-1 text-truncate">
                            Your free trial expired in <b>21</b> days.
                        </div>
                        <div className="flex-shrink-0">
                            <Link to="pricing-basic" className="text-reset text-decoration-underline"><b>Upgrade</b></Link>
                        </div>
                    </Alert>

                    <div className="row align-items-center">
                        <div className="col-sm-7">
                            <p className="font-size-18">Upgrade your plan from a <span className="fw-semibold">Free
                                trial</span>, to ‘Premium Plan’ <i className="mdi mdi-arrow-right"></i></p>
                            <div className="mt-4">
                                <Link to="pricing-basic" className="btn btn-primary">Upgrade Account!</Link>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <img src={illustrator} className="img-fluid" alt="" />
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <div className="float-end">
                        <Dropdown
                            isOpen={menu1}
                            toggle={() => setMenu1(!menu1)}
                        >
                            <DropdownToggle tag="a" className="text-reset">
                                <span className="fw-semibold">Report By:</span> <span
                                    className="text-muted">Monthly<i
                                        className="mdi mdi-chevron-down ms-1"></i></span>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem to="#">Yearly</DropdownItem>
                                <DropdownItem to="#">Monthly</DropdownItem>
                                <DropdownItem to="#">Weekly</DropdownItem>
                                <DropdownItem to="#">Today</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <h4 className="card-title mb-4">Earning Reports</h4>

                    <div className="row align-items-center">
                        <div className="col-sm-7">
                            <div className="row mb-3">
                                <div className="col-6">
                                    <p className="text-muted mb-2">This Month</p>
                                    <h5>$12,582<small
                                        className="badge badge-soft-success font-13 ms-2">+15%</small></h5>
                                </div>

                                <div className="col-6">
                                    <p className="text-muted mb-2">Last Month</p>
                                    <h5>$98,741</h5>
                                </div>
                            </div>
                            {props.page && props.page === 'widget' ? '' :
                                <React.Fragment>
                                    <p className="text-muted"><span className="text-success me-1"> 25.2%<i
                                        className="mdi mdi-arrow-up"></i></span>From previous period</p>
                                </React.Fragment>
                            }
                            <div className="mt-4">
                                <Link to="#" className="btn btn-soft-secondary btn-sm">Generate Reports <i
                                    className="mdi mdi-arrow-right ms-1"></i></Link>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className={props.page ? "" : "mt-4 mt-0"}>
                                <div id="donut_chart" className="apex-charts" dir="ltr">
                                    <ReactApexChart options={options} series={series} type="donut" height={130} />
                                </div>
                            </div>
                        </div>
                    </div>

                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export default EarningReports;