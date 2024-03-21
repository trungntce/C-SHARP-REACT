import React from "react";
import ReactApexChart from "react-apexcharts";

const Scatter = () => {
  const series = [
    {
      name: "Box",
      type: "boxPlot",
      data: [
        {
          x: new Date("2017-01-01").getTime(),
          y: [54, 66, 69, 75, 88]
        },
        {
          x: new Date("2018-01-01").getTime(),
          y: [43, 65, 69, 76, 81]
        },
        {
          x: new Date("2019-01-01").getTime(),
          y: [31, 39, 45, 51, 59]
        },
        {
          x: new Date("2020-01-01").getTime(),
          y: [39, 46, 55, 65, 71]
        },
        {
          x: new Date("2021-01-01").getTime(),
          y: [29, 31, 35, 39, 44]
        }
      ]
    },
    {
      name: "Outliers",
      type: "scatter",
      data: [
        {
          x: new Date("2017-01-01").getTime(),
          y: 32
        },
        {
          x: new Date("2018-01-01").getTime(),
          y: 25
        },
        {
          x: new Date("2019-01-01").getTime(),
          y: 64
        },
        {
          x: new Date("2020-01-01").getTime(),
          y: 27
        },
        {
          x: new Date("2020-01-01").getTime(),
          y: 78
        },
        {
          x: new Date("2021-01-01").getTime(),
          y: 15
        }
      ]
    }
  ];
  var options = {
    chart: {
      toolbar: {
        show: !1
      }
    },
    colors: ["#f1734f", "#038edc"],
    title: {
      text: "BoxPlot - Scatter Chart",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        formatter: function (val: any) {
          return new Date(val).getFullYear();
        }
      }
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "#f1734f",
          lower: "#564ab1"
        }
      }
    },
    tooltip: {
      shared: !1,
      intersect: !0
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="boxPlot"
        height={350}
      />
    </React.Fragment>
  );
};

export default Scatter;
