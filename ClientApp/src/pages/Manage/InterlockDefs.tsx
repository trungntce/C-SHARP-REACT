  import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const InterlockDefs = () => {
  const { t } = useTranslation();

  return [
    {
      headerName: `${t("@COL_INTERLOCK")} CODE`, //"인터락 Code",
      field: "interlockCode",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: `${t("@COL_INTERLOCK")} NAME`, //"인터락 Name",
      field: "interlockName",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    // {
    //   headerName: "인터락 Type",
    //   field: "interlockType",
    //   cellStyle: {textAlign: 'center'},
    //   flex: 1,
    // },
    {
      headerName: t("@REMARK"), //"설명",
      field: "remark",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@USEYN"), //"사용여부",
      field: "useYn",
      cellStyle: {textAlign: 'center'},
      flex: 0.5,
    },
    {
      headerName: t("@COL_CREATE_USER"), //"생성자",
      field: "createUser",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@COL_CREATION_TIME"), //"생성시간",
      field: "createDt",
      flex: 1.3,
      cellStyle: {textAlign: 'center'},
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    },
    {
      headerName: t("@COL_UPDATE_USER"), //"변경자",
      field: "updateUser",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@COL_UPDATE_TIME"), //"변경시간",
      field: "updateDt",
      cellStyle: {textAlign: 'center'},
      flex: 1.3,
      valueFormatter: (d: any) => dateFormat(d.data.updateDt),
    },
  ]
};
