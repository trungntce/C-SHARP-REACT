import React,{useState} from "react";
import ReactApexChart from "react-apexcharts";

let data: any[];

const Realtimes = () => {
  const [realtimeList, setrealtime] = useState({});

  let lastDate = 0;
  const TICKINTERVAL = 86400000;
  const XAXISRANGE = 777600000;
  const getDayWiseTimeSeries = (baseval: any, count: any, yrange: any) => {
    let i = 0;

    while (i < count) {
      const x = baseval;
      const y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      
        setrealtime({ x: x, y: y });

      lastDate = baseval;
      baseval += TICKINTERVAL;
      i++;
    }
  };

  getDayWiseTimeSeries(new Date("11 Feb 2017 GMT").getTime(), 10, {
    min: 10,
    max: 90,
  });

  const getNewSeries = (baseval : any, yrange : any) => {
    var newDate = baseval + TICKINTERVAL;
    lastDate = newDate
  
    for (var i = 0; i < data.length - 10; i++) {
      // IMPORTANT
      // we reset the x and y of the data which is out of drawing area
      // to prevent memory leaks
      data[i].x = newDate - XAXISRANGE - TICKINTERVAL
      data[i].y = 0
    }
  
    data.push({
      x: newDate,
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    })
  }

  const resetData = () => {
    // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
    data = data.slice(data.length - 10, data.length);
  }

  window.setInterval(function () {
    getNewSeries(lastDate, {
      min: 10,
      max: 90
    })
  

  }, 1000)

  const series = [
    {
      data: realtimeList,
    },
  ];
  var options = {
    chart: {
      id: "realtime",
      animations: {
        enabled: !0,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: !1,
      },
      zoom: {
        enabled: !1,
      },
    },
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Dynamic Updating Chart",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    markers: {
      size: 0,
    },
    colors: ["#038edc"],
    xaxis: {
      type: "datetime",
      range: XAXISRANGE,
    },
    yaxis: {
      max: 100,
    },
    legend: {
      show: !1,
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </React.Fragment>
  );
};

export default Realtimes;
