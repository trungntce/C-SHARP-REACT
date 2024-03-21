import React from "react";
import ReactApexChart from "react-apexcharts";

const Circle = () => {
  const series = [76, 67, 61, 55];
  const options = {
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: !1,
          },
          value: {
            show: !1,
          },
        },
      },
    },
    colors: ["#038edc", "#5fd0f3", "#f1734f", "#51d28c"],
    labels: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
    legend: {
      show: !0,
      floating: !0,
      fontSize: "16px",
      position: "left",
      offsetX: 160,
      offsetY: 15,
      labels: {
        useSeriesColors: !0,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName: any, opts: any) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
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
        type="radialBar"
        height={350}
      />
    </React.Fragment>
  );
};

export default Circle;
