import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@PERSON_NUM"),                       //"사번",
      field: "personNum",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.8,
    },
    {
      headerName: t("@USER_NAME"),                       //"이름",
      field: "name",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2.2,
    },
    {
      headerName: '',                       //"",
      field: "displayName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 4,
    },
    {
      headerName: t("@COL_USE_STATUS"),                       //"사용유무",
      field: "enabledFlag",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}