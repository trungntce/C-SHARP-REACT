import React from "react";
import ReactApexChart from "react-apexcharts";
import AnnotationsSeries from "../../../common/data/annotations";
import logosm from "../../../assets/images/logo-sm.png";

const Annotations = () => {
  const series = [{
    data: AnnotationsSeries.monthDataSeries1.prices
  }];

  const options = {
    chart: {
      id: "areachart-2"
    },
    annotations: {
      yaxis: [{
        y: 8200,
        borderColor: "#038edc",
        label: {
          borderColor: "#038edc",
          style: {
            color: "#fff",
            background: "#038edc",
          },
          text: "Support",
        }
      }, {
        y: 8600,
        y2: 9000,
        borderColor: "#f7cc53",
        fillColor: "#f7cc53",
        opacity: 0.2,
        label: {
          borderColor: "#f7cc53",
          style: {
            fontSize: "10px",
            color: "#000",
            background: "#f7cc53",
          },
          text: "Y-axis range",
        }
      }],
      xaxis: [{
        x: new Date("23 Nov 2017").getTime(),
        strokeDashArray: 0,
        borderColor: "#564ab1",
        label: {
          borderColor: "#564ab1",
          style: {
            color: "#fff",
            background: "#564ab1",
          },
          text: "Anno Test",
        }
      }, {
        x: new Date("26 Nov 2017").getTime(),
        x2: new Date("28 Nov 2017").getTime(),
        fillColor: "#51d28c",
        opacity: 0.4,
        label: {
          borderColor: "#000",
          style: {
            fontSize: "10px",
            color: "#fff",
            background: "#000",
          },
          offsetY: -10,
          text: "X-axis range",
        }
      }],
      points: [{
        x: new Date("01 Dec 2017").getTime(),
        y: 8607.55,
        marker: {
          size: 8,
          fillColor: "#fff",
          strokeColor: "red",
          radius: 2,
          cssClass: "apexcharts-custom-class"
        },
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#f34e4e",
          },
  
          text: "Point Annotation",
        }
      }, {
        x: new Date("08 Dec 2017").getTime(),
        y: 9340.85,
        marker: {
          size: 0
        },
        image: {
          path: logosm,
          width: 40,
          height: 40
        }
      }]
    },
    dataLabels: {
      enabled: !1
    },
    stroke: {
      curve: "straight"
    },
    colors: ["#038edc"],
    grid: {
      padding: {
        right: 30,
        left: 20
      }
    },
    title: {
      text: "Line with Annotations",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    labels: AnnotationsSeries.monthDataSeries1.dates,
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
        height={350}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Annotations;
