import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../../common/utility";

export const columnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@MATCHING_CODE"),//"매칭 코드",
      field: "eqpErrorCode",
      flex: 1,
    },
    {
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      field: "eqpCode",
      flex: 1,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpDesc",
      flex: 1.5,
    },
    {
      headerName: t("@ERROR_CODE"),//"에러코드",
      field: "errorCode",
      flex: 1,
    },
    {
      headerName: t("@ERROR_MSG"),//"에러메세지",
      field: "errorMessage",
      flex: 1.5,
    },
    {
      headerName: t("@REMARKS"),//"비고",
      field: "remark",
      flex: 2,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      flex: 0.7,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    },
  ]
}