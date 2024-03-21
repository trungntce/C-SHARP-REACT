import React from "react";
import ReactApexChart from "react-apexcharts";

const UserChart = () => {
    const series = [
        {
            name: "Total Visit",
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 54]
        }
    ];
    var options = {
        chart: {
            id: "area-datetime",
            dropShadow: {
                enabled: true,
                color: "#000",
                top: 18,
                left: 7,
                blur: 4,
                opacity: 0.075
            },
            zoom: {
                autoScaleYaxis: true
            },
            toolbar: {
                show: false,
            }
        },

        dataLabels: {
            enabled: false
        },
        markers: {
            size: 3,
            strokeWidth: 3,

            hover: {
                size: 6,
            }
        },
        stroke: {
            show: true,
            // curve: "smooth",
            width: 3,
            dashArray: 0,
        },
        xaxis: {
            categories: ["01 Jan", "02 Jan", "03 Jan", "04 Jan", "05 Jan", "06 Jan", "07 Jan", "08 Jan", "09 Jan", "10 Jan", "11 Jan", "12 Jan"],
        },
        yaxis: {
            labels: {
                show: false,
            }
        },
        tooltip: {
            x: {
                format: "dd MMM yyyy"
            }
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                }
            },
            yaxis: {
                lines: {
                    show: false,
                }
            }
        },
        colors: ["#038edc"],
        fill: {
            opacity: 0.05,
            colors: ["#038edc"],
            type: "solid",
        },
    };

    return (
        <React.Fragment>
            <ReactApexChart options={options} series={series} type="area" height={440} className="apex-charts" />
        </React.Fragment>
    );
};

export default UserChart;