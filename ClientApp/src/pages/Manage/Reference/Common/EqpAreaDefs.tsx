import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../../common/utility";

export const columnDefs = () => {
  const { t }  = useTranslation();
  return [
    {
      headerName: t("@LARGE_CATEGORY"),//"대분류",
      field: "eqpareagroupName",
      flex: 0.01,
    },
    {
      headerName: t("@MIDDLE_CATEGORY_NAME"),//"중분류명",
      field: "eqpareaName",
      flex: 2.4,
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
      headerName: t("@REMARK"),//"설명",
      field: "remark",
      minWidth: 170,
      flex: 3,
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
      flex: 2,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}