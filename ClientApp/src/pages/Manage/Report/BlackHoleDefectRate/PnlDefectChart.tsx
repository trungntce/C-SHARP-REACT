import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../../common/types";
import { devideFormat } from "../../../../common/utility";

interface Props {
 PnlSelect : (d:any) => void;
}

const PnlDefectChart = forwardRef(({ PnlSelect }: Props, ref: any) => {

 const spinnerRef = useRef<any>();
  const dataRef = useRef<any[]>([]);
  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
   chart: {
      id: "pnl_defect",
      type: "bar",
      height: 350,
      events: {
       click : (event:any, chartContext:any, config:any) => {
        PnlSelect(dataRef.current[config.dataPointIndex]);
       }
      }
    },
   dataLabels: {
     enabled: false,
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
    plotOptions: {
     bar: {
       horizontal: false,
       columnWidth: "50%",
       endingShape: "rounded",
     },
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
      tickPlacement: 'on'
    },
    yaxis : {
     labels:{
      formatter: (val:any,index:any) => val.toFixed(3)
     }
    },
    markers: {
      size: 4,
    },
    stroke: {
      width: 1,
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
    tooltip:{
      enabled: true,
      y:{
        formatter : (value:any) => `${value === null ? 0 : value} %`
      }
    },
    noData: {
     text: "Select BATCH",
   }
  });

  const setChart = async (getdata: Dictionary[],title:string,selectded:string) => {
    const sortedData = [...getdata].sort((x:any ,y:any)=>{
      let a = x["panel_id"].toUpperCase();
      let b = y["panel_id"].toUpperCase();

      if(a < b) return -1;
      if(a > b) return 1;

      return 0;
   });

    options.xaxis.categories = [...sortedData].map((d: any) => d["panel_id"]);
    options.title["text"] = `BLACK HOLE ${title.toUpperCase()} PCS 불량률 (%) [${selectded}] `;

    options.plotOptions.bar.columnWidth = [...sortedData].length < 10 ? "30%" : "50%" ;
    dataRef.current = sortedData;

    ApexCharts.exec("pnl_defect", "updateOptions", { ...options });
    ApexCharts.exec("pnl_defect", "updateSeries", [
      {
        name: `DEFECT RATE`,
        data: [...sortedData].map((d: any) => devideFormat(d["defect_cnt"],d["total_pieces"],2,"%")),
      },
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

export default PnlDefectChart;
