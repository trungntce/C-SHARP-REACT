import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import {  dateFormat, floatFormat } from "../../../../common/utility";
import moment from "moment";
import { useTranslation } from "react-i18next";

export const ColumnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@TYPE"),//"타입",
      field: "typeDesc",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    },
    // {
    //   field: "workorder",
    //   headerName: "BATCH",
    //   width: 170,
    //   cellRenderer: (d: any) => {
    //     // const spts = d.data.workorderList.split(',');
  
    //     return (
    //       <>
    //           <span>{d.data.workorder}</span>
    //           {/* {' '}
    //           { spts.length > 1 ? (
    //             <a id={`cup-popover-workorder-${d.data.rowNo}`} className="workorder-cell">
    //               <i className="fa fa-search"></i>
    //             </a>
    //           ) : null }
    //           { spts.length > 1 ? (
    //             <UncontrolledPopover
    //               trigger="legacy"
    //               target={`cup-popover-workorder-${d.data.rowNo}`}
    //               placement="right"
    //               className="trace-popover-container"
    //             >
    //               <PopoverHeader>BATCH List</PopoverHeader>
    //               <PopoverBody>
    //                 <Table className="table table-bordered">
    //                   <thead className="table-light">
    //                     <tr>
    //                       <th>BATCH</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {spts.map((x: string, i: number) => (
    //                       <tr key={i}>
    //                         <th>{x}</th>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </Table>
    //               </PopoverBody>
    //             </UncontrolledPopover>
    //           ) : null } */}
    //       </>
    //     );
    //   },
    // },  
    // {
    //   headerName: "공정순서",
    //   field: "operSeqNo",
    //   width:  90,
    //   // tooltipValueGetter: (d:any) => d.data.itemName,
    // },
    {
      field: "measureDt",
      headerName: t("@INSPECTION_DATE"),//"검사일시",
      valueFormatter: (d: any) => dateFormat(d.data.measureDt, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      headerName: t("@NUMBER_DIMENSIONS"),//"차수",
      field: "adjSeq",
      width: 60,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      width: 220,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },     
    {
      headerName: t("@MANAGEMENT_ITEM"),//"관리항목",
      field: "factorDesc",
      width: 150,
    },
    {
      headerName: t("@CHEM"),//"약품",
      field: "chemName",
      width: 150,
    },
    {
      headerName: t("@COL_JUDGMENT"),//"판정",
      field: "statusFlag",
      width: 90,
    },
  
    {
      headerName: t("@MEASURED_VALUE"),//"측정값",
      field: "value",
      width: 80,
      valueFormatter: (d: any) => floatFormat(d.data.value, 2)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "lsl",
      field: "lsl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.lsl, 2)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "usl",
      field: "usl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.usl, 2)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "lcl",
      field: "lcl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.lcl, 2)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "ucl",
      field: "ucl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.ucl, 2)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    // {
    //   field: "judgeCnt",
    //   headerName: "판넬(OK/NG)",
    //   width: 90,
    //   filter: false,
    //   cellRenderer: (d: any) => {
    //     return (
    //       <>
    //         <span className="judge-ok">{d.data.okCnt}</span>
    //         /
    //         <span className="judge-ng">{d.data.ngCnt}</span>
    //       </>
    //     );
    //   },
    // },
  
  ];
}

export const DetailColumnDefs = [
  {
    headerName: "타입",
    field: "typeDesc",
    width: 110,
    filter: false,
  },      
  {
    headerName: "판정",
    field: "judge",
    width: 55,
    cellRenderer: (d: any) => {
      console.log(d)
      return (
        <>
          <span
            className={
              d.data.statusFlag == "O" || d.data.statusFlag == "OK"
                ? "judge-ok"
                :
              d.data.statusFlag == "C"  || d.data.statusFlag == "CHK"  
                ?"judge-chk"
                : "judge-ng"
            }
          >
            {d.data.statusFlag == "O" || d.data.statusFlag == "OK" ? "OK" : 
              d.data.statusFlag == "C"  || d.data.statusFlag == "CHK"  ? 'CHK' 
              : "NG"}
          </span>
        </>
      );
    }
  },   
  // {
  //   field: "judgeCnt",
  //   headerName: "PV(OK/NG)",
  //   width: 80,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <>
  //         <span className="judge-ok">{d.data.okCnt}</span>
  //         /
  //         <span className="judge-ng">{d.data.ngCnt}</span>
  //       </>
  //     );
  //   },
  // },
  {
    field: "lclucl",
    headerName: "LCL~UCL",
    cellClass: "font-size-13",
    width: 100,
    filter: false,
    cellRenderer: (d: any) => {
      return (
        <>
          {d.data.lcl}~{d.data.ucl}
        </>
      );
    },
  },  
  {
    field: "lslusl",
    headerName: "LSL~USL",
    cellClass: "font-size-13",
    width: 100,
    filter: false,
    cellRenderer: (d: any) => {
      return (
        <>
          {d.data.lsl}~{d.data.usl}
        </>
      );
    },
  },  
  {
    field: "valueMin",
    headerName: "최소값",
    cellClass: "font-size-13",
    width: 70,
    filter: false,
    cellRenderer: (d: any) => {
      return (
        <>
          {d.data.valueMin}
        </>
      );
    },
  },  
  {
    field: "valueMax",
    headerName: "최대값",
    cellClass: "font-size-13",
    width: 70,
    filter: false,
    cellRenderer: (d: any) => {
      return (
        <>
          {d.data.valueMin}
        </>
      );
    },
  },  
  {
    field: "inspectionDate",
    headerName: "검사일시",
    cellClass: "font-size-13",
    width: 150,
    filter: false,
    valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm:ss"),

  },  
  // {
  //   field: "d001Std",
  //   headerName: "Data1",
  //   cellClass: "font-size-13",
  //   width: 55,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <span
  //         className={d.data.d001Judge == "O" ? "" : d.data.d001Judge == "C"?  "judge-chk" : "judge-ng"}
  //         >
  //         {floatFormat(d.data.d001Min, 1)}
  //       </span> 
  //     );
  //   },
  // },
  // {
  //   field: "d002Std",
  //   headerName: "Data2",
  //   cellClass: "font-size-13",
  //   width: 55,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <span
  //         className={d.data.d002Judge == "O" ? "" : d.data.d002Judge == "C"?  "judge-chk" : "judge-ng"}
  //         >
  //         {floatFormat(d.data.d002Min, 1)}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   field: "d003Std",
  //   headerName: "Data3",
  //   cellClass: "font-size-13",
  //   width: 55,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <span
  //         className={d.data.d003Judge == "O" ? "" : d.data.d003Judge == "C"?  "judge-chk" : "judge-ng"}
  //         >
  //         {floatFormat(d.data.d003Min, 1)}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   field: "d004Std",
  //   headerName: "Data4",
  //   cellClass: "font-size-13",
  //   width: 55,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <span
  //         className={d.data.d004Judge == "O" ? "" : d.data.d004Judge == "C"?  "judge-chk" : "judge-ng"}
  //         >
  //         {floatFormat(d.data.d004Min, 1)}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   field: "d005Std",
  //   headerName: "Data5",
  //   cellClass: "font-size-13",
  //   width: 55,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <span
  //         className={d.data.d005Judge == "O" ? "" : d.data.d005Judge == "C"?  "judge-chk" : "judge-ng"}
  //         >
  //         {floatFormat(d.data.d005Min, 1)}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   field: "d006Std",
  //   headerName: "Data6",
  //   cellClass: "font-size-13",
  //   width: 55,
  //   filter: false,
  //   cellRenderer: (d: any) => {
  //     return (
  //       <span
  //         className={d.data.d006Judge == "O" ? "" : d.data.d006Judge == "C"?  "judge-chk" : "judge-ng"}
  //         >
  //         {floatFormat(d.data.d006Min, 1)}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   field: "rawDt",
  //   headerName: "측정일시",
  //   valueFormatter: (d: any) => dateFormat(d.data.rawDt, "MM-DD HH:mm:ss"),
  //   maxWidth: 125,
  // }  
];