import ReactApexChart from "react-apexcharts";

const StackedColumn2 = () => {
  const series = [
    {
      name: "PRODUCT A",
      data: [44, 55, 41, 67, 22, 43, 21, 49],
    },
    {
      name: "PRODUCT B",
      data: [13, 23, 20, 8, 13, 27, 33, 12],
    },
    {
      name: "PRODUCT C",
      data: [11, 17, 15, 15, 21, 14, 15, 13],
    },
  ];

  const options = {
    
    chart: {
      stacked: !0,
      stackType: "100%",
      toolbar: {
        show: !1,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: [
        "2011 Q1",
        "2011 Q2",
        "2011 Q3",
        "2011 Q4",
        "2012 Q1",
        "2012 Q2",
        "2012 Q3",
        "2012 Q4",
      ],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "right",
      offsetX: 0,
      offsetY: 50,
    },
    colors: ["#038edc", "#51d28c", "#f7cc53"],
  };

  return <ReactApexChart series={series} options={options} type="bar" height={350} />;
};

export default StackedColumn2;
