import React from "react";
import ReactApexChart from "react-apexcharts";

const GradientCircle = () => {
  const series = [75];
  const options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
        },
        track: {
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
        },

        dataLabels: {
          show: !0,
          name: {
            offsetY: -10,
            show: !0,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: function (val: any) {
              return parseInt(val);
            },
            color: "#111",
            fontSize: "36px",
            show: !0,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#f7cc53"],
        inverseColors: !0,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Percent"],
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

export default GradientCircle;
