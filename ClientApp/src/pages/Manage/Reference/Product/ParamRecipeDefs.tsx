import { useTranslation } from "react-i18next";
import { dateFormat, getLang } from "../../../../common/utility";

export const ColumnDefs = () => {
  const { t } = useTranslation();

  return [
    // {
    //   headerName: "설비코드",
    //   field: "eqpCode",
    //   maxWidth: 160,
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    // },
    {
      headerName: t("@COL_EQP_NAME"), //설비명
      field: "eqpName",
      width: 150,
      tooltipValueGetter: (d: any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },
    {
      headerName: t("@COL_GROUP_NAME"), //그룹명
      field: "groupName",
      width: 150,
      tooltipValueGetter: (d: any) =>
        `[${d.data.groupCode}] ${d.data.groupName}`,
      valueFormatter: (d: any) => getLang(d.data.groupName),
    },
    {
      headerName: `${t("@COL_REGISTRATION")}PV/SV`, //등록PV/SV
      field: "paramCnt",
      width: 120,
      valueFormatter: (d: any) => `${d.data.paramCnt}/${d.data.recipeCnt}`,
    },
  ];
};
