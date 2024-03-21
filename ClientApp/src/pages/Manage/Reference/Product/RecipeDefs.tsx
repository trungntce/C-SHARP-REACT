import { useTranslation } from "react-i18next";
import {  dateFormat, getLang, getLangAll } from "../../../../common/utility";


//MADE BY SIFLEX
export const columnDefs = () =>{
  const { t } = useTranslation();

  return [
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      width:200,
    },
    {
      headerName: t("@COL_GROUP_CODE"),//"그룹코드",
      field: "groupCode",
      width:150,
    },
    {
      headerName: t("@COL_GROUP_NAME"),//"그룹명",
      field: "groupName",
      width:200,
    },
    {
      headerName: t("@COL_CONDITION_DESCRIPTION"),//"조건설명",
      field: "remark",
      width:300,
    },
    {
      headerName: t("@COL_RECIPE_CODE"),//"Recipe코드",
      field: "recipeCode",
      width:120,
    },
    {
      headerName: t("@COL_RECIPE_NAME"),//"Recipe명",
      field: "recipeName",
      width:400,
      valueFormatter: (d: any) => getLang(d.data.recipeName),
    },
    {
      headerName: t("@COL_REFERENCE_VALUE"),//"기준값",
      field: "baseVal",
      width:80,
    },
    {
      headerName: t("@COL_GRADE"),//"등급",
      field: "val1",
      width:80,
    },
    {
      headerName: t("@INTERLOCK_YN"),//"인터락 여부",
      field: "interlockYn",
      width:100,
    },
    {
      headerName: t("@ALARM_YN"),//"알람 여부",
      field: "alarmYn",
      width:100,
    },
    {
      headerName: t("@JUDGE_YN"),//"판정 여부",
      field: "judgeYn",
      width:100,
    },
    {
      headerName: `RawTable ${t("@COL_NAME")}`,//"RawTable명",
      field: "roomname",
      width:300,
    },
    {
      headerName: `RawColumn ${t("@COL_NAME")}`,//"RawColumn명",
      field: "symbolcomment",
      width:300,
    },
    {
      headerName: t("@COL_REGISTRATION_DATE"),//"등록일",
      field: "createDt",
      width:200,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return 0
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD hh:DD")
      }
    },
  ]
}