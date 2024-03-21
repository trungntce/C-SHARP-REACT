import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../common/types";
import { css, Global } from "@emotion/react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart, getElementsAtEvent, getElementAtEvent } from "react-chartjs-2";
import { Col, Row } from "reactstrap";
import { LinearProgress } from "@mui/material";
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  ChartDataLabels
);

const bbtNg = ["4W", "short", "both", "open", "aux", "c", "er", "spk"];
const bbtNgName = [{"4W": "4W"}, {"short": "SHORT"}, {"both": "BOTH"}, {"open": "OPEN"}, {"aux": "AUX"}
, {"c": "C"}, {"er": "ER"}, {"spk": "SPK"}];

const dataChartStyle = css`
  .bbt-chart-data {
    
  }
  .bbt-chart-leg-text {
    display: flex;
    font-size: 11px;
    height: 11%;
    margin: 0px;
    padding: 0px;
  }

  .bbt-chart-leg-text p {
    width: 29px;
    height: 11px;
    margin-right: 6px;
    margin-bottom: 3px;
  }
`;
const chartLabels = [null, '월', '월', '월', '월', null, 'w', 'w', 'w', 'w', null, 'd', 'd', 'd', 'd', null];

const AOIDefectNewListChart = forwardRef((props: any, ref: any) => {
  const [data, setData] = useState<any>([]);
  const divRef = useRef<any>();
  const [loading, setLoading] = useState<any>(false);

  const [dataChart, setDataChart] = useState<any>({
    'labels': chartLabels,
    datasets: [],
  });
  const [title, setTitle] = useState<string>('');
  const setChart = async (data: Dictionary[], titleText: string = "") => {
    setLoading(false);
    setTitle(titleText ?? '');
    setData(data);

    const dataMonth = data[0];
    const dataWeek = data[1];
    const dataDay = data[2];
    const labels = [
      null,
      dataMonth[0].dateMwd,
      dataMonth[1].dateMwd,
      dataMonth[2].dateMwd,
      dataMonth[3].dateMwd,
      null,
      dataWeek[0].dateMwd,
      dataWeek[1].dateMwd,
      dataWeek[2].dateMwd,
      dataWeek[3].dateMwd,
      null,
      dataDay[0].dateMwd,
      dataDay[1].dateMwd,
      dataDay[2].dateMwd,
      dataDay[3].dateMwd,
      null
    ];

    const datasets: any[] = [];
    const lineDatas = createLineData(data);
    lineDatas.forEach((item: any) => {
      datasets.push(item);
    });
    const barDatas = createBarData(data);
    barDatas.forEach((item: any) => { 
      datasets.push(item);
    });
    
    setDataChart({
      'labels': labels,
      datasets: datasets
    });

    //console.log(chartRef);

    //console.log('change size: ', divRef.current.offsetWidth, ': ', divRef.current.offsetHeight);

    const chart = chartRef.current;
    chart.canvas.parentNode.style.height = + divRef.current.offsetHeight + 'px';
    chart.canvas.parentNode.style.width = divRef.current.offsetWidth + 'px';
  };

  window.addEventListener('resize', (e) => { 
    //const chart = chartRef.current;
    //console.log(chart.cavas);
 //   const canvas = document.getElementsByClassName('bbt-chart-data')[0];
 //   console.log(canvas);
 //   if (canvas && canvas.parentNode) {
   //   canvas.parentNode.style.height = + divRef.current.offsetHeight + 'px';
    //  canvas.parentNode.style.width = divRef.current.offsetWidth + 'px';
 //   }
  });

  const createBarData = (data: Dictionary[]) => {
    const dataMonth = data[0];
    const dataWeek = data[1];
    const dataDay = data[2];
    const dataTotal = createArrayBar(dataMonth, dataWeek, dataDay, 'totalCnt');
    // const data_4W = createArrayBar(dataMonth, dataWeek, dataDay, '4W');
   // const data_aux = createArrayBar(dataMonth, dataWeek, dataDay, 'aux');
   // const data_both = createArrayBar(dataMonth, dataWeek, dataDay, 'both');
   // const data_c = createArrayBar(dataMonth, dataWeek, dataDay, 'c');
   // const data_er = createArrayBar(dataMonth, dataWeek, dataDay, 'er');
   // const data_open = createArrayBar(dataMonth, dataWeek, dataDay, 'open');
   // const data_spk = createArrayBar(dataMonth, dataWeek, dataDay, 'spk');
   // const data_short = createArrayBar(dataMonth, dataWeek, dataDay, 'short');
    return [
      createObjBar(dataTotal, 'Total', '#E7E9EB'),
      // createObjBar(data_4W, '4W', '#FF7F27'),
      //createObjBar(data_aux, 'AUX', '#747581'),
      //createObjBar(data_both, 'BOTH', '#EBB832'),
      //createObjBar(data_c, 'C', '#2CA30E'),
      //createObjBar(data_er, 'ER', '#6a93fc'),
      //createObjBar(data_open, 'OPEN', '#b7ed82'),
     // createObjBar(data_spk, 'SPK', '#82edd4'),
     // createObjBar(data_short, 'SHORT', '#d987f2'),
    ];
  }

  const createArrayBar = (dataMonth: any, dataWeek: any, dataDay: any, key: string) => { 
    return [
      null,
      dataMonth[0][key],
      dataMonth[1][key],
      dataMonth[2][key],
      dataMonth[3][key],
      null,
      dataWeek[0][key],
      dataWeek[1][key],
      dataWeek[2][key],
      dataWeek[3][key],
      null,
      dataDay[0][key],
      dataDay[1][key],
      dataDay[2][key],
      dataDay[3][key],
      null
    ];
  }

  const createObjBar = (data: any, label: string, color: string) => { 
    return {
      type: 'bar',
      label: label,
      backgroundColor: color,
      data: data,
      yAxisID: 'second-y-axis'
    };
  }

  const createLineData = (data: Dictionary[]) => {
    const dataMonth = data[0];
    const dataWeek = data[1];
    const dataDay = data[2];

    const lineDataMon = [
      { x: null, y: null },
      { x: 20, y: divide(dataMonth[0].ngPcsCnt, dataMonth[0].pcsCnt) },
      { x: 15, y: divide(dataMonth[1].ngPcsCnt, dataMonth[1].pcsCnt) },
      { x: 20, y: divide(dataMonth[2].ngPcsCnt, dataMonth[2].pcsCnt) },
      { x: 25, y: divide(dataMonth[3].ngPcsCnt, dataMonth[3].pcsCnt) }
    ];
    const lineDataWek = [
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: 40, y: divide(dataWeek[0].ngPcsCnt, dataWeek[0].pcsCnt) },
      { x: 45, y: divide(dataWeek[1].ngPcsCnt, dataWeek[1].pcsCnt) },
      { x: 50, y: divide(dataWeek[2].ngPcsCnt, dataWeek[2].pcsCnt) },
      { x: 55, y: divide(dataWeek[3].ngPcsCnt, dataWeek[3].pcsCnt) }
    ];
    const lineDataDay = [
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: null, y: null },
      { x: 65, y: divide(dataDay[0].ngPcsCnt, dataDay[0].pcsCnt) },
      { x: 70, y: divide(dataDay[1].ngPcsCnt, dataDay[1].pcsCnt) },
      { x: 75, y: divide(dataDay[2].ngPcsCnt, dataDay[2].pcsCnt) },
      { x: 80, y: divide(dataDay[3].ngPcsCnt, dataDay[3].pcsCnt) },
      { x: null, y: null }
    ];

    return [
      createObjLine(lineDataMon, 'Total Month'),
      createObjLine(lineDataWek, 'Total Weekly'),
      createObjLine(lineDataDay, 'Total Daily')
    ];
  }

  const divide = (a: number, b:number) => {
    if (null === a || a === 0) {
      return null;
    }
    if (null === b || b === 0) {
      return null;
    }
    return ((a/b)*100).toFixed(2);
  }

  const createObjLine = (data: any, label: string) => { 
    return {
      type: 'line',
      label: label,
      borderColor: '#ff0000',
      borderWidth: 2,
      fill: false,
      data: data,
      yAxisID: 'first-y-axis',
    };
  }

  const getBarChartData = (key: string) => {
    if (key === null || key === undefined) {
      //console.log('Key is required!!!');
      return null;
    }
    if (data === null || data.length <= 0) {
      return null;
    }
    const months = data[0];
    const weeks = data[1];
    const days = data[2];
    //console.log(months, weeks, days);
    let colData = null;
    months.forEach((item: any) => {
      if (item.dateMwd === key) {
        return colData = item;
      }
    });
    weeks.forEach((item:any) => {
      if (item.dateMwd === key) {
        return colData = item;
      }
    });
    days.forEach((item:any) => {
      if (item.dateMwd === key) {
        return colData = item;
      }
    });
    return colData;
  }

  useImperativeHandle(ref, () => ({
    setChart,
    getBarChartData,
    data,
    setLoading
  }));

  const chartRef = useRef<any>();
  
  const [options, setOptions] = useState<any>({
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: false
      },
      title: {
        display: false,
        text: title ?? 'Chart JS',
        },
        datalabels: {
          color: '#000',
          align: 'start',
          anchor: "end",
          offset: (ctx: any) => {
            return -20;
            /*
            const {
              datasetIndex,
              dataIndex,
              chart
            } = ctx;
            const data = chart.getDatasetMeta(datasetIndex).data;
  
            return data[dataIndex].y - chart.chartArea.top - 22;
            */
          },
          formatter: function (value: any, context: any) {
            if (null === value || value === undefined) return '';

            // console.log(context);
            if (context.dataset.type === 'line') { 
              if (null !== value && typeof (value) === 'object') {
                if (undefined !== value.y) {
                  if (value.y <= 0) { 
                    return '';
                  }
                  return value.y + '%';
                }
                return '';
              }
              if (null === value || value === undefined) return '';
                return value + '%';
            }
            //  if (value < 1) return '';
            if (null !== value && typeof (value) === 'object') {
              if (undefined !== value.y) {
                if (value.y <= 0) { 
                  return '';
                }
                return new value.y;
              }
              return '';
            }

            if (value <= 0) {
              return '';
            }

            return new Intl.NumberFormat().format(parseInt(value));
          }
        }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        stacked: true
      },
      'first-y-axis': {
        type: 'linear',
        position: 'right',
        stacked: true,
        grid: {
          display: false
        },
        display: false,
      },
      'second-y-axis': {
        type: 'linear',
        position: 'left',
        grid: {
          display: false
        },
        display: false,
      }
    },
    maintainAspectRatio: false,
    aspectRatio: 1
  });

  useEffect(() => { 

  }, [dataChart])
  
  const onClickChart = (event: any) => {
    const res: any = getElementAtEvent(chartRef.current, event);
   // console.log(res);
    if (res.length === 0) {
      return;
    }
    //console.log(chartRef.current.data.labels[res[0]?.index]);
    props.onClick(chartRef.current.data.labels[res[0]?.index])
  }
  
  
 return (
   <div style={{ height: '100%', width: '100%' }}>
     <Global styles={dataChartStyle} />
      <div ref={divRef} style={{ height: '31vh', width: '100vh', position: 'relative', paddingTop: '10px' }}>
        {null !== dataChart ? <Chart className='bbt-chart-data' style={{ width: '100%', height: '100%' }} ref={chartRef} onClick={onClickChart} options={options} data={dataChart} type="line" /> : '<></>'}
     </div>
     {loading ? <LinearProgress /> : <></>}
     <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{ title }</div>
  </div>
 )
});

export default AOIDefectNewListChart;
