import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showLoading } from "../../../../common/utility";
import { useTranslation } from "react-i18next";

const RChart = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "rChart",
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
      yaxis: [
      // {
      //   y: 0,
      //   borderColor: "#ff5555",
      //   label: {
      //     borderColor: "#ff5555",
      //     offsetY: 0,
      //     style: {
      //       color: "#fff",
      //       background: "#ff5555",
      //     },
      //     text: "+3σ",
      //   }
      // },
      {
        y: 0,
        borderColor: "#ff8800",
        label: {
          borderColor: "#ff8800",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#ff8800",
          },
          text: "UCL",
        }
      },
      {
        y: 0,
        borderColor: "#ff8800",
        label: {
          borderColor: "#ff8800",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#ff8800",
          },
          text: "LCL",
        }
      },
      {
        y: 0,
        borderColor: "#6666ff",
        label: {
          borderColor: "#6666ff",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#6666ff",
          },
          text: t("@COL_AVG"),
        }
      },
    ]
    },
    markers:{
      size: 5,
      discrete: [],
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
      width: [2]
    },
    legend: {
      show: true,
      position: "top",
      offsetY: 30,
    },
    // title: {
    //   text: 'R Chart',
    //   align: 'left'
    // },
    xaxis: {
      type: 'category',
      labels:{
        show:false
      }
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
    options.annotations.yaxis[1].y = 0;
    options.annotations.yaxis[2].y = 0;
    setOptions({ ...options });
    setSeries([]);
  }

  const setChart = async (row: Dictionary, list: Dictionary[]) => {
    if (list?.length) {
      console.log(list)
      const serie = list.map(x => { return { y: [x.range], x: 'No. ' + x.rowNum + ' - ' +x.workorder } });
      // options.annotations.yaxis[0].y = row.rangeAdd3Sigma;
      options.annotations.yaxis[0].y = row.rCalcUcl;
      options.annotations.yaxis[1].y = row.rCalcLcl;
      options.annotations.yaxis[2].y = row.rangeAvg;
      
      console.log(list)
      const markerDescripe : any[] = [];
      list.map((x : any, i : number) => {
        if(x.judgeRule1R !== 'OK'){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#ff8800',
            strokeColor: '#ff8800',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }
      })
      options.markers.discrete = markerDescripe;

      const minList = list.map(x => x.range);
      const maxList = list.map(x => x.range);

      const minlcl = Math.min(...[...minList]);
      const maxucl = Math.max(...[...maxList]);

      const min = Math.min(...[...minList], row.rCalcLcl);
      const max = Math.max(...[...maxList], row.rCalcUcl);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec("rChart", "updateOptions", { ...options });
      ApexCharts.exec("rChart", "updateSeries", 
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

export default RChart;