import { ColDef } from "ag-grid-community";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Popover, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";

export const rollDefs = (props: any) => {
  const { t }  = useTranslation();
  
  return [
    // {
    //   field: "operDescription",
    //   headerName: "ROLL 분할공정",
    //   maxWidth: 120
    // },
    {
      field: "parentId",
      headerName: `Parent ${t("@COL_BARCDOE")}`,//"Parent 바코드",
      maxWidth: 150
    },
    {
      field: "childId",
      headerName: `Child ${t("@COL_BARCDOE")}`,//"Child 바코드",
      maxWidth: 150
    },
    // {
    //   field: "panelCnt",
    //   headerName: "판넬수량",
    //   // cellRenderer: (d: any) => {
    //   //   return (
    //   //     <a onClick={() => {
    //   //       if(props.searchPanelByRoll)
    //   //         props.searchPanelByRoll.call(null, d.data.parentId, d.data.childId);
    //   //     }}>
    //   //       <span className="underline">
    //   //         {`${d.data.panelCnt}`}
    //   //       </span>
    //   //       {' '}
    //   //       <i className="fa fa-search"></i>
    //   //     </a>
    //   //   );
    //   // },
    //   maxWidth: 80
    // },
    {
      headerName: t("@COL_DIVISION_WHEN"),//"분할시기",      
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),
      maxWidth: 90
    },
    // {
    //   field: "eqpCode",
    //   headerName: "설비코드",
    //   maxWidth: 120
    // },
    {
      field: "eqpName",
      headerName: t("@COL_EQP_NAME"),//"설비명",
      minWidth: 150
    }, 
  ];
}
