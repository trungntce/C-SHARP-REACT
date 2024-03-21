import React from "react";
import ReactApexChart from "react-apexcharts";

const PatternedDonut = () => {
    const series = [44, 55, 41, 17, 15];
  const options = {
    chart: {
      dropShadow: {
        enabled: !0,
        color: "#111",
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2,
      },
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: !0,
            total: {
              showAlways: !0,
              show: !0,
            },
          },
        },
      },
    },
    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8,
      },
    },
    fill: {
      type: "pattern",
      opacity: 1,
      pattern: {
        enabled: !0,
        style: [
          "verticalLines",
          "squares",
          "horizontalLines",
          "circles",
          "slantedLines",
        ],
      },
    },
    states: {
      hover: {
        filter: "none",
      },
    },
    theme: {
      palette: "palette2",
    },
    title: {
      text: "Favourite Movie Type",
      style: {
        fontWeight: 500,
      },
    },
    legend: {
      position: "bottom",
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e", "#564ab1"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={300}
      />
    </React.Fragment>
  );
};

export default PatternedDonut;
