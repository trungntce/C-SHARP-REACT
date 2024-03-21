import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, getLang, getLangAll } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@ERROR_TYPE_CODE"),//"에러유형코드",
      field: "errorgroupCode",
      flex: 0.01,
    },
    {
      headerName: t("@ERROR_TYPE_NAME"),//"에러유형명",
      field: "errorgroupName",
      flex: 0.01,
    },
    {
      headerName: t("@ERROR_CODE"),//"에러코드",
      field: "errorCode",
      flex: 1.6,
    },
    {
      headerName: t("@ERROR_MSG"),//"에러메세지",
      field: "errorMessage",
      flex: 2.4,
      valueFormatter: (d: any) => getLang(d.data.errorMessage)
    },
    {
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      field: "eqpCode",
      flex: 2,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpDesc",
      flex: 2.5,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      flex: 1.2,
    },
    {
      headerName: t("@SORT"),
      field: "sort",
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      flex: 1.2,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      flex: 1.7,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}