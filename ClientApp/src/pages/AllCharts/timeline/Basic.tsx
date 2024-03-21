import React from "react";
import ReactApexChart from "react-apexcharts";

const Basic = () => {
  const series = [
    {
      data: [
        {
          x: "Code",
          y: [
            new Date("2019-03-02").getTime(),
            new Date("2019-03-04").getTime(),
          ],
        },
        {
          x: "Test",
          y: [
            new Date("2019-03-04").getTime(),
            new Date("2019-03-08").getTime(),
          ],
        },
        {
          x: "Validation",
          y: [
            new Date("2019-03-08").getTime(),
            new Date("2019-03-12").getTime(),
          ],
        },
        {
          x: "Deployment",
          y: [
            new Date("2019-03-12").getTime(),
            new Date("2019-03-18").getTime(),
          ],
        },
      ],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
      },
    },
    xaxis: {
      type: "datetime",
    },
    colors: ["#038edc"],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={350}
      />
    </React.Fragment>
  );
};

export default Basic;