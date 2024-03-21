import React from "react";
import ReactApexChart from "react-apexcharts";

const ApexBar = () => {
    const series = [{
        name: "Previous Month",
        data: [25.3, 12.5, 20.2, 18.5, 40.4, 25.4]
    }, {
        name: "This Month",
        data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4]
    }];

    const options = {
        chart: {
            stacked: !0,
            toolbar: {
                show: !1,
            }
        },
        plotOptions: {
            bar: {
                horizontal: !1,
                columnWidth: "23%",
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: !1,
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
            markers: {
                width: 8,
                height: 8,
                radius: 30,
            }
        },
        stroke: {
            show: !0,
            width: 2,
            colors: ["transparent"]
        },
        colors: ["#c0e3f6", "#038edc"],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

            axisTicks: {
                show: !1,
            },
        },
        yaxis: {
            labels: {
                formatter: function (value: any) {
                    return value + "k";
                }
            },
            tickAmount: 2,
            min: 0,
            max: 70
        },
        grid: {
            strokeDashArray: 10
        },
        fill: {
            opacity: 1
        }
    };
    return (
        <React.Fragment>
            <ReactApexChart options={options} series={series} type="bar" height={200} className="apex-charts" />
        </React.Fragment>
    );
};

export default ApexBar;