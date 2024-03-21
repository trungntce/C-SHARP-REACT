import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: `${t("@USER")}ID`,//"사용자ID",
      field: "userId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.8,
    },
    {
      headerName: `${t("@USER")}${t("@COL_NAME")}`,//"사용자명",
      field: "userName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2.2,
    },
    {
      headerName: t("@COUNTRY_CODE"),//"국가코드",
      field: "nationCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: "Email",
      field: "email",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2.5,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: t("@REMARK"),//"설명",
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 4.3,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 2.3,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}