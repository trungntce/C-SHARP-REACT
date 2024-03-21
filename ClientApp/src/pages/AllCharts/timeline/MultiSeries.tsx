import React from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

const MultiSeries = () => {
  const series = [
    {
      name: "Bob",
      data: [
        {
          x: "Design",
          y: [
            new Date("2019-03-05").getTime(),
            new Date("2019-03-08").getTime(),
          ],
        },
        {
          x: "Code",
          y: [
            new Date("2019-03-08").getTime(),
            new Date("2019-03-11").getTime(),
          ],
        },
        {
          x: "Test",
          y: [
            new Date("2019-03-11").getTime(),
            new Date("2019-03-16").getTime(),
          ],
        },
      ],
    },
    {
      name: "Joe",
      data: [
        {
          x: "Design",
          y: [
            new Date("2019-03-02").getTime(),
            new Date("2019-03-05").getTime(),
          ],
        },
        {
          x: "Code",
          y: [
            new Date("2019-03-06").getTime(),
            new Date("2019-03-09").getTime(),
          ],
        },
        {
          x: "Test",
          y: [
            new Date("2019-03-10").getTime(),
            new Date("2019-03-19").getTime(),
          ],
        },
      ],
    },
  ];

  var options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        var a = moment(val[0]);
        var b = moment(val[1]);
        var diff = b.diff(a, "days");
        return diff + (diff > 1 ? " days" : " day");
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100],
      },
    },
    xaxis: {
      type: "datetime",
    },
    legend: {
      position: "top",
    },
    colors: ["#038edc", "#51d28c"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={335}
      />
    </React.Fragment>
  );
};

export default MultiSeries;
