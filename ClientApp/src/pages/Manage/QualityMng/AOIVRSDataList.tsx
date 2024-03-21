import { useEffect, useRef, useState } from "react";
import { Button, Col, Input, Label, Modal, Row, Table } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary, contentType } from "../../../common/types";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { columnCountDefs, columnErrorDefs, columnDetailDefs, ngTypes } from "./AOIVRSDataDefs";
import moment from "moment";
import GridBase from "../../../components/Common/Base/GridBase";
import { CellClickedEvent } from "ag-grid-community";
import api from "../../../common/api";

import AutoCombo from "../../../components/Common/AutoCombo";
import Select from "../../../components/Common/Select";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../../common/utility";
import { showProgress } from "../../../components/MessageBox/Progress";
import { alertBox } from "../../../components/MessageBox/Alert";
import { currencyFormat, dateFormat, devideFormat, nullGuard, percentFormat } from "../../../common/utility";

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
    const result = await refetch();
    if(result.data) {
      const ngcountlist: Dictionary[] = result.data;

      setCountList(result.data);

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

  return (
    <>

<ListBase
        folder="Quality Management"
        title="AOI/VRS"
        postfix="검사DATA조회"
        icon="check-square"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <div>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "250px" }} placeholder="제품코드" mapCode="item" />
              </div>
              <div>
                <Input name="itemName" placeholder="제품명" style={{ width: "250px"}} />
              </div>
              <div>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder="모델코드" mapCode="model" />
              </div>
              <div>
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder="장비코드" mapCode="eqp" />
              </div>
              <div>
                <Input name="workorder" placeholder="BATCH" style={{ minWidth: "236px" }} />
              </div>
              <div>
                <AutoCombo name="appCode" sx={{ minWidth: "170px" }} placeholder="어플리케이션" mapCode="app" />
              </div>
              <div>
                <Input name="ngName" type="text" placeholder="불량명" />
              </div>
              <div>
                <Row>
                  <Col style={{ minWidth: "70px"}} className="text-end">
                    <Label htmlFor="groupby" className="form-label">조회기준:</Label>
                  </Col>
                  <Col style={{ minWidth: "100px" }}>
                    <Select name="groupby" label="조회기준" placeholder="조회기준" defaultValue="LOT" mapCode="code" category="BBT_GROUPBY" required={true} className="form-select" />
                  </Col>
                </Row>
              </div>
            </div>
          </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Row style={{ height: "60%" }}>
              <Col md='12' style={{ height: "100%" }}>
                  <GridBase
                    ref={gridCountRef}
                    columnDefs={columnCountDefs}
                    className="ag-grid-bbt"
                    containerId="grid-bbt-wrap"
                    alwaysShowHorizontalScroll={true}
                    onCellClicked={cellClick}
                    wrapHeaderText= {true}
                    autoHeaderHeight= {true}
                    onGridReady={() => {
                      setCountList([]);
                    }}
                  />
              </Col>
            </Row>
          <Row style={{ height: "40%", paddingTop: '1px' }}>
            <Col md='5' style={{ height: '90%' }}>
                <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderTop: 'solid 1px #ccc' }}>
                  <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px' }} id="workorderTitle">Batch Information</h5></div>
                    <div style={{ textAlign: 'right', width: '80px', paddingTop: '8px' }}>
                      <Button size="sm" type="button" color="primary" onClick={excelPanelListHandler}>
                        <i className="mdi mdi-file-excel me-1"></i> Excel
                      </Button>
                    </div>
                </div>
                <Row style={{ height: '100%' }}>
                  <Col>
                    <GridBase
                      ref={gridErrorRef}
                      columnDefs={columnErrorDefs}
                      className="ag-grid-bbt"
                      containerId="grid-bbt-wrap"
                      alwaysShowHorizontalScroll={true}
                      onCellClicked={errorClick}
                      onGridReady={() => {
                        setErrorList([]);
                      }}
                    />
                  </Col>
                </Row>
            </Col>
            <Col md='7' style={{ height: '90%' }}>
              <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderBottom: 'solid 1px #ccc' }}>
                  <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px'  }} id="panelTitle">Panel Information</h5></div>
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
                      // onCellClicked={detailClick}
                      onGridReady={() => {
                        setDetailList([]);
                      }}
                  />
            </Col>
          </Row>
        </Row>
        </ListBase>
      {/* <ListBase
        folder="Quality Management"
        title="AOI/VRS"
        postfix="검사DATA조회"
        icon="check-square"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <div>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "250px" }} placeholder="제품코드" mapCode="item" />
              </div>
              <div>
                <Input name="itemName" placeholder="제품명" style={{ width: "250px"}} />
              </div>
              <div>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder="모델코드" mapCode="model" />
              </div>
              <div>
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder="장비코드" mapCode="eqp" />
              </div>
              <div>
                <Input name="workorder" placeholder="BATCH" style={{ minWidth: "236px" }} />
              </div>
              <div>
                <AutoCombo name="appCode" sx={{ minWidth: "170px" }} placeholder="어플리케이션" mapCode="app" />
              </div>
              <div>
                <Input name="ngName" type="text" placeholder="불량명" />
              </div>
              <div>
                <Row>
                  <Col style={{ minWidth: "70px"}} className="text-end">
                    <Label htmlFor="groupby" className="form-label">조회기준:</Label>
                  </Col>
                  <Col style={{ minWidth: "100px" }}>
                    <Select name="groupby" label="조회기준" placeholder="조회기준" defaultValue="LOT" mapCode="code" category="BBT_GROUPBY" required={true} className="form-select" />
                  </Col>
                </Row>
              </div>
            </div>
          </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Col md='8' style={{ height: "100%" }}>
              <GridBase
                ref={gridCountRef}
                columnDefs={columnCountDefs}
                className="ag-grid-bbt"
                containerId="grid-bbt-wrap"
                alwaysShowHorizontalScroll={true}
                onCellClicked={cellClick}
                onGridReady={() => {
                  setCountList([]);
                }}
              />
          </Col>
          <Col md='4' style={{ height: '100%' }}>
                <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderTop: 'solid 1px #ccc' }}>
                  <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px' }} id="workorderTitle">Batch Information</h5></div>
                    <div style={{ textAlign: 'right', width: '80px', paddingTop: '8px' }}>
                      <Button size="sm" type="button" color="primary" onClick={excelPanelListHandler}>
                        <i className="mdi mdi-file-excel me-1"></i> Excel
                      </Button>
                    </div>
                </div>
                <Row style={{ height: '42%' }}>
                  <Col>
                    <GridBase
                      ref={gridErrorRef}
                      columnDefs={columnErrorDefs}
                      className="ag-grid-bbt"
                      containerId="grid-bbt-wrap"
                      alwaysShowHorizontalScroll={true}
                      onCellClicked={errorClick}
                      onGridReady={() => {
                        setErrorList([]);
                      }}
                    />
                  </Col>
                  </Row>
                <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderBottom: 'solid 1px #ccc' }}>
                  <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px'  }} id="panelTitle">Panel Information</h5></div>
                  <div style={{ textAlign: 'right', width: '80px', paddingTop: '8px' }}>
                    <Button size="sm" type="button" color="primary" onClick={excelByPanelHandler}>
                      <i className="mdi mdi-file-excel me-1"></i> Excel
                    </Button>
              </div>
            </div>
            <Row style={{ height: 'calc(100% - 42% - 80px)', width: 'calc(100% + 10px)' }}>
              <Col>
                <GridBase
                      ref={gridDetailRef}
                      columnDefs={columnDetailDefs}
                      className="ag-grid-bbt"
                      containerId="grid-bbt-wrap"
                      alwaysShowHorizontalScroll={true}
                      // onCellClicked={detailClick}
                      onGridReady={() => {
                        setDetailList([]);
                      }}
                    />
                </Col>
              </Row>
            </Col>
          </Row>
        </ListBase> */}

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