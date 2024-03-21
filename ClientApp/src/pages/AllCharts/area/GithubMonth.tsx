import React from "react";
import Githubdata from "../../../common/data/githubdata";
import ReactApexChart from "react-apexcharts";

const GithubMonth = () => {
  const series = [
    {
      name: "commits",
      data: Githubdata.series,
    },
  ];

  var options = {
    chart: {
      id: "chartyear",
      toolbar: {
        show: !1,
        autoSelected: "pan",
      },
      events: {
        mounted: function (chart: any) {
          var commitsEl = document.querySelector(".cmeta span.commits");
          var commits = chart.getSeriesTotalXRange(
            chart.w.globals.minX,
            chart.w.globals.maxX
          );
          if (commitsEl) {
            commitsEl.innerHTML = commits;
          }
        },
        updated: function (chart: any) {
          var commitsEl = document.querySelector(".cmeta span.commits");
          var commits = chart.getSeriesTotalXRange(
            chart.w.globals.minX,
            chart.w.globals.maxX
          );

          if (commitsEl) {
            commitsEl.innerHTML = commits;
          }
        },
      },
    },
    colors: ["#f1734f"],
    stroke: {
      width: 0,
      curve: "smooth",
    },
    dataLabels: {
      enabled: !1,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    yaxis: {
      show: !1,
      tickAmount: 3,
    },
    xaxis: {
      type: "datetime",
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={130}
      />
    </React.Fragment>
  );
};

export default GithubMonth;
