import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../../common/utility';
import { Button } from "reactstrap";

export const columnTypeProdDefs = () => {
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
      headerName: "관리코드",
      field: "checksheetCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: "관리코드",
      field: "checksheetGroupCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
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
      headerName: "REV",
      field: "rev",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
        headerName: "유효시작일자",
        field: "validStrtDt",
        filter: "agDateColumnFilter",
        sortable: true,
        flex: 1.5,
        valueFormatter: (d: any) => dateFormat(d.data.validStrtDt)
    },
    {
        headerName: "유효종료일자",
        field: "validEndDt",
        filter: "agDateColumnFilter",
        sortable: true,
        flex: 1.5,
        valueFormatter: (d: any) => dateFormat(d.data.validEndDt)
    },
    {
        headerName: "설명",
        field: "remark",
        filter: "agTextColumnFilter",
        sortable: true,
        flex: 1.5,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
  ];
}


export const columnChecksheetItemDefs = (deleteCallback: any, setFormItem: any) => {
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
      headerName: "항목코드",
      field: "itemCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "항목명",
      field: "itemName",
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
    {
      headerName: "설명",
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "Create User",
      field: "createUser",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "Create Date",
      field: "createDt",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    },
    {
      headerName: "#",
      cellStyle: { textAlign: 'center' },
      field: "",
      sortable: false,
      maxWidth: 140,
      cellRenderer: (e: any) => {
        return (
          <>
          {/* <i className="fa-regular fa-square-check"></i> */}
            <Button title="고치다" id='btnEditItem' type='button' color="primary" onClick={() => setFormItem(e.data)}>
              <i className="uil uil-pen me-2"></i>
            </Button>
            &nbsp;
            <Button title={t("@DELETE")} type='button' color="warning" onClick={() => deleteCallback(e)}>
              <i className="uil uil-trash me-2"></i>
            </Button>
          </>
        );
      }
    }
  ];
}
