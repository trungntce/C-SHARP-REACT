import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const modelListColumnDefs = () => {
  const { t } = useTranslation();
  return [

    // {
    //   headerName: t("@LARGE_CATEGORY"), 
    //   field: "className" ,
    //   width: 150,
    //   tooltipValueGetter: (d:any) => `[${d.data.classCode}] ${d.data.className}`,
    // },
    {
      headerName: t("@COL_MODEL_CODE"), //모델코드
      field: "modelCode",
      flex: 2.0,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //모델명
      field: "modelDesc",
      flex: 2.0,
    },
    {
      headerName: t("@COL_REGISTRATION"), //모델명
      field: "insertYn",
      flex: 0.8,
    },
  

  ]
};
