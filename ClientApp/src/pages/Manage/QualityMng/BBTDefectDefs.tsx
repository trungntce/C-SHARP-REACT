import { useTranslation } from "react-i18next"

export const bbtWorstDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_GRADE"),//"등급",
      field: "grade",
      type: "leftAligned",
      width: 60,
      resizable: true,
      filter: true
    },
    {
      headerName: t("@COL_ITEM_NAME"),//"제품명",
      field: "modelDescription",
      type: "leftAligned",
      width: 150,
      resizable: true,
    },
    {
      headerName: t("@MONTHLY_YIELD"),//"월간 수율",
      field: "monthYield",
      type: "rightAligned",
      width: 90,
      resizable: true,
      valueFormatter: (d: any) => d.data.monthYield + ' %',
    },
    {
      headerName: t("@PREVIOUS_DAY_YIELD"),//"전일 수율",
      field: "yesterdayYield",
      type: "rightAligned",
      width: 90,
      resizable: true,
      valueFormatter: (d: any) => d.data.weekYield + ' %',
    },
    {
      headerName: t("@TODAY_S_YIELD"),//"금일 수율",
      field: "dayYield",
      type: "rightAligned",
      width: 90,
      resizable: true,
      valueFormatter: (d: any) => d.data.dayYield + ' %',
    },
    {
      headerName: "OPEN",
      field: "openYield",
      type: "rightAligned",
      width: 90,
      resizable: true,
      valueFormatter: (d: any) => d.data.openYield + ' %',
    },
    {
      headerName: "SHORT",
      field: "shortYield",
      type: "rightAligned",
      width: 90,
      resizable: true,
      valueFormatter: (d: any) => d.data.shortYield + ' %',
    },
    // {
    //   headerName: "Sus접지저항",
    //   field: "shortDefactQtyToday",
    //   type: "rightAligned",
    //   flex: 1.2,
    //   resizable: true,
    //   valueFormatter: (d: any) => d.data.shortDefactQtyToday,
    // },
    // {
    //   headerName: "기타",
    //   field: "",
    //   type: "rightAligned",
    //   // valueFormatter: (d: any) => (d.data.diff.toFixed(2) + ' %'),
    //   flex: 1,
    //   resizable: true,
    // },
  ];
}