import { useTranslation } from "react-i18next";
import { dateFormat, getLang } from "../../../../common/utility";
import { Button } from "reactstrap";

export const columnChecksheetReportDefs = () => {

  return [
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      width: 40,
      filter: false,
      pinned: 'left',
      cellStyle: {
        textAlign: 'center'
      }
    },
    {
      headerName: "설비",
      minWidth: 400,
      pinned: 'left',
      children: [
        {
          headerName: "작업장코드",
          field: "workcenter_code",
          filter: "agTextColumnFilter",
          width: 100,
          sortable: true,
          pinned: 'left',
        },
        {
          headerName: "작업장",
          field: "workcenter_name",
          filter: "agTextColumnFilter",
          sortable: true,
          width: 100,
          pinned: 'left',
        },
        {
          headerName: "설비코드",
          field: "eqp_code",
          filter: "agTextColumnFilter",
          sortable: true,
          width: 100,
          pinned: 'left',
        },
        {
          headerName: "설비명",
          field: "eqp_name",
          filter: "agTextColumnFilter",
          sortable: true,
          width: 100,
          pinned: 'left',
        }
      ]
    }
  ];
};

export const columnResultDefs = (callback:any) => {
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
        if (e.data.imgCnt <= 0) { 
          return <></>
        }
        return (
          <>
            <Button title='' type='button' color="primary" onClick={() => callback(e.data)}>
              <i className="fa-solid fa-image"></i> ({e.data.imgCnt})
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

export const columnResultImgDefs = (callback:any) => {
  
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
      headerName: "Image",
      field: "",
      maxWidth: 120,
      sortable: false,
      cellStyle: {
        textAlign: 'center'
      },
      cellRenderer: (e: any) => {
        return (
          <>
            <Button title='' type='button' color="primary" onClick={() => callback(e.data)}>
              <i className="fa-solid fa-image"></i> View
            </Button>
          </>
        );
      }
    },
    {
      headerName: "Image name",
      field: "imgName",
      filter: "agDateColumnFilter",
      sortable: true,
    },
    {
      headerName: "날짜 확인",
      field: "createDt",
      filter: "agDateColumnFilter",
      sortable: true,
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    },
    {
      headerName: "사용자 확인",
      field: "createUser",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    }
  ];
}
