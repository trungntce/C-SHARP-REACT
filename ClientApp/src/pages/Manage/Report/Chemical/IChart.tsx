import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showLoading } from "../../../../common/utility";

const IChart = forwardRef((props: any, ref: any) => {
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "I Chart",
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
      {
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "fff",
            background: "#f34e4e",
          },
          text: "LSL",
        }
      },
      {
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#f34e4e",
          },
          text: "USL",
        }
      },
      {
        y: 0,
        borderColor: "#33FF33",
        label: {
          borderColor: "#33FF33",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#33FF33",
          },
          text: "STD",
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
          text: "평균",
        }
      }      
      ,{
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
        borderColor: "#ff8800",
        label: {
          borderColor: "#ff8800",
          offsetY: 0,
          style: {
            color: "#000000",
            background: "#ff8800",
          },
          text: "UCL",
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
    title: {
      text: '',
      align: 'left'
    },
    xaxis: {
      // type: 'category'
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: function (val: any) {
          if(!val || val == 0)
            return "";

          return val?.toFixed(2);
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

    options.annotations.yaxis[3].y = 0;

    options.annotations.yaxis[4].y = 0;
    options.annotations.yaxis[5].y = 0;
    setOptions({ ...options });
    setSeries([]);
  }

  const setChart = async (row: Dictionary, list: Dictionary[]) => {
    if (list?.length) {
      const serie = list.map(x => { return { y: [x.value], x: x.measureDt } });
      options.annotations.yaxis[0].y = row.valueLsl;
      options.annotations.yaxis[1].y = row.valueUsl;
      options.annotations.yaxis[2].y = row.valueMiddle;
      
      options.annotations.yaxis[3].y = row.valueAvg;

      options.annotations.yaxis[4].y = row.valueUcl;
      options.annotations.yaxis[5].y = row.valueLcl;


      const markerDescripe : any[] = [];
      list.map((x : any, i : number) => {

        if(Number(x.adjSeq) === 1){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#B6EBBD',
            strokeColor: '#B6EBBD',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(Number(x.adjSeq) === 2){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#9DE7B6',
            strokeColor: '#9DE7B6',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(Number(x.adjSeq) === 3){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#85E3AE',
            strokeColor: '#85E3AE',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(Number(x.adjSeq) === 4){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#00B663',
            strokeColor: '#00B663',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(Number(x.adjSeq) === 5){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#009E4A',
            strokeColor: '#009E4A',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(Number(x.adjSeq) === 6){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#017939',
            strokeColor: '#017939',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(Number(x.adjSeq) > 6){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#215932',
            strokeColor: '#215932',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }
        

        
        if(x.statusFlag === 'CHK'){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#ff8800',
            strokeColor: '#ff8800',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(x.statusFlag === 'NG'){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#ff0000',
            strokeColor: '#ff0000',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }


      })

      options.markers.discrete = markerDescripe;

      const minList = list.map(x => x.value);
      const maxList = list.map(x => x.value);

      const minlcl = Math.min(...[...minList]);
      const maxucl = Math.max(...[...maxList]);

      const min = Math.min(...[...minList], ...[row.valueLsl, row.valueLowerSigma]);
      const max = Math.max(...[...maxList], ...[row.valueUsl, row.valueUpperSigma]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec("I Chart", "updateOptions", { ...options });
      ApexCharts.exec("I Chart", "updateSeries", 
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

export default IChart;
