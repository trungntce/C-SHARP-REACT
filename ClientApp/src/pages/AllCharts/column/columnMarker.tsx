import ReactApexChart from "react-apexcharts";

const ColumnMarker = () => {
  const series = [
    {
      name: "Actual",
      data: [
        {
          x: "2011",
          y: 1292,
          goals: [
            {
              name: "Expected",
              value: 1400,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2012",
          y: 4432,
          goals: [
            {
              name: "Expected",
              value: 5400,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2013",
          y: 5423,
          goals: [
            {
              name: "Expected",
              value: 5200,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2014",
          y: 6653,
          goals: [
            {
              name: "Expected",
              value: 6500,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2015",
          y: 8133,
          goals: [
            {
              name: "Expected",
              value: 6600,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2016",
          y: 7132,
          goals: [
            {
              name: "Expected",
              value: 7500,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2017",
          y: 7332,
          goals: [
            {
              name: "Expected",
              value: 8700,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
        {
          x: "2018",
          y: 6553,
          goals: [
            {
              name: "Expected",
              value: 7300,
              strokeWidth: 5,
              strokeColor: "#775DD0",
            },
          ],
        },
      ],
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    colors: ["#51d28c"],
    dataLabels: {
      enabled: !1,
    },
    legend: {
      show: !0,
      showForSingleSeries: !0,
      customLegendItems: ["Actual", "Expected"],
      markers: {
        fillColors: ["#51d28c", "#564ab1"],
      },
    },
  };
  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

export default ColumnMarker;
