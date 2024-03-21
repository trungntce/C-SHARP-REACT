import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const ColumnDefs = () => {
  const { t } = useTranslation();
  return [

    // {
    //   headerName: t("@LARGE_CATEGORY"), 
    //   field: "className" ,
    //   width: 150,
    //   tooltipValueGetter: (d:any) => `[${d.data.classCode}] ${d.data.className}`,
    // },
  {
      headerName: t("@COL_OPERATION_CODE"),  //"공정코드",
      field: "operCode",
      width: 150,
      tooltipValueGetter: (d:any) => `[${d.data.operCode}] ${d.data.operName}`,
    },
    {
      headerName: t("@COL_OPERATION_NAME"),  //"공정코드",
      field: "operName",
      width: 150,
    },
    {
      headerName: t('@MATERIAL'),   //자재
      field: "materialYn",
      width: 80,
    },    
    {
      headerName: 'TOOL',   
      field: "toolYn",
      width: 80,
    },  
    {
      headerName: t("@WORKER"),   //작업자
      field: "workerYn",
      width: 80,
    }, 
   
    {
      headerName: t("@SAMPLING_INSPECTION"),  //샘플링 검사
      field: "samplingYn",
      width: 80,
    },
    {
      headerName: t("@TOTAL_INSPECTION"),
      field: "totalInspYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "SPC",
      field: "spcYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "Q-TIME",
      field: "qtimeYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@CHEM"),
      field: "chemYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "SV",
      field: "recipeYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "PV",
      field: "paramYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "PANEL",
      field: "panelYn",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@REMARKS"),
      field: "remark",
      width: 180,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      field: "rowNo",
      headerName: 'rowNo',  //"검사일",
      maxWidth: 125,
      hide:true
    },
    {
      field: "createUser",
      headerName: 'CREATE_USER',  //"검사일",
      minWidth: 125,
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
      minWidth: 125,
    },
    {
      field: "updateDt",
      headerName: 'UPDATE_TIME',  //"검사일",
      valueFormatter: (d: any) => dateFormat(d.data.updateDt, "YYYY-MM-DD HH:mm:ss"),
      minWidth: 125,
    },

  ]
};
