import React from "react";
import ReactApexChart from "react-apexcharts";

const Stacked = () => {
  const series = [
    {
      name: "Marine Sprite",
      data: [44, 55, 41, 37, 22, 43, 21],
    },
    {
      name: "Striking Calf",
      data: [53, 32, 33, 52, 13, 43, 32],
    },
    {
      name: "Tank Picture",
      data: [12, 17, 11, 9, 15, 11, 20],
    },
    {
      name: "Bucket Slope",
      data: [9, 7, 5, 8, 6, 9, 4],
    },
    {
      name: "Reborn Kid",
      data: [25, 12, 19, 32, 25, 24, 10],
    },
  ];

  const options = {
    chart: {
      S: !0,
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "Fiction Books Sales",
      style: {
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
      labels: {
        formatter: function (val: any) {
          return val + "K";
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#e83e8c", "#564ab1"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </React.Fragment>
  );
};

export default Stacked;
