import React from "react";
import ReactApexChart from "react-apexcharts";

const Basic = () => {
  const generateData = (count: any, yrange: any) => {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
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
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric2",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric3",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric4",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric5",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric6",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric7",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric8",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
    {
      name: "Metric9",
      data: generateData(18, {
        min: 0,
        max: 90,
      }),
    },
  ];

  var options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#038edc"],
    title: {
      text: "HeatMap Chart (Single color)",
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
        type="heatmap"
        height={450}
      />
    </React.Fragment>
  );
};

export default Basic;
