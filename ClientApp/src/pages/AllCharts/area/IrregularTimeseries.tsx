import React from "react";
import DataSeries from "../../../common/data/irregularSeries";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

const IrregularTimeseries = () => {
//   const ts1 = 1388534400000;
//   const ts2 = 1388620800000;
//   const ts3 = 1389052800000;

//   const dataSet = [[], [], []];
//   const innerArr: number =[];

//   for (var i = 0; i < 12; i++) {
//     ts1 = ts1 + 86400000;
//     const innerArr = [ts1, DataSeries[2][i].value];
//     dataSet[0].push(innerArr);
//   }
//   for (var i = 0; i < 18; i++) {
//     ts2 = ts2 + 86400000;
//     const innerArr = [ts2, DataSeries[1][i].value];
//     dataSet[1].push(innerArr);
//   }
//   for (var i = 0; i < 12; i++) {
//     ts3 = ts3 + 86400000;
//     const innerArr = [ts3, DataSeries[0][i].value];
//     dataSet[2].push(innerArr);
//   }

//   //Irregular Timeseries Chart

//   var options = {
//     series: [
//       {
//         name: "PRODUCT A",
//         data: dataSet[0],
//       },
//       {
//         name: "PRODUCT B",
//         data: dataSet[1],
//       },
//       {
//         name: "PRODUCT C",
//         data: dataSet[2],
//       },
//     ],
//     chart: {
//       type: "area",
//       stacked: false,
//       height: 350,
//       zoom: {
//         enabled: false,
//       },
//       toolbar: {
//         show: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     markers: {
//       size: 0,
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shadeIntensity: 1,
//         inverseColors: false,
//         opacityFrom: 0.45,
//         opacityTo: 0.05,
//         stops: [20, 100, 100, 100],
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           colors: "#8e8da4",
//         },
//         offsetX: 0,
//         formatter: function (val) {
//           return (val / 1000000).toFixed(2);
//         },
//       },
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     xaxis: {
//       type: "datetime",
//       tickAmount: 8,
//       min: new Date("01/01/2014").getTime(),
//       max: new Date("01/20/2014").getTime(),
//       labels: {
//         rotate: -15,
//         rotateAlways: true,
//         formatter: function (val: any, timestamp: any) {
//           return moment(new Date(timestamp)).format("DD MMM YYYY");
//         },
//       },
//     },
//     title: {
//       text: "Irregular Data in Time Series",
//       align: "left",
//       offsetX: 14,
//       style: {
//         fontWeight: 500,
//       },
//     },
//     tooltip: {
//       shared: true,
//     },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       offsetX: -10,
//     },
//     colors: ["#038edc", "#f7cc53", "#51d28c"],
//   };

  return (
    <ReactApexChart
    //   options={options}
    //   series={series}
      type="area"
      height={350}
    />
  );
};

export default IrregularTimeseries;
