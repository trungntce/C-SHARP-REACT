import ReactApexChart from "react-apexcharts";

const RangeColumn = () => {
  const series = [
    {
      data: [
        {
          x: "Team A",
          y: [1, 5],
        },
        {
          x: "Team B",
          y: [4, 6],
        },
        {
          x: "Team C",
          y: [5, 8],
        },
        {
          x: "Team D",
          y: [3, 11],
        },
      ],
    },
    {
      data: [
        {
          x: "Team A",
          y: [2, 6],
        },
        {
          x: "Team B",
          y: [1, 3],
        },
        {
          x: "Team C",
          y: [7, 8],
        },
        {
          x: "Team D",
          y: [5, 9],
        },
      ],
    },
  ];
  var options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !1,
      },
    },
    dataLabels: {
      enabled: !0,
    },
    legend: {
      show: !1,
    },
    colors: ["#038edc", "#51d28c"],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="rangeBar"
      height={335}
    />
  );
};

export default RangeColumn;
