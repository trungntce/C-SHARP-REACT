import { dateFormat } from "../../../common/utility";

export const mesDefs = [
    {  
      headerName: "상태", 
      field: 'status', 
      flex: 1.4,
    },
    { 
      headerName: "대수", 
      field: 'cnt', 
      flex: 0.8 
    },
    {  
      headerName: "%", 
      field: 'per', 
      flex: 1,
    }   
];

export const unHealthyDefs = [
    { 
      headerName: "설비명", 
      field: 'EqpCode', 
      flex:1 
    },
    {  
      headerName: "집계유형", 
      field: 'Type', 
      flex:1,
      cellRenderer: (d: any) => {
        if(d.data.Type == "P") {
            return "PC";
        }else {
            return "PLC/HMI";
        }
      }
    },
    {  
      headerName: "미취합 개시시간", 
      field: 'Heartbeat', 
      flex:1,
      valueFormatter: (d: any) => dateFormat(d.data.Heartbeat, "YYYY-MM-DD HH:mm:ss")
    },
    {  
      headerName: "미취합 지속시간(단위: 분)", 
      field: 'duration', 
      flex:1,
    //   valueFormatter: (d: any) => dateFormat(d.data.time, "YYYY-MM-DD HH:mm:ss")
    }
];

export const fail4MDefs = [
  { 
    headerName: "일시", 
    field: 'EqpCode', 
    flex:1 
  },
  { 
    headerName: "공정명", 
    field: 'EqpCode', 
    flex:1 
  },
  { 
    headerName: "설비명", 
    field: 'EqpCode', 
    flex:1 
  },
  { 
    headerName: "설비코드", 
    field: 'EqpCode', 
    flex:1 
  },
  { 
    headerName: "문제내용", 
    field: 'EqpCode', 
    flex:1 
  },
];


export const recogDefs = [
    {  
      headerName: "No", 
      field: 'rowNum', 
      flex:1 
    },
    {  
      headerName: "공정명", 
      field: 'operName', 
      flex:1 
    },
    {  
      headerName: "설비명", 
      field: 'eqpName', 
      flex:1 
    },
    {  
      headerName: "바코드 IP", 
      field: 'barcode', 
      flex:1 
    },
    {  
      headerName: "현상", 
      field: 'effect', 
      flex:1 
    },
];

export const barcodeStatusDefs = [
    {  
      headerName: "공정명", 
      field: 'name', 
      flex:1 
    },
    {  
      headerName: "가동대수", 
      field: 'name', 
      flex:1 
    },
    {  
      headerName: "비가동대수", 
      field: 'name', 
      flex:1 
    },
    {  
      headerName: "가동현황", 
      field: 'value', 
      flex:1 
    }
];