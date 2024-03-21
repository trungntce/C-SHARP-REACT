import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";

export const panelDefs = (method?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  return [
    { 
      headerClass: "multi4m", 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      width: 35
    },
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      width: 40,
      filter: false,
    },
    {
      headerName: t("@COL_PANEL_BARCODE"), //"판넬바코드",
      field: "panelId",
      width: 210,
      tooltipValueGetter: (d:any) => d.data.panelId,
      cellRenderer: (d: any) => {
        return (
          <>
            { d.data.deviceId == "AUTO_GEN_ID" ? (<span className="badge bg-success cell-re-ini">A</span>) : null }
            { d.data.deviceId == "AUTO_GEN_BY_LOG" ? (<span className="badge bg-primary cell-re-ini">R</span>) : null }
            { d.data.panelId }
          </>
        );
      }
    },
    {
      headerClass: "multi4m",
      field: "pieceList",
      headerName: "PCS",
      filter: false,
      width: 55,
      cellRenderer: (d: any) => {
        if(!d.data.pcsCnt || d.data.pcsCnt <= 0)
          return null;

        return (
          <>
            <a className="detail-cell" onClick={() => {
              method?.pcsSearch?.call(null, d.data);
            }}>
              {d.data.pcsCnt} <i className="fa fa-search"></i>
            </a>
          </>
        );
      }
    },
    {
      headerClass: "item",
      field: "interlockYn",
      headerName: t("@COL_INTERLOCK"), //"인터락",
      filter: false,
      width: 50,
      cellRenderer: (d: any) => {
        if(!d.data.interlockYn || d.data.interlockYn == 'N')
          return null;

        return (
          <>
            <i className="fa fa-check judge-ng"></i>
          </>
        );
      }
    },
    {
      headerName: "BATCH",
      field: "workorderReal",
      width: 170,
      tooltipValueGetter: (d:any) => d.data.workorderReal,
    },
    {
      headerName: t("@COL_SCAN_TIME"), //"스캔시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      width: 110,
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm:ss"),
    }
  ];
}
