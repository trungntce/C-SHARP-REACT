import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../../common/types";
import { devideFormat } from "../../../../common/utility";
import styles from './BlackHoleDefect.module.scss'


interface Props {
 selectBatch : (th:"minmaxavg"|"defect",d:any) => void;
}

const BatchDefectChart = forwardRef(({ selectBatch }: Props, ref: any) => {

 const spinnerRef = useRef<any>(false);
  const dataRef = useRef<any[]>([]);
  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: `batch_defect`,
      type: "bar",
      height: 350,
      events: {
       click : (event:any, chartContext:any, config:any) => {
        selectBatch("defect",dataRef.current[config.dataPointIndex]);
       }
      },
    },
    plotOptions: {
      bar: {
       horizontal: false,
       columnWidth: "30%",
       borderRadius: 5,
       dataLabels: {
         position: 'top', // Display values on top of each bar
       },
     },
   },
   dataLabels:{
    enabled:true,
    formatter: (val:any) => `${val.toFixed(2)}`
   },
   grid: {
    borderColor: "#999",
    row: {
      colors: ["#ADC4CE", "transparent"],
     opacity: 0.2,
    },
    yaxis: {
     lines: {
      show: true,
     },
    },
    xaxis: {
      lines: {
      show: false,
      },
    },
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
      
      tickPlacement: 'on'
    },
    tooltip:{
      enabled: true,
    },
    yaxis: {
     labels:{
      formatter: (val:any,index:any) => val.toFixed(3)
     }
    },

    title: {
      text: `BLACK HOLE Defect Rate`,
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
      showForSingleSeries: true,
    },
  });

  const setChart = async (getdata: Dictionary[], title:string = "") => {
   const sortedData = [...getdata].sort((a:any,b:any)=> new Date(a["create_dt"]).getTime() - new Date(b["create_dt"]).getTime());

    dataRef.current = sortedData;
    
    options.xaxis.categories = [...sortedData].map((d: any) => d["roll_id"]);
    options.title["text"] = `BLACK HOLE ${title.toUpperCase()} PCS 불량률 (%)`;

    ApexCharts.exec("batch_defect", "updateOptions", { ...options });
    ApexCharts.exec("batch_defect", "updateSeries", [
      {
       name: "DEFECT RATE",
       data: [...sortedData].map((d: any) => devideFormat(d["ng_cnt"],d["total_cnt"],2,"%"))   
      }
    ]);
  };

  useImperativeHandle(ref, () => ({
    setChart,
  }));

  return (

    <div style={{ width: "100%", height: "100%" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>

  );
});

export default BatchDefectChart;

