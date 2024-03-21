import React from "react";
import ReactApexChart from "react-apexcharts";

const Visitorgraph = (props: any) => {
    const series = props.series;
    const mapheight = props.page ? "56" : "52";

    const options = {
        chart: {
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
            curve: "smooth",
            width: 2
        },
        colors: ["#038edc"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: !1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            },
        },

        tooltip: {
            fixed: {
                enabled: !1
            },
            x: {
                show: !1
            },
            y: {
                title: {
                    formatter: function (seriesName: any) {
                        return "";
                    }
                }
            },
            marker: {
                show: !1
            }
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart options={options} series={series} type="area" height={mapheight} />
        </React.Fragment>
    );
};

export default Visitorgraph;