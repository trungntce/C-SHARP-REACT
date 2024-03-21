import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: "AOI",
      field: "aoiCnt",
      filter: false,
      width: 40,
    },
    {
      headerName: "BBT",
      field: "bbtCnt",
      filter: false,
      width: 40,
    },
    {
      headerName: "B/H",
      field: "blackholeCnt",
      filter: false,
      width: 40
    },
  ];
}