import { useTranslation } from "react-i18next";
import {  dateFormat, getLang, getLangAll } from "../../../../common/utility";

export const columnDefs = () => { 
  const { t } = useTranslation();

    return [
    {
      headerName: 'REV',
      field: 'rev',
      width: 100,
    },
    {
      headerName: t("@COL_MODEL_CODE"),
      field: 'modelCode',
      width: 200,
    },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),
      field: 'operationSeqNo',
      width: 200,
    },
    {
      headerName: t("@COL_OPERATION_CODE"),
      field: 'operationCode',
      width: 200,
      },
      {
        headerName: 'Tên công đoạn',
        field: 'operationDesc',
        width: 200,
      },
    {
      headerName: t("@COL_EQP_CODE"),
      field: 'eqpCode',
      width: 200,
      },
      {
        headerName: t("@COL_EQP_NAME"),
        field: 'eqpDesc',
        width: 200,
        },
      {
        headerName: t("@COL_RECIPE_CODE"),
        field: "recipeCode",
        width: 120,
      },
      {
        headerName: t("@COL_RECIPE_NAME"),
        field: "recipeName",
        width: 400,
      },
    {
      headerName: t('@COL_PTYPE'),
      field: "pType",
      width: 120,
      },
      {
        headerName: t('@COL_SV_PV_CODE'),
        field: "svPvCode",
        width: 120,
        },
    {
      headerName: t('@COL_SV_PV_NAME'),
      field: "svPvName",
      width: 120,
    },
    {
        headerName: t('@COL_SV_VALUE'),
        field: "baseVal",
        width: 120,
    },
    {
      headerName: t('@COL_PV_VALUE'),
      field: "std",
      width: 120,
    },
    {
      headerName: t('@COL_PV_LCL'),
      field: "lcl",
      width: 120,
    },
    {
      headerName: t('@COL_PV_UCL'),
      field: "ucl",
      width: 120,
    },
    {
      headerName: t('@COL_PV_LSL'),
      field: "lsl",
      width: 120,
    },
    {
      headerName: t('@COL_PV_USL'),
      field: "usl",
      width: 120,
    },
  ];
}
