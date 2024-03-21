import React from "react";
import ReactApexChart from "react-apexcharts";

const RangeWithoutShades = () => {
  const generateData = (count: any, yrange: any) => {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  };

  const series = [
    {
      name: "Metric1",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric2",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric3",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric4",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric5",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric6",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric7",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric8",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric8",
      data: generateData(20, {
        min: 0,
        max: 90,
      }),
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "heatmap",
      toolbar: {
        show: !1,
      },
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      heatmap: {
        radius: 30,
        enableShades: !1,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 50,
              color: "#038edc",
            },
            {
              from: 51,
              to: 100,
              color: "#5fd0f3",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: !0,
      style: {
        colors: ["#fff"],
      },
    },
    xaxis: {
      type: "category",
    },
    title: {
      text: "Rounded (Range without Shades)",
      style: {
        fontWeight: 500,
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

export default RangeWithoutShades;
