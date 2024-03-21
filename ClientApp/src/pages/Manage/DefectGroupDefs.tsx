import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat, getLang, getLangAll } from "../../common/utility";

export const defectGroupDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      field: "defectgroupCode",
      headerName: t("@COL_DEFECT_TYPE_CODE"), //불량유형코드
      width:150,
    },
    {
      field: "defectgroupName",
      headerName: t("@COL_DEFECT_TYPE_NAME"), //headerName: "불량유형명",
      width:300,
      valueFormatter: (d: any) => getLang(d.data.defectgroupName)
    },
    {
      field: "useYn",
      headerName: t("@USEYN"), //headerName: "사용여부",
      width:100,
    },
    {
      field: "defectCount",
      headerName: t("@COL_REGISTRATION_CODE"), //headerName: "등록코드",
      filter: "agNumberColumnFilter",
      width:100,
    },
    {
      field: "maxSort",
      headerName: "코드MaxSort",
      filter: "agNumberColumnFilter",
      width:100,
    },
    {
      field: "remark",
      headerName: t("@REMARKS"), //headerName: "비고",
      width:100,
    },
    {
      headerName: t("@COL_CREATE_USER"), //headerName: "생성자",
      field: "createUser",
      width:100,
    },
    {
      headerName: t("@COL_CREATION_TIME"), //headerName: "생성날짜",
      field: "createDt",
      filter: "agDateColumnFilter",
      width:100,
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    }
  ];
}
