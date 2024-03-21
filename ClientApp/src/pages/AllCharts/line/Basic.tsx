import React from "react";
import ReactApexChart from "react-apexcharts";

const Basic = () => {
  const series = [{
    name: "Desktops",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];
  const options = {
    chart: {
      zoom: {
        enabled: !1
      },
      toolbar: {
        show: !1
      }
    },
    markers: {
      size: 4,
    },
    dataLabels: {
      enabled: !1
    },
    stroke: {
      curve: "straight"
    },
    colors: ["#038edc"],
    title: {
      text: "Product Trends by Month",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },

    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Basic;