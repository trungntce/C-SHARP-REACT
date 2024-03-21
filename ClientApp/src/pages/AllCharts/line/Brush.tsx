import React from "react";
import ReactApexChart from "react-apexcharts";

const Brush = () => {
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
  
  var data = generateDayWiseTimeSeries(new Date("11 Feb 2017").getTime(), 185, {
    min: 30,
    max: 90
  });
const series = [{
  data: data
}];
  const options = {
    chart: {
      id: "chart2",
      toolbar: {
        autoSelected: "pan",
        show: !1
      }
    },
    colors: ["#f1734f"],
    stroke: {
      width: 3
    },
    dataLabels: {
      enabled: !1
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: "datetime"
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={230}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Brush;
