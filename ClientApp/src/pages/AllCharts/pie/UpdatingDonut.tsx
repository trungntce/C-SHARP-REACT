import React from "react";
import ReactApexChart from "react-apexcharts";

const UpdatingDonut = () => {
  const series = [44, 55, 13, 33];
  const options = {
    dataLabels: {
      enabled: !1,
    },
    legend: {
      position: "bottom",
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={280}
      />
    </React.Fragment>
  );
};

export default UpdatingDonut;
