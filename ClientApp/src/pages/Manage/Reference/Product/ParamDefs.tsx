import { useTranslation } from "react-i18next";
import {  dateFormat, getLang, getLangAll } from "../../../../common/utility";

export const ColumnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_CATEGORY_NAME"),//"카테고리명",
      field: "cateName",
      width:100,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      width:200,
    },
    {
      headerName: t("@COL_GROUP_CODE"),//"그룹코드",
      field: "groupCode",
      width:200,
    },
    {
      headerName: t("@COL_GROUP_NAME"),//"그룹명",
      field: "groupName",
      width:200,
    },
    {
      headerName: t("@COL_CONDITION_DESCRIPTION"),//"조건설명",
      field: "remark",
      width:200,
    },
    {
      headerName: t("@PARAMETER_ID"),//"파라미터ID",
      field: "paramId",
      width:150,
    },
    {
      headerName: t("@COL_PARAMETER_NAME"),//"파라미터명",
      field: "paramName",
      width:400,
      valueFormatter: (d: any) => getLang(d.data.paramName),
    },
    {
      headerName: t("@COL_UNIT"),//"단위",
      field: "unit",
      width:80,
    },
    {
      headerName: t("@COL_STANDARD_VALUE"),//"표준값",
      field: "std",
      width:80,
    },
    {
      headerName: "lcl",
      field: "lcl",
      width:80,
    },
    {
      headerName: "ucl",
      field: "ucl",
      width:80,
    },
    {
      headerName: "lsl",
      field: "lsl",
      width:80,
    },
    {
      headerName: "usl",
      field: "usl",
      width:80,
    },
    {
      headerName: t("@INTERLOCK_YN"),//"인터락 여부",
      field: "interlockYn",
      width:80,
    },
    {
      headerName: t("@ALARM_YN"),//"알람 여부",
      field: "alarmYn",
      width:80,
    },
    {
      headerName: t("@JUDGE_YN"),//"판정 여부",
      field: "judgeYn",
      width:80,
    },
    {
      headerName:`RawTable${t("@COL_NAME")}`,//"RawTable명",
      field: "roomname",
      width:80,
    },
    {
      headerName: `RawColumn${t("@COL_NAME")}`, //"RawColumn명",
      field: "symbolcomment",
      width:400,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"등록일",
      field: "createDt",
      width:100,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return 0
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD")
      }
    },
  ]
};