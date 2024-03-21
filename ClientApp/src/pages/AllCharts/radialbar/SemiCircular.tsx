import React from "react";
import ReactApexChart from "react-apexcharts";

const SemiCircular = () => {
  const series = [76];
  const options = {
    chart: {
      offsetY: -20,
      sparkline: {
        enabled: !0,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: !0,
            top: 2,
            left: 0,
            color: "#999",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: !1,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: !1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ["Average Results"],
    colors: ["#038edc"],
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={350}
      />
    </React.Fragment>
  );
};

export default SemiCircular;
