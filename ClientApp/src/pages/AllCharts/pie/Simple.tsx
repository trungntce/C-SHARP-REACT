import React from "react";
import ReactApexChart from "react-apexcharts";

const Simple = () => {
  const series = [44, 55, 13, 43, 22];
  var options = {
    chart: {
      height: 300,
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e", "#564ab1"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={300}
      />
    </React.Fragment>
  );
};

export default Simple;
