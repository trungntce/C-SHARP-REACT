import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    { 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      width: 35
    },
    {
      headerName: `${t("@INTERLOCK_REASON_CODE")}`,//"코드",
      field: "codeId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: `${t("@INTERLOCK_REASON")}`,//"내용",
      field: "codeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@REMARKS"),//"비고",
      field: "reamark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}

export const columnInterlockDefs = () => {
  const { t }  = useTranslation();
  
  return [
    { 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      width: 35
    },
    {
      headerName: '',//"코드",
      field: "opClassCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: `${t("@LARGE_CATEGORY_NAME")}`,//"내용",
      field: "opClassDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: '',//"비고",
      field: "opTypeCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@MIDDLE_CATEGORY_NAME"),//"비고",
      field: "opTypeDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}

export const columnGroupDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: `${t("@USER_GROUP")}/${t("@USER")}`,//"사용자그룹/사용자",
      field: "userTypeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: `${t("@USER_GROUP")}/${t("@USER_NAME")}`,//"사용자그룹/사용자명",
      field: "idName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: `${t("@INTERLOCK_REASON")}`,//"인터락 사유",
      field: "interlockName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: `${t("@TYPE")}`,//"내용",
      field: "messengerCaseName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}