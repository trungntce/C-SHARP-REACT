import { ColDef } from "ag-grid-community";
import { TimeFormat } from "../../../AnyPage/utills/getTimes";

export const BlackHoleRowData = ():ColDef[] => {
 return [
  {
   headerName:"일자",
   field:"create_dt",
   width:250
  },
  {
   headerName:"Batch No",
   field:"workorder",
   width:250
  },
  {
   headerName:"Max",
   field:"max",
   width:170
  },
  {
   headerName:"Min",
   field:"min",
   width:170
  },
  {
   headerName:"Avg",
   field:"avg",
   width:170
  },
 ]
};

export const BlackHoleNglist = ():ColDef[] => {
 return [
  {
   headerName:"이상 발생일",
   field:"create_dt",
   width:250
  },
  {
    headerName:"제품명",
    field:"itemCode",
    width:250
   },
  {
   headerName:"Roll No",
   field:"Roll No",
   width:250
  },
  {
    headerName:"원인/대책",
    field:"remark",
    width:250
   },
 ]
}

export const BlackHoleNgImgList = ():ColDef[] => {
 return [
  {
   headerName:"Date",
   field:"time",
   width:200,
   valueFormatter : (d:any)=> TimeFormat(d.data.time)
  },
  {
   headerName:"PNL ID",
   field:"panel_id",
   width:250
  },
  {
   headerName:"File Location",
   field:"filelocation",
   width:250,
   resizable:true,
  },
 ]
}