import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import {  dateFormat, floatFormat } from "../../../../common/utility";
import { judgeName } from "../../../Trace/TraceDefs";
import { useTranslation } from "react-i18next";

export const ColumnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      field: "workorder",
      headerName: "BATCH",
      width: 210,
      cellRenderer: (d: any) => {
        const spts = d.data.workorderList.split(',');
  
        return (
          <>
              <span>{spts[0]}</span>
              {' '}
              { spts.length > 1 ? (
                <a id={`cup-popover-workorder-${d.data.rowNo}`} className="workorder-cell">
                  <i className="fa fa-search"></i>
                </a>
              ) : null }
              { spts.length > 1 ? (
                <UncontrolledPopover
                  trigger="legacy"
                  target={`cup-popover-workorder-${d.data.rowNo}`}
                  placement="right"
                  className="trace-popover-container"
                >
                  <PopoverHeader>BATCH List</PopoverHeader>
                  <PopoverBody>
                    <Table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>BATCH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spts.map((x: string, i: number) => (
                          <tr key={i}>
                            <th>{x}</th>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </PopoverBody>
                </UncontrolledPopover>
              ) : null }
          </>
        );
      },
    },    
    {
      field: "rollId",
      headerName: "Roll ID",
      width: 100,
      cellRenderer: (d: any) => {
        const spts = d.data.rollList?.split(',');
  
        return (
          <>
              <span>{spts ? spts[0] : null}</span>
              {' '}
              { spts && spts.length > 1 ? (
                <a id={`cup-popover-roll-${d.data.rowNo}`} className="roll-cell">
                  <i className="fa fa-search"></i>
                </a>
              ) : null }
              { spts && spts.length > 1 ? (
                <UncontrolledPopover
                  trigger="legacy"
                  target={`cup-popover-roll-${d.data.rowNo}`}
                  placement="right"
                  className="trace-popover-container"
                >
                  <PopoverHeader>ROLL List</PopoverHeader>
                  <PopoverBody>
                    <Table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>ROLL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spts.map((x: string, i: number) => (
                          <tr key={i}>
                            <th>{x}</th>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </PopoverBody>
                </UncontrolledPopover>
              ) : null }
          </>
        );
      },
    },    
  
    {
      headerName: t("@COL_ITEM_NAME"), //"제품명",
      field: "itemName",
      width: 230,
      tooltipValueGetter: (d:any) => d.data.itemName,
    },
    {
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      field: "modelCode",
      width: 180,
      tooltipValueGetter: (d:any) => d.data.modelCode,
    },
    {
      headerName: t("@COL_EQP_NAME"), //"설비명",
      field: "eqpName",
      width: 220,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },      
    {
      field: "judgeCnt",
      headerName: "OK/CHK/NG",
      width: 90,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <>
            <span className="judge-ok">{d.data.okCnt}</span>
            /
            <span className="judge-chk">{d.data.chkCnt}</span>
            /
            <span className="judge-ng">{d.data.ngCnt}</span>
          </>
        );
      },
    },
    {
      field: "createDt",
      headerName: `4M ${t("@COL_DATE")}`, //"4M일시",
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      field: "startDtCmi",
      headerName: "cmi_start",
      valueFormatter: (d: any) => dateFormat(d.data.startDtCmi, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      field: "endDtCmi",
      headerName: "cmi_end",
      valueFormatter: (d: any) => dateFormat(d.data.endDtCmi, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      field: "eqpMinVal",
      headerName: t("@COL_MIN"), //"최소",
      maxWidth: 80,
    },
    {
      field: "eqpMaxVal",
      headerName: t("@COL_MAX"), //"최대",
      maxWidth: 80,
    },
    {
      field: "eqpAvgVal",
      headerName: t("@COL_AVG"), //"평균",
      valueFormatter: (d: any) => d.data.eqpAvgVal.toFixed(2),
      maxWidth: 80,
    },
  ]
};

export const PanelColumnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: "No",
      field: "panelSeq",
      width: 40,
      filter: false,
    },      
    {
      headerName: t("@COL_PANEL_BARCODE"),   //판넬바코드
      field: "panelId",
      width: 190,
      tooltipValueGetter: (d:any) => d.data.panelId,
      cellRenderer: (d: any) => {
        return (
          <>
            { d.data.deviceId == "AUTO_GEN_ID" ? (<span className="badge bg-success cell-re-ini">A</span>) : null }
            { d.data.deviceId == "AUTO_GEN_BY_LOG" ? (<span className="badge bg-primary cell-re-ini">R</span>) : null }
            {d.data.panelId}
          </>
        );
      }
    },   
    {
      headerName: t("@COL_JUDGMENT"),
      field: "judge",
      width: 55,
      cellRenderer: (d: any) => {
        
  
        return (
          <>
            {judgeName(d.data.judge)}
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
      field: "d001Std",
      headerName: "STD",
      cellClass: "font-size-13",
      width: 40,
      filter: false,
    },  
    {
      field: "lclucl",
      headerName: "LCL~UCL",
      cellClass: "font-size-13",
      width: 70,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <>
            {d.data.d001Lcl}~{d.data.d001Ucl}
          </>
        );
      },
    },
    {
      field: "lslusl",
      headerName: "LSL~USL",
      cellClass: "font-size-13",
      width: 70,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <>
            {d.data.d001Lsl}~{d.data.d001Usl}
          </>
        );
      },
    },  
    {
      field: "d001Std",
      headerName: "Data1",
      cellClass: "font-size-13",
      width: 55,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <span
            className={d.data.d001Judge == "O" ? "" : d.data.d001Judge == "C"?  "judge-chk" : "judge-ng"}
            >
            {floatFormat(d.data.d001Min, 1)}
          </span> 
        );
      },
    },
    {
      field: "d002Std",
      headerName: "Data2",
      cellClass: "font-size-13",
      width: 55,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <span
            className={d.data.d002Judge == "O" ? "" : d.data.d002Judge == "C"?  "judge-chk" : "judge-ng"}
            >
            {floatFormat(d.data.d002Min, 1)}
          </span>
        );
      },
    },
    {
      field: "d003Std",
      headerName: "Data3",
      cellClass: "font-size-13",
      width: 55,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <span
            className={d.data.d003Judge == "O" ? "" : d.data.d003Judge == "C"?  "judge-chk" : "judge-ng"}
            >
            {floatFormat(d.data.d003Min, 1)}
          </span>
        );
      },
    },
    {
      field: "d004Std",
      headerName: "Data4",
      cellClass: "font-size-13",
      width: 55,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <span
            className={d.data.d004Judge == "O" ? "" : d.data.d004Judge == "C"?  "judge-chk" : "judge-ng"}
            >
            {floatFormat(d.data.d004Min, 1)}
          </span>
        );
      },
    },
    {
      field: "d005Std",
      headerName: "Data5",
      cellClass: "font-size-13",
      width: 55,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <span
            className={d.data.d005Judge == "O" ? "" : d.data.d005Judge == "C"?  "judge-chk" : "judge-ng"}
            >
            {floatFormat(d.data.d005Min, 1)}
          </span>
        );
      },
    },
    {
      field: "d006Std",
      headerName: "Data6",
      cellClass: "font-size-13",
      width: 55,
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <span
            className={d.data.d006Judge == "O" ? "" : d.data.d006Judge == "C"?  "judge-chk" : "judge-ng"}
            >
            {floatFormat(d.data.d006Min, 1)}
          </span>
        );
      },
    },
    {
      field: "rawDt",
      headerName: `${t("@COL_EQUIPMENT")}${t("@COL_MEASUREMENT_DATE")}`, //설비측정일시
      valueFormatter: (d: any) => dateFormat(d.data.rawDt, "MM-DD HH:mm:ss"),
      maxWidth: 110,
    },
    {
      headerName: `PNL${t("@COL_SCAN_TIME")}`,  //PNL 스캔시간
      field: "panelCreateDt",
      filter: "agDateColumnFilter",
      width: 110,
      valueFormatter: (d: any) => dateFormat(d.data.panelCreateDt, "MM-DD HH:mm:ss"),
    }
  
  ]
};