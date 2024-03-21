import React from "react";
import ReactApexChart from "react-apexcharts";

const Donut = () => {
  const series = [44, 55, 41, 17, 15];
  const options = {
    legend: {
      position: "bottom",
    },
    dataLabels: {
      dropShadow: {
        enabled: !1,
      },
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

export default Donut;
