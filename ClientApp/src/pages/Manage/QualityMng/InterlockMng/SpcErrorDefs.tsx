import { useTranslation } from "react-i18next"
import { dateFormat, getLang, getLangAll } from "../../../../common/utility"

export const columnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_OCCURRENCE_TIME"),      // "발생시간",
      field: "inspectionDate",
      flex: 0.7,
      cellRenderer: (d: any) => {
        return dateFormat(d.data.inspectionDate, "YYYY-MM-DD HH:mm")
      }
    },
    // {
    //   headerName: t("@COL_OPERATION_NAME"),      // "공정명",
    //   field: "operationDescription",
    //   flex: 1.6,
    // },
    {
      headerName: t("@COL_OPERATION_NAME"),      // "공정명",
      field: "tranOperName",
      width:350,
      valueFormatter: (d: any) => getLang(d.data.tranOperName),
    },
    {
      headerName: t("@COL_MODEL_CODE"),      // "모델코드",
      field: "bomItemCode",
      resizable: true,
      flex: 1.6,
    },
    {
      headerName: t("@COL_MODEL_NAME"),      // "모델명",
      field: "bomItemDescription",
      resizable: true,
      flex: 2,
    },
    {
      headerName: `NG ${t("@COL_CATEGORY")}`,      // "NG 항목",
      field: "ngDescription",
      flex: 1,
    },
    {
      headerName: t("@LOWER_LIMIT"),      // "하한",
      field: "innerStandardMin",
      flex: 0.5,
    },
    {
      headerName: t("@UPPER_LIMIT"),      // "상한",
      field: "innerStandardMax",
      flex: 0.5,
    },
    {
      headerName: t("@COL_MEASUREMENT"),      // "측정Data",
      field: "valueNg",
      flex: 0.7,
     
    },
    {
      headerName: "BATCH No",
      field: "jobNo",
      flex: 1.6,
    },
    // {
    //   headerName: "Affect PNL",
    //   field: "affectPnl",
    //   flex: 1,
    // },
    // {
    //   headerName: "기준",
    //   field: "",
    //   flex: 1,
    // },
  ]
  
}