import React from "react";
import ReactApexChart from "react-apexcharts";

const Basic = () => {
  const series = [14, 23, 21, 17, 15, 10, 12, 17, 21];
  var options = {
    labels: [
      "Series A",
      "Series B",
      "Series C",
      "Series D",
      "Series E",
      "Series F",
      "Series G",
      "Series H",
      "Series I",
    ],
    stroke: {
      colors: ["#fff"],
    },
    fill: {
      opacity: 0.8,
    },

    legend: {
      position: "bottom",
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e", "#564ab1", "#5fd0f3"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="polarArea"
        width={400}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Basic;
