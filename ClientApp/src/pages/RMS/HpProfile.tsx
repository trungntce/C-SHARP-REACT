import { useEffect, useCallback, useRef, useState } from "react";
import { Button, Col, Input, Label, Modal, Row, Table } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary, contentType } from "../../common/types";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { columnCountDefs, columnErrorDefs, columnDetailDefs, ngTypes } from "./HpProfileDefs";
import moment from "moment";
import GridBase from "../../components/Common/Base/GridBase";
import { CellClickedEvent } from "ag-grid-community";
import api from "../../common/api";

import AutoCombo from "../../components/Common/AutoCombo";
import Select from "../../components/Common/Select";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../common/utility";
import { showProgress } from "../../components/MessageBox/Progress";
import { alertBox } from "../../components/MessageBox/Alert";
import { currencyFormat, dateFormat, devideFormat, nullGuard, percentFormat } from "../../common/utility";



import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


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


const labels = ['1', '6', '21', '36', '41', '91', '131', '156','161'];
//const labels2 = ['1', '6', '36', '41', '91', '131', '156', '161'];


export const data = {
    labels,
    datasets: [
        {
            label: 'Temp',
            data: [60, 110 , 160, 160, 180, 180, 180, 60, 60],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Press',
            data: [10,10,10,10,42,42,42,42,42],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};


const AOIVRSDataList = () => {
  const [searchRef, getSearch] = useSearchRef();

  const [gridCountRef, setCountList] = useGridRef();
  const [gridErrorRef, setErrorList] = useGridRef();
  const [gridDetailRef, setDetailList] = useGridRef();
  // const [panelList, setPanelList] = useState<any | null>([]);
  const [modal_center, setmodal_center] = useState(false);
  const [ngData, setNgdata] = useState<Dictionary>([]);
  const workorder = useRef<string | null>(null);
  const panelId = useRef<string | null>(null);
  const eqpCode = useRef<string | null>(null);
  const eqpName = useRef<string | null>(null);
  const modelCode = useRef<string | null>(null);
  const operCode = useRef<string | null>(null);

  const { refetch } = useApi("aoivrsdata", getSearch, gridCountRef);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null | undefined = null;
  let image = new Image();

  const searchHandler = async (_?: Dictionary) => {
      const result = { data: []  };// await refetch();
    if(result.data) {
      const ngcountlist: Dictionary[] = result.data;

        const demodata = [{ 'step_name': 'STEP 1', 'temperature': '60', 'temp_during': '1', 'pressure': '10', 'pres_during': '1', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 2', 'temperature': '160', 'temp_during': '20', 'pressure': '10', 'pres_during': '5', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 3', 'temperature': '160', 'temp_during': '15', 'pressure': '10', 'pres_during': '30', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 4', 'temperature': '180', 'temp_during': '5', 'pressure': '42', 'pres_during': '5', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 5', 'temperature': '180', 'temp_during': '50', 'pressure': '42', 'pres_during': '50', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 6', 'temperature': '180', 'temp_during': '40', 'pressure': '42', 'pres_during': '40', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 7', 'temperature': '60', 'temp_during': '25', 'pressure': '42', 'pres_during': '25', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 8', 'temperature': '60', 'temp_during': '5', 'pressure': '42', 'pres_during': '5', 'dimensionA': '5', 'dimensionB': '5', 'dimensionC': '8', 'dimensionD': '8', 'dimensionE': '15' },
            { 'step_name': 'STEP 9', 'temperature': '', 'temp_during': '', 'pressure': '', 'pres_during': '', 'dimensionA': '', 'dimensionB': '', 'dimensionC': '', 'dimensionD': '', 'dimensionE': '' },
            { 'step_name': 'STEP 10', 'temperature': '', 'temp_during': '', 'pressure': '', 'pres_during': '', 'dimensionA': '', 'dimensionB': '', 'dimensionC': '', 'dimensionD': '', 'dimensionE': '' },
            { 'step_name': 'Total', 'temperature': '', 'temp_during': '161', 'pressure': '', 'pres_during': '161', 'dimensionA': '', 'dimensionB': '', 'dimensionC': '', 'dimensionD': '', 'dimensionE': '' },
            
        ]

        setCountList(demodata);

      setErrorList([]);

      setDetailList([]);
      
      //setPanelList([])

      const el = document.getElementById('workorderTitle');
      if (el && el !== undefined) { 
        el.innerText = 'Batch Information';
      }
      const elPanelId = document.getElementById('panelTitle');
      if (elPanelId && elPanelId !== undefined) { 
        elPanelId.innerText = 'Panel Information';
      }
      const elscanTime = document.getElementById('scanTimeTitle');
      if (elscanTime && elscanTime !== undefined) { 
        elscanTime.innerText = "";
      }
      const elRolllId = document.getElementById('rollIdTitle');
      if (elRolllId && elRolllId !== undefined) { 
        elRolllId.innerText = "Roll ID";
      }
      const elEqpName = document.getElementById('eqpNameTitle');
      if (elEqpName && elEqpName !== undefined) { 
        elEqpName.innerText = "";
      }
      
      const headerRow: Dictionary = {
        panelQty: 0,
        ngPcsTotal: 0,
        pcsTotal: 0,
        ngCnt: 0
      }

      ngTypes.forEach(ng=> {
        headerRow[ng.field] = 0;
      });

      if(ngcountlist.length) {
        ngcountlist.forEach((item) => {
          headerRow.itemName = "Total";
          headerRow.panelQty += item.panelQty;
          headerRow.ngPcsTotal += item.ngPcsTotal;
          headerRow.pcsTotal += item.pcsTotal;
          headerRow.ngCnt += item.ngCnt;

          ngTypes.forEach(ng=> {
            headerRow[ng.field] += item[ng.field];
          });
        });

        gridCountRef.current!.api.setPinnedTopRowData([headerRow]);
      }
    }
  }

  const drawImage = (ctx: CanvasRenderingContext2D | null | undefined, img: HTMLImageElement) => {
    ctx?.drawImage(img, 0, 0);
};

// const getPanelRowData = (panelList?: any) => {
//   if (null === panelList || panelList.length < 2) {
//     return <></>;
//   }
//   const pieces = panelList[0];
//   const opers = panelList[1];
//   const len = opers.length < pieces.length ? pieces.length : opers.length;

//   const panels = [];
//   for (let i = 0; i < len; i++) {
//     panels.push({
//       row_id: i === 0 ? 'NO' : (pieces[i - 1]?.row_id ?? ''),
//       filelocation: i === 0 ? '' : (pieces[i - 1]?.filelocation ?? ''),
//       ng_name: i === 0 ? '불량항목' : (pieces[i - 1]?.ng_name ?? ''),
//       pnl_dpu: i === 0 ? 'PNL DPU' : (pieces[i - 1]?.ng_cnt ?? ''),
//       error_rate: i === 0 ? '불량 점유율' : (devideFormat(pieces[i - 1]?.ng_cnt, pieces[i - 1]?.ng_total) ?? ''),
//       oper_seq_no: opers[i]?.oper_seq_no ?? '',
//       oper_description: opers[i]?.oper_description ?? '',
//       eqp_description: opers[i]?.eqp_description ?? ''
//     });
//   }

//   return panels.map((item: any, index: any) => { 
//     return <tr key={index} onClick={(e: any) => detailClick(pieces, index - 1)}>
//       <td>{ item.row_id }</td>
//       <td>{ item.ng_name }</td>
//       <td>{ item.pnl_dpu }</td>
//       <td>{ item.error_rate }</td>
//       <td>{ item.oper_seq_no }</td>
//       <td>{ item.oper_description }</td>
//       <td>{ item.eqp_description }</td>
//     </tr>
//   });
// }

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

    setErrorList([]);

    setDetailList([]);

    showLoading(gridErrorRef, true);

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
    const result = await api<any>("get", "aoivrsdata/nglist" , {
      fromDt: params.fromDt, 
      toDt: params.toDt, 
      workorder: e.data.workorder, 
      modelCode: e.data.modelCode, 
      eqpCode: e.data.eqpCode, 
      eqpName: e.data.eqpName, 
      operCode: e.data.operCode
    });
    
    if(result.data) setErrorList(result.data);
  }

  const errorClick = async (e: CellClickedEvent) => { 
    const params = getSearch();

    const elPanelId = document.getElementById('panelTitle');

    if (elPanelId && elPanelId !== undefined) { 
      elPanelId.innerText = e.data!.pnlId + ' Information';
    }

    setDetailList([]);

    showLoading(gridDetailRef, true);

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

    const result = await api<any>("get", "aoivrsdata/bypanel" , {
      fromDt: params.fromDt, 
      toDt: params.toDt, 
      pnlId: e.data.pnlId, 
      workorder: e.data.workorder, 
      operCode: e.data.operCode, 
      modelCode: e.data.modelCode, 
      eqpCode: e.data.eqpCode, 
      eqpName: e.data.eqpName
    });

    if(result.data) setDetailList(result.data);
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
        console.log(e, e1);
        //console.log(e.currentTarget);
        const target = document.getElementsByName("eqp_description").length ? document.getElementsByName("eqp_description")[0] :"";
        if (target) {
            target.textContent = e1 ? e1.label : "";
            target.innerText = e1 ? e1.label : "";           
        }
    }


    function onchangeModel(e: any, e1: any) {
        console.log(e, e1);
        //console.log(e.currentTarget);
        const target = document.getElementsByName("model_description").length ? document.getElementsByName("model_description")[0] : "";
        if (target) {
            target.textContent = e1?e1.label:"";
            target.innerText = e1 ? e1.label : "";
        }
    }


  const excelHandler = async(e:any) => {
    e.preventDefault();

    if(gridCountRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox("데이터가 없습니다.");
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","aoivrsdata",param);
    downloadFile(`AOI_VRS검사DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  const excelPanelListHandler = async(e:any) => {
    e.preventDefault();

    if(gridCountRef.current!.api.getDisplayedRowCount() <= 0)
    {
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

    const result = await api<any>("download","aoivrsdata/nglist",param);
    downloadFile(`AOI_VRS검사DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  const excelByPanelHandler = async(e:any) => {
    e.preventDefault();

    if(gridCountRef.current!.api.getDisplayedRowCount() <= 0)
    {
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

    const result = await api<any>("download","aoivrsdata/bypanel", param);
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
        `

    useEffect(() => {
        const hpvalue = document.getElementsByName("hp_type")[0];
        if (hpvalue) hpvalue.textContent = "HP XL";
    });


    const onCellEditingStopped = useCallback((event: any) => {
        //var cellDefs:any = gridCountRef.current!api.getEditingCells();
        console.log('cellEditingStopped', event.column.colId);
        if (event.column.colId == "step_name") return event;

        event.node.setDataValue(event.column.colId, (parseFloat(event.newValue) || '' ));
        event.api.refreshCells({ force: true });
        return event;
    }, []);


  return (
      <>
          <style>
              {css}
          </style>
<ListBase
        folder="RMS"
        title="H/P Profile"
              postfix="H/P Profile"
        icon="check-square"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                        <i className="mdi mdi-file-excel me-1"></i>{"Excel"}
                  
                    </Button>      

                    <Button color="primary" onClick={excelHandler}>
                        <i className="uil uil-check me-2"></i>
                        {"Save"}
                    </Button>

                    <Button type="button" color="outline-primary" onClick={excelHandler} >
                        <i className="uil uil-check me-2"></i>
                        {"Approval"}
                    </Button>
              </>
            }
               
            >
                <table className="search-row"  >
                    <tbody >
                <tr>
                {/*    <td style={{ maxWidth: "115px", display:"none" }}>*/}
                {/*<DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />*/}
                {/*        </td>*/}
          
                        <td >장비코드
                        </td>

                        <td >
                        <AutoCombo name="eqp_code" id="eqp_code" sx={{ width: "250px", display: "inline-block" }} placeholder="장비코드" mapCode="eqp" onChange={onchangeValue}   />
                        </td>

                        <td >
                            모델코드
                        </td>

                        <td >
                        <AutoCombo name="model_code" id="model_code" sx={{ width: "250px", display: "inline-block" }} placeholder="모델코드" mapCode="model" onChange={onchangeModel} />
                        </td>

                        <td >HP Recipe
                        </td>

                        <td>
                        <AutoCombo name="hp_recipe_code" sx={{ width: "250px", display: "inline-block" }} placeholder="HP Recipe Rev" mapCode="revision" />
                        </td>

                   
                    </tr>
                    <tr>
                        <td>
                        장비name
                        </td>
                        <td ><Label name="eqp_description" />
                        </td>
                        <td>
                        모델name
                        </td>
                        <td ><Label name="model_description" />
                        </td>
                        <td>
                         등록자 
                        </td>
                        <td ><Label name="create_user" />
                        </td>

                </tr>
                    <tr>
                        <td>
                        H/P Type 
                        </td>
                        <td ><Label name="hp_type" placeholder="HP XL" defaultValue="HP XL" />
                        </td>
                        <td >
                        </td>
                        <td >
                        </td>
                        <td >
                        </td>
                        <td >
                        </td>
                        </tr>
                </tbody >
            </table>
          </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Row style={{ height: "60%" }}>
                      <Col md='6' style={{ height: "100%" }}>
                          <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px' }} id="panelTitle">Standard Information</h5></div>
                  <GridBase
                    ref={gridCountRef}
                    columnDefs={columnCountDefs}
                    className="ag-grid-bbt"
                    containerId="grid-bbt-wrap"
                    alwaysShowHorizontalScroll={true}
              
                    wrapHeaderText= {true}
                              autoHeaderHeight={true}
                              onCellEditingStopped={onCellEditingStopped}
                    onGridReady={() => {
                      setCountList([]);
                    }}
                  />
                      </Col>

                      <Col md='6' style={{ height: "100%" }}>
                      <Line options={options} data={data} />
                  </Col>
            </Row>
          <Row style={{ height: "40%", paddingTop: '40px' }}>
            
            <Col md='12' style={{ height: '90%' }}>
              <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderBottom: 'solid 1px #ccc' }}>
                  <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px'  }} id="panelTitle">History Information</h5></div>
                  <div style={{ textAlign: 'right', width: '80px', paddingTop: '8px' }}>
                    <Button size="sm" type="button" color="primary" onClick={excelByPanelHandler}>
                      <i className="mdi mdi-file-excel me-1"></i> Excel
                    </Button>
              </div>
              </div>
                <GridBase
                      ref={gridDetailRef}
                              columnDefs={columnDetailDefs}
                      className="ag-grid-bbt"
                      containerId="grid-bbt-wrap"
                      alwaysShowHorizontalScroll={true}
                   
                      onGridReady={() => {
                        setDetailList([]);
                      }}
                  />
            </Col>
          </Row>
        </Row>
        </ListBase>
     

        {/* <Modal
          size="lg"
          isOpen={modal_center}
          toggle={(e: any) => {
            tog_center(e);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">{ngData.ngName}</h5>
            <button
            type="button"
              onClick={() => {
                setmodal_center(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body d-flex justify-content-center align-items-center">
            <canvas ref={canvasRef} />
          </div>
        </Modal>         */}
    </>
  )
}

export default AOIVRSDataList;