import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../common/utility';

export const apiHistoryDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "No",
      field: "historyNo",
      width: 70
    },
    {
      headerName: "Path",
      field: "path",
      width: 200
    },
    {
      headerName: "Method",
      field: "method",
      width: 80,
      cellRenderer: (d: any) => {
        return (
          <>
            <span className={`cell-${d.data.method?.toLowerCase()}`}>{d.data.method}</span>
          </>
        );
      }
    },
    {
      headerName: "Query",
      field: "query",
      width: 250
    },
    {
      cellClass: "cell-gray",
      headerName: "REQ",
      field: "request",
      width: 55,
      cellRenderer: (d: any) => {
        if(!d.data.request){
          return null;
        }

        return (
          <>
            <i className="fa fa-check"></i>
          </>
        );
      }
    },
    {
      cellClass: "cell-gray",
      headerName: "RES",
      field: "response",
      width: 55,
      cellRenderer: (d: any) => {
        if(!d.data.response){
          return null;
        }

        if(d.data.response.indexOf("Too Long Response") > -1){
          return null;
        }

        return (
          <>
            <i className="fa fa-check"></i>
          </>
        );
      }
    },
    {
      headerName: "Host",
      field: "host",
      width: 110
    },
    {
      headerName: "Client",
      field: "client",
      width: 110
    },
    {
      headerName: "생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      width: 130,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];
}