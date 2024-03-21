import React from "react";
import ReactApexChart from "react-apexcharts";

const Multiple = () => {
    const series = [44, 55, 67, 83];
    const options = {
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: !0,
              label: "Total",
              formatter: function (w : any) {
                return 249;
              }
            }
          }
        }
      },
      labels: ["Apples", "Oranges", "Bananas", "Berries"],
      colors :["#038edc", "#51d28c", "#f7cc53", "#f34e4e"]
      };
      
  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={350}
      />
    </React.Fragment>
  );
};

export default Multiple;
