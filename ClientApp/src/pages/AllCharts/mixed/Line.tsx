import React from "react";
import ReactApexChart from "react-apexcharts";

const Line = () => {
  const series = [
    {
      name: "Website Blog",
      type: "column",
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
    },
    {
      name: "Social Media",
      type: "line",
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: "Traffic Sources",
      style: {
        fontWeight: 600,
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: [
      "01 Jan 2001",
      "02 Jan 2001",
      "03 Jan 2001",
      "04 Jan 2001",
      "05 Jan 2001",
      "06 Jan 2001",
      "07 Jan 2001",
      "08 Jan 2001",
      "09 Jan 2001",
      "10 Jan 2001",
      "11 Jan 2001",
      "12 Jan 2001",
    ],
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        title: {
          text: "Website Blog",
          style: {
            fontWeight: 600,
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Social Media",
          style: {
            fontWeight: 600,
          },
        },
      },
    ],
    colors: ["#038edc", "#51d28c"],
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </React.Fragment>
  );
};

export default Line;
