import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../../common/types";
import { devideFormat } from "../../../../common/utility";
import style from './BlackHoleDefect.module.scss'

interface Props {
  title: string;
  color: string;
}

const PnlMinMaxChart = forwardRef(({ title, color }: Props, ref: any) => {

 const spinnerRef = useRef<any>();
  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "pnl_minmaxavg",
      type: "line",
      height: 350,
    },
    xaxis: {
      tooltip: {
        enabled: false,
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
    noData: {
     text: "Select BATCH",
   }
  });

  const setChart = async (getdata: Dictionary[], title:string, selectded:string) => {
   const sortedData = [...getdata].sort((x:any ,y:any)=>{
      let a = x["panel_id"].toUpperCase();
      let b = y["panel_id"].toUpperCase();

      if(a < b) return -1;
      if(a > b) return 1;

      return 0;
   });


    options.xaxis.categories = [...sortedData].map((d: any) => d["panel_id"]);
    options.title["text"] = `BLACK HOLE ${title.toUpperCase()} TREND [${selectded}] `;

    ApexCharts.exec("pnl_minmaxavg", "updateOptions", { ...options });
    ApexCharts.exec("pnl_minmaxavg", "updateSeries", [
     {
      name: `MIN`,
      data: [...sortedData].map((m: any) => m["min_data"]),
      color: "#3E8DF3",
    },
    {
      name: `MAX`,
      data: [...sortedData].map((m: any) => m["max_data"]),
      color: "#67E09C",
    },
    {
      name: `AVG`,
      data: [...sortedData].map((m: any) => m["avg_data"]),
      color: "#F3B343",
    },
    {
      name: `USL`,
      data: [...sortedData].map((m: any) => m["usl_data"]),
      color: "#EB5564",
    },
    {
      name: `LSL`,
      data: [...sortedData].map((m: any) => m["lsl_data"]),
      color: "#EB5564",
    },
    ]);
  };

  useImperativeHandle(ref, () => ({
    setChart,
  }));

  useEffect(() => {
  }, []);

  return (
   <>
    <div ref={spinnerRef} className={style.chartSpinner}>
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    <div style={{ width: "100%", height: "100%" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
   </>
  );
});

export default PnlMinMaxChart;
