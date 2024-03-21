import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat, getLang } from '../../../../common/utility';
import { Button } from "reactstrap";
import { alertBox, confirmBox } from '../../../../components/MessageBox/Alert';
import api from '../../../../common/api';

export const columnDefErrUpload = () => { 
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
      headerName: "Dòng lỗi",
      field: "row_no",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: 'Mô tả',
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
  ];
}

export const columnItemEqpDefs = (deleteItem: any, setFormItem: any, showImg: any) => {
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
      headerName: t("@CKSICODE"),
      field: "checksheetItemCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: t("@CKSTYPE"),
      field: "checksheetTypeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@DAYCKTYPE"),
      field: "dailyCheckTypeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
      valueFormatter: (d: any) => getLang(d.data.dailyCheckTypeName),
    },
    // {
    //   headerName: t("@DAYCKTYPE"),
    //   field: "dailyCheckDate",
    //   filter: "agTextColumnFilter",
    //   sortable: true,
    //   flex: 1,
    // },
    {
      headerName: t("@FREQ"),
      field: "checkFreqNum",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    // {
    //   headerName: "평일",
    //   field: "dayType",
    //   filter: "agTextColumnFilter",
    //   sortable: true,
    //   flex: 1,
    //   valueFormatter: (d: any) => getLang(d.data.dayTypeName),
    // },
    // {
    //   headerName: "월별일",
    //   field: "dayVal",
    //   filter: "agTextColumnFilter",
    //   sortable: true,
    //   flex: 1,
    // },
    {
      headerName: t("@ORD"),
      field: "ord",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@EXPERIOD"),
      field: "exchgPeriod",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@STANDARD_VALUE"),
      field: "standardVal",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@MINVAL"),
      field: "minVal",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@MAXVAL"),
      field: "maxVal",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@METHOD"),
      field: "method",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@INSPECTPOINT"),
      field: "inspectPoint",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    // {
    //   headerName: "측정단위",
    //   field: "unitMeasureName",
    //   filter: "agTextColumnFilter",
    //   sortable: true,
    //   flex: 1,
    //   valueFormatter: (d: any) => getLang(d.data.unitMeasureName),
    // },
    // {
    //   headerName: "측정주기",
    //   field: "measurePeriodName",
    //   filter: "agTextColumnFilter",
    //   sortable: true,
    //   flex: 1,
    //   valueFormatter: (d: any) => getLang(d.data.measurePeriodName),
    // },
    {
      headerName: t("@INPUTTYPE"),
      field: "inputTypeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
      cellRenderer: (e: any) => {
        return (
              e.data.inputType === 'image' ?
                <Button title='Preview' type='button' color="primary" onClick={() => showImg(e.data)}>
                  {getLang(e.data.inputTypeName)}
                </Button> : <>{getLang(e.data.inputTypeName)}</>
        );
      }
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@REMARK"),
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "#",
      field: "",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
      minWidth: 140,
      cellStyle: {
        textAlign: 'center'
      },
      cellRenderer: (e: any) => {
        return (
          <>
          {/* <i className="fa-regular fa-square-check"></i> */}
            <Button title='고치다' type='button' color="primary" onClick={() => setFormItem(e.data)}>
              <i className="uil uil-pen me-2"></i>
            </Button>&nbsp;
            <Button title={t("@DELETE")} type='button' color="warning" onClick={() => deleteItem(e)}>
              <i className="uil uil-trash me-2"></i>
            </Button>
          </>
        );
      }
    }
  ];
}
