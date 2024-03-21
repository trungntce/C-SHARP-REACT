import React from "react";
import ReactApexChart from "react-apexcharts";

const Groupes = () => {
  const series = [
    {
      data: [44, 55, 41, 64, 22, 43, 21],
    },
    {
      data: [53, 32, 33, 52, 13, 44, 32],
    },
  ];

  var options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: !0,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: !0,
      width: 1,
      colors: ["#fff"],
    },
    tooltip: {
      shared: !0,
      intersect: !1,
    },
    xaxis: {
      categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
    },
    color: ["#51d28c", "#038edc"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={410}
      />
    </React.Fragment>
  );
};

export default Groupes;
