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
  const [loading, setLoading] = useState<any>(false);
  const divRef = useRef<any>();
  const colors = ['#F8CBAD', '#B4C6E7', '#00e5ff', '#ff5400', '#9800ff', '#00a1ff', '#d8ff00', '#ff008c', '#007bff'];
  const [eqpList, setEqpList] = useState<any>([]);

  const [dataChart, setDataChart] = useState<any>({
    'labels': chartLabels,
    datasets: [],
  });
  const [title, setTitle] = useState<string>('');

  const setChart = async (data: Dictionary[], titleText: string = "") => {
    setLoading(false);
    setTitle(titleText ?? '');
    setData(data);
    const chartData = data[0];
    const labels = [
      null,
      chartData[0].date_mwd,
      chartData[1].date_mwd,
      chartData[2].date_mwd,
      chartData[3].date_mwd,
      null,
      chartData[4].date_mwd,
      chartData[5].date_mwd,
      chartData[6].date_mwd,
      chartData[7].date_mwd,
      null,
      chartData[8].date_mwd,
      chartData[9].date_mwd,
      chartData[10].date_mwd,
      chartData[11].date_mwd,
      null
    ];

    const datasets: any[] = [];
    const lineDatas = createLineData(data);
    lineDatas.forEach((item: any) => {
      datasets.push(item);
    });
    const barDatas = createBarData(data);
    console.log(barDatas);
    barDatas.forEach((item: any) => { 
      datasets.push(item);
    });
    
    setDataChart({
      'labels': labels,
      datasets: datasets
    });

    console.log(chartRef);

    console.log('change size: ', divRef.current.offsetWidth, ': ', divRef.current.offsetHeight);

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
    if (data.length < 0) {
      return [];
    }

    const results: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const bar = data[i];
      const barData = createArrayBar(bar);
      console.log(barData);
      results.push(createObjBar(barData, bar[0].eqp_code, colors[i]));
    }
    console.log(results);
    return results;
  }

  const createArrayBar = (data:any) => { 
    return [
      null,
      data[0].pnl_total,
      data[1].pnl_total,
      data[2].pnl_total,
      data[3].pnl_total,
      null,
      data[4].pnl_total,
      data[5].pnl_total,
      data[6].pnl_total,
      data[7].pnl_total,
      null,
      data[8].pnl_total,
      data[9].pnl_total,
      data[10].pnl_total,
      data[11].pnl_total,
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
    if (data.length < 0) {
      return [];
    }

    const results: any[] = [];

    let labels = '';
    for (let i = 0; i < data.length; i++) { 
      const line = data[i];
      const lineDataMon = [
        { x: null, y: null },
        { x: 20, y: divide(line[0].ng_pcs_cnt, line[0].pcs_total) },
        { x: 15, y: divide(line[1].ng_pcs_cnt, line[1].pcs_total) },
        { x: 20, y: divide(line[2].ng_pcs_cnt, line[2].pcs_total) },
        { x: 25, y: divide(line[3].ng_pcs_cnt, line[3].pcs_total) }
      ];
      const lineDataWek = [
        { x: null, y: null },
        { x: null, y: null },
        { x: null, y: null },
        { x: null, y: null },
        { x: null, y: null },
        { x: null, y: null },
        { x: 40, y: divide(line[4].ng_pcs_cnt, line[4].pcs_total) },
        { x: 45, y: divide(line[5].ng_pcs_cnt, line[5].pcs_total) },
        { x: 50, y: divide(line[6].ng_pcs_cnt, line[6].pcs_total) },
        { x: 55, y: divide(line[7].ng_pcs_cnt, line[7].pcs_total) }
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
        { x: 65, y: divide(line[8].ng_pcs_cnt, line[8].pcs_total) },
        { x: 70, y: divide(line[9].ng_pcs_cnt, line[9].pcs_total) },
        { x: 75, y: divide(line[10].ng_pcs_cnt, line[10].pcs_total) },
        { x: 80, y: divide(line[11].ng_pcs_cnt, line[11].pcs_total) },
        { x: null, y: null }
      ];

      results.push(createObjLine(lineDataMon, line[0].eqp_code, colors[i]));
      results.push(createObjLine(lineDataWek, line[0].eqp_code, colors[i]));
      results.push(createObjLine(lineDataDay, line[0].eqp_code, colors[i]));

      if (labels !== '') {
        labels += '|';
      }
      eqpList.forEach((x: any) => { 
        if (x.value === line[0].eqp_code) { 
          labels += `<span style="color: ${colors[i]}">${x.label}(${line[0].eqp_code})</span>`;
        }
      });
    }
   // setTitle(labels);
    const divTitle = document.getElementById('divTitle');
    if (divTitle) {
      divTitle.innerHTML = labels;
    }

    return results;
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

  const createObjLine = (data: any, label: string, color: string) => { 
    return {
      type: 'line',
      label: label,
      borderColor: color,
      borderWidth: 2,
      fill: false,
      data: data,
      yAxisID: 'first-y-axis',
    };
  }

  const getBarChartData = (key: string) => {
    if (key === null || key === undefined) {
      console.log('Key is required!!!');
      return null;
    }
    if (data === null || data.length <= 0) {
      return null;
    }
    const items = data[0];
    let item = null;
    items.forEach((o:any) => { 
      if (o.date_mwd === key) {
        item = {
          fromDt: o.from_dt,
          toDt: o.to_dt
        };
      }
    });
    console.log('item', item);
    return item;
  }

  useImperativeHandle(ref, () => ({
    setChart,
    getBarChartData,
    data,
    setLoading,
    setEqpList
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
      //  stacked: true,
        grid: {
          display: false
        },
        display: false,
      },
      'second-y-axis': {
        type: 'linear',
        position: 'left',
        stacked: true,
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
    console.log(chartRef.current.data.labels[res[0]?.index]);
    props.onClick(chartRef.current.data.labels[res[0]?.index])
  }
  

 return (
   <div style={{ height: '100%', width: '100%' }}>
     <Global styles={dataChartStyle} />
      <div ref={divRef} style={{ height: '31vh', width: '100vh', position: 'relative', paddingTop: '10px' }}>
        {null !== dataChart ? <Chart className='bbt-chart-data' style={{ width: '100%', height: '100%' }} ref={chartRef} onClick={onClickChart} options={options} data={dataChart} type="line" /> : '<></>'}
     </div>
     {loading ? <LinearProgress /> : <></>}
     <div id="divTitle" style={{ textAlign: 'center', fontWeight: 'bold' }}></div>
  </div>
 )
});

export default AOIDefectNewListChart;
