import React from "react";
import ReactApexChart from "react-apexcharts";

const ColorRange = () => {
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
      name: "Jan",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Feb",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Mar",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Apr",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "May",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Jun",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Jul",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Aug",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
    {
      name: "Sep",
      data: generateData(20, {
        min: -30,
        max: 55,
      }),
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: !0,
        colorScale: {
          ranges: [
            {
              from: -30,
              to: 5,
              name: "Low",
              color: "#038edc",
            },
            {
              from: 6,
              to: 20,
              name: "Medium",
              color: "#51d28c",
            },
            {
              from: 21,
              to: 45,
              name: "High",
              color: "#564ab1",
            },
            {
              from: 46,
              to: 55,
              name: "Extreme",
              color: "#f7cc53",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      width: 1,
    },
    title: {
      text: "HeatMap Chart with Color Range",
      style: {
        fontWeight: 500,
      },
    },
    colors: ["#038edc", "#51d28c", "#f34e4e", "#f7cc53"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height={350}
      />
    </React.Fragment>
  );
};

export default ColorRange;
