import { ColDef } from "ag-grid-community";
import {  dateFormat, devideFormat, currencyFormat } from "../../common/utility";



//import React, {
//    useCallback,
//    useMemo,
//    useRef,
//    useState,
//    StrictMode,
//} from 'react';


//import MoodEditor from './moodEditor.jsx';
//import NumericCellEditor from './numericCellEditor.jsx';

//import { GenderRenderer } from './gender';


//const cellEditorSelector = (params:any) => {
//    if (params.data.type === 'age') {
//        return {
//            component: NumericCellEditor,
//        };
//    }
//    if (params.data.type === 'gender') {
//        return {
//            component: 'agRichSelectCellEditor',
//            params: {
//                values: ['Male', 'Female'],
//            },
//            popup: true,
//        };
//    }
//    if (params.data.type === 'mood') {
//        return {
//            component: MoodEditor,
//            popup: true,
//            popupPosition: 'under',
//        };
//    }
//    return undefined;
//};





//export const columnCountDefs = useState([
//        {
//            headerName: 'Doubling',
//            field: 'number',
//            cellEditorSelector: cellEditorSelector,
//            editable: true,
//            width: 300,
//        },
//        {
//            field: 'mood',
//            cellEditorSelector: cellEditorSelector,
//            cellEditorPopup: true,
//            editable: true,
//            width: 300,
//        },
//        {
//            headerName: 'Numeric',
//            field: 'number',
//            cellEditorSelector: cellEditorSelector,
//            editable: true,
//            width: 280,
//        },
//    ]);

export const columnCountDefs = [
    {
        field: "step_name", headerName: "step Name", width: 90, headerClass: "no-leftborder cell-header-group-2",
        //cellRenderer: GenderRenderer,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            //cellRenderer: GenderRenderer,
            values: ["Step 1","Step 2"],
        },
        /*cellEditorPopup: true,*/
        cellEditorPopupPosition: 'under',
        editable: true
    },
    { field: "temperature", headerName: "temperature", width: 90, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "temp_during", headerName: "temp During", width: 90, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "pressure", headerName: "pressure", width: 90, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "pres_during", headerName: "pres During", width: 90, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "dimensionA", headerName: "A", width: 50, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "dimensionB", headerName: "B", width: 50, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "dimensionC", headerName: "C", width: 50, headerClass: "no-leftborder cell-header-group-2",   editable: true },   
    { field: "dimensionD", headerName: "D", width: 50, headerClass: "no-leftborder cell-header-group-2",   editable: true },
    { field: "dimensionE", headerName: "E", width: 50, headerClass: "no-leftborder cell-header-group-2",   editable: true },
  {
    field: "startDt",
    headerName: "4M등록 시간",
    width: 150, 
    headerClass: "no-leftborder cell-header-group-2",
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.startDt)
        return '';

      if(d.data.startDt.toUpperCase().indexOf("TOTAL") >= 0 || 
        d.data.startDt.toUpperCase().indexOf("SUM") >= 0 || 
        d.data.startDt.toUpperCase().indexOf("AMOUNT") >= 0)
        return ( <div className="text-center">{d.data.startDt}</div> );  

      return dateFormat(d.data.startDt, "YYYY-MM-DD HH:mm:ss")
    }
    }    
]

export const columnErrorDefs = [
]


export const ngTypes = [
    { headerName: "None", field: "none" }
    , { headerName: "Open", field: "open" }
    , { headerName: "Short", field: "short" }
];


const ngCols: ColDef<any>[] = [];
ngTypes.forEach(ng => {
    const valueCol = {
        headerName: ng.headerName,
        headerClass: 'cell-header-group-4',
        children: [
            { headerName: "수량", field: ng.field, width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d: any) => currencyFormat(d.data[ng.field]), filter: "agNumberColumnFilter" },
            { headerName: "기준DPU", field: ng.field + "Rate", width: 85, headerClass: 'cell-header-group-5', valueFormatter: (d: any) => d.data[ng.field + "Rate"], filter: "agNumberColumnFilter" },
            { headerName: "DPU", field: ng.field + "dpu", width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d: any) => (d.data[ng.field] / d.data.panelQty).toFixed(2) ?? 0, filter: "agNumberColumnFilter" },
            { headerName: "불량율", width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d: any) => d.data.pcsTotal > 0 ? devideFormat(d.data[ng.field], d.data.pcsTotal) : 0, filter: "agNumberColumnFilter" },
        ]
    };

    ngCols.push(valueCol);
});

export const columnDetailDefs = [
    { field: "No", headerName: "No.", width: 90, headerClass: "no-leftborder cell-header-group-2" },
    { field: "Date", headerName: "Date", width: 90, headerClass: "no-leftborder cell-header-group-2" },
    { field: "model_code", headerName: "Model code", width: 150, headerClass: "no-leftborder cell-header-group-2" },
    { field: "model_description", headerName: "Model name", width: 150, headerClass: "no-leftborder cell-header-group-2" },
    { field: "eqp_code", headerName: "Equipment code", width: 150, headerClass: "no-leftborder cell-header-group-2" },
    { field: "eqp_description", headerName: "Equipment name", width: 150, headerClass: "no-leftborder cell-header-group-2" },
    { field: "hp_recipe_code", headerName: "recipe_code", width: 150, headerClass: "no-leftborder cell-header-group-2" },
    { field: "hp_recipe_name", headerName: "사용여부", width: 150, headerClass: "no-leftborder cell-header-group-2" },    {
        field: "create_user", headerName: "등록자", width: 150, headerClass: "no-leftborder cell-header-group-2" },
    { field: "remark", headerName: "Description", width: 150, headerClass: "no-leftborder cell-header-group-2" },
]