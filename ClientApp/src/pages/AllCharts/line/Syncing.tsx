import React from "react";
import ReactApexChart from "react-apexcharts";

const Syncing = () => {
  const generateDayWiseTimeSeries = (baseval : any, count: any, yrange: any) => {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  
      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  };
  
const series = [{
  data: generateDayWiseTimeSeries(new Date("11 Feb 2017").getTime(), 20, {
    min: 10,
    max: 60
  })
}];
const options = {
    chart: {
      id: "fb",
      group: "social"
    },
    colors: ["#038edc"],
    yaxis: {
      labels: {
        minWidth: 40
      }
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={160}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Syncing;
