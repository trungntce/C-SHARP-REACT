import React from "react";
import ReactApexChart from "react-apexcharts";

const Stepline = () => {
  const series = [
    {
      data: [34, 44, 54, 21, 12, 43, 33, 23, 66, 66, 58],
    },
  ];
  const options = {
    stroke: {
      curve: "stepline",
    },
    dataLabels: {
      enabled: !1,
    },
    title: {
      text: "Stepline Chart",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    markers: {
      hover: {
        sizeOffset: 4,
      },
    },
    colors: ["#038edc"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Stepline;
