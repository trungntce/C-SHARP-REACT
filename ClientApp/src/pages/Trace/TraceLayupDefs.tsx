import { ColDef } from "ag-grid-community";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Popover, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";

export const layupDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      field: "operDescription",
      headerName: t("@LAYUP_OPERATION"), //"적층공정",
      minWidth: 150
    },
    {
      field: "panelId",
      headerName: t("@COL_PANEL_BARCODE"), //"판넬바코드",
      minWidth: 150
    },
    {
      field: "layerIndex",
      headerName: t("@LAYUP_SEQ"), //"적층순번",
      minWidth: 80
    },
    {
      field: "mainYn",
      headerName: `${t("@MAIN_FLOOR")}YN`, //"메인층YN",
      minWidth: 90
    },
    {
      headerName: t("@LAYUP_DATE"), //"적층일시",      
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),
      minWidth: 90
    },
    // {
    //   field: "eqpCode",
    //   headerName: "설비코드",
    //   maxWidth: 120
    // },
    {
      field: t("@COL_EQP_NAME"), //"eqpName",
      headerName: "설비명",
      minWidth: 150
    },    
  ];
}
