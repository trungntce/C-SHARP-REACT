import ReactApexChart from "react-apexcharts";

const DistributedColumn = () => {
  const colors = [
    "#038edc",
    "#51d28c",
    "#f7cc53",
    "#f34e4e",
    "#564ab1",
    "#5fd0f3",
  ];

  const series = [
    {
      data: [21, 22, 10, 28, 16, 21, 13, 30],
    },
  ];

  const options = {
    
    chart: {
      events: {
        click: function (chart: any, w: any, e: any) {
        },
      },
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: !0,
      },
    },
    dataLabels: {
      enabled: !1,
    },
    legend: {
      show: !1,
    },
    xaxis: {
      categories: [
        ["John", "Doe"],
        ["Joe", "Smith"],
        ["Jake", "Williams"],
        "Amber",
        ["Peter", "Brown"],
        ["Mary", "Evans"],
        ["David", "Wilson"],
        ["Lily", "Roberts"],
      ],
      labels: {
        style: {
          colors: [
            "#038edc",
            "#51d28c",
            "#f7cc53",
            "#f34e4e",
            "#564ab1",
            "#5fd0f3",
          ],
          fontSize: "12px",
        },
      },
    },
  };

  return <ReactApexChart series={series} options={options} type="bar" height={350} />;
};

export default DistributedColumn;
