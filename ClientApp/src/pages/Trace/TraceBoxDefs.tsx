import { ColDef } from "ag-grid-community";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Popover, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";

export const boxDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      field: "panelId",
      headerName: "TRAY 바코드",
      maxWidth: 150
    },
    {
      field: "panelId",
      headerName: "BOX 바코드",
      maxWidth: 150
    },
    {
      headerName: "포장일시",
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),
      maxWidth: 120
    },
    {
      headerName: "출하일시",
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),
      maxWidth: 120
    },
  ];
}
