import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const errorGroupDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      field: "errorgroupCode",
      headerName: t("@ERROR_TYPE_CODE"),//"에러유형코드",
      flex: 1.2,
    },
    {
      field: "errorgroupName",
      headerName: t("@ERROR_TYPE_NAME"),//"에러유형명",
      flex: 1.8,
    },
    {
      field: "useYn",
      headerName: t("@USEYN"),//"사용여부",
      flex: 0.8,
    },
    {
      field: "errorCount",
      headerName: t("@COL_REGISTRATION_CODE"),//"등록코드",
      filter: "agNumberColumnFilter",
      flex: 0.7,
    },
    {
      field: "maxSort",
      headerName: `${t("@CODE")}MaxSort`,//"코드MaxSort",
      filter: "agNumberColumnFilter",
      flex: 0.01,
    },
    {
      field: "remark",
      headerName: t("@REMARKS"),//"비고",
      flex: 1.5,
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
