import { useTranslation } from "react-i18next";
import { getLang, getLangAll } from "../../../../common/utility";

export const columnDefs = () =>{
  const { t } = useTranslation();
  return  [
    {
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      field: "modelCode",
      width:200,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //"모델명",
      field: "modelDescription",
      width:300,
    },
    // {
    //   headerName: "승인여부",
    //   field: "approveYn",
    //   flex: 0.5,
    //   cellRenderer: (e:any) => {
    //     if(e.data.approveYn === "N") {
    //       return "승인요청";
    //     }else if(e.data.approveYn === "Y") {
    //       return "승인완료";
    //     }else if(e.data.approveYn === "R") {
    //       return "반려";
    //     }else if(e.data.approveYn === "D") {
    //       return "재승인요청";
    //     }
    //   }
    // },
    {
      headerName: t("@APPROVAL_STATUS"), //"승인여부",
      field: "codeName",
      width:300,
      valueFormatter: (d: any) => getLang(d.data.codeName),
    },
  ]
}