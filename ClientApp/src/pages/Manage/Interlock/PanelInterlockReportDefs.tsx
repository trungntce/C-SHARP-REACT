import { ColDef } from "ag-grid-community";
import React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import api from "../../../common/api";
import { contentType, Dictionary, UploadFile } from "../../../common/types";
import { dateFormat, downloadFile, executeIdle, getLang, getLangAll } from "../../../common/utility";
import LotInfo from "../../Trace/LotInfo";
import { judgeName } from "../../Trace/TraceDefs";

export const panelColumnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    { 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      width: 35
    },
    {
      headerName: `${t("@INTERLOCK_REASON_CODE")}`,//"코드",
      field: "codeId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: `${t("@INTERLOCK_REASON")}`,//"내용",
      field: "codeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@REMARKS"),//"비고",
      field: "reamark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}

export const workorderColumnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    { 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      width: 35
    },
    {
      headerName: `${t("@INTERLOCK_REASON_CODE")}`,//"코드",
      field: "codeId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: `${t("@INTERLOCK_REASON")}`,//"내용",
      field: "codeName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@REMARKS"),//"비고",
      field: "reamark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    }
  ];
}

