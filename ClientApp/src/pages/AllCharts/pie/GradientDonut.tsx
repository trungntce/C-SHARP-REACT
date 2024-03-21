import React from "react";
import ReactApexChart from "react-apexcharts";

const GradientDonut = () => {
    const series = [44, 55, 41, 17, 15];
    var options = {
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: "gradient",
        },
        legend: {
          formatter: function (val : any, opts : any) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex];
          },
          position: "bottom"
        },
        title: {
          text: "Gradient Donut with custom Start-angle",
          style: {
            fontWeight: 500,
          },
        },
        colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e", "#564ab1"]
      };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={300}
      />
    </React.Fragment>
  );
};

export default GradientDonut;