import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../../common/utility";

export const eqpAreaGroupDefs = () => {
  const { t } = useTranslation();
  return [
    {
      field: "eqpCode",
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      flex: 1.5,
    },
    {
      field: "eqpName",
      headerName: t("@COL_EQP_NAME"),//"설비명",
      flex: 2.5,
    },
    {
      field: "recipeCode",
      headerName: "Recipe 대분류코드",//"Recipe 대분류코드",
      flex: 1.5,
    },
    {
      field: "recipeName",
      headerName: "Recipe 대분류명",//"Recipe 대분류명",
      flex: 1.5,
    },
    {
      field: "eqpareagroupName",
      headerName: t("@LARGE_CATEGORY_NAME"),//"대분류",
      flex: 2.5,
    },
    {
      field: "useYn",
      headerName: t("@USEYN"),//"사용여부",
      flex: 0.8,
    },
    {
      field: "eqpCount",
      headerName: t("@REGISTER_MID_CLASSIFICATION"),//"등록중분류",
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      field: "maxSort",
      headerName: `${t("@MIDDLE_CATEGORY")} MaxSort`,//"중분류 MaxSort",
      filter: "agNumberColumnFilter",
      flex: 0.01,
    },
    {
      field: "remark",
      headerName: t("@REMARKS"),//"비고",
      flex: 3.5,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      flex: 0.7,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    }
  ];
}