import React from "react";
import {
    Card, CardBody, Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";

import { WidgetsData } from "../../common/data/dashboard";

//import Charts
import ReactApexChart from "react-apexcharts";

const WidgetData = (props : any) => {
    const mapheight = props.page ? '30%' : '50%';

    const baroptions: Object = {
        chart: {
            type: 'bar',
            height: 50,
            sparkline: {
                enabled: !0
            }
        },
        plotOptions: {
            bar: {
                columnWidth: mapheight,
            },
        },
        tooltip: {
            fixed: {
                enabled: !1
            },
            y: {
                title: {
                    formatter: function () {
                        return ''
                    }
                }
            },
        },
        colors: ['#038edc'],
    };
    
    const areaoptions: Object = {
        chart: {
            height: 50,
            type: 'area',
            sparkline: {
                enabled: !0
            },
            toolbar: {
                show: !1
            },
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: !1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [50, 100, 100, 100]
            },
        },
        colors: ['#038edc', 'transparent'],
    };

    return (
        <React.Fragment>
            {(WidgetsData || []).map((widget: any, key: number) => (
                <Col xl={3} sm={6} key={key}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="font-size-xs text-uppercase"> {widget["title"]} </h6>
                                    <h4 className="mt-4 font-weight-bold mb-2 d-flex align-items-center">
                                        {widget["price"]}
                                    </h4>
                                    <div className="text-muted"> {widget["subtitle"]} </div>
                                </div>
                                <div>
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="a" className="dropdown-toggle btn btn-light btn-sm">
                                            <span className="text-muted">{widget["fotmat"]}<i
                                                className="mdi mdi-chevron-down ms-1"></i></span>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem to="#">Monthly</DropdownItem>
                                            <DropdownItem to="#">Yearly</DropdownItem>
                                            <DropdownItem to="#">Weekly</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                            <div className="apex-charts mt-3">
                            <ReactApexChart
                                options={widget['charttype'] === 'bar' ? baroptions : areaoptions}
                                series={[{ data: [...widget["series"]] }]}
                                type={widget['charttype']}
                                className="apex-charts"
                                dir="ltr"
                                height = "50"
                            />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </React.Fragment>
    );
};

export default WidgetData;