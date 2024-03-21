import React from "react";
import Githubdata from "../../../common/data/githubdata";
import ReactApexChart from "react-apexcharts";

const GithubYear = () => {
  const seriesYears = [
    {
      name: "commits",
      data: Githubdata.series,
    },
  ];

  const optionsYears = {
    chart: {
      toolbar: {
        autoSelected: "selection",
      },
      brush: {
        enabled: true,
        target: "chartyear",
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date("26 Jan 2014").getTime(),
          max: new Date("29 Mar 2015").getTime(),
        },
      },
    },
    colors: ["#51d28c"],
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      width: 0,
      curve: "smooth",
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    xaxis: {
      type: "datetime",
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={optionsYears}
        series={seriesYears}
        type="area"
        height={170}
      />
    </React.Fragment>
  );
};

export default GithubYear;
