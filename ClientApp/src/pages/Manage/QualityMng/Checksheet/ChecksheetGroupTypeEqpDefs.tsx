import moment from 'moment';
import { Button} from "reactstrap";
import { useTranslation } from "react-i18next";


export const columnGroupTypeEqpDefs = (deleteCallback: any, setFormItem: any) => {
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
      field: "checksheetGroupCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "설비코드",
      field: "equipmentCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "설비명",
      field: "equipmentDescription",
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
      maxWidth: '80',
      cellStyle: {
        textAlign: 'center'
      }
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
