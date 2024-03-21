import React from "react";
import ReactApexChart from "react-apexcharts";

const visitor = (props : any) => {

    const chartheight = props.page ? "215" : "245";
    
    const series = [44, 25, 19];

    const options = {
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                },
            }
        },
        dataLabels: {
            enabled: !1,
        },

        labels: ["Social", "Direct", "Others"],
        colors: ["#038edc", "#f5f6f8", "#5fd0f3"],
        legend: {
            show: !0,
            position: "bottom",
            horizontalAlign: "center",
            verticalAlign: "middle",
            floating: !1,
            fontSize: "14px",
            offsetX: 0
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={chartheight}
                className="apex-charts"
            />
        </React.Fragment>
    );
};

export default visitor;