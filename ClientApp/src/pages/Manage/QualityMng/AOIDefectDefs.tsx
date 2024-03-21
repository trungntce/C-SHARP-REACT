import { useTranslation } from "react-i18next";
import { toComma } from "../../AnyPage/utills/toComma";

export const aoiWorstDefs = () =>{
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
      field: "bomItemDescription",
      type: "leftAligned",
      width: 170,
      resizable: true,
    },
    {
      type: "rightAligned",
      field: "layer",
      width: 70,
      resizable: true,
      headerComponentParams: {
        template: '<div class="header-wrapper">검사층</div>',
      },
      suppressMovable: true,
    },
    {
      field: "rateMonth",
      type: "rightAligned",
      width: 80,
      resizable: true,
      headerComponentParams: {
        template: '<div class="header-wrapper">월간 수율</div>',
      },
      suppressMovable: true,
      valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
    },
    {
      field: "rateYesterday",
      type: "rightAligned",
      width: 80,
      resizable: true,
      headerComponentParams: {
        template: '<div class="header-wrapper">전일 수율</div>',
      },
      suppressMovable: true,
      valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
    },
    {
      field: "rateToday",
      type: "rightAligned",
      width: 80,
      resizable: true,
      cellStyle:(params: any) => {
        return {borderRight: "1px solid white"}
      },
      headerComponentParams: {
        template: '<div class="header-wrapper">금일 수율</div>',
      },
      suppressMovable: true,
      valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
    },
    {
      headerName: "OPEN",
      field: "open",
      type: "rightAligned",
      width: 80,
      resizable: true,
      valueFormatter: (d: any) => d.data.open + ' %',
    },
    {
      headerName: "SHORT",
      field: "short",
      type: "rightAligned",
      width: 80,
      resizable: true,
      valueFormatter: (d: any) => d.data.short + ' %',
    },
    {
      headerName: "HOLE",
      field: "hole",
      type: "rightAligned",
      width: 80,
      resizable: true,
      valueFormatter: (d: any) => d.data.hole + ' %',
    },
    {
      headerName: "ETC",
      field: "etc",
      type: "rightAligned",
      width: 80,
      resizable: true,
      valueFormatter: (d: any) => d.data.etc + ' %',
    },
    {
      headerName: "FOOT",
      field: "foot",
      type: "rightAligned",
      width: 80,
      resizable: true,
      valueFormatter: (d: any) => d.data.foot + ' %',
    },
  ];
}