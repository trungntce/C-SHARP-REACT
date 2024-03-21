import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, getLang, getLangAll } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@GROUP_ID"), //"그룹ID",
      field: "codegroupId",
      width:100
    },
    {
      headerName: t("@COL_GROUP_NAME"), //"그룹명",
      field: "codegroupName",
       width:250,
    },
    {
      headerName: `${t("@CODE")}ID`, //"코드ID",
      field: "codeId",
      width:150,
    },
    {
      headerName: t("@CODE_NAME"), //"코드명",
      field: "codeName",
      minWidth:400,
      valueFormatter: (d: any) => getLang(d.data.codeName),
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      width:100,
    },
    {
      headerName: t("@SORT"),
      field: "sort",
      filter: "agNumberColumnFilter",
      width:100,
    },
    {
      headerName: t("@REMARK"), //"설명",
      field: "remark",
      width:300,
    },
    {
      headerName: `${t("@COL_INTERNAL")}GROUP`, //"내부GROUP",
      field: "ruleVal",
       width:100,
    },
    {
      headerName: t("@COL_CREATE_USER"), //"생성자",
      field: "createUser",
       width:100,
    },
    {
      headerName: t("@COL_CREATION_TIME"), //"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
       width:200,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}