import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, getLang, getLangAll } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@COL_DEFECT_TYPE_CODE"), //headerName: "불량유형코드",
      field: "defectgroupCode",
      width : 150,
    },
    {
      headerName: t("@COL_DEFECT_TYPE_NAME"), //headerName: "불량유형명",
      field: "defectgroupName",
      width : 100,
    },
    {
      headerName: t("@COL_DEFECT_CODE"), //headerName: "불량코드",
      field: "defectCode",
      width : 150,
    },
    {
      headerName: t("@COL_DEFECT_NAME"), //headerName: "불량명",
      field: "defectName",
      width : 300,
      valueFormatter: (d: any) => getLang(d.data.defectName)
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      width : 100,
    },
    {
      headerName: t("@SORT"),
      field: "sort",
      filter: "agNumberColumnFilter",
      width : 100,
    },
    {
      headerName: t("@COL_CREATE_USER"), //headerName: "생성자",
      field: "createUser",
      width : 100,
    },
    {
      headerName: t("@COL_CREATION_TIME"), //headerName: "생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      width : 100,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}