import React from "react";
import ReactApexChart from "react-apexcharts";
import authbg from "../../../assets/images/auth-bg.jpg";
import img5 from "../../../assets/images/small/img-5.jpg";
import img2 from "../../../assets/images/small/img-2.jpg";

const ImageFill = () => {
  const series = [44, 33, 54, 45];
  var options = {
    colors: ["#93C3EE", "#E5C6A0", "#669DB5", "#94A74A"],
    fill: {
      type: "image",
      opacity: 0.85,
      image: {
        width: 25,
        imagedHeight: 25,
      },
    },
    stroke: {
      width: 4,
    },
    dataLabels: {
      enabled: !0,
      style: {
        colors: ["#111"],
      },
      background: {
        enabled: !0,
        foreColor: "#fff",
        borderWidth: 0,
      },
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={300}
      />
    </React.Fragment>
  );
};

export default ImageFill;
