import { forwardRef, useImperativeHandle, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../common/types";

const bbtNg = ["4W", "short", "both", "open", "aux", "c", "er", "spk"];
const bbtNgName = [{"4W": "4W"}, {"short": "SHORT"}, {"both": "BOTH"}, {"open": "OPEN"}, {"aux": "AUX"}
, {"c": "C"}, {"er": "ER"}, {"spk": "SPK"}];

const BBTDefectListChart = forwardRef((props:any, ref:any) =>{

 const [series, setSeries] = useState<any>([]);
 const [options, setOptions] = useState<any>({
  chart: {
   id: `batch_defect${props.id}`,
   stacked: true,
   stackType: "normal",
   type: "bar",
   height: 300,
  },
  dataLabels: {
   enabled: false,
  },
  plotOptions: {
   bar: {
    horizontal: false,
    dataLabels: {
      enabled: true,
      position: "top",
      style: {
        colors: ['#333'],
      },
    },
    columnWidth: "30%",
    endingShape: "rounded",
  },
 },
  xaxis: {
   tooltip: {
    enabled: false,
   },
   labels: {
    show: true,
    rotateAlways: true,
    style: {
     fontSize: "13px",
    },
   },
   tickPlacement: 'on'
  },
  yaxis : {
    labels:{
      formatter : (value:any) => `${value}%`
    }
  },
  markers: {
   size: 4,
  },
  stroke: {
   width: 2,
  },
  title: {
   text: `BBT 불량 ${props.title}`,
   align: "left",
   margin: 0,
   offsetX: 5,
   offsetY: 0,
   style: {
    fontSize: "15px",
    fontWeight: "600",
   },
  },
  legend: {
    // show: false,
    showForNullSeries: false,
    showForZeroSeries: false
  },
  tooltip:{
    enabled: true,
    y:{
      formatter : (value:any) => `${value === null ? 0 : value} %`
    }
  }
 });
 
 const setChart = async (data: Dictionary[], titleText:string = "") => {
  const sortedData = [...data].sort();
  console.log(sortedData);

  const totalNg = [...sortedData].map((m:any)=>m["totalNg"].toFixed(2)); 

  // options.xaxis.categories = categories;
  
  const Seriees =  bbtNg.map((ng:any) => {
    const result = bbtNgName.find((name: any) => ng.includes(Object.keys(name)));

    return {  
      name: result ? Object.values(result): null ,
      data: [...sortedData].map((m:Dictionary) => m[ng] != 0 ? m[ng].toFixed(2) : null),
      type: "column"
    }

  });


  options.xaxis.categories = [...sortedData].map((d: any) => d["dateMwd"]);
  // options.title["text"] = `제품 코드 : ${titleText}`;

  ApexCharts.exec(`batch_defect${props.id}`, "updateOptions", { ...options });
  ApexCharts.exec(`batch_defect${props.id}`, "updateSeries", [...Seriees, {name: "전체 불량률", data: totalNg, type: "line"}]);

 };

 useImperativeHandle(ref, () => ({
   setChart,
 }));

 return (
  <ReactApexChart
   options={options}
   series={series}
   type="line"
   height="95%"
  />
 )
});

export default BBTDefectListChart