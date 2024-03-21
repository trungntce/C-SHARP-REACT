import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: `${t("@GROUP_ID")}`,//"그룹ID",
      field: "pushType",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: `${t("@MODULE_CODE")}`,//"모듈 코드",
      field: "pushModuleLcode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: t("@COL_GROUP_NAME"),//"그룹명",
      field: "pushDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}