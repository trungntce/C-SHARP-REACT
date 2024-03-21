import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@STATUS_MANAGE_CODE"),//"상태관리코드",
      field: "hcCode",
      flex: 1.6,
    },
    {
      headerName: t("@COL_COLLECTION_TYPE"),//"수집유형",
      field: "hcTypeName",
      flex: 1.2,
    },
    {
      headerName: t("@CODE_NAME"),//"코드명",
      field: "hcName",
      flex: 2.4,
    },
    {
      headerName: t("@MANAGE_TAG"),//"관리태그",
      field: "tags",
      minWidth: 180,
      flex: 4,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      flex: 0.8,
    },
    {
      headerName: t("@SORT"),
      field: "sort",
      filter: "agNumberColumnFilter",
      flex: 0.7,
    },
    {
      headerName: t("@REMARK"),//"설명",
      field: "remark",
      minWidth: 280,
      flex: 4,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      flex: 1,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      flex: 1.7,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}