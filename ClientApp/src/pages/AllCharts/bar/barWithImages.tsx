import React from "react";
import ReactApexChart from "react-apexcharts";

const BarWithImages = () => {
  const series = [
    {
      name: "coins",
      data: [
        2, 4, 3, 4, 3, 5, 5, 6.5, 6, 5, 4, 5, 8, 7, 7, 8, 8, 10, 9, 9, 12, 12,
        11, 12, 13, 14, 16, 14, 15, 17, 19, 21,
      ],
    },
  ];

  const options = {
    chart: {
      animations: {
        enabled: !1,
      },
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
        barHeight: "100%",
      },
    },
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      colors: ["#fff"],
      width: 0.2,
    },
    // labels: Array.apply(null , { length : 39 }).map(function (el : any, index : any) {
    //   return index + 1;
    // }),
    yaxis: {
      axisBorder: {
        show: !1,
      },
      axisTicks: {
        show: !1,
      },
      labels: {
        show: !1,
      },
      title: {
        text: "Weight",
      },
    },
    grid: {
      position: "back",
    },
    title: {
      text: "Paths filled by clipped image",
      align: "right",
      offsetY: 30,
      style: {
        fontWeight: 600,
      },
    },
    fill: {
      type: "image",
      opacity: 0.87,
      image: {
        width: 466,
        height: 406,
      },
    },
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

export default BarWithImages;