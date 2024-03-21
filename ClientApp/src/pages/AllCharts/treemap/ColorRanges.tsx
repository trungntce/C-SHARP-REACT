import React from "react";
import ReactApexChart from "react-apexcharts";

const ColorRanges = () => {
  const series = [
    {
      data: [
        {
          x: "INTC",
          y: 1.2,
        },
        {
          x: "GS",
          y: 0.4,
        },
        {
          x: "CVX",
          y: -1.4,
        },
        {
          x: "GE",
          y: 2.7,
        },
        {
          x: "CAT",
          y: -0.3,
        },
        {
          x: "RTX",
          y: 5.1,
        },
        {
          x: "CSCO",
          y: -2.3,
        },
        {
          x: "JNJ",
          y: 2.1,
        },
        {
          x: "PG",
          y: 0.3,
        },
        {
          x: "TRV",
          y: 0.12,
        },
        {
          x: "MMM",
          y: -2.31,
        },
        {
          x: "NKE",
          y: 3.98,
        },
        {
          x: "IYT",
          y: 1.67,
        },
      ],
    },
  ];

  const options = {
    legend: {
      show: !1,
    },
    chart: {
      height: 350,
      type: "treemap",
      toolbar: {
        show: !1,
      },
    },
    title: {
      text: "Treemap with Color scale",
      style: {
        fontWeight: 500,
      },
    },
    dataLabels: {
      enabled: !0,
      style: {
        fontSize: "12px",
      },
      formatter: function (text: any, op: any) {
        return [text, op.value];
      },
      offsetY: -4,
    },
    plotOptions: {
      treemap: {
        enableShades: !0,
        shadeIntensity: 0.5,
        reverseNegativeShade: !0,
        colorScale: {
          ranges: [
            {
              from: -6,
              to: 0,
              color: "#f34e4e",
            },
            {
              from: 0.001,
              to: 6,
              color: "#51d28c",
            },
          ],
        },
      },
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="treemap"
        height={350}
      />
    </React.Fragment>
  );
};

export default ColorRanges;
