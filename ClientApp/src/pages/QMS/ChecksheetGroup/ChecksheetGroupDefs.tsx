import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "Mã công đoạn",
      field: "operationCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "Tên công đoạn",
      field: "operationDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
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
      headerName: "Ngày bắt đầu",
      field: "validStrtDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 2,
      valueFormatter: (d: any) => dateFormat(d.data.validStrtDt)
    },
    {
      headerName: "Ngày kết thúc",
      field: "validEndDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 2,
      valueFormatter: (d: any) => dateFormat(d.data.validEndDt)
    },
    {
      headerName: "설명",
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    // {
    //   headerName: "생성자",
    //   field: "createUser",
    //   filter: "agTextColumnFilter",
    //   sortable: true,
    //   flex: 1,
    // },
    // {
    //   headerName: "생성시간",
    //   field: "createDt",
    //   filter: "agDateColumnFilter",
    //   sortable: true,
    //   flex: 1,
    //   valueFormatter: (d: any) => dateFormat(d.data.createDt)
    // },
  ];
}