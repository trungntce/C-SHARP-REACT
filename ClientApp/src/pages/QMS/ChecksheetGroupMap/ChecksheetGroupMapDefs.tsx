import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const groupMapColumnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "Mã quản lý",
      field: "chksOperCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "Tên quản lý",
      field: "chksOperName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "Mã thiết bị",
      field: "eqpCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: "Tên thiết bị",
      field: "eqpDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
  ];
}