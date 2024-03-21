import React from "react";
import ReactApexChart from "react-apexcharts";

const Basic = () => {
  const series = [70];
  const options = {
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
      },
    },
    labels: ["Cricket"],
    colors: ["#038edc"],
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

export default Basic;
