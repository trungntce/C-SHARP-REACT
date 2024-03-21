import { ColDef } from "ag-grid-community";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Popover, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";

export const pieceDefs = () => {
  const { t }  = useTranslation();
  
  return [
    // { 
    //   headerClass: "multi4m", 
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   filter: false,
    //   width: 35
    // },
    {
      headerClass: "",
      field: "operDescription",
      headerName:`PCS ${t("@QR_OPERATION")}`, //"PCS 각인공정",
      maxWidth: 120
    },
    {
      field: "pieceId",
      headerName: `PCS(SHEET)${t("@COL_BARCDOE")}`,//"PCS(SHEET)바코드",
      maxWidth: 210,
      tooltipValueGetter: (d:any) => d.data.pieceId,
    },
    // {
    //   field: "eqpCode",
    //   headerName: "설비코드",
    //   maxWidth: 120
    // },
    {
      field: "eqpName",
      headerName: t("@COL_EQP_NAME"),//"설비명",
      minWidth: 150,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },   
    {
      headerName: `${t("@COL_REGISTRATION")}${t("@COL_DATE")}`,//"등록일시",      
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),
      maxWidth: 90
    },
  ];
}
