import { useEffect, useCallback, useRef, useState } from "react";
import { Button, Col, Input, Label, Modal, Row, Table } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary, contentType } from "../../common/types";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";

import moment from "moment";
import GridBase from "../../components/Common/Base/GridBase";
import { CellClickedEvent } from "ag-grid-community";
import api from "../../common/api";

//import AutoCombo from "../../components/Common/AutoComboByCode";
import Select from "../../components/Common/Select";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../common/utility";
import { showProgress } from "../../components/MessageBox/Progress";
import { alertBox } from "../../components/MessageBox/Alert";
import { currencyFormat, dateFormat, devideFormat, nullGuard, percentFormat } from "../../common/utility";


//import { GenderRenderer } from './gender';


export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'H/P Profile Chart',
        },
    },
};


const ModelMasterChecksheet = () => {
    const [searchRef, getSearch] = useSearchRef();

    const [gridCountRef, setCountList] = useGridRef();


    const [modal_center, setmodal_center] = useState(false);
    const [ngData, setNgdata] = useState<Dictionary>([]);
    const workorder = useRef<string | null>(null);
    const panelId = useRef<string | null>(null);
    const eqpCode = useRef<string | null>(null);
    const eqpName = useRef<string | null>(null);
    const modelCode = useRef<string | null>(null);
    const operCode = useRef<string | null>(null);

    const { refetch } = useApi("NewModelCheckSheet", getSearch, gridCountRef);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas: HTMLCanvasElement | null = null;
    let context: CanvasRenderingContext2D | null | undefined = null;
    let image = new Image();

    function dhxSerializeGridToJson(grid: any) {
        var json: any = {};
        grid.forEachRow(function (id: any) {
            json[id] = [];
            grid.forEachCell(id, function (cellObj: any, ind: any) {
                json[id][ind] = grid.cells(id, ind).getValue();
            });
        });
        return JSON.stringify(json);
    }

    const searchHandler = async (_?: Dictionary) => {


        // var myjson = dhxSerializeGridToJson(gridCountRef.current);
        //var myjson = dhxSerializeGridToJson(gridCountRef);

        const result = await refetch();
        if (result.data) {
            // const ngcountlist: Dictionary[] = result.data;

            for (var i = 0; i < result.data.length; i++)
                if (result.data[i].sort == 0) {
                    result.data[i].sort = 'TTL';
                    break;
                }

            setCountList(result.data);


            //const headerRow: Dictionary = {
            //  panelQty: 0,
            //  ngPcsTotal: 0,
            //  pcsTotal: 0,
            //  ngCnt: 0
            //}

            //ngTypes.forEach(ng=> {
            //  headerRow[ng.field] = 0;
            //});

            //if(ngcountlist.length) {
            //  ngcountlist.forEach((item) => {
            //    headerRow.itemName = "Total";
            //    headerRow.panelQty += item.panelQty;
            //    headerRow.ngPcsTotal += item.ngPcsTotal;
            //    headerRow.pcsTotal += item.pcsTotal;
            //    headerRow.ngCnt += item.ngCnt;

            //    //ngTypes.forEach(ng=> {
            //    //  headerRow[ng.field] += item[ng.field];
            //    //});
            //  });

            //  gridCountRef.current!.api.setPinnedTopRowData([headerRow]);
            //}
        }
    }

    const drawImage = (ctx: CanvasRenderingContext2D | null | undefined, img: HTMLImageElement) => {
        ctx?.drawImage(img, 0, 0);
    };

    const cellClick = async (e: CellClickedEvent) => {
        const params = getSearch();

        const el = document.getElementById('workorderTitle');
        if (el && el !== undefined) {
            el.innerText = e.data!.workorder + ' Batch Information';
        }

        workorder.current = e.data!.workorder;
        eqpCode.current = e.data!.eqpCode;
        eqpName.current = e.data!.eqpName;
        modelCode.current = e.data!.modelCode;
        operCode.current = e.data!.operCode;


        // setPanelList([])

        const elPanelId = document.getElementById('panelTitle');
        if (elPanelId && elPanelId !== undefined) {
            elPanelId.innerText = 'Panel Information';
        }
        // const elscanTime = document.getElementById('scanTimeTitle');
        // if (elscanTime && elscanTime !== undefined) { 
        //   elscanTime.innerText = "";
        // }
        // const elRolllId = document.getElementById('rollIdTitle');
        // if (elRolllId && elRolllId !== undefined) { 
        //   elRolllId.innerText = "Roll ID";
        // }
        // const elEqpName = document.getElementById('eqpNameTitle');
        // if (elEqpName && elEqpName !== undefined) { 
        //   elEqpName.innerText = "";
        // }
        const result = await api<any>("get", "aoivrsdata/nglist", {
            fromDt: params.fromDt,
            toDt: params.toDt,
            workorder: e.data.workorder,
            modelCode: e.data.modelCode,
            eqpCode: e.data.eqpCode,
            eqpName: e.data.eqpName,
            operCode: e.data.operCode
        });

        //if(result.data) setErrorList(result.data);
    }

    const errorClick = async (e: CellClickedEvent) => {
        const params = getSearch();

        const elPanelId = document.getElementById('panelTitle');

        if (elPanelId && elPanelId !== undefined) {
            elPanelId.innerText = e.data!.pnlId + ' Information';
        }

        //setDetailList([]);

        //showLoading(gridDetailRef, true);

        // const elscanTime = document.getElementById('scanTimeTitle');

        // if (elscanTime && elscanTime !== undefined) { 
        //   elscanTime.innerText = e.data!.scanDt??'';
        // }

        // const elRolllId = document.getElementById('rollIdTitle');

        // if (elRolllId && elRolllId !== undefined) { 
        //   elRolllId.innerText = 'Roll ID ' + e.data!.rollId??'';
        // }
        // const elEqpName = document.getElementById('eqpNameTitle');

        // if (elEqpName && elEqpName !== undefined) { 
        //   elEqpName.innerText = e.data!.eqpName??'';
        // }

        panelId.current = e.data!.pnlId;
        eqpCode.current = e.data!.eqpCode;
        eqpName.current = e.data!.eqpName;
        modelCode.current = e.data!.modelCode;
        operCode.current = e.data!.operCode;

        const result = await api<any>("get", "aoivrsdata/bypanel", {
            fromDt: params.fromDt,
            toDt: params.toDt,
            pnlId: e.data.pnlId,
            workorder: e.data.workorder,
            operCode: e.data.operCode,
            modelCode: e.data.modelCode,
            eqpCode: e.data.eqpCode,
            eqpName: e.data.eqpName
        });

        //if(result.data) setDetailList(result.data);
    };

    // const detailClick = (e: CellClickedEvent) => {
    //     if(e.data && e.data.filelocation) {
    //       setNgdata(e.data);
    //       tog_center(e.data);
    //     }
    //   }

    //   const tog_center = (e: any) => {
    //     setmodal_center(!modal_center);

    //     image.onload = () => {
    //       canvas = canvasRef.current!;
    //       context = canvas.getContext("2d");

    //       canvasRef.current!.width = image.width;
    //       canvasRef.current!.height = image.height;

    //       drawImage(context, image);
    //     }

    //     image.src = "http://172.20.1.14/downloads" + e.filelocation;
    //   }

    function onchangeValue(e: any, e1: any) {
       
        const target = document.getElementsByName("eqp_description").length ? document.getElementsByName("eqp_description")[0] : "";
        if (target) {
            target.textContent = e1 ? e1.label : "";
            target.innerText = e1 ? e1.label : "";
        }
    }


    function onchangeModel(e: any, e1: any) {
       
        const target = document.getElementsByName("model_description").length ? document.getElementsByName("model_description")[0] : "";
        if (target) {
            target.textContent = e1 ? e1.label : "";
            target.innerText = e1 ? e1.label : "";
        }
    }


    const excelHandler = async (e: any) => {
        e.preventDefault();

        if (gridCountRef.current!.api.getDisplayedRowCount() <= 0) {
            alertBox("데이터가 없습니다.");
            return;
        }

        const param = getSearch();
        param.isExcel = true;

        const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
        startFakeProgress();

        const result = await api<any>("download", "aoivrsdata", param);
        downloadFile(`AOI_VRS검사DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

        hideProgress();
    }

    const excelPanelListHandler = async (e: any) => {
        e.preventDefault();

        if (gridCountRef.current!.api.getDisplayedRowCount() <= 0) {
            alertBox("데이터가 없습니다.");
            return;
        }

        const param = getSearch();
        param.isExcel = true;
        param.workorder = workorder.current;
        param.eqpCode = eqpCode.current;
        param.eqpName = eqpName.current;
        param.operCode = operCode.current;
        param.modelCode = modelCode.current;

        const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
        startFakeProgress();

        const result = await api<any>("download", "aoivrsdata/nglist", param);
        downloadFile(`AOI_VRS검사DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

        hideProgress();
    }

    const excelByPanelHandler = async (e: any) => {
        e.preventDefault();

        if (gridCountRef.current!.api.getDisplayedRowCount() <= 0) {
            alertBox("데이터가 없습니다.");
            return;
        }

        const param = getSearch();
        param.isExcel = true;
        param.pnlId = panelId.current;
        param.workorder = workorder.current;
        param.eqpCode = eqpCode.current;
        param.eqpName = eqpName.current;
        param.operCode = operCode.current;
        param.modelCode = modelCode.current;

        const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
        startFakeProgress();

        const result = await api<any>("download", "aoivrsdata/bypanel", param);
        downloadFile(`AOI_VRS검사DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

        hideProgress();
    }



    const css = `
 
     label{         
           width: 248px;           
           height:25px !important;
           padding-left:10px;
     }

     table,tr,td{
         border:lightgray 1px solid;
         border-collapse: collapse;
     }

     .form-label
        {
          display: inline-block;
          padding-top: 8px !important;
        }

        .search-button-row{
            max-width: 360px !important;
        }

        .textcenter{
            text-align:center !important;
        }
        `




    const columnCountDefs = [
        {
            field: "sort", headerName: "No.", width: 50, headerClass: "no-leftborder cell-header-group-2 ",

        },
        {
             field: "BOM_ITEM_CODE", headerName: "New Model Code", width: 200, headerClass: "no-leftborder cell-header-group-2",

         },
         {
             field: "BOM_ITEM_DESCRIPTION", headerName: "New Model Name", width: 280, headerClass: "no-leftborder cell-header-group-2",
    
         },
         {
             field: "CREATION_DATE", headerName: "Creation Date", width: 190, headerClass: "no-leftborder cell-header-group-2",

         },
         {
             field: "Total", headerName: "Total", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter"
                         , cellStyle: { textAlign: 'center' }
         },
         {
             field: "recipe", headerName: "Recipe", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",
             /*cellRenderer: GenderRenderer,*/
             cellEditor: 'agSelectCellEditor',
             cellEditorParams: {
                 
                 values: ["OK", "NG"],
             },
             editable: true
             , cellStyle: { textAlign: 'center' }
         },
         {
             field: "gbr_data", headerName: "GBR Data", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",
             
             cellEditor: 'agSelectCellEditor',
             cellEditorParams: {
                
                 values: ["OK", "NG"],
             },
             editable: true
             , cellStyle: { textAlign: 'center' }
         },
         {
             field: "bbt_no", headerName: "BBT no", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",
            
             cellEditor: 'agSelectCellEditor',
             cellEditorParams: {
                
                 values: ["OK", "NG"],
             },
             editable: true
             , cellStyle: { textAlign: 'center' }
         },
         {
             field: "black_hold_align", headerName: "black Hold Align", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",
            
             cellEditor: 'agSelectCellEditor',
             cellEditorParams: {
             
                 values: ["OK", "NG"],
             },
             editable: true
             , cellStyle: { textAlign: 'center' }
        },
        {
            field: "spc", headerName: "SPC", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {

                values: ["OK", "NG"],
            },
            editable: true
            , cellStyle: { textAlign: 'center' }
        },
         {
             field: "other", headerName: "Other", width: 125, headerClass: "no-leftborder cell-header-group-2 textcenter",
             cellEditor: 'agSelectCellEditor',
             cellEditorParams: {

                 values: ["OK", "NG"],
             },

             editable: true
             , cellStyle: { textAlign: 'center' }
         },
    ]

    // set background colour on every row, this is probably bad, should be using CSS classes
    const rowStyle = { background: 'white' };

    // set background colour on even rows again, this looks bad, should be using CSS classes
    const getRowStyle = (params: any) => {
       
        if (params.node.data.Total == "OK") {
            return { background: 'lightgreen' };
        }
        if (params.node.data.sort == "TTL") {
            return { background: '#f8f8f8' };
        }
    };  



    const changerows: any = [];


    const onCellEditingStopped = useCallback( (event: any) => {

        //var cellDefs:any = gridCountRef.current!api.getEditingCells();

        var data = { ...event.data };
        var modelcode = data.BOM_ITEM_CODE;
        var changecol = event.column.colId;

        //console.log('-------------------', changecol);


        for (var i = 0; i < columnCountDefs.length; i++) {
            var field = columnCountDefs[i].field;
            data[field] = data[field] || '';
        }

        for (var key in data) {
            if (key != changecol) data[key] = '';
            else {
                data.valu = data[key];
                data.type = changecol;
            }
        }

        data.model_code = modelcode;

        data.changedtime = new Date();
        changerows.push(data);

        //const result = await api<any>("post", "NewModelCheckSheet/save", data);
        //data.success = result.data;               
        //event.node.setDataValue(event.column.colId, (parseFloat(event.newValue) || '' ));
        //event.api.refreshCells({ force: true });
        //return event;
    }, []);

    async function postHandler(changerows: any) {
       
        if (!changerows) return;
        if (!changerows.length) return;
        var keeprows = changerows.filter((x: any) => { return (x.keep && !x.success) });
        var result: any = [];

        for (var i = 0; i < keeprows.length; i++) {
            if (!keeprows[i].model_code || !keeprows[i].type) continue;
            var res = await api<any>("post", "NewModelCheckSheet/save", keeprows[i]);
            result.push(res.data);
          
            keeprows[i].success = res.data;
        }

        if (!result) return;
        if (!result.length) return;

        var done = result.reduce((acc: any, cur: any) => {            
            return (!acc ? 1 : acc && acc>0 ) && (cur && cur > 0)
        });
               
        if (done) {
            await postHandler(keeprows);
            searchHandler();
        }
        else {
            alertBox('Save Failed(실패한), please try again!!');            
        }
    }


    function saveHandler()
    {        
        
        gridCountRef.current?.api.clearFocusedCell();
        //gridCountRef.current?.api.clearFocusedCell();
        //console.log(gridCountRef.current?.api.getEditingCells());

        setTimeout(async function () {
            changerows.push({ model_code :'',type:'',success:1});
            for (var i = 0; i < changerows.length - 1; i++)
                for (var j = i + 1; j < changerows.length; j++) {
                    var max = i;
                    if (changerows[i].model_code == changerows[j].model_code
                        && changerows[i].type == changerows[j].type) {
                        if (changerows[i].changedtime < changerows[j].changedtime)
                            max = j;
                    }
                    changerows[max].keep = 1;
                }
            await postHandler(changerows);
        }, 500);
    }




  return (
      <>
          <style>
              {css}
          </style>
<ListBase
        folder="RMS"
        title="New Model Check Sheet"
              postfix="New Model Check Sheet"
        icon="check-square"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                    <Button type="button" color="outline-primary" onClick={saveHandler}>
                        <i className="uil uil-check me-2"></i>{"SAVE"}
                  
                    </Button>      

              </>
            }
               
            >
            {/*    <table className="search-row"  >*/}
            {/*        <tbody >*/}
            {/*    <tr>*/}
            {/*    */}{/*    <td style={{ maxWidth: "115px", display:"none" }}>*/}
            {/*    */}{/*<DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />*/}
            {/*    */}{/*        </td>*/}
          
            {/*          <td>.</td>*/}
                       
            {/*            </tr>*/}
            {/*    </tbody >*/}
            {/*</table>*/}
          </SearchBase>
        }>

              <Row style={{ height: "100%" }}>
                  <Col md='12' style={{ height: "100%" }}>
                      <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px'  }} id="panelTitle">Model Information</h5></div>
                  <GridBase
                    ref={gridCountRef}
                    columnDefs={columnCountDefs}
                    className="ag-grid-bbt"
                    containerId="grid-bbt-wrap"
                    alwaysShowHorizontalScroll={true}
                          rowStyle={rowStyle}
                          getRowStyle={getRowStyle}
                    wrapHeaderText= {true}
                              autoHeaderHeight={true}
                          onCellEditingStopped={onCellEditingStopped}
                    onGridReady={() => {
                      setCountList([]);
                    }}
                  />
                      </Col>

                  
            </Row>
        
        
        </ListBase>
     

    </>
  )
}

export default ModelMasterChecksheet;