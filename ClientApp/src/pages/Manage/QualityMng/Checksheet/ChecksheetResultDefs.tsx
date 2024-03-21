import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, getLang } from '../../../../common/utility';
import { Button } from "reactstrap";


export const columnResultDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      width:40,
      filter: false,
      cellStyle: {
        textAlign: 'center'
      }
    },
    {
      headerName: "작업장코드",
      field: "workcenterCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "작업장",
      field: "workcenterDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "관리항목코드",
      field: "checksheetGroupCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: "관리타입",
      field: "checksheetCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "설비코드",
      field: "eqpCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "설비명",
      field: "equipmentDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "관리항목코드",
      field: "checksheetItemCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "관리타입",
      field: "checksheetTypeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "방법",
      field: "method",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "점검포인트",
      field: "inspectPoint",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "규격",
      field: "standardVal",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "규격MIN",
      field: "minVal",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "규격MAX",
      field: "maxVal",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "값 확인",
      field: "checkValue",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "상태 확인",
      field: "checkStatusName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
      cellStyle: {
        textAlign: 'center'
      },
      valueFormatter: (d: any) => { 
        if (null !== d.data.checkStatusName && d.data.checkStatusName !== '') { 
          return getLang(d.data.checkStatusName + "");
        }
      },
    },
    {
      headerName: "Image",
      field: "",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 1,
      cellRenderer: (e: any) => {
        return (
          <>
            <Button title='' type='button' color="primary">
              <i className="fa-solid fa-image"></i> (e.data.imgCnt)
            </Button>
          </>
        );
      }
    },
    {
      headerName: "날짜 확인",
      field: "checkDate",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.checkDate)
    },
    {
      headerName: "사용자 확인",
      field: "checkUser",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    }
   
  ];
}
