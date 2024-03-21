import React from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

const DifferentColor = () => {
  const series = [
    {
      data: [
        {
          x: "Analysis",
          y: [
            new Date("2019-02-27").getTime(),
            new Date("2019-03-04").getTime(),
          ],
          fillColor: "#038edc",
        },
        {
          x: "Design",
          y: [
            new Date("2019-03-04").getTime(),
            new Date("2019-03-08").getTime(),
          ],
          fillColor: "#f34e4e",
        },
        {
          x: "Coding",
          y: [
            new Date("2019-03-07").getTime(),
            new Date("2019-03-10").getTime(),
          ],
          fillColor: "#51d28c",
        },
        {
          x: "Testing",
          y: [
            new Date("2019-03-08").getTime(),
            new Date("2019-03-12").getTime(),
          ],
          fillColor: "#f7cc53",
        },
        {
          x: "Deployment",
          y: [
            new Date("2019-03-12").getTime(),
            new Date("2019-03-17").getTime(),
          ],
          fillColor: "#5fd0f3",
        },
      ],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        var label = opts.w.globals.labels[opts.dataPointIndex];
        var a = moment(val[0]);
        var b = moment(val[1]);
        var diff = b.diff(a, "days");
        return label + ": " + diff + (diff > 1 ? " days" : " day");
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      show: true,
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={350}
      />
    </React.Fragment>
  );
};

export default DifferentColor;
