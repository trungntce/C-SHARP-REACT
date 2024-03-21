import ReactApexChart from "react-apexcharts";

const Quarter = () => {
  const series = [
    {
      data: [],
    },
  ];

  const optionsQuarter = {
    chart: {
      id: "barQuarter",
      width: "100%",
      stacked: !0,
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        horizontal: !1,
      },
    },
    legend: {
      show: !1,
    },
    grid: {
      yaxis: {
        lines: {
          show: !1,
        },
      },
      xaxis: {
        lines: {
          show: !0,
        },
      },
    },
    yaxis: {
      labels: {
        show: !1,
      },
    },
    title: {
      text: "Quarterly Results",
      offsetX: 10,
      style: {
        fontWeight: 600,
      },
    },
    tooltip: {
      x: {
        formatter: function (val: any, opts: any) {
          return opts.w.globals.seriesNames[opts.seriesIndex];
        },
      },
      y: {
        title: {
          formatter: function (val: any, opts: any) {
            return opts.w.globals.labels[opts.dataPointIndex];
          },
        },
      },
    },
  };

  return (
    <ReactApexChart
      series={series}
      options={optionsQuarter}
      type="bar"
      height={330}
    />
  );
};

export default Quarter;
