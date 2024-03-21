import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showLoading } from "../../../../common/utility";
import { useTranslation } from "react-i18next";

const XbarChart = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation()
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "XbarChart",
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
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
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
      {
        y: 0,
        borderColor: "#fd8a17",
        label: {
          borderColor: "#fd8a17",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#fd8a17",
          },
          text: "LCL",
        }
      },
      {
        y: 0,
        borderColor: "#fd8a17",
        label: {
          borderColor: "#fd8a17",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#fd8a17",
          },
          text: "UCL",
        }
      },
      {
        y: 0,
        borderColor: "#44ff44",
        label: {
          borderColor: "#44ff44",
          offsetY: 0,
          style: {
            color: "#000000",
            background: "#44ff44",
          },
          text: "Target",
        }
      },
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
      //     text: "1-L-SIGMA",
      //   }
      // },
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
    //   text: 'X-Bar Chart',
    //   align: 'left',
    //   style : {
    //     fontSize : '0.5rem',
    //     color:'black',
    //     marginTop : '20px',
    //   }

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
            
          return val > 10 ? val?.toFixed(2) : val?.toFixed(3);
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
    
    // options.annotations.yaxis[5].y = 0;
    // options.annotations.yaxis[6].y = 0;

    options.markers.discrete = [];

    setOptions({ ...options });
    setSeries([]);
  }

  const setChart = async (row: Dictionary, list: Dictionary[]) => {
    if (list?.length) {
      
      const serie = list.map(x => { return { y: [x.avg], x: `No. ${x.rowNum} - ` + x.workorder } });
      const serieMinMax = list.map(x => { return { y: [x.min, x.max], x: x.workorder } });
      options.annotations.yaxis[0].y = row.lsl;
      options.annotations.yaxis[1].y = row.usl > 998 ? 0 : row.usl;

      options.annotations.yaxis[2].y = row.valueAvg;

      options.annotations.yaxis[3].y = row.valueSub2Sigma;
      options.annotations.yaxis[4].y = row.valueAdd2Sigma;
      options.annotations.yaxis[5].y = (row.usl + row.lsl) / 2;

      // options.annotations.yaxis[3].y = row.xBarCalcLcl;
      // options.annotations.yaxis[4].y = row.xBarCalcUcl;
      // options.annotations.yaxis[5].y = row.valueSub1Sigma;
      // options.annotations.yaxis[6].y = row.valueSub2Sigma;

      const markerDescripe : any[] = [];
      list.map((x : any, i : number) => {
        if(x.statusFlag === 'NG'){
          const describe = {
            seriesIndex: 0,
            dataPointIndex: i,
            fillColor: '#ff0000',
            strokeColor: '#ff0000',
            size: 7,
            shape: "circle" 
          }
          markerDescripe.push(describe)
        }else if(x.statusFlag === 'CHK'){
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

      const minList = list.map(x => x.avg);
      const maxList = list.map(x => x.avg);


      const min = Math.min(...[...minList, ...[row.lsl]]);
      const max = Math.max(...[...maxList, ...[row.usl]]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec("XbarChart", "updateOptions", { ...options });
      ApexCharts.exec("XbarChart", "updateSeries", 
        [
          { type: "line", data: serie, name: `값` }
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


export default XbarChart;






