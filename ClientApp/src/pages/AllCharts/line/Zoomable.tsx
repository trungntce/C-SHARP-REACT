import React from "react";
import ReactApexChart from "react-apexcharts";
import zoomableSeries from "../../../common/data/zoomableSeries";

const series = [{
  name: "XYZ MOTORS",
  data: zoomableSeries
}];

const Zoomable = () => {
  const options = {
    chart: {
      stacked: !1,
      zoom: {
        type: "x",
        enabled: !0,
        autoScaleYaxis: !0
      },
      toolbar: {
        autoSelected: "zoom"
      }
    },
    colors: ["#038edc"],
    dataLabels: {
      enabled: !1
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Stock Price Movement",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: !1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      showAlways: !0,
      labels: {
        show: !0,
        formatter: function (val : any) {
          return (val / 1000000).toFixed(0);
        },
      },
      title: {
        text: "Price",
        style: {
          fontWeight: 500,
        },
      },
    },
    xaxis: {
      type: "datetime",
  
    },
    tooltip: {
      shared: !1,
      y: {
        formatter: function (val : any) {
          return (val / 1000000).toFixed(0);
        }
      }
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Zoomable;
