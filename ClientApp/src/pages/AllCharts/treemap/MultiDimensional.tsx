import React from "react";
import ReactApexChart from "react-apexcharts";

const MultiDimensional = () => {
  const series = [
    {
      name: "Desktops",
      data: [
        {
          x: "ABC",
          y: 10
        },
        {
          x: "DEF",
          y: 60
        },
        {
          x: "XYZ",
          y: 41
        }
      ]
    },
    {
      name: "Mobile",
      data: [
        {
          x: "ABCD",
          y: 10
        },
        {
          x: "DEFG",
          y: 20
        },
        {
          x: "WXYZ",
          y: 51
        },
        {
          x: "PQR",
          y: 30
        },
        {
          x: "MNO",
          y: 20
        },
        {
          x: "CDE",
          y: 30
        }
      ]
    }
  ];

  const options = {
    legend: {
    show: !1
  },
  chart: {
    toolbar: {
      show: !1
    }
  },
  title: {
    text: "Multi-dimensional Treemap",
    align: "center",
    style: {
      fontWeight: 500,
    }
  },
  colors: ["#038edc", "#51d28c"]
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="treemap"
        height={350}
      />
    </React.Fragment>
  );
};

export default MultiDimensional;
