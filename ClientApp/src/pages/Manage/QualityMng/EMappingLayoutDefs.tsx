import moment from 'moment';
import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../common/utility';

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@COL_ITEM_NAME"),//"제품명",
      field: "itemName",
      width: 180,
      tooltipValueGetter: (d:any) => d.data.itemName,
    },
    {
      headerName: t("@COL_MODEL_CODE"),//"모델코드",
      field: "modelCode",
      width: 230,
      tooltipValueGetter: (d:any) => d.data.modelCode,
    },
    {
      headerName: t("@REMARK"),//"설명",
      field: "remark",
      width: 300
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUserName",
      width: 100
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      width: 125,
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm"),
    }
  ];
}