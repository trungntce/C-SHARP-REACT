import React from "react";
import ReactApexChart from "react-apexcharts";
import seriesDataLinear from "../../../common/data/seriesDataLiner";

const ComboCandlestick = () => {
  const series = [
    {
      name: "volume",
      data: seriesDataLinear,
    },
  ];
  var options = {
    chart: {
      brush: {
        enabled: !0,
        target: "candles",
      },
      selection: {
        enabled: !0,
        xaxis: {
          min: new Date("20 Jan 2017").getTime(),
          max: new Date("10 Dec 2017").getTime(),
        },
        fill: {
          color: "#ccc",
          opacity: 0.4,
        },
        stroke: {
          color: "#0d47a1",
        },
      },
    },
    dataLabels: {
      enabled: !1,
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: -1000,
              to: 0,
              color: "#f1734f",
            },
            {
              from: 1,
              to: 10000,
              color: "#f7cc53",
            },
          ],
        },
      },
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        offsetX: 13,
      },
    },
    yaxis: {
      labels: {
        show: !1,
      },
    },
  };
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={150}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default ComboCandlestick;
