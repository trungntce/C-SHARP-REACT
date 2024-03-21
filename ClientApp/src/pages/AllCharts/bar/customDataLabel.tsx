import React from "react";
import ReactApexChart from "react-apexcharts";

const CustomDataLabel = () => {
  const series = [
    {
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: !0,
        horizontal: !0,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: [
      "#5fd0f3",
      "#495057",
      "#e83e8c",
      "#13d8aa",
      "#f34e4e",
      "#2b908f",
      "#f9a3a4",
      "#564ab1",
      "#f1734f",
      "#038edc",
    ],
    dataLabels: {
      enabled: !0,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val: any, opt: any) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: !1,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [
        "South Korea",
        "Canada",
        "United Kingdom",
        "Netherlands",
        "Italy",
        "France",
        "Japan",
        "United States",
        "China",
        "India",
      ],
    },
    yaxis: {
      labels: {
        show: !1,
      },
    },
    title: {
      text: "Custom DataLabels",
      align: "center",
      floating: !0,
      style: {
        fontWeight: 600,
      },
    },
    subtitle: {
      text: "Category Names as DataLabels inside bars",
      align: "center",
    },
    tooltip: {
      theme: "dark",
      x: {
        show: !1,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
    },
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

export default CustomDataLabel;
