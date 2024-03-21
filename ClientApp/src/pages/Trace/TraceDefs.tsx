import { ColDef } from "ag-grid-community";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Button, Popover, PopoverBody, PopoverHeader, Table, UncontrolledPopover, UncontrolledTooltip } from "reactstrap";
import api from "../../common/api";
import { Dictionary } from "../../common/types";
import { dateFormat, dayFormat, executeIdle, percentFormat, floatFormat, devideFormat, currencyFormat, toHHMM } from "../../common/utility";
import LotInfo from "./LotInfo";

export const judgeName = (judge: string) => {
  if(judge == 'O' || judge == 'OK')
    return (<span className="judge-ok">OK</span>);

  if(judge == 'N' || judge == 'NG')
    return (<span className="judge-ng">NG</span>);

  if(judge == 'C' || judge == 'CHK' || judge == 'CHECK')
    return (<span className="judge-chk">CHK</span>);

  if(judge == 'X' || judge == 'X')
    return (<span className="judge-x">X</span>);

  return null;
}

export const operMatterInspYn = (useYn: string) => {
  if(useYn === 'Y')
    return { 
      backgroundColor:"#d9ffd9" ,   //파스텔톤
      // backgroundColor:"#f0f0f0" , //회색
      // backgroundColor:"#aaffaa" ,
      // borderBottom:"1px solid #aaaaaa"
      textAlign: 'center' ,
    };
  return {textAlign: 'center' ,};
}

export const traceDefs = (filter: (list: Dictionary[]) => Dictionary[], method?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    { 
      headerClass: "multi4m", 
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      width: 35
    },
    {
      headerClass: "all",
      cellClass: "cell-operseq",
      field: "operSeqNo",
      headerName: t("@OPER_SEQ"), //"공순",
      width: 70,
      cellStyle: {textAlign: 'right'},
      cellRenderer: (d: any) => {
        return (
          <>
            <span className={d.data.panelId ? "cell-operseq-scan" : ""}>{d.data.operSeqNo || d.data.operSeqNo4M}</span>

            <a id={`trace-popover-rework-${d.data.rowNo}`}>
              { d.data.workType == 'R' ? (<span className="badge bg-success cell-re-ini">RE</span>) : "" }
            </a>
            <UncontrolledPopover 
              trigger="legacy"
              target={`trace-popover-rework-${d.data.rowNo}`}
              placement="right" 
              className="trace-popover-container">
              <PopoverHeader>Equipment Detail</PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    {/* 비코 
                    재처리코드
                    재처리코드명 */}
                    <tr>
                      <th>{t("@REWORK_CODE")}</th>
                      <th>{t("@REWORK_CODE_NAME")}</th>
                      <th>{t('@REMARKS')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{d.data.reworkInitialCode}</td>
                      <td>{d.data.reworkInitialName}</td>
                      <td>{d.data.remark}</td>
                    </tr>
                  </tbody>
                </Table>
              </PopoverBody>
            </UncontrolledPopover>

            <a id={`trace-popover-initial-${d.data.rowNo}`}>
              { d.data.workType == 'I' ? (<span className="badge bg-info cell-re-ini">초</span>) : "" }
            </a>
            <UncontrolledPopover 
              trigger="legacy"
              target={`trace-popover-initial-${d.data.rowNo}`}
              placement="right" 
              className="trace-popover-container">
              <PopoverHeader>Equipment Detail</PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    {/* 초품코드
                    초품코드명
                    비고 */}
                    <tr>
                      <th>{t("@INIT_ITEM_CODE")}</th>
                      <th>{t("@INIT_ITEM_CODE_NAME")}</th>
                      <th>{t("@REMARKS")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{d.data.reworkInitialCode}</td>
                      <td>{d.data.reworkInitialName}</td>
                      <td>{d.data.remark}</td>
                    </tr>
                  </tbody>
                </Table>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        )
      }
    },
    // {
    //   field: "operCode",
    //   headerName: "공정코드",
    //   maxWidth: 70,
    //   cellRenderer: (d: any) => {
    //     return d.data.operCode || d.data.operCode4M
    //   }
    // },    
    {
      headerClass: "all",
      field: "operDescription",
      headerName: t("@COL_OPERATION_NAME"),  //"공정명",
      width: 160,
      tooltipValueGetter: (d:any) => `[${d.data.operCode || d.data.operCode4M}] ${d.data.operDescription || d.data.operDescription4M}`,
      cellRenderer: (d: any) => {
        return (
          <>
            { !d.node.rowPinned && d.data.onhandOperSeqNo == (d.data.operSeqNo || d.data.operSeqNo4M) ? (
                <><i className="fa fa-play text-primary font-size-12"></i>{' '}</>
              ) : "" }
            { d.data.eqpCodeCtq ? (<span className="badge bg-danger cell-ctq">CTQ</span>) : "" }
            { d.data.operDescription || d.data.operDescription4M || d.data.operDescriptionScan }
          </>
        )
      }
    },
    {
      headerClass: "multi4m",
      field: "modelCode",
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      width: 160,
      cellStyle: {textAlign: 'center'},
      tooltipValueGetter: (d:any) => `[${d.data.modelCode}] ${d.data.modelName}`,
      cellRenderer: (d: any) => {
        return (
          <>
            { d.data.modelCode }
          </>
        )
      }
    },    
    {
      headerClass: "item",
      cellClass: "cell-lot",
      field: "workorder4M",
      headerName: "BATCH",
      width: 170,
      cellStyle: {textAlign: 'center'},
      tooltipValueGetter: (d:any) => d.data.workorder4M,
      cellRenderer: (d: any) => {
        const popoverRef = useRef<any>();
        const lotInfoRef = useRef<any>();

        if(!d.data.workorder4M)
          return null;

        const searchHandler = async () => {
          executeIdle(() => {
            lotInfoRef.current.searchLot(null, d.data.workorder4M);
          });          
        }

        if(d.data.workorderJob == d.data.workorder4M){
          return (
            <>
              <span>
                {d.data.workorder4M}
              </span>
            </>);
        }

        return (
          <>
            <a id={`trace-popover-lot-${d.data.rowNo}`} onClick={searchHandler}>
              <i className="fa fa-search text-muted"></i>
              {' '}
              <span>
                {d.data.workorder4M}
              </span>
            </a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`trace-popover-lot-${d.data.rowNo}`}
              placement="right" 
              className="trace-popover-container trace-popover-container-lot">
              <PopoverBody>
                <LotInfo 
                  ref={lotInfoRef}
                />
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" size="sm" color="primary" onClick={() => { window.open(`/trace4m/${d.data.workorder4M}`) }}>
                    <i className="uil uil-external-link-alt me-2"></i> BATCH{t("@HISTORY_TRACKING")}
                  </Button>
                  <Button type="button" size="sm" color="light" onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                  </Button>
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        );
      }
    },
    {
      headerClass: "item",
      cellClass: "cell-panelid",
      field: "panelId",
      headerName: `${t("@ROLL")}/${t("@COL_PANEL_BARCODE")}`, //"롤/판넬바코드",
      width: 220,
      cellStyle: {textAlign: 'center'},
      tooltipValueGetter: (d:any) => d.data.panelId,
      cellRenderer: (d: any) => {
        if(d.data.typeCode)
          return (
            <>
              { d.data.typeCode == 'R' ? (<Badge color="success" pill>R</Badge>) : ""}              
              <span>
              { d.data.deviceId == "AUTO_GEN_ID" ? (<span className="badge bg-success cell-re-ini">A</span>) : null }
              { d.data.deviceId == "AUTO_GEN_BY_LOG" ? (<span className="badge bg-primary cell-re-ini">R</span>) : null }
                {d.data.panelId}
              </span>
            </>
          );

        return null;
      }
    },
    // {
    //   field: "eqpCode",
    //   headerName: "설비코드",
    //   maxWidth: 120,
    // },
    {
      headerClass: "all",
      cellClass: "cell-eqp",
      field: "eqpName",
      headerName: t("@COL_EQP_NAME"), //"설비명",
      width: 135,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
      cellRenderer: (d: any) => {
        if(!d.data.eqpCnt || d.data.eqpCnt <= 1)
          return d.data.eqpName;

        const eqpList = JSON.parse(d.data.eqpJson);
        if(!eqpList || !eqpList.length)
          return d.data.eqpName;

        return (
          <>
            <a id={`trace-popover-eqp-${d.data.rowNo}`}>
              <i className="fa fa-search"></i>
              {' '}
              <span>
                {d.data.eqpName}
              </span>
            </a>
            <UncontrolledPopover 
              trigger="legacy"
              target={`trace-popover-eqp-${d.data.rowNo}`}
              placement="left" 
              className="trace-popover-container">
              <PopoverHeader>Equipment Detail</PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    {/* 설비코드
                    설비명 */}
                    <tr>
                      <th>{t("@COL_EQP_CODE")}</th>
                      <th>{t("@COL_EQP_NAME")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eqpList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>{x["eqp_code"]}</td>
                          <td>{x["eqp_name"]}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        );
      }
    },
    {
      headerClass: "all",
      cellClass: "cell-mat",
      field: "materialName",
      headerName: t("@MATERIAL"), //"자재",
      filter: false,
      width: 45,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.materialYn))
      },
      cellRenderer: (d: any) => {
        if(!d.data.materialCnt)
          return null;

        const materialList = JSON.parse(d.data.materialJson);
        if(!materialList || !materialList.length)
          return null;
        
        const [semiMaterial, setSemiMaterial] = useState<any>([]);
        const [matSubTitle, setMatSubTitle] = useState<string>("");

        const searchHandler = async (material : string) => {
          setMatSubTitle(material);
          
          const result = await api<Dictionary[]>("get", "trace/materialhistory", { workorder : material });
          if(result?.data?.length){
            setSemiMaterial(result.data)
          }
        }

        return (
          <>
            <a id={`trace-popover-material-${d.data.rowNo}`}>
              <span>
                {d.data.materialCnt}
              </span>
              <i className="fa fa-search"></i>
            </a>
            <UncontrolledPopover 
              trigger="legacy"
              target={`trace-popover-material-${d.data.rowNo}`}
              placement="bottom-start" 
              className="trace-popover-container">
              <PopoverHeader>Material Detail</PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    {/*자재BATCH No
                    자재코드
                    자재명
                    MAKER
                    Barcode(분할BATCH)
                    유수명*/}
                    <tr>
                      <th>{t("@MATERIAL")}BATCH No</th>
                      <th>{t("@MATERIAL_CODE")}</th>
                      <th>{t("@MATERIAL_NAME")}</th>
                      <th>MAKER</th>
                      <th>{`Barcode(${t("@SPLIT")}BATCH)`}</th>
                      <th>{t("@QTIME")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          {/* {materialHis[x["material_lot"]] && materialHis[x["material_lot"]].length > 0 ? */}
                          {<td>
                              <a id={`trace-popover-material-depth-${d.data.rowNo}`} onClick={() => searchHandler(x.material_lot)}>
                                {`${x["material_lot"]}   `} 
                                <i className="fa fa-search"></i>
                              </a>
                              <UncontrolledPopover 
                                trigger="legacy"
                                target={`trace-popover-material-depth-${d.data.rowNo}`}
                                placement="bottom-start" 
                                className="trace-popover-container"
                                >
                                <PopoverHeader>{`Material Detail - [ ${matSubTitle} ]`}</PopoverHeader>
                                <PopoverBody>
                                  <Table className="table table-bordered">
                                    <thead className="table-light">
                                      <tr>
                                        <th>{t("@MATERIAL")}BATCH No</th>
                                        <th>{t("@MATERIAL_CODE")}</th>
                                        <th>{t("@MATERIAL_NAME")}</th>
                                        <th>MAKER</th>
                                        <th>{`Barcode(${t("@SPLIT")}BATCH)`}</th>
                                        <th>{t("@QTIME")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {semiMaterial.map((y: Dictionary, j: number) => (
                                        <tr key={`sub_${j}`}>
                                          <td>{y["materialLot"]}</td>
                                          <td>{y["materialCode"]}</td>
                                          <td>{y["materialName"]}</td>
                                          <td>{y["makerName"]}</td>
                                          <td>{y["child_material_lot"]}</td>
                                          <td>{dayFormat(y["expiredDt"])}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </PopoverBody>
                              </UncontrolledPopover>
                            </td> 
                          }
                          {/* <th>{x["material_lot"]}</th>  */}
                          <td>{x["material_code"]}</td>
                          <td>{x["material_name"]}</td>
                          <td>{x["maker_name"]}</td>
                          <td>{x["child_material_lot"]}</td>
                          <td>{dayFormat(x["expired_dt"])}</td> 
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        );
      }
    },
    {
      headerClass: "all",
      cellClass: "cell-tool",
      field: "toolName",
      headerName: "TOOL",
      filter: false,
      width: 50,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.toolYn))
      },
      cellRenderer: (d: any) => {
        if(!d.data.toolCnt)
          return null;

        const toolList = JSON.parse(d.data.toolJson);
        if(!toolList || !toolList.length)
          return null;

        return (
          <>
            <a id={`trace-popover-tool-${d.data.rowNo}`}>
              <span>
                {d.data.toolCnt}
              </span>
              <i className="fa fa-search"></i>
            </a>
            <UncontrolledPopover 
              trigger="legacy"
              target={`trace-popover-tool-${d.data.rowNo}`}
              placement="left" 
              className="trace-popover-container">
              <PopoverHeader>Tool Detail</PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Barcode</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>{x["tool_code"]}</td>
                          <td>{x["tool_name"]}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        );
      }
    },
    {
      headerClass: "all",
      cellClass: "cell-worker",
      field: "workerName",
      headerName: t("@WORKER"), //"작업자",
      filter: false,
      width: 55,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.workerYn))
      },
      cellRenderer: (d: any) => {
        if(!d.data.workerCnt)
          return null;

        const workerList = JSON.parse(d.data.workerJson);
        if(!workerList || !workerList.length)
          return null;

        return (
          <>
            <a id={`trace-popover-worker-${d.data.rowNo}`}>
              <span>
                {d.data.workerCnt}
              </span>
              <i className="fa fa-search"></i>
            </a>
            <UncontrolledPopover 
              trigger="legacy"
              target={`trace-popover-worker-${d.data.rowNo}`}
              placement="left" 
              className="trace-popover-container">
              <PopoverHeader>Worker Detail</PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Barcode</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>{x["worker_code"]}</td>
                          <td>{x["worker_name"]}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        );
      }
    },
    {
      headerClass: "all",
      field: "rejectRate",
      headerName: t("@SAMPLING_INSPECTION"), //"샘플링검사",
      filter: false,
      width: 75,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.samplingYn))
      },
      cellRenderer: (d: any) => {
        const popoverRef = useRef<any>();
        const cuPopoverRef = useRef<any>();
        const [rejectList, setRejectList] = useState<Dictionary[]>([]);
 
        const searchHandler = async () => {
          const result = await api<Dictionary[]>("get", "trace/defect", {
            workorder: d.data.workorderJob,
            operSeqNo: d.data.operSeqNo,
          });
          if (result?.data?.length) {
            setRejectList(result.data);
          }
        };
 
        return (
          <>            
            {d.data.rejectRate == null ? "" : (<a id={`trace-popover-reject-${d.data.rowNo}`} onClick={searchHandler}>{percentFormat(d.data.rejectRate)}</a>)}
 
            {d.data.rejectRate == null ? null : (
              <UncontrolledPopover 
                // trigger="legacy"
                ref={popoverRef}
                target={`trace-popover-reject-${d.data.rowNo}`}
                placement="top"
                className="trace-popover-container"
              >
                <PopoverHeader>
                  Defect Detail
                  <a onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i>
                  </a>
                </PopoverHeader>
                <PopoverBody>
                  <Table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        {/* <th>불량코드</th> */}
                        <th>불량명</th>
                        <th>단위</th>
                        <th>불량수량(PNL)</th>
                        {/* <th>불량Qty(PCS)</th> */}
                        <th>기준</th>
                        <th>부적합률</th>
                      </tr>
                    </thead>
                    <tbody>
                      { rejectList.map((x: Dictionary, i: number) => (
                        <tr key={i}>
                          {/* <th>{x["rejectCode"]}</th> */}
                          <td>{x["rejectDesc"]}</td>
                          <td>{x["rejectUomCode"]}</td>
                          <td>{x["rejectQty"]}</td>
                          {/* <th>{x["attribute1"]}</th> */}
                          <td>{percentFormat(x["rejectBaseRate"], 2)}</td>
                          <td>{percentFormat(x["rejectRate"], 2)}</td>
                        </tr>
                      ))}
                      {
                        !rejectList.length && (
                          <tr>
                            {/* 데이터가 없습니다. */}
                            <td colSpan={5} className="text-center">{t("@MSG_ALRAM_TYPE4")}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {
                        popoverRef.current.toggle();
                      }}
                    >
                      <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                    </Button>
                  </div>
                </PopoverBody>
              </UncontrolledPopover>
            )}
          </>
        );
      },
    },
    {
      headerClass: "all",
      field: "cuDefectRate",
      headerName: t("@TOTAL_INSPECTION"), //"전수검사",
      width: 85,
      filter: false,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.totalInspYn))
      },
      cellRenderer: (d: any) => {
        const cuPopoverRef = useRef<any>();
        const bbtPopoverRef = useRef<any>();
        const blackholePopoverRef = useRef<any>();
        const aoiDetailPopoverRef = useRef<any>();

        const [bbtList, setBBTList] = useState<Dictionary[]>([]);
        const [aoiColsList, setColsList] = useState<Dictionary[]>([]);
        const [aoiDetailList, setAoiDetailList] = useState<Dictionary[]>([]);
        const [blackHoleDetailList, setBlackHoleDetailList] = useState<Dictionary[]>([]);

        const searchHandler = async () => {
          const result = await api<Dictionary[]>("get", "bbt", {
            fromDt: '2023-01-01',
            toDt: '2099-12-31',
            workorder: d.data.panelId ? d.data.workorder4M : d.data.workorderJob,
            panelId: d.data.panelId,
            eqpCode: JSON.stringify({ value: d.data.eqpCode }),
            groupby: "EQP"
          });
          if (result?.data?.length) {
            setBBTList(result.data);
          }
        };

        const aoiDetailSearch = () => {
          api<Dictionary[]>("get", "trace/aoicols", {
            workorder: d.data.panelId ? d.data.workorder4M : d.data.workorderJob,
            operSeqNo: d.data.operSeqNo
          }).then(result => {
            if(result?.data?.length){
              setColsList(result.data);  

              api<Dictionary[]>("get", "trace/aoidetail", {
                workorder: d.data.panelId ? d.data.workorder4M : d.data.workorderJob,
                operSeqNo: d.data.operSeqNo,
                panelId: d.data?.panelId
              }).then(result => {
                if(result?.data?.length) {
                  setAoiDetailList(result.data);
                }
              })
            }
          })
        }

        const blackHoleDetailSearch = async () => {
          if(d.data.panelId) {
            const result = await api<Dictionary[]>("get", "trace/blackholepnlthickness", {panelId: d.data.panelId});
            if(result?.data?.length) {
              setBlackHoleDetailList(result.data);
            }
          }
        }

        if(d.data.cuDefectRate || d.data.cuDefectRate == 0){
          return (
            <>            
              {/* <a id={`trace-popover-cu-${d.data.rowNo}`}><span className="badge bg-warning cell-re-ini">C</span>{`${percentFormat(d.data.cuDefectRate)}`}</a> */}
              <a id={`trace-popover-cu-${d.data.rowNo}`}><span className="badge bg-warning cell-re-ini">CMI</span></a>
              <UncontrolledPopover 
                // trigger="legacy"
                ref={cuPopoverRef}
                target={`trace-popover-cu-${d.data.rowNo}`}
                placement="top"
                className="trace-popover-container"
              >
                <PopoverHeader>
                  동도금 측정 Detail
                  <a onClick={() => {cuPopoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i>
                  </a>
                </PopoverHeader>
                <PopoverBody>
                  <Table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>불량률</th>
                        <th>최소</th>
                        <th>최대</th>
                        <th>평균</th>
                        <th>판넬(OK/NG)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{percentFormat(d.data.cuDefectRate, 1)}</td>
                        <td>{floatFormat(d.data.cuMinVal, 1)}</td>
                        <td>{floatFormat(d.data.cuMaxVal, 1)}</td>
                        <td>{floatFormat(d.data.cuAvgVal, 1)}</td>
                        <td>
                          <span className="judge-ok">{d.data.cuOkCnt}</span>
                          /
                          <span className="judge-ng">{d.data.cuNgCnt}</span>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {cuPopoverRef.current.toggle();}}>
                      <i className="uil uil-times me-2"></i> 닫기
                    </Button>
                  </div>
                </PopoverBody>
              </UncontrolledPopover>
            </>
          );
        }

        if((d.data.bbtTotalCnt || d.data.bbtTotalCnt == 0) && d.data.bbtCompleteYn == 'Y'){
          return (
            <>            
              <a id={`trace-popover-bbt-${d.data.rowNo}`} onClick={searchHandler}>
                <span className="badge bg-primary cell-re-ini">B</span>
                {`${devideFormat(d.data.bbtNgCnt, d.data.bbtTotalCnt)}`}</a>
              <UncontrolledPopover 
                // trigger="legacy"
                ref={bbtPopoverRef}
                target={`trace-popover-bbt-${d.data.rowNo}`}
                placement="top"
                className="trace-popover-container"
              >
                <PopoverHeader>
                  BBT 검사 Detail
                  <a onClick={() => {bbtPopoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i>
                  </a>
                </PopoverHeader>
                <PopoverBody>
                  <Table className="table table-bordered table-thead-tr-th-center">
                    <thead className="table-light">
                      <tr>
                        <th rowSpan={2}>Application</th>
                        <th colSpan={4}>검사수량</th>
                        <th colSpan={16}>불량(판정 기준)</th>
                      </tr>
                      <tr>
                        <td>PNL</td>
                        <td>PCS</td>
                        <td>불량</td>
                        <td>불량률</td>

                        <td>4W</td>
                        <td>불량률</td>
 
                        <td>Aux</td>
                        <td>불량률</td> 

                        <td>Both</td>
                        <td>불량률</td> 

                        <td>C</td>
                        <td>불량률</td> 

                        <td>ER</td>
                        <td>불량률</td> 

                        <td>Open</td>
                        <td>불량률</td> 

                        <td>SPK</td>
                        <td>불량률</td> 

                        <td>Short</td>
                        <td>불량률</td> 
                      </tr>
                    </thead>
                    <tbody>
                      {bbtList.map((x: Dictionary, i: number) => (
                        <tr key={i}>
                          <td>{x["appName"]}</td>
                          
                          <td>{currencyFormat(x["panelCnt"])}</td>
                          <td>{currencyFormat(x["totalCnt"])}</td>
                          <td>{currencyFormat(x["ngCnt"])}</td>
                          <td>{percentFormat(x["ngRate"])}</td>

                          <td>{currencyFormat(x["4WCnt"])}</td>
                          <td>{devideFormat(x["4WCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["auxCnt"])}</td>
                          <td>{devideFormat(x["auxCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["bothCnt"])}</td>
                          <td>{devideFormat(x["bothCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["cCnt"])}</td>
                          <td>{devideFormat(x["cCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["erCnt"])}</td>
                          <td>{devideFormat(x["erCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["openCnt"])}</td>
                          <td>{devideFormat(x["openCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["spkCnt"])}</td>
                          <td>{devideFormat(x["spkCnt"], x["totalCnt"] )}</td>

                          <td>{currencyFormat(x["shortCnt"])}</td>
                          <td>{devideFormat(x["shortCnt"], x["totalCnt"] )}</td>
                        </tr>
                      ))}                      
                    </tbody>
                  </Table>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {bbtPopoverRef.current.toggle();}}>
                      <i className="uil uil-times me-2"></i> 닫기
                    </Button>
                  </div>
                </PopoverBody>
              </UncontrolledPopover>
            </>
          );
        }

        if(d.data.blackHoleList?.length){
          return (
            <>            
              <a id={`trace-popover-blackhole-${d.data.rowNo}`} onClick={blackHoleDetailSearch}>
                <span className="badge bg-secondary cell-re-ini">H</span>
                {d.data.blackHoleList.map((x: Dictionary, i: number) => (
                  x.ngType == "Totalng" ?  `${devideFormat(x["totalNgCnt"], x["totalPcsCnt"])}` : ''
                ))}
              </a>
              <UncontrolledPopover 
                // trigger="legacy"
                ref={blackholePopoverRef}
                target={`trace-popover-blackhole-${d.data.rowNo}`}
                placement="top"
                className="trace-popover-container"
              >
                <PopoverHeader>
                  Blackhole 검사 Detail
                  <a onClick={() => {blackholePopoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i>
                  </a>
                </PopoverHeader>
                <PopoverBody>
                  <Table className="table table-bordered table-thead-tr-th-center">
                    <thead className="table-light">
                      <tr>
                        <td>구분</td>
                        <td>검사수</td>
                        <td>불량수</td>
                        <td>불량률</td>
                        <td>USL</td>
                        <td>LSL</td>
                        <td>MIN</td>
                        <td>MAX</td>
                        <td>AVG</td>
                      </tr>
                    </thead>
                    <tbody>
                      {d.data.blackHoleList.map((x: Dictionary, i: number) => (
                        x.ngType != "Thickness" &&  x.ngType != "Totalng" ? 
                          <tr key={i}>
                            <td>{x["ngType"]}</td>
                            <td>{currencyFormat(x["totalPcsCnt"])}</td>
                            <td>{currencyFormat(x["totalNgCnt"])}</td>
                            <td>{devideFormat(x["totalNgCnt"], x["totalPcsCnt"])}</td>
                            <td>{x["usl"] ? x["usl"].toFixed(2) : x["usl"]}</td>
                            <td>{x["lsl"] ? x["lsl"].toFixed(2) : x["lsl"]}</td>
                            <td>{x["min"] ? x["min"].toFixed(2) : x["min"]}</td>
                            <td>{x["max"] ? x["max"].toFixed(2) : x["max"]}</td>
                            <td>{x["avg"] ? x["avg"].toFixed(2) : x["avg"]}</td>
                          </tr>
                          :
                          ""
                      ))}
                    </tbody>
                  </Table>
                  
                  <Table className="table table-bordered table-thead-tr-th-center">
                    <thead className="table-light">
                      {d.data.panelId  ? 
                        <tr>
                          <td>구분</td>
                          <td>USL</td>
                          <td>LSL</td>
                          <td>UP1</td>
                          <td>UP2</td>
                          <td>UP3</td>
                          <td>DOWN1</td>
                          <td>DOWN2</td>
                          <td>DOWN3</td>
                        </tr>
                        :
                        <tr>
                          <td>구분</td>
                          <td>검사수</td>
                          <td>USL</td>
                          <td>LSL</td>
                          <td>MIN</td>
                          <td>MAX</td>
                          <td>AVG</td>
                        </tr>
                      }
                    </thead>
                    <tbody>
                      {d.data.panelId ?
                        blackHoleDetailList.map((x: Dictionary, i: number) => (
                          <tr key={i}>
                            <td>{x["ngType"]}</td>
                            <td>{"-"}</td>
                            <td>{"-"}</td>
                            <td>{x["up1Thickness"] ? x["up1Thickness"].toFixed(2) : x["up1Thickness"]}</td>
                            <td>{x["up2Thickness"] ? x["up2Thickness"].toFixed(2) : x["up2Thickness"]}</td>
                            <td>{x["up3Thickness"] ? x["up3Thickness"].toFixed(2) : x["up3Thickness"]}</td>
                            <td>{x["down1Thickness"] ? x["down1Thickness"].toFixed(2) : x["down1Thickness"]}</td>
                            <td>{x["down2Thickness"] ? x["down2Thickness"].toFixed(2) : x["down2Thickness"]}</td>
                            <td>{x["down3Thickness"] ? x["down3Thickness"].toFixed(2) : x["down3Thickness"]}</td>
                          </tr>
                        ))
                        :
                        d.data.blackHoleList.map((x: Dictionary, i: number) => (
                          x.ngType == "Thickness" ? 
                              <tr key={i}>
                                <td>{x["ngType"]}</td>
                                <td>{currencyFormat(x["totalPcsCnt"])}</td>
                                <td>{x["usl"] ? x["usl"].toFixed(2) : x["usl"]}</td>
                                <td>{x["lsl"] ? x["lsl"].toFixed(2) : x["lsl"]}</td>
                                <td>{x["min"] ? x["min"].toFixed(2) : x["min"]}</td>
                                <td>{x["max"] ? x["max"].toFixed(2) : x["max"]}</td>
                                <td>{x["avg"] ? x["avg"].toFixed(2) : x["avg"]}</td>
                              </tr>
                            :
                            ""
                          ))}
                    </tbody>
                  </Table>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {blackholePopoverRef.current.toggle();}}>
                      <i className="uil uil-times me-2"></i> 닫기
                    </Button>
                  </div>
                </PopoverBody>
              </UncontrolledPopover>
            </>
          );
        }

        if(d.data.aoiPcsTotal >= 0){
          return (
            <>            
              <a id={`trace-popover-aoi-${d.data.rowNo}`} onClick={aoiDetailSearch}>
                <span className="badge bg-secondary cell-re-ini">A</span> {d.data.aoiPcsTotal != 0 ? `${devideFormat(d.data.aoiNgPcsTotal, d.data.aoiPcsTotal)}` : '0.00%'}</a>
              <UncontrolledPopover 
                // trigger="legacy"
                ref={aoiDetailPopoverRef}
                target={`trace-popover-aoi-${d.data.rowNo}`}
                placement="top"
                className="trace-popover-container"
              >
                <PopoverHeader>
                  AOI 검사 Detail
                  <a onClick={() => {aoiDetailPopoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i>
                  </a>
                </PopoverHeader>
                <PopoverBody>
                  <Table className="table table-bordered table-thead-tr-th-center">
                    <thead className="table-light">
                      <tr key={"aoi-head"}>
                        <td>LAYER</td>
                        <td>총 검사수량</td>
                        <td>불량수량</td>
                        <td>PCS 불량률</td>
                        <td>Defect수량</td>
                        {aoiColsList.map((e: Dictionary, index: number) => {
                          return(
                            <>
                              <td>
                                {e.headerName}
                              </td>
                              <td>
                                점유율
                              </td>
                            </>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {aoiDetailList.map((x: Dictionary, i: number) => (
                        <tr key={i}>
                          <td>{x["layer"]}</td>
                          <td>{d.data.aoiPcsTotal}</td>
                          <td>{x["aoiNgPcs"]}</td>
                          <td>{devideFormat(x["aoiNgPcs"], d.data.aoiPcsTotal)}</td>
                          <td>{x["defectCnt"]}</td>
                          {aoiColsList.map((e: Dictionary, index: number) => {
                            return(
                              <>
                                <td>
                                  {x[e.field]}
                                </td>
                                <td>
                                  {devideFormat(x[e.field], x["defectCnt"])}
                                </td>
                              </>
                            )
                          })}
                        </tr>
                      ))}                      
                    </tbody>
                  </Table>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {aoiDetailPopoverRef.current.toggle();}}>
                      <i className="uil uil-times me-2"></i> 닫기
                    </Button>
                  </div>
                </PopoverBody>
              </UncontrolledPopover>
            </>
          );
        }


        return null;
      },
    }, 
    {
      headerClass: "all",
      field: "ipqcStatus",
      headerName: "SPC",
      width: 55,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.spcYn))
      },
      cellRenderer: (d: any) => {
        if(d.node.rowPinned){

          if(!d.data.spcJudge)
            return null;

          return (
            <>
              <span className={d.data.spcJudge == 'O' ? "judge-ok judge-white" : d.data.spcJudge == 'C' ? "judge-chk judge-white" :"judge-ng judge-white"}>
                {d.data.spcJudge == "O" ? "OK" : d.data.spcJudge == "C" ? 'CHK' : "NG"}</span>
            </>
          );
        }

        const popoverRef = useRef<any>();
        const [spcList, setSpcList] = useState<Dictionary[]>([]);

        const searchHandler = async () => {
          const result = await api<Dictionary[]>("get", "trace/spc", { jobId: d.data.jobId4M || d.data.jobId, operSeqNo: d.data.operSeqNo, operId: d.data.operId, workorder: d.data.workorder4M || d.data.workorderJob});
          if(result?.data?.length){
            setSpcList(result.data);
          }
        }

        return (
          <>            
            <a id={`trace-popover-spc-${d.data.rowNo}`} onClick={searchHandler}>
              {judgeName(d.data.ipqcStatus)}</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`trace-popover-spc-${d.data.rowNo}`} 
              placement="top" 
              className="trace-popover-container">
              <PopoverHeader>
                SPC Detail
                <a onClick={() => {popoverRef.current.toggle();}}>
                  <i className="uil uil-times me-2"></i>
                </a>
              </PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>발생시간</th>
                      <th>Type Desc</th>
                      <th>Oper Desc</th>
                      <th>Inspection Desc</th>
                      <th>상태</th>
                      <th>SPC RULE NG</th>
                      <th>LCL</th>
                      <th>UCL</th>
                      <th>LSL</th>
                      <th>USL</th>
                      <th>측정 Min</th>
                      <th>측정 Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spcList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>{dateFormat(x["inspectionDate"], "YYYY-MM-DD HH:mm")}</td>
                          <td>{x["typeDesc"]}</td>
                          <td>{x["operationDescription"]}</td>
                          <td>{x["inspectionDesc"]}</td>
                          <td>{judgeName(x["statusFlag"])}</td>
                          <td>
                              {(x["spcRuleNgList"] ) !== 'NONE' && x["searchEqpCode"] && x["typeDesc"] !== 'IQC 치수 검사' ?
                                <a href={`/spcreport?fromDt=${x["searchFrom"]}&toDt=${x["searchTo"]}&itemCode=${x["searchItemCode"]}&operCode=${x["searchOperCode"]}&inspectDesc=${x["searchInspectionDesc"]}&eqpCode=${x["searchEqpCode"]}`} target="_blank">
                                  <i className="fa fa-search">
                                    {' ' +x["spcRuleNgList"]}
                                  </i> 
                                </a>
                               :  
                               x["spcRuleNgList"] } 
                          </td>
                          {/* <td>{x["specLsl"]}</td>
                          <td>{x["specUsl"]}</td> */}
                          <td>{x["lcl"]}</td>
                          <td>{x["ucl"]}</td>
                          <td>{x["lsl"]}</td>
                          <td>{x["usl"]}</td>
                          <td>{x["valueMin"]}</td>
                          <td>{x["valueMax"]}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" color="light" onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i> 닫기
                  </Button>
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        )
      },
    },
    {
      headerClass: "all",
      field: "qtimeJudge",
      headerName: "QTime",
      width: 70,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.qtimeYn))
      },
      cellRenderer: (d: any) => {

        const getJudgeClass = (judge: string) => {
          if(judge == "N")
            return "qtime-ng";

          if(judge == "O")
            return "qtime-ok";

          if(judge == "C")
            return "qtime-chk";

          return "";
        }

        if(d.node.rowPinned){

          if(!d.data.qtimeJudge)
            return null;

          return (
            <>
              <span className={`${getJudgeClass(d.data.qtimeJudge)} judge-white`}>
                {d.data.qtimeJudge == "O" ? "OK" : "NG"}</span>
            </>
          );
        }

        const popoverRef = useRef<any>();
        const [qtimeList, setQtimeList] = useState<Dictionary[]>([]);

        const searchHandler = async () => {
          const result = await api<Dictionary[]>("get", "trace/qtime", { workorder: d.data.workorderJob, toOperSeqNo: d.data.operSeqNo });
          if(result?.data?.length){
            setQtimeList(result.data);
          }
        }

        if(!d.data.qtimeJudge)
          return null;

        return (
          <>            
            <a id={`trace-popover-qtime-${d.data.rowNo}`} className={`${getJudgeClass(d.data.qtimeJudge)}`} onClick={searchHandler}>
              {d.data.qtimeJudge == "O" ? "OK" : "NG"}</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`trace-popover-qtime-${d.data.rowNo}`} 
              placement="top" 
              className="trace-popover-container">
              <PopoverHeader>
                QTime Detail
                <a 
                  onClick={() => {
                    popoverRef.current.toggle();
                  }}
                >
                  <i className="uil uil-times me-2"></i>
                </a>
              </PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      {/* <th>상태</th> */}
                      <th>공정(대분류)</th>
                      <th>공정(소분류)</th>
                      <th>발생공정</th>
                      <th>발생공정일시</th>
                      <th>작업공정</th>
                      <th>작업공정일시</th>
                      <th>경과시간</th>
                      <th>제한시간</th>
                      <th>경고시간</th>
                      {/* <th>남은시간</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {qtimeList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          {/* <td>{x["status"]}</td> */}
                          <td>{x["toOpClassDesc"]}</td>
                          <td>{x["toOpTypeDesc"]}</td>
                          <td>{x["fromOperDesc"]}</td>
                          <td>{dateFormat(x["fromEndDt"], "MM-DD HH:mm")}</td>
                          <td>{x["toOperDesc"]}</td>
                          <td>{dateFormat(d.data.startDt, "MM-DD HH:mm")}</td>
                          <td>{toHHMM(moment.duration(moment(d.data.startDt).diff(moment(x["fromEndDt"]))).asMinutes())}</td>
                          <td>{x["limitHour"]}</td>
                          <td>{x["warnHour"]}</td>
                          {/* <td>{x["passHour"]}</td> */}
                          </tr>
                      )
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" color="light" onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i> 닫기
                  </Button>
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        )
      },
    },
    {
      headerClass: "all",
      field: "chemJudge",
      headerName: t("@CHEM"),//"약품"
      width: 55,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.chemYn))
      },
      cellRenderer: (d: any) => {

        const getJudgeClass = (judge: string) => {
          if(judge == "NG")
            return "chem-ng";

          if(judge == "OK")
            return "chem-ok";

          if(judge == "CHK")
            return "chem-chk";

          return "";
        }

        if(d.node.rowPinned){

          if(!d.data.chemJudge)
            return null;

          return (
            <>
              <span className={`${getJudgeClass(d.data.chemJudge)} judge-white`}>
                {d.data.chemJudge}</span>
            </>
          );
        }

        const popoverRef = useRef<any>();
        const [chemList, setChemList] = useState<Dictionary[]>([]);

        const searchHandler = async () => {
          const result = await api<Dictionary[]>("get", "trace/chem", { eqpId: d.data.eqpId, startDt: d.data.startDt });
          if(result?.data?.length){
            setChemList(result.data);
          }
        }

        if(!d.data.chemJudge)
          return null;

        return (
          <>            
            <a id={`trace-popover-chem-${d.data.rowNo}`} className={`${getJudgeClass(d.data.chemJudge)}`} onClick={searchHandler}>
              {d.data.chemJudge}</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`trace-popover-chem-${d.data.rowNo}`} 
              placement="top" 
              className="trace-popover-container">
              <PopoverHeader>
                약품분석 Detail
                <a 
                  onClick={() => {
                    popoverRef.current.toggle();
                  }}
                >
                  <i className="uil uil-times me-2"></i>
                </a>
              </PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>측정일시</th>
                      <th>구분</th>
                      <th>약품명</th>
                      <th>관리범위</th>
                      <th>측정값</th>
                      <th>LCL</th>
                      <th>UCL</th>
                      <th>LSL</th>
                      <th>USL</th>
                      <th>판정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chemList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>{dateFormat(x["measureDatetime"], "MM-DD HH:mm")}</td>
                          <td>{x["typeDesc"]}</td>
                          <td>{x["chemicalName"]}</td>
                          <td>{x["measureRange"]}</td>
                          <td>{floatFormat(x["measureValue"])}</td>
                          <td>{floatFormat(x["lcl"])}</td>
                          <td>{floatFormat(x["ucl"])}</td>
                          <td>{floatFormat(x["lsl"])}</td>
                          <td>{floatFormat(x["usl"])}</td>
                          <td>
                            <span className={x["statusFlag"] == 'OK' ? "judge-ok" : x["statusFlag"] == 'CHK' ? "judge-chk" : "judge-ng"}>
                              {x["statusFlag"]}</span>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" color="light" onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i> 닫기
                  </Button>
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        )
      },
    },    
    {
      headerClass: "item",
      field: "recipeJudgeName",
      headerName: "SV",
      width: 50,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.recipeYn))
      },
      cellRenderer: (d: any) => {
        if(d.node.rowPinned){
          if(!d.data.recipeJudge)
            return null;

          return (
            <>
              <span className={d.data.recipeJudge == 'O' ? "judge-ok judge-white" : "judge-ng judge-white"}>
                {d.data.recipeJudge == "O" ? "OK" : "NG"}</span>
            </>
          );
        }

        const popoverRef = useRef<any>();

        if(!d.data.recipeJson)
          return null;

        const recipeList = JSON.parse(d.data.recipeJson);
        if(!recipeList || !recipeList.length)
          return null;

        return (
          <>
            <a className={d.data.recipeJudge == 'O' ? "judge-ok" : "judge-ng"} 
              id={`trace-popover-recipe-${d.data.itemKey}`}>{d.data.recipeJudgeName}</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`trace-popover-recipe-${d.data.itemKey}`}
              placement="left" 
              className="trace-popover-container">
              <PopoverHeader>
                Recipe Detail
                <a onClick={() => {popoverRef.current.toggle();}}>
                  <i className="uil uil-times me-2"></i>
                </a>
              </PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Recipe</th>
                      <th>Judge</th>
                      <th>Base Val</th>
                      <th>Eqp Val</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>
                            <span
                              id={`trace-popover-recipe-inner-${i}`}>
                              {x["recipe_name"]}
                            </span>
                            <UncontrolledTooltip
                              target={`trace-popover-recipe-inner-${i}`}
                              placement="top"
                              className="raw-tooltip-container"
                            >
                              <span className="raw-tablename">[{x["table_name"]}]</span> {x["column_name"]}
                              <br />
                              {x["recipe_name"]}
                            </UncontrolledTooltip>
                          </td>
                          <td>{judgeName(x["judge"])}</td>
                          <td>{x["base_val"]}</td>
                          <td>
                          {x["eqp_min_val"]} ~ {x["eqp_max_val"]}
                          {' '}
                          {x["table_name"] !== "raw_laser" ? ( //LOT 종합이력 추적 레이저 돋보기 임시 막음
                            <Button
                              className="btn-sm"
                              color="light"
                              onClick={() => {
                                method?.recipeChart?.call(null, x);
                              }}
                            >
                              <i className="fa fa-search"></i>
                            </Button>
                          ) : (
                            <></>
                          )}
                          </td>
                          <td>{dateFormat(x["eqp_start_dt"], 'HH:mm:ss')}</td>
                          <td>{dateFormat(x["eqp_end_dt"], 'HH:mm:ss')}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" color="light" onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i> 닫기
                  </Button>
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </>
        );
      }
    },
    {
      headerClass: "4m",
      field: "recipeJudgeName4M",
      headerName: "SV",
      filter: false,
      width: 35,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.recipeYn))
      },
      cellRenderer: (d: any) => {
        if(!d.data.recipeCnt || d.data.recipeCnt <= 0)
          return null;

        if(!d.data.startDt)
          return null;

        return (
          <>
            <a id={`trace-popover-recipe4m-${d.data.rowNo}`} className="detail-cell cell-recipe-ng" onClick={() => {
              method?.recipeChartEx?.call(null, d.data);
            }}>
              <i className="fa fa-search"></i>
            </a>
          </>
        );
      }
    },    
    {
      headerClass: "4m",
      field: "paramJudgeName4M",
      headerName: "PV",
      filter: false,
      width: 35,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.paramYn))
      },
      cellRenderer: (d: any) => {
        if(!d.data.paramCnt || d.data.paramCnt <= 0)
          return null;

        if(!d.data.startDt)
          return null;

        return (
          <>
            <a id={`trace-popover-param4m-${d.data.rowNo}`} className="detail-cell cell-param-ng" onClick={() => {
              method?.paramChartEx?.call(null, d.data);
            }}>
              <i className="fa fa-search"></i>
            </a>
          </>
        );
      }
    },
    {
      headerClass: "item",
      field: "paramJudgeName",
      headerName: "PV",
      width: 50,
      cellStyle: {textAlign: 'center'},
      cellRenderer: (d: any) => {
        if(d.node.rowPinned){

          if(!d.data.paramJudge)
            return null;

          return (
            <>
              <span className={d.data.paramJudge == 'O' ? "judge-ok judge-white" : "judge-ng judge-white"}>
                {d.data.paramJudge == "O" ? "OK" : "NG"}</span>
            </>
          );
        }

        const popoverRef = useRef<any>();

        if(!d.data.paramJson)
          return null;

        const paramList = JSON.parse(d.data.paramJson);
        if(!paramList || !paramList.length)
          return null;

        return (
          <>
            <a className={d.data.paramJudge == 'O' ? "judge-ok" : "judge-ng"} 
              id={`trace-popover-param-${d.data.itemKey}`}>{d.data.paramJudgeName}</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`trace-popover-param-${d.data.itemKey}`} 
              placement="left" 
              className="trace-popover-container">
              <PopoverHeader>
                Parameter Detail
                <a onClick={() => {popoverRef.current.toggle();}}>
                  <i className="uil uil-times me-2"></i>
                </a>
              </PopoverHeader>
              <PopoverBody>
                <Table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Param</th>
                      <th>Judge</th>
                      <th>LSL</th>
                      <th>USL</th>
                      <th>UCL</th>
                      <th>UCL</th>
                      <th>Eqp Val</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paramList.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>
                            { x["ctq_row_no"] ? (<span className="badge bg-danger cell-ctq">CTQ</span>) : "" }
                            <span
                              id={`trace-popover-param-inner-${i}`}>
                              {x["param_name"]}
                            </span>
                            <UncontrolledTooltip
                              target={`trace-popover-param-inner-${i}`}
                              placement="top"
                              className="raw-tooltip-container"
                            >
                              <span className="raw-tablename">[{x["table_name"]}]</span> {x["column_name"]}
                              <br />
                              {x["param_name"]}
                            </UncontrolledTooltip>
                          </td>
                          <td>{judgeName(x["judge"])}</td>
                          <td>{x["lsl"]}</td>
                          <td>{x["usl"]}</td>
                          <td>{x["lcl"]}</td>
                          <td>{x["ucl"]}</td>
                          <td>
                          {x["eqp_min_val"]} ~ {x["eqp_max_val"]}
                          {' '}
                          {x["table_name"] !== "raw_laser" ? ( //LOT 종합이력 추적 레이저 돋보기 임시 막음
                            <Button
                              className="btn-sm"
                              color="light"
                              onClick={() => {
                                method?.paramChart?.call(null, x);
                              }}
                            >
                              <i className="fa fa-search"></i>
                            </Button>
                          ) : (
                            <></>
                          )}
                          </td>
                          <td>{dateFormat(x["eqp_start_dt"], 'HH:mm:ss')}</td>
                          <td>{dateFormat(x["eqp_end_dt"], 'HH:mm:ss')}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>      
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" color="light" onClick={() => {popoverRef.current.toggle();}}>
                    <i className="uil uil-times me-2"></i> 닫기
                  </Button>
                </div>          
              </PopoverBody>              
            </UncontrolledPopover>
          </>
        );
      }
    },
    // {
    //   headerClass: "all",
    //   field: "createDt4M",
    //   headerName: "4M스캔",
    //   valueFormatter: (d: any) => dateFormat(d.data.createDt4M, "MM-DD HH:mm"),
    //   maxWidth: 90
    // },
    {
      headerClass: "item",
      field: "createDt4M",
      headerName: t("@PANEL"),//"판넬",
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),
      width: 90,
    },
    {
      headerClass: "4m",
      headerName: `${t("@COL_DETAILS")}${t("@LOOKUP")}`,//"상세조회",
      width: 80,
      cellStyle : (d: any) => {
        return (operMatterInspYn(d.data.panelYn))
      },
      cellRenderer: (d: any) => {
        let rollName = "ROLL";
        //let panelName = "P";
        let gap = "";

        if(d.data.rollId && d.data.itemExistKey){
          rollName = "R";
          //panelName = "P";
          gap = " ";
        }

        return (
          <>
            { d.data.rollId  && (
              <span className="detail-cell">
                <a onClick={() => {
                  method.rollSearch(d.data.rollId, d.data.groupKey);
                }}>
                  <span className="detail-cell-roll">{rollName}</span>
                  {' '}
                  <i className="fa fa-search"></i></a>
              </span>
            )}
            { gap }
            { d.data.itemExistKey  && (
              <span className="detail-cell">
                <a onClick={() => {
                  if(d.data.itemExistKey == 'F'){ // 레이저 공정 이전 가상 판넬 조회
                    method.fakePanelSearch(d.data.fakeGroupKey);
                  }else{
                    method.panelSearch(d.data.groupKey);
                  }
                }}>
                  <span className="detail-cell-panel">
                    <span className="text-black">{d.data.itemCnt}</span>
                    <span className="text-muted">{d.data.erpQty4M ? `(${d.data.erpQty4M})` : ""}</span>
                  </span>{" "}
                  <i className="fa fa-search"></i></a>
              </span>
            )}
          </>
        );
      }
    },    
    {
      headerClass: "multi4m",
      headerName: t("@PANEL"),//"판넬",
      width: 80,
      cellRenderer: (d: any) => {
        return (
          <>
            { d.data.itemExistKey  && (
              <span className="detail-cell">
                <span className="detail-cell-panel">
                  <span className="text-black">{d.data.itemCnt}</span>
                  <span className="text-muted">{d.data.erpQty4M ? `(${d.data.erpQty4M})` : ""}</span>
                </span>{" "}
              </span>
            )}
          </>
        );
      }
    },    
    {
      headerClass: "4m",
      headerName: `${t("@PANEL")}SV`,//"판넬SV",
      width: 60,
      filter: false,
      cellStyle: {textAlign: 'center'},
      tooltipValueGetter: (d:any) => `OK: ${d.data.recipeItemOkCnt}, NG: ${d.data.recipeItemNgCnt}, 미판정: ${d.data.recipeItemXCnt}, `,
      cellRenderer: (d: any) => {
        if(!(d.data.recipeItemOkCnt || d.data.recipeItemNgCnt || d.data.recipeItemXCnt))
          return null;

        return (
          <>
            {d.data.recipeItemOkCnt > 0 ? (
              <span className="judge-ok font-size-12">{d.data.recipeItemOkCnt}</span>
            ) : null}{" "}
            {d.data.recipeItemNgCnt > 0 ? (
              <span className="judge-ng font-size-12">{d.data.recipeItemNgCnt}</span>
            ) : null}{" "}
            {d.data.recipeItemXCnt > 0 ? (
              <span className="judge-x font-size-12">{d.data.recipeItemXCnt}</span>
            ) : null}
          </>
        );
      }
    },
    {
      headerClass: "4m",
      headerName: `${t("@PANEL")}PV`,//"판넬PV",
      width: 60,
      filter: false,
      cellStyle: {textAlign: 'center'},
      tooltipValueGetter: (d:any) => `OK: ${d.data.paramItemOkCnt}, CHK: ${d.data.paramItemChkCnt}, NG: ${d.data.paramItemNgCnt}, 미판정: ${d.data.paramItemXCnt}, `,
      cellRenderer: (d: any) => {
        if(!(d.data.paramItemOkCnt || d.data.paramItemChkCnt || d.data.paramItemNgCnt || d.data.paramItemXCnt))
          return null;

        return (
          <>
            {d.data.paramItemOkCnt > 0 ? (<span className="judge-ok">{d.data.paramItemOkCnt}</span>) : null}
            {' '}
            {d.data.paramItemChkCnt > 0 ? (<span className="judge-chk">{d.data.paramItemChkCnt}</span>) : null}
            {' '}
            {d.data.paramItemNgCnt > 0 ? (<span className="judge-ng">{d.data.paramItemNgCnt}</span>) : null}
            {' '}
            {d.data.paramItemXCnt > 0 ? (<span className="judge-x">{d.data.paramItemXCnt}</span>) : null}
          </>
        );
      }
    },
    {
      headerClass: "4m",
      field: "startDt",
      headerName: "Start",
      cellStyle: {textAlign: 'center'},
      valueFormatter: (d: any) => dateFormat(d.data.startDt, "MM-DD HH:mm"),
      width: 90,
    },
    {
      headerClass: "4m",
      field: "endDt",
      headerName: "End",
      cellStyle: {textAlign: 'center'},
      valueFormatter: (d: any) => dateFormat(d.data.endDt, "MM-DD HH:mm"),
      width: 90,
    },
    {
      headerClass: "4m",
      field: "rejudge",
      headerName: "",
      cellRenderer: (d: any) => {
        if(!d.data.workorder4M)
          return null;

        return (
          <>
            <a onClick={() => {
              method?.panelReJudge?.call(null, d.data);
            }}>&nbsp;</a>
          </>
        );
      },
      width: 20
    },
  ];

  return filter(defs);
}