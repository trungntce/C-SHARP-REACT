import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const codeGroupDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      field: "codegroupId",
      headerName: t("@CODE_GROUP"), //"코드그룹",
      width:200,
    },
    {
      field: "codegroupName",
      headerName: t("@CODE_GROUP_NAEM"), //"코드그룹명",
      width:400,
    },
    {
      field: "useYn",
      headerName: t("@USEYN"), //사용여부
      width:80,
    },
    {
      field: "codeCount",
      headerName: t("@COL_REGISTRATION_CODE"), //"등록코드",
      filter: "agNumberColumnFilter",
      width:100,
    },
    {
      field: "maxSort",
      headerName: "MaxSort",
      filter: "agNumberColumnFilter",
      width:120,
    },
    {
      field: "remark",
      headerName: t("@REMARKS"), //"비고",
      width:300,
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
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    }
  ]
} ;
