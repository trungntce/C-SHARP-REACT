import { useState } from 'react';
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

//import countup
import CountUp from "react-countup";

const SalesAnalytics = () => {
    const series = [{
        name: 'Income',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    }, {
        name: 'Sales',
        type: 'column',
        data: [19, 8, 26, 21, 18, 36, 30, 28, 40, 39, 15]
    }, {
        name: 'Conversation Ratio',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }, {
        name: 'Users',
        type: 'line',
        data: [9, 11, 13, 12, 10, 8, 6, 9, 14, 17, 22]
    }];

    const options = {
        chart: {
            stacked: !1,
            offsetY: -5,
            toolbar: {
                show: !1,
            }
        },
        stroke: {
            width: [0, 0, 0, 1],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '40%',
            }
        },
        colors: ['#5fd0f3', '#038edc', '#dfe2e6', '#51d28c'],
        fill: {
            opacity: [0.85, 1, 0.25, 1],
            gradient: {
                inverseColors: !1,
                shade: 'light',
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100],
            }
        },
        labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            title: {
                text: 'Sales Analytics',
                style: {
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            shared: !0,
            intersect: !1,
            y: {
                formatter: function (y: any) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(0);
                    }
                    return y;
                }
            }
        },
        grid: {
            borderColor: '#f1f1f1',
            padding: {
                bottom: 15
            }
        }
    };

    const [menu1, setMenu1] = useState<boolean>(!1);
    return (
        <Card className="card-h-100">
            <CardBody>
                <div className="float-end">
                    <Dropdown
                        isOpen={menu1}
                        toggle={() => setMenu1(!menu1)}
                    >
                        <DropdownToggle tag="a" className="text-reset">
                            <span className="fw-semibold">Sort By:</span>
                            <span className="text-muted">Yearly
                                <i className="mdi mdi-chevron-down ms-1"></i>
                            </span>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem to="#">Yearly</DropdownItem>
                            <DropdownItem to="#">Monthly</DropdownItem>
                            <DropdownItem to="#">Weekly</DropdownItem>
                            <DropdownItem to="#">Today</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <h4 className="card-title mb-4">Sales Analytics</h4>

                <div className="mt-1">
                    <ul className="list-inline main-chart mb-0 text-center">
                        <li className="list-inline-item chart-border-left me-0 border-0">
                            <h3 className="text-primary">
                                <span><CountUp prefix="$" suffix="k" start={0} end={3.85} decimals={2} duration={2.75} /></span><span
                                    className="text-muted d-inline-block fw-normal font-size-15 ms-2">Income</span>
                            </h3>
                        </li>
                        <li className="list-inline-item chart-border-left me-0">
                            <h3><span><CountUp start={0} end={258} duration={2.75} /></span><span
                                className="text-muted d-inline-block fw-normal font-size-15 ms-2">Sales</span>
                            </h3>
                        </li>
                        <li className="list-inline-item chart-border-left me-0">
                            <h3><span><CountUp start={0} end={52} suffix="k" duration={2.75} /></span><span
                                className="text-muted d-inline-block fw-normal font-size-15 ms-2">Users</span>
                            </h3>
                        </li>
                    </ul>
                </div>

                <div className="mt-3">
                    <div id="sales-analytics-chart" className="apex-charts" dir="ltr">
                        <ReactApexChart options={options} series={series} type="line" height={332} />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default SalesAnalytics;