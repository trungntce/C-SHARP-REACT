import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../common/utility";

export const columnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      field: "createDt",
      headerName: t("@COL_DATE_TYPE2"),//"일자",
      headerClass: "no-leftborder",
      maxWidth: 100,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return 0
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD")
      }
    },
    {
      field: "workorder",
      headerName: "BATCH NO.",//"작업지시번호",
      maxWidth: 160,
    },
    {
      field: "modelDescription",
      headerName: t("@COL_MODEL_NAME"),//"모델명",
      maxWidth: 200,
    },
    {
      field: "eqpCode",
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      maxWidth: 140,
    },
    {
      field: "panelId",
      headerName: `PNL ${t("@COL_BARCDOE")}`,//"PNL 바코드",
      maxWidth: 190,
    },
    // {
    //   field: "pnlno",
    //   headerName: "PNL",
    //   maxWidth: 70,
    //   type: 'rightAligned',
    // },
    // {
    //   field: "piece",
    //   headerName: "PCS",
    //   maxWidth: 70,
    //   type: 'rightAligned',
    // },
    {
      field: "ngName",
      headerName: t("@COL_DEFECT_NAME"),//"불량명",
      maxWidth: 130,
      cellStyle: (params:any) => {
        if(params.data["ngcode"] == "0") {
          return { backgroundColor: "#FFBF00" }
        }
        if(params.data["ngcode"] == "25") {
          return { backgroundColor:"#A5DF00" } 
        }
        if(params.data["ngcode"] == "1") {
          return { backgroundColor:"#04B486" }
        }
        if(params.data["ngcode"] == "2") {
          return { backgroundColor:"#045FB4" }
        }
        if(params.data["ngcode"] == "9") {
          return { backgroundColor:"#5F04B4" }
        }
        if(params.data["ngcode"] == "19") {
          return { backgroundColor:"#8A0886" }
        }
        if(params.data["ngcode"] == "4") {
          return { backgroundColor:"#FE2EC8" }
        }else{
          return { backgroundColor:"red" }
        }
      }
    },
    {
      field: "xlocationCm",
      headerName: `x${t("@LOCATION")}`,//"x좌표",
      maxWidth: 100,
      type: "rightAligned"
    },
    {
      field: "ylocationCm",
      headerName: `y${t("@LOCATION")}`,//"y좌표",
      maxWidth: 100,
      type: "rightAligned"
    },
  ]
}