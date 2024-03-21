import { useTranslation } from "react-i18next"

export const columnEqpDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_EQP_NAME"), //"설비명", 
      field: "equipmentDescription", 
      flex:1,
    }
  ]
}