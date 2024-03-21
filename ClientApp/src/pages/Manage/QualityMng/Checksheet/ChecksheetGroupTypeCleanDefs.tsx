import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../../common/utility';
import { Row, Col, Button, Input, Label } from "reactstrap";

export const columnGroupTypeProdDefs = (deleteCallback: any, setFormItem: any) => {
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
      headerName: "고치다",
      field: "",
      sortable: false,
      maxWidth: 140,
      cellRenderer: (e: any) => {
        return (
          <>
          {/* <i className="fa-regular fa-square-check"></i> */}
            <Button title='고치다' id='btnEditItem' type='button' color="primary" onClick={() => setFormItem(e.data)}>
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
