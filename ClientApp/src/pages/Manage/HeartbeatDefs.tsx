import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, fromNow } from '../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "No",
      field: "index",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "장비ID",
      field: "eqpCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 3,
    },
    {
      headerName: "장비명",
      field: "eqpDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 5,
    },
    {
      headerName: "Last Ping",
      field: "pingDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 2,
      valueFormatter: (d: any) => dateFormat(d.data.pingDt),
      cellRenderer: 'agAnimateShowChangeCellRenderer'
    },
    {
      headerName: "Last Updated",
      field: "pingDt",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
      valueFormatter: (d: any) => fromNow(d.data.pingDt),
      cellRenderer: 'agAnimateShowChangeCellRenderer'
    },
    {
      headerName: "Status",
      field: "secAgo",
      sortable: true,
      flex: 1,
      cellRenderer: (d: any) => {
        if(d.data.secAgo <= 60){
          return (<span className="text-primary">Healthy</span>);
        }else if(d.data.secAgo > 60 && d.data.secAgo <= 600){
          return (<span className="text-warning">Warning</span>);
        }else{
          return (<span className="text-danger">Dead</span>);
        }
      }
    }
  ];
}