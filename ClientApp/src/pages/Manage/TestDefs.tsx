import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, getLang, getLangAll } from '../../common/utility';

export const columnDefs = () => {
  const { t, i18n }  = useTranslation();
  
  return [
    {
      headerName: "테스트ID",
      field: "testId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.8,      
    },
    {
      headerName: "테스트명",
      field: "testName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2.2,
      valueFormatter: (d: any) => getLang(d.data.testName),
      tooltipValueGetter: (d:any) => getLangAll(d.data.testName),
    },
    {
      headerName: "테스트명멀티",
      field: "testNameMulti",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2.2,
      valueFormatter: (d: any) => getLang(d.data.testName, ["ko-KR", "vi-VN"]),
      tooltipValueGetter: (d:any) => getLangAll(d.data.testName),
    },
    {
      headerName: "수량",
      field: "quantity",
      filter: "agNumberColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.2,
    },
    {
      headerName: t("@SORT"),
      field: "sort",
      filter: "agNumberColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "설명",
      field: "remark",
      minWidth: 300,
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 4,
    },
    {
      headerName: "생성자",
      field: "createUser",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 1.7,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}