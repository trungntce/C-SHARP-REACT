import React from "react";
import ReactApexChart from "react-apexcharts";
import AnnotationsSeries from "../../../common/data/annotations";

const Annotations2 = () => {
  const series = [{
    name: "AE-106",
    data: AnnotationsSeries.monthDataSeriesEx.prices
  }, {
    name: "AE-107",
    data: AnnotationsSeries.monthDataSeriesEx2.prices
  }];

  const options = {
    chart: {
      id: "areachart-2"
    },
    annotations: {
      yaxis: [{
        y: 18.7,
        borderColor: "#f1532f",
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#f34e4e",
          },
  
          text: "Lower",
        }
      }]
    },
    dataLabels: {
      enabled: !1
    },
    stroke: {
      curve: "straight"
    },
    colors: ["#038edc", "#51d28c"],
    grid: {
      padding: {
        right: 30,
        left: 20
      }
    },
    title: {
      text: "DI Water",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    labels: AnnotationsSeries.monthDataSeriesEx.dates,
    xaxis: {
      type: "datetime",
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={190}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Annotations2;
