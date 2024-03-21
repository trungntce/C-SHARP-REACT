import React from "react";
import ReactApexChart from "react-apexcharts";

const Distributed = () => {
  const series = [
    {
      data: [
        {
          x: "New Delhi",
          y: 218,
        },
        {
          x: "Kolkata",
          y: 149,
        },
        {
          x: "Mumbai",
          y: 184,
        },
        {
          x: "Ahmedabad",
          y: 55,
        },
        {
          x: "Bangaluru",
          y: 84,
        },
        {
          x: "Pune",
          y: 31,
        },
        {
          x: "Chennai",
          y: 70,
        },
        {
          x: "Jaipur",
          y: 30,
        },
        {
          x: "Surat",
          y: 44,
        },
        {
          x: "Hyderabad",
          y: 68,
        },
        {
          x: "Lucknow",
          y: 28,
        },
        {
          x: "Indore",
          y: 19,
        },
        {
          x: "Kanpur",
          y: 29,
        },
      ],
    },
  ];

  const options = {
    legend: {
      show: !1,
    },
    chart: {
      toolbar: {
        show: !1,
      },
    },
    title: {
      text: "Distibuted Treemap (different color for each cell)",
      align: "center",
      style: {
        fontWeight: 500,
      },
    },
    colors: [
      "#038edc",
      "#f7cc53",
      "#51d28c",
      "#e83e8c",
      "#564ab1",
      "#51d28c",
      "#5fd0f3",
      "#f34e4e",
      "#51d28c",
      "#e83e8c",
      "#495057",
      "#f1734f",
    ],
    plotOptions: {
      treemap: {
        distributed: !0,
        enableShades: !1,
      },
    },
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

export default Distributed;
