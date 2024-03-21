import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const pieceSearchDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "고객사",
      field: "vendorShortName",
      flex: 1
    },
    {
      headerName: "모델코드",
      field: "modelCode",
      flex: 1.2
    },
    {
      headerName: "모델명",
      field: "modelDescription",
      flex: 1.5
    },
    {
      headerName: "LOT",
      field: "workorder",
      flex: 1.5
    },
    // {
    //   field: "operDescription",
    //   headerName: "재단공정",
    //   flex: 1.2
    // },
    {
      cellClass: "panel-cell",
      field: "panelId",
      headerName: "판넬바코드",
      flex: 1.2
    },
    {
      cellClass: "piece-cell",
      field: "pieceId",
      headerName: "PCS(SHEET)바코드",
      flex: 1.2
    },
    // {
    //   headerName: "재단일시",      
    //   valueFormatter: (d: any) => dateFormat(d.data.scanDt),
    //   flex: 0.8
    // },
  ];
}
