import React from "react";
import ReactApexChart from "react-apexcharts";

const PolarArea = () => {
    const series = [42, 47, 52, 58, 65];
    const options = {
      labels: ["Rose A", "Rose B", "Rose C", "Rose D", "Rose E"],
      fill: {
        opacity: 1
      },
      stroke: {
        width: 1,
        colors: undefined
      },
      yaxis: {
        show: !1
      },
      legend: {
        position: "bottom"
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0
          },
          spokes: {
            strokeWidth: 0
          },
        }
      },
      theme: {
        mode: "light", 
        palette: "palette1",
        monochrome: {
          enabled: !0,
          shadeTo: "light",
          color: "#038edc",
          shadeIntensity: 0.6
        }
      }
      };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="polarArea"
        width={400}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default PolarArea;
