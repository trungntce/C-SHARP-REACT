import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showLoading } from "../../../../common/utility";

const MrChart = forwardRef((props: any, ref: any) => {
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "mrChart",
      height: '100%',
      type: 'line',
      animations: {
        speed: 500
      },
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: false
        },
      }
    },
    annotations: {
      yaxis: [{
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#ff6700",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#ff6700",
          },
          text: "LCL",
        }
      },
      // {
      //   y: 0,
      //   borderColor: "#f1532f",
      //   label: {
      //     borderColor: "#ff6700",
      //     offsetY: 0,
      //     style: {
      //       color: "#fff",
      //       background: "#ff6700",
      //     },
      //     text: "UCL",
      //   }
      // },
      // {
      //   y: 0,
      //   borderColor: "#f1532f",
      //   label: {
      //     borderColor: "#f34e4e",
      //     offsetY: 0,
      //     style: {
      //       color: "fff",
      //       background: "#f34e4e",
      //     },
      //     text: "LSL",
      //   }
      // },
      // {
      //   y: 0,
      //   borderColor: "#f1532f",
      //   label: {
      //     borderColor: "#f34e4e",
      //     offsetY: 0,
      //     style: {
      //       color: "#fff",
      //       background: "#f34e4e",
      //     },
      //     text: "USL",
      //   }
      // }
    ]
    },
    colors: ['#008cf4'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: [1]
    },
    stroke: {
      curve: 'straight',
      width: [3]
    },
    legend: {
      show: true,
      position: "top",
      offsetY: 30,
    },
    title: {
      text: 'MR Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: function (val: any) {
          if(!val || val == 0)
            return "";

          return val?.toFixed(3);
        }
      },
    },
    noData: {
      text: "No Data",
    }
  });

  const resetChart = () => {
    options.annotations.yaxis[0].y = 0;
    // options.annotations.yaxis[1].y = 0;
    // options.annotations.yaxis[2].y = 0;
    // options.annotations.yaxis[3].y = 0;
    setOptions({ ...options });
    setSeries([]);
  }

  const setChart = async (row: Dictionary, list: Dictionary[]) => {
    if (list?.length) {
      const serie = list.map(x => { return { y: [x.range], x: x.measureDt } });
      options.annotations.yaxis[0].y = 0;
      // options.annotations.yaxis[1].y = 0;
      // options.annotations.yaxis[2].y = 0;
      // options.annotations.yaxis[3].y = 0;

      const minList = list.map(x => x.range);
      const maxList = list.map(x => x.range);

      const minlcl = Math.min(...[...minList]);
      const maxucl = Math.max(...[...maxList]);

      const min = Math.min(...[...minList]);
      const max = Math.max(...[...maxList]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec("mrChart", "updateOptions", { ...options });
      ApexCharts.exec("mrChart", "updateSeries", 
        [
          { type: "line", data: serie, name: `범위` }
        ]);
    } else {
      alertBox("조회된 데이터가 없습니다.");
    }

    spinnerRef.current.style.display = "none";
  };

  useImperativeHandle(ref, () => ({
    resetChart,
    setChart,
    showLoading: (isShow: boolean) => {
      spinnerRef.current.style.display = isShow ? "block" : "none";
    }
  }));

  useEffect(() => {
  }, []);

  return (
    <>
      <div ref={spinnerRef} className="chart-spinner">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={'100%'}
        className="apex-charts"
      />
    </>
  );
});

export default MrChart;
