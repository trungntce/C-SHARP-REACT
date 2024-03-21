import React from "react";
import ReactApexChart from "react-apexcharts";

const PolygonFill = () => {
  const series = [
    {
      name: "Series 1",
      data: [20, 100, 40, 30, 50, 80, 33],
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: !0,
      },
    },
    dataLabels: {
      enabled: !1,
    },
    plotOptions: {
      radar: {
        size: 140,
      },
    },
    title: {
      text: "Radar with Polygon Fill",
      style: {
        fontWeight: 500,
      },
    },
    colors: ["#5FD0F5"],
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColor: "#f34e4e",
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
      },
    },
    xaxis: {
      categories: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        formatter: function (val: any, i: any) {
          if (i % 2 === 0) {
            return val;
          } else {
            return "";
          }
        },
      },
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radar"
        height={350}
      />
    </React.Fragment>
  );
};

export default PolygonFill;
