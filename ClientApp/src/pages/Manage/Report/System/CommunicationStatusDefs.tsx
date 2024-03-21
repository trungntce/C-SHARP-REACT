import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../../../common/utility";
import { TimeFormat } from "../../../AnyPage/utills/getTimes";
import StatusRender from "./StatusRender";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const CommunicationStatusDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      field: "hcCode",
      flex: 1,
      maxWidth: 150,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      flex: 1,
      maxWidth: 250,
    },
    {
      headerName: "IP ADDRESS",
      field: "ipAddress",
      flex: 1,
      maxWidth: 350,
      resizable:true,
      valueFormatter: (d: any) => {
        const SecondaryEqp = d.data.ipAddress.split("-")[0];
        return d.data.ipAddress?.includes("Secondary") 
        ? SecondaryEqp :  d.data.ipAddress
      },
    },
    {
      headerName: `${t("@LAST")} ${t("@RESPONSE_TIME")}`,//"마지막 응답시간",
      field: "lastDt",
      flex: 1,
      maxWidth: 220,
      valueFormatter: (d: any) => TimeFormat(d.data.lastDt),
    },
    {
      headerName: `${t("@STATE")}(${t("@COMMUNICATION_INTERRUPTION")} / ${t("@MINUTE")})`,//"상태(통신중단 / 분)",
      field: "status",
      flex: 1,
      maxWidth: 200,
      cellRenderer: StatusRender,
    },
    {
      headerName: `${t("@COL_DETAILS")}${t("@INFORMATION")}`,//"상세정보",
      field: "remark",
      flex: 1,
      editable: true,
    },
    {
      headerName: t("@LAST_COLLECTION_TIME"),  //최종수집시간
      field: "eqp_last_dt",
      maxWidth: 150,
      cellRenderer: (d:any) => {
        return (
          <Link to={`/pcinfotable/${d.data.hcCode}`} target="_blank">{dateFormat(d.data.eqp_last_dt, "YYYY-MM-DD HH:mm:ss")}</Link>
        )
      }
    },
  ];
}

export const DownListDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_OCCURRENCE_TIME"),//"발생시간",
      field: "insertDt",
      flex: 1,
      maxWidth: 200,
      valueFormatter: (d: any) => TimeFormat(d.data.insertDt),
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpCode",
      flex: 1,
      maxWidth: 350,
    },
    {
      headerName: t("@ACTION_ITEMS"),//"조치사항",
      field: "insertRemark",
      flex: 1,
    },
  ];
}
