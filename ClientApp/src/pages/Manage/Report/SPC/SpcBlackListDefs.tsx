import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import {  dateFormat, floatFormat } from "../../../../common/utility";
import moment from "moment";
import { useTranslation } from "react-i18next";

export const ColumnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_OPERATION_NAME"),  //"공정코드",
      field: "operName",
      width: 150,
      pinned: 'left',
      tooltipValueGetter: (d:any) => `[${d.data.operCode}] ${d.data.operName}`,
    },
    {
      headerName: t("@INSPECTION_NAME"),  //"검사명",
      field: "inspectionDesc",
      width: 220,
      pinned: 'left',
      // tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },    
    {
      headerName: t("@COL_EQP_NAME"),  //"설비명",
      field: "eqpName",
      width: 220,
      pinned: 'left',
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },     
    {
      headerName: t("@COL_ITEM_NAME"),  //"제품명",
      field: "itemName",
      width: 230,
      pinned: 'left',
      tooltipValueGetter: (d:any) => `[${d.data.itemName}] ${d.data.itemCode}`,
    },
    {
      headerName: "RULE_1_X",
      field: "judgeRule1X",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_1_R",
      field: "judgeRule1R",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_2",
      field: "judgeRule2",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_3",
      field: "judgeRule3",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_4",
      field: "judgeRule4",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_5",
      field: "judgeRule5",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_6",
      field: "judgeRule6",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_7",
      field: "judgeRule7",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_8",
      field: "judgeRule8",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@REMARKS"),
      field: "remark",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      field: "createUser",
      headerName: 'CREATE_USER',  //"검사일",
      maxWidth: 125,
    },
    {
      field: "createDt",
      headerName: 'CREATE_TIME',  //"검사일",
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm:ss"),
      minWidth: 125,
    },
    {
      field: "updateUser",
      headerName: 'UPDATE_USER',  //"검사일",
      maxWidth: 125,
    },
    {
      field: "updateDt",
      headerName: 'UPDATE_TIME',  //"검사일",
      valueFormatter: (d: any) => dateFormat(d.data.updateDt, "YYYY-MM-DD HH:mm:ss"),
      minWidth: 125,
    },
    {
      field: "rowNo",
      headerName: 'rowNo',  //"검사일",
      maxWidth: 125,
      hide:true
    },
  ]
};
