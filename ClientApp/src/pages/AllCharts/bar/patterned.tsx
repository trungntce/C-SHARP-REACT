import React from "react";
import ReactApexChart from "react-apexcharts";

const Patterned = () => {
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
  ];

  const options = {
    chart: {
      stacked: !0,
      dropShadow: {
        enabled: !0,
        blur: 1,
        opacity: 0.25,
      },
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      width: 2,
    },
    title: {
      text: "Compare Sales Strategy",
      style: {
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      shared: !1,
      y: {
        formatter: function (val : any) {
          return val + "K";
        },
      },
    },
    fill: {
      type: "pattern",
      opacity: 1,
      pattern: {
        style: ["circles", "slantedLines", "verticalLines", "horizontalLines"], // string or array of strings
      },
    },
    states: {
      hover: {
        filter: "none",
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e"],
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

export default Patterned;
