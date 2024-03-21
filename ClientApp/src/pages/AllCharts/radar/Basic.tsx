import React from "react";
import ReactApexChart from "react-apexcharts";

const Basic = () => {
    const series = [{
        name: "Series 1",
        data: [80, 50, 30, 40, 100, 20],
      }];
    const options = {   
        chart: {
        toolbar: {
          show: !1
        }
      },
      stroke: {
          colors:["#038edc"]
      },
      xaxis: {
        categories: ["January", "February", "March", "April", "May", "June"]
      }
      };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radar"
        height={350}
      />
    </React.Fragment>
  );
};

export default Basic;
