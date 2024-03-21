import React from "react";
import Chartseries from "../../../common/data/chartseries";
import ReactApexChart from "react-apexcharts";

const Basicarea = () => {
  const series = [{
    name: "STOCK ABC",
    data: Chartseries[0]["monthDataSeries1"]["prices"]
  }];

  var options = {
    chart: {
      zoom: {
        enabled: !1
      }
    },
    dataLabels: {
      enabled: !1
    },
    stroke: {
      curve: "straight"
    },

    title: {
      text: "Fundamental Analysis of Stocks",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    subtitle: {
      text: "Price Movements",
      align: "left"
    },
    labels: Chartseries[0]["monthDataSeries1"]["dates"],
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      opposite: !0
    },
    legend: {
      horizontalAlign: "left"
    },
    colors: ["#038edc"]
  };

  return (
    <React.Fragment>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </React.Fragment>
  );
};

export default Basicarea;