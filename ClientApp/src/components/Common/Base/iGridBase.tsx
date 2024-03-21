import { AgGridReact } from "ag-grid-react";
import { forwardRef } from "react";
import { baseColDef } from "./DefBase";
import api from "../../../common/api";
import { alertBox } from "../../../components/MessageBox/Alert";



const iGridBase = forwardRef((props: any, ref: any) => {
    const { style, className, ...rest } = props;


    const autoSizeStrategy = {
        type: 'fitCellContents',
        //defaultMinWidth: 100,
        //defaultWidth: 50,
        //columnLimits: [{ colId: 'country', minWidth: 50 }]
    };

    return (
        <div className={`ag-theme-alpine mb-2 ${className}`} id={props.containerId} style={{ width: "100%", height: "calc(100% - 35px)", ...style }}>
            <AgGridReact
                ref={ref}
                //autoSizeStrategy={autoSizeStrategy}
                headerHeight={37}
                rowHeight={35}
                rowSelection={props.rowSelection || "single"}
                enableCellTextSelection={true}
                rowMultiSelectWithClick={true}

                defaultColDef={baseColDef}
                overlayLoadingTemplate={
                    '<span class="ag-overlay-loading-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></span>'
                }
                {...rest}
            />
        </div>
    );
});

export async function postHandler(changerows: any, apipath: string,
    checkKeep: string = 'keep', checkSuccess: string = 'success', checkGiveUp1: string = 'model_code', checkGiveUp2: string = 'type') {

    if (!changerows) return;
    if (!changerows.length) return;
    var keeprows = changerows.filter((x: any) => { return (x[checkKeep ? checkKeep : 'keep'] && !x[checkSuccess ? checkSuccess :'success'])});
    var result: any = [];

    for (var i = 0; i < keeprows.length; i++) {
        if (!keeprows[i][checkGiveUp1 ? checkGiveUp1 : 'model_code'] || !keeprows[i][checkGiveUp2 ?checkGiveUp2:'type']) continue;
        var res = await api<any>("post", apipath, keeprows[i]);
        result.push(res.data);

        keeprows[i].success = res.data;
    }

    if (!result) return;
    if (!result.length) return;

    var done = result.reduce((acc: any, cur: any) => {
        return (!acc ? 1 : acc && acc > 0) && (cur && cur > 0)
    });

    if (done) {
        await postHandler(keeprows, apipath);
        //searchHandler();
    }
    else {
        alertBox('Save Failed(실패한), please try again!!');
    }
}


function doAppend(curGrid: any, setGrid: any, newDataG: any) {

    var dtadd1: any = [];
    var i = 0;

    //console.log('chay vao do append rồi----------------', newDataG);

    curGrid.current.api.forEachNode(function (a: any, b: any) {
        //console.log(b, '.all row=', gridCountRef.current.api.getDisplayedRowCount());
        i++;
        //console.log(i, '------------', curGrid.current.api.getDisplayedRowCount());
        if (a && a.data) {
            var countChild = Object.keys(a.data);
            //if (b == 0) dtadd1 = [];
            if (countChild.length > 0) dtadd1.push({ ...a.data });
        }
        
        if (i == curGrid.current.api.getDisplayedRowCount()) {
            
            if (newDataG && newDataG.length)
                for (var j = 0; j < newDataG.length; j++) {
                    if (!newDataG[j]) continue;
                    //console.log('22chay vao do append rồi', newDataG[j]);
                    var countChild2 = Object.keys(newDataG[j]);
                    //if (b == 0) dtadd1 = [];
                    if (countChild2.length > 0) dtadd1.push(newDataG[j]); //dtadd1.splice(0, 0, newData[i]); 
                }
            //dtadd1.splice(0, 0, { step_name: "STEP " + dtadd1.length, temperature: "", temp_during: "", pressure: "", pres_during: "", dimensiona: "", dimensionb: "", dimensionc: "", dimensiond: "", dimensione: "" });
            setGrid([...dtadd1]);
        }
    });
}



export function GridAppendOrReplace(curGrid: any, setGrid: any, newDataG: any, IsAppend: any) {

    //resizeColumns(,, curGrid);
    

    if (IsAppend)
        if (!countDatarowIN(newDataG)) return;

    if (countDatarowIN(newDataG)) {
        for (var l = 0; l < newDataG.length; l++) {
            if (!newDataG[l]) break;
            var lstcol = Object.keys(newDataG[l]);
            if (lstcol.length > 0 && !lstcol.includes("__no"))
                newDataG[l].__no = l + 1 + curGrid.current.api.getDisplayedRowCount();
        }
    }

    if (!IsAppend) {
        if (!countDatarowIN(newDataG)) 
            setGrid([]);
        else
            setGrid(newDataG);

        return;
    }    

    if (curGrid.current.api.getDisplayedRowCount() == 0) {
        if (countDatarowIN(newDataG)) setGrid(newDataG);
        return;
    }

    if (countDatarowIN(newDataG))
        doAppend(curGrid, setGrid, [...newDataG]);    
}



export function countDatarow(data: any) {
    return countDatarowIN(data);
}


function countDatarowIN(data: any) {

    if (!data || !data[0]) return false;

    var lstcol = Object.keys(data[0]);
    var lstval = Object.values(data[0]);
    var total = 0;
    for (var i = 0; i < lstcol.length; i++)
        if (lstcol[i] == lstval[i]) total++;

    if (total == lstcol.length) data.splice(0,1);

    return total != lstcol.length;
}




//export function getColumns(ref: any) {

//    var columnDefs: any = [];
//    if (ref && ref[0]) {
//        var row = ref[0];

//        var columnNames = Object.keys(row);
//        for (var j = 0; j < columnNames.length; j++) {
//            var value = columnNames[j];
//            var width = 60;
//            var tmpwwith = width;

//            for (var i = 0; i < (ref.length > 20 ? 20 : ref.length); i++) {
//                row = ref[i];
//                try { tmpwwith = row[value].toString().length * 10 } catch { }
//                width = width > tmpwwith ? width : tmpwwith;
//            }

//            if (width > 300) width = 300;

//            if (value) columnDefs.push(
//                {
//                    field: value, headerName: value.replace('_', ' '),
//                    headerClass: "no-leftborder cell-header-group-2",
//                    width: width,
//                }
//            );
//        }

//    }
//    return columnDefs;
//}

//function resizeColumns(columnNames: any, columnsState: any, curGrid:any) {

//    var i = 0;
//    curGrid.current.api.forEachNode(function (a: any, b: any) {
//        i++;
//        if (i > 20) return;

//        if (a && a.data) {
//            for (var j = 0; j < columnNames.length; j++) {
//                var col = columnNames[j].field;
//                //var value = a.data[col];
//                var width = 60;
//                var tmpwwith = columnNames[j].width;

//                    var row = a.data;
//                    try { tmpwwith = row[col].toString().length * 10 } catch { }
//                    width = width > tmpwwith ? width : tmpwwith;

//                if (width > 300) width = 300;
//                columnNames[j].width = width;
//            }
//        }

//        if (i == curGrid.current.api.getDisplayedRowCount()) columnsState(columnNames);
//    });


//}




export function changeColumns( columnsState: any, ref: any, hideCol: any = [], headerName:any=[] , centerCol: any = [],
                                editCol: any = [], cellEditor: any = [], cellEditorParams: any = [])
{
    var columnDefs:any = [];
    if (ref && ref[0])
    {
        var row = ref[0];

        var columnNames = Object.keys(row);
        for (var j = 0; j < columnNames.length;j++)
        {
            var value = columnNames[j];
            var width = 60;      
            var tmpwwith = width;

            for (var i = 0; i < (ref.length > 20 ? 20 : ref.length); i++) {
                row = ref[i];                
                try { tmpwwith = row[value].toString().length * 10 } catch { }
                width = width > tmpwwith ? width : tmpwwith; 
            }

            if (width > 300) width = 300;

            if (value) columnDefs.push(
                {
                    field: value,
                    headerName: (headerName[value] || value.replace('_', ' ')),
                    colId: value,
                    headerClass: "no-leftborder cell-header-group-2",
                    width: (width < 80 ? 80 : width),                    
                    hide: hideCol[value] ? true : false,
                    cellStyle: centerCol[value] ? { textAlign: 'center' } : {},
                    editable: editCol[value] ? true : false,
                    cellEditor: cellEditor[value] ? cellEditor[value]:"",
                    cellEditorParams: cellEditorParams[value] ? cellEditorParams[value] : {},
                    //valueSetter: (cellEditorParams[value] ? cellEditorParams[value] : (params: any) => {  //to make sure user entered number only
                    //    console.log(params);
                    //    var newValInt = parseFloat(params.newValue);
                    //    var valueChanged = params.newValue == newValInt;
                    //    console.log(newValInt,'----',valueChanged);
                       
                    //        params.newValue = valueChanged ? newValInt : params.oldValue;
                        
                    //    params.api.refreshCells({ force: true });
                    //    return params;
                    //}),
                }
            );
        }
    }

    
    var lstcol:any = [];
    if (columnDefs && columnDefs.length ) {
        lstcol = Object.keys(columnDefs[0]);
        if (lstcol.length > 0 && !lstcol.includes("__no"))
            columnDefs.splice(0, 0,
                {
                    field: "__no", headerName: "No.",
                    headerClass: "no-leftborder cell-header-group-2",
                    width: 60,
                    hide: hideCol["__no"] ? true : false,
                });
    }
    if (columnDefs && columnDefs.length && lstcol.length>1)
        columnsState(columnDefs);

    return columnDefs;
}


export default iGridBase;

