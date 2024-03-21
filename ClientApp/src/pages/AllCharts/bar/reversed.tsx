import React from "react";
import ReactApexChart from "react-apexcharts";

const Reversed = () => {
  const series = [
    {
      data: [400, 430, 448, 470, 540, 580, 690],
    },
  ];

  var options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    annotations: {
      xaxis: [
        {
          x: 500,
          borderColor: "#038edc",
          label: {
            borderColor: "#038edc",
            style: {
              color: "#fff",
              background: "#038edc",
            },
            text: "X annotation",
          },
        },
      ],
      yaxis: [
        {
          y: "July",
          y2: "September",
          label: {
            text: "Y annotation",
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        horizontal: !0,
      },
    },
    dataLabels: {
      enabled: !0,
    },
    xaxis: {
      categories: [
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    grid: {
      xaxis: {
        lines: {
          show: !0,
        },
      },
    },
    yaxis: {
      reversed: !0,
      axisTicks: {
        show: !0,
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
        dir="ltr"
      />
    </React.Fragment>
  );
};

export default Reversed;
