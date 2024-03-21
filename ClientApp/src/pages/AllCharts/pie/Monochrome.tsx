import React from "react";
import ReactApexChart from "react-apexcharts";

const Monochrome = () => {
  const series = [25, 15, 44, 55, 41, 17];
  const options = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    theme: {
      monochrome: {
        enabled: !0,
        color: "#038edc",
        shadeTo: "light",
        shadeIntensity: 0.6,
      },
    },

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Monochrome Pie",
      style: {
        fontWeight: 500,
      },
    },
    dataLabels: {
      formatter: function (val: any, opts: any) {
        var name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
      },
      dropShadow: {
        enabled: !1,
      },
    },
    legend: {
      show: !1,
    },
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

export default Monochrome;
