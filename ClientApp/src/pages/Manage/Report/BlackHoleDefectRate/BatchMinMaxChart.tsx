import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../../common/types";
import { devideFormat } from "../../../../common/utility";
import styles from './BlackHoleDefect.module.scss'

interface Props {
 selectBatch : (th:"minmaxavg"|"defect",d:any) => void;
}

const BatchMinMaxChart = forwardRef(({ selectBatch }: Props, ref: any) => {

 const spinnerRef = useRef<any>();
  const dataRef = useRef<any[]>([]);
  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: `BatchMinMaxAvg`,
      type: "line",
      height: 350,
      events: {
       click : (event:any, chartContext:any, config:any) => {
        selectBatch("minmaxavg",dataRef.current[config.dataPointIndex]);
       }
      }
    },
    xaxis: {
      tooltip: {
        enabled: true,
        formatter: (val:any) => {
          const workorder = dataRef.current[val-1]["workorders"];
          const arrayToString = workorder.split(",").join('<br/>');
          return `
          <div>
            <span>- Batch -</span><br/>
            ${arrayToString}
          </div>
        `
        },
    },
      labels: {
        show: true,
        rotate: -90,
        rotateAlways: true,
        style: {
          fontSize: "10px",
        },
      },
    },
    tootip:{
      enabled: true,
    },
    yaxis : {
     labels:{
      formatter: (val:any,index:any) => val.toFixed(3)
     }
    },
    markers: {
     size: [4, 4, 4, 0, 0],
   },
   stroke: {
     width: [1, 1, 1, 3, 3],
     dashArray: [0, 0, 0, 3, 3],
     //colors: ["#3E8DF3", "#67E09C", "#F3B343", "#EB5564", "#EB5564"],
   },
    title: {
      text: `BLACK HOLE TREND`,
      align: "left",
      margin: 0,
      offsetX: 10,
      offsetY: 0,
      style: {
        fontSize: "15px",
        fontWeight: "600",
      },
    },
    legend: {
      show:true,
    },
    // tooltip:{
    //   enabled: true,
    //   custom : ({ series, seriesIndex, dataPointIndex, w }:any)=>{
    //     const workorder = dataRef.current[dataPointIndex]["workorders"];
    //     const rollId = dataRef.current[dataPointIndex]["roll_id"];
    //     const arrayToString = workorder.split(",").join('<br/>');
    //     return `
    //       <div class=${styles.customTooltip}>
    //         <span>Roll ID : ${rollId}</span><br/>
    //         <span>- Batch -</span>
    //         ${arrayToString}
    //       </div>
    //     `
    //   }
    // }
  });

  const setChart = async (getdata: Dictionary[],title:string) => {
   const sortedData = [...getdata].sort((a:any,b:any)=> new Date(a["create_dt"]).getTime() - new Date(b["create_dt"]).getTime());

    dataRef.current = sortedData;

    options.xaxis.categories = [...sortedData].map((d: any) => d["roll_id"]);
    options.title["text"] = `BLACK HOLE ${title.toUpperCase()} TREND`;

    ApexCharts.exec(`BatchMinMaxAvg`, "updateOptions", { ...options });
    ApexCharts.exec(`BatchMinMaxAvg`, "updateSeries", [
     {
      name: `MIN`,
      data: [...sortedData].map((m: any) => m["mindata"]),
      color: "#3E8DF3",
     },
     {
      name: `MAX`,
      data: [...sortedData].map((m: any) => m["maxdata"]),
      color: "#67E09C",
     },
     {
      name: `AVG`,
      data: [...sortedData].map((m: any) => m["averagedata"]),
      color: "#F3B343",
     },
     {
      name: `USL`,
      data: [...sortedData].map((m: any) => m["usldata"]),
      color: "#EB5564",
     },
     {
      name: `LSL`,
      data: [...sortedData].map((m: any) => m["lsldata"]),
      color: "#EB5564",
     },
    ]);
  };

  useImperativeHandle(ref, () => ({
    setChart,
  }));

  return (

      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />

  );
});

export default BatchMinMaxChart;