import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../../common/utility";
import { Link } from "react-router-dom";

export const columnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: "No",
      field: "idx",
      resizable: true,
      flex: 0.6,
    },
    {
      headerName: t("@COL_INPUT_DATE"),//"투입일자",
      field: "workindt",
      flex: 1,
      cellRenderer: (d: any) => {
        return dateFormat(d.data.workindt, "YYYY-MM-DD")
      }
    },
    {
      headerName: t("@COL_COMPLETION_DATE"),//"완료일자",
      field: "completedt",
      flex: 1,
      cellRenderer: (d: any) => {
        return dateFormat(d.data.completedt, "YYYY-MM-DD")
      }
    },
    {
      headerName: t("@COL_SHIPMENT_DATE"),//"출하일자",
      field: "outdt",
      flex: 1,
      cellRenderer: (d: any) => {
        return dateFormat(d.data.outdt, "YYYY-MM-DD")
      }
    },
    {
      headerName: "Roll Code",
      field: "rollId",
      flex: 1.6,
    },
    {
      headerName: "Model Code",
      field: "modelId",
      flex: 1.6,
    },
    {
      headerName: "BATCH NO",
      field: "lotNo",
      resizable: true,
      flex: 1.6,
      cellRenderer: (d: any) => {
        return (
          <Link to={`/trace4m/${d.data.lotNo}`}>
            {d.data.lotNo}
          </Link>
        );
      }
    },
    {
      headerName: "PNL Code",
      field: "pnlCode",
      flex: 1.6,
      cellRenderer: (d: any) => {
        return (
          <Link to={`/trace/${d.data.pnlCode}`}>
            { d.data.pnlCode }
          </Link>
        )
      }
    },
    {
      headerName: "Sheet",
      field: "sheetId",
      flex: 1.6,
    },
    {
      headerName: "PCS",
      field: "pieceId",
      flex: 1.6,
    },
  ];
  
}