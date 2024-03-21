import React from "react";
import ReactApexChart from "react-apexcharts";

const DataLabels = () => {
  const series = [
    {
      name: "High - 2018",
      data: [26, 24, 32, 36, 33, 31, 33],
    },
    {
      name: "Low - 2018",
      data: [14, 11, 16, 12, 17, 13, 12],
    },
  ];
  const options = {
    chart: {
      zoom: {
        enabled: !1,
      },
      toolbar: {
        show: !1,
      },
      color: '#fff'
    },
    colors: ["#038edc", "#f1734f"],
    dataLabels: {
      enabled: !0,
    },
    stroke: {
      width: [3, 3],
      curve: "straight",
    },
    title: {
      text: "Average High & Low Temperature",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: "#f1f1f1",
    },
    markers: {
      style: "inverted",
      size: 6,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      title: {
        text: "Month",
      },
    },
    yaxis: {
      title: {
        text: "Temperature",
      },
      min: 5,
      max: 40,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: !1,
            },
          },
          legend: {
            show: !1,
          },
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={380}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default DataLabels;
