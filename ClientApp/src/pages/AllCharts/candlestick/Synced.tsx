import React from "react";
import ReactApexChart from "react-apexcharts";
import seriesData from "../../../common/data/candlestickData";
import classname from 'classnames';

const Synced = () => {
  const series = [{
    data: seriesData
  }];

  const options = {
    chart: {
      id: 'candles',
      toolbar: {
        autoSelected: 'pan',
        show: !1
      },
      zoom: {
        enabled: !1
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#038edc',
          downward: '#f1734f'
        }
      }
    },
    xaxis: {
      type: 'datetime'
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={200}
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default Synced;
