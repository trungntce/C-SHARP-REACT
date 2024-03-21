import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@GROUP_ID"),                       //"그룹ID",
      field: "usergroupId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.8,
    },
    {
      headerName: t("@COL_GROUP_NAME"),                       //"그룹명",
      field: "usergroupName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2.2,
    },
    {
      headerName: t("@REMARK"),                       //"설명",
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 4,
    },
    {
      headerName: t("@COL_CREATE_USER"),                       //"생성자",
      field: "createUser",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@COL_CREATION_TIME"),                       //"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 1.7,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}