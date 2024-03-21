import React from "react";
import ReactApexChart from "react-apexcharts";

const BrushLine2 = () => {
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
  var options = {
    chart: {
      id: "chart1",
      brush: {
        target: "chart2",
        enabled: !0
      },
      selection: {
        enabled: !0,
        xaxis: {
          min: new Date("19 Jun 2017").getTime(),
          max: new Date("14 Aug 2017").getTime()
        }
      },
    },
    colors: ["#038edc"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      }
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: !1
      }
    },
    yaxis: {
      tickAmount: 2
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={130}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default BrushLine2;
