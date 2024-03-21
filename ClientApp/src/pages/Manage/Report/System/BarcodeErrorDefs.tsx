import { useTranslation } from "react-i18next"
import { dateFormat } from "../../../../common/utility"

export const columnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: "BATCH",
      field: "workorder",
      flex: 1.6,
    },
    {
      headerName: t("@COL_MODEL_CODE"),//"모델코드",
      field: "modelCode",
      flex: 1.3,
    },
    {
      headerName: t("@COL_MODEL_NAME"),//"모델명",
      field: "modelDescription",
      flex: 1.6,
    },
    {
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      field: "eqpCode",
      flex: 1,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      flex: 1.7,
    },  
    {
      headerName: t("@UNRECOGNIZED_TIME"),//"미인식 시간",
      field: "createDt",
      flex: 1,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return 0
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD hh:DD")
      }
    },  
  
  ]
}