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

export const interlockMasterDefs = (listApi?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: t("@COL_BASIC_INFORMATION"),  //"기본정보",
      children: [
        { 
          headerClass: "multi4m", 
          checkboxSelection: true,
          filter: false,
          width: 35,
          pinned: true
        },
        {
          headerName: "No",
          valueGetter: "node.rowIndex + 1",
          width: 40,
          filter: false,
          pinned: true          
        },
        {
          field: "workorder",
          headerName: "Batch No.",
          width: 200,
          tooltipValueGetter: (d:any) => d.data.workorder,
          cellRenderer: (d: any) => {
            const popoverRef = useRef<any>();
            const lotInfoRef = useRef<any>();
    
            if(!d.data.workorder)
              return null;
    
            const searchHandler = async () => {
              executeIdle(() => {
                lotInfoRef.current.searchLot(null, d.data.workorder);
              });          
            }          
    
            if(d.data.workorderJob == d.data.workorder){
              return (
                <>
                  <span>
                    {d.data.workorder}
                  </span>
                </>);
            }
    
            return (
              <>
                <a id={`trace-popover-lot-${d.data.rowNo}`} onClick={searchHandler}>
                  <i className="fa fa-search text-muted"></i>
                  {' '}
                  <span>
                    {d.data.workorder}
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
                      <Button type="button" size="sm" color="primary" onClick={() => { window.open(`/trace4m/${d.data.workorder}`) }}>
                        <i className="uil uil-external-link-alt me-2"></i> BATCH이력추적
                      </Button>
                      <Button type="button" size="sm" color="light" onClick={() => {popoverRef.current.toggle();}}>
                        <i className="uil uil-times me-2"></i> 닫기
                      </Button>
                    </div>
                  </PopoverBody>
                </UncontrolledPopover>
              </>
            );
          },
          pinned: true
        },
        {
          field: "completeYn",
          headerName: t("@COMPLETE"), // "완료",
          filter: false,
          sortable: true,
          width: 40,
          cellRenderer: (d: any) => {
            if(d.data.completeYn == 'Y'){
              return (
                <>
                  <i className="fa fa-check judge-ok"></i>
                </>
              );
            }
          },
          pinned: true
        },
        {
          field: "workorderInterlockCode",
          headerName: t("@COL_INTERLOCK"),  //"인터락",
          filter: false,
          sortable: true,
          width: 50,
          cellRenderer: (d: any) => {
            const popoverRef = useRef<any>();
            const [list, setList] = useState<Dictionary[]>([]);

            const searchHandler = async () => {
              const result = await api<Dictionary[]>("get", "panelinterlock/workorder", { workorder: d.data.workorder });
              if (result?.data?.length) {
                setList(result.data);
              }
            };

            return (
              <>
                <a id={`trace-popover-workorderinterlock-${d.node.rowIndex}`} onClick={searchHandler}>
                  <i className="fa fa-search text-muted"></i></a>
                {d.data.workorderInterlockCode && (<i className="fa fa-check judge-ng ms-1"></i>)}
                <UncontrolledPopover
                  // trigger="legacy"
                  ref={popoverRef}
                  target={`trace-popover-workorderinterlock-${d.node.rowIndex}`}
                  placement="right"
                  className="trace-popover-container">
                  <PopoverHeader>
                    {`Batch ${t("@INTERLOCK_HISTORY")}`}
                    <a
                      onClick={() => {
                        popoverRef.current.toggle();
                      } }
                    >
                      <i className="uil uil-times me-2"></i>
                    </a>
                  </PopoverHeader>
                  <PopoverBody>
                    <Table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>{t("@COL_DIVISION")}</th>
                          <th>{t("@OPER_SEQ")}</th>
                          <th>{t("@COL_OPERATION_NAME")}</th>
                          <th>{t("@COL_EQP_NAME")}</th>
                          <th>{t("@INTERLOCK_CODE")}</th>
                          <th>{t("@COL_AUTO")}</th>
                          <th>{`${t("@COL_REGISTRATION")} ${t("@COL_RELEASE")} ${t("@COL_REASON")}`}</th>
                          <th>{`${t("@COL_REGISTRATION")} ${t("@COL_RELEASE")} ${t("@OFFICER")}`}</th>
                          <th>{`${t("@COL_REGISTRATION")} ${t("@COL_RELEASE")} ${t("@COL_DATE")}`}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((x: Dictionary, i: number) => (
                          (
                            <React.Fragment key={i}>
                              <tr>
                                <td style={{ minWidth: "40px" }} className="text-danger">등록</td>
                                <td rowSpan={2}>{x["operSeqNo"]}</td>
                                <td rowSpan={2} style={{ minWidth: "120px" }}>{x["operName"]}</td>
                                <td rowSpan={2} style={{ minWidth: "120px" }}>{x["eqpName"]}</td>
                                <td rowSpan={2} style={{ minWidth: "200px" }}>{x["interlockName"]}</td>
                                <td rowSpan={2} style={{ minWidth: "40px" }}>{x["autoYn"]}</td>

                                <td>{x["onRemark"]}</td>
                                <td style={{ minWidth: "70px" }}>{x["onUserName"]}</td>
                                <td style={{ minWidth: "80px" }}>{dateFormat(x["onDt"], "MM-DD HH:mm")}</td>
                              </tr>
                              <tr>
                                <td className="text-primary">해제</td>
                                <td>{x["offRemark"]}</td>
                                <td style={{ minWidth: "70px" }}>{x["offUserName"]}</td>
                                <td style={{ minWidth: "80px" }}>{dateFormat(x["offDt"], "MM-DD HH:mm")}</td>
                              </tr>
                            </React.Fragment>
                          )
                        ))}
                        {!list.length ? (
                          <tr>
                            <td colSpan={9} className="text-center">
                              등록/해제 내역이 없습니다.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button type="button" color="light" onClick={() => { popoverRef.current.toggle(); } }>
                        <i className="uil uil-times me-2"></i> 닫기
                      </Button>
                    </div>
                  </PopoverBody>
                </UncontrolledPopover>
              </>
            );
          },
          pinned: true
        },        
        {
          headerName: t("@COL_MODEL_CODE"),  //"모델코드",
          field: "modelCode",
          width: 160,
          tooltipValueGetter: (d:any) => d.data.modelCode,
        },
        {
          headerName: t("@COL_MODEL_NAME"),  //"모델명",
          field: "modelName",
          width: 140,
          tooltipValueGetter: (d:any) => d.data.modelName,
        },
        {
          headerName: t("@COL_EQP_NAME"), //"설비명",
          field: "eqpName",
          width: 160,
          tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
        },
        {
          field: "operSeqNo",
          headerName: t("@OPER_SEQ"), //"공순",
          maxWidth: 75,
          tooltipValueGetter: (d:any) => `[${d.data.operSeqNo}] ${d.data.operCode}`,
          cellRenderer: (d: any) => {
            return (
              <>
                <a onClick={() => {
                  window.open(`/trace4m/${d.data.workorder}/${d.data.operSeqNo}`)
                }}>
                  <i className="uil uil-external-link-alt me-1"></i>
                  {d.data.operSeqNo}
                </a>
              </>
            );
          }
        },
        {
          field: "operName",
          headerName: t("@COL_OPERATION_NAME"), // "공정명",
          width: 130,
          tooltipValueGetter: (d:any) => d.data.operName,
        },   
        // {
        //   field: "tranOperName",
        //   headerName: t("@COL_OPERATION_NAME"), // "공정명",
        //   width: 200,
        //   valueFormatter: (d: any) => getLang(d.data.tranOperName),
        // },        
      ]
    },

    {
      headerName: t("@COL_INTERLOCK"), //"인터락",
      headerClass: "no-leftborder",
      children: [
        // {
        //   headerName: "판넬 ID",
        //   field: "panelId",
        //   width: 190,
        //   headerCheckboxSelection: true,
        //   checkboxSelection: true,
        //   filter: false,
        //   tooltipValueGetter: (d:any) => d.data.panelId,
        // },
        // {
        //   headerClass: "item",
        //   field: "interlockYn",
        //   headerName: "인터락",
        //   filter: false,
        //   width: 50,
        //   cellRenderer: (d: any) => {
        //     if(!d.data.interlockYn || d.data.interlockYn == 'N')
        //     {
        //       return;
        //     }
    
        //     return (
        //       <>
        //         <i className="fa fa-check judge-ng"></i>
        //       </>
        //     );
        //   }
        // },
        {
          headerName: t("@COL_DIVISION"), // "구분",
          field: "gubun",
          width: 55,
          // cellRenderer: (d: any) => {
          //   if(d.data.interlockCode?.endsWith("_C"))
          //     return "C-NG";

          //   if(d.data.interlockCode?.endsWith("_S"))
          //     return "S-NG";

          //   return "S-NG";
          // }
        },        
        {
          headerName: t("@CLASSIFICATION"), // "분류",
          field: "interlockNameMajor",
          width: 120,
          tooltipValueGetter: (d:any) => `[${d.data.interlockCodeMajor}] ${d.data.interlockNameMajor}`,
          valueFormatter: (d: any) => getLang(d.data.interlockNameMajor),
        },
        {
          headerName: t("@SUBCLASS"),    //소분류
          field: "interlockName",
          width: 190,
          tooltipValueGetter: (d:any) => `[${d.data.interlockCode}] ${d.data.interlockName}`,
          valueFormatter: (d: any) => getLang(d.data.interlockName),
          cellClass: (d: any) => {
            return d.data.interlockClass;
          },
          cellRenderer: (d: any) => {
            const spcUnionPopoverRef = useRef<any>();
            const spc8RulePopoverRef = useRef<any>();
            const chemPopoverRef = useRef<any>();

            const [spcUnionList, setSpcUnionList] = useState<Dictionary[]>([]);
            const [spc8RuleList, setSpc8RuleList] = useState<Dictionary[]>([]);
            const [chemList, setChemList] = useState<Dictionary[]>([]);

            const spcUnionSearch = async () => {
              if(d.data.headerGroupKey) {
                const result = await api<Dictionary[]>("get", "panelinterlock/spc4munion", {headerGroupKey: d.data.headerGroupKey});
                if(result?.data?.length) {
                  setSpcUnionList(result.data);
                }
              }
            }

            const spc8RuleSearch = async () => {
              if(d.data.headerGroupKey) {
                const result = await api<Dictionary[]>("get", "panelinterlock/spc4m8rule", {headerGroupKey: d.data.headerGroupKey});
                if(result?.data?.length) {
                  setSpc8RuleList(result.data);
                }
              }
            }

            const chemSearch = async () => {
              if(d.data.headerGroupKey) {
                const result = await api<Dictionary[]>("get", "panelinterlock/chem4m", {headerGroupKey: d.data.headerGroupKey});
                if(result?.data?.length) {
                  setChemList(result.data);
                }
              }
            }

            if(d.data.interlockCodeMajor != '5003' && d.data.interlockCodeMajor != '5008' && d.data.interlockCodeMajor != '5103')
              return d.data.interlockName;

            if(d.data.headerGroupKey && d.data.interlockCodeMajor == '5003'){
              return (
                <>            
                  <a id={`trace-popover-spcunion-${d.data.rowNo}`} onClick={spcUnionSearch}>
                    <i className="fa fa-search"></i>
                    {' '}
                    { d.data.interlockName }
                  </a>
                  <UncontrolledPopover 
                    // trigger="legacy"
                    ref={spcUnionPopoverRef}
                    target={`trace-popover-spcunion-${d.data.rowNo}`}
                    className="trace-popover-container"
                  >
                    <PopoverHeader>
                      SPC Detail
                      <a onClick={() => {spcUnionPopoverRef.current.toggle();}}>
                        <i className="uil uil-times me-2"></i>
                      </a>
                    </PopoverHeader>
                    <PopoverBody>
                      <Table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>{t("@COL_OCCURRENCE_TIME")}</th>              {/* 발생시간 */}
                            <th>Type Desc</th>        
                            <th>{t("@COL_OPERATION_NAME")}</th>               {/* 공정명 */}
                            <th>Inspection Desc</th>  
                            <th>{t("@COL_JUDGMENT")}</th>                     {/* 판정 */}
                            <th>LCL</th>              
                            <th>UCL</th>              
                            <th>LSL</th>              
                            <th>USL</th>              
                            <th>{`${t("@COL_MEASUREMENT")} Min`}</th>         {/* 측정 Min */}
                            <th>{`${t("@COL_MEASUREMENT")} Max`}</th>         {/* 측정 Max */}
                          </tr>
                        </thead>
                        <tbody>
                          {spcUnionList.map((x: Dictionary, i: number) => (
                            (
                              <tr key={i}>
                                <td>{dateFormat(x["inspDate"], "YYYY-MM-DD HH:mm")}</td>
                                <td>{x["typeDesc"]}</td>
                                <td>{x["operName"]}</td>
                                <td>{x["inspectionDesc"]}</td>
                                <td>{judgeName(x["judge"])}</td>
                                <td>{x["lcl"]}</td>
                                <td>{x["ucl"]}</td>
                                <td>{x["lsl"]}</td>
                                <td>{x["usl"]}</td>
                                <td>{x["minVal"]}</td>
                                <td>{x["maxVal"]}</td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </Table>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          type="button"
                          color="light"
                          onClick={() => {spcUnionPopoverRef.current.toggle();}}>
                          <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                        </Button>
                      </div>
                    </PopoverBody>
                  </UncontrolledPopover>
                </>
              );
            }

            if(d.data.headerGroupKey && d.data.interlockCodeMajor == '5103'){
              return (
                <>            
                  <a id={`trace-popover-spc8rule-${d.data.rowNo}`} onClick={spc8RuleSearch}>
                    <i className="fa fa-search"></i>
                    {' '}
                    { d.data.interlockName }
                  </a>
                  <UncontrolledPopover 
                    // trigger="legacy"
                    ref={spc8RulePopoverRef}
                    target={`trace-popover-spc8rule-${d.data.rowNo}`}
                    placement="left-end"
                    className="trace-popover-container"
                  >
                    <PopoverHeader>
                      SPC 8Rule Detail
                      <a onClick={() => {spc8RulePopoverRef.current.toggle();}}>
                        <i className="uil uil-times me-2"></i>
                      </a>
                    </PopoverHeader>
                    <PopoverBody>
                      <Table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>{t("@COL_OCCURRENCE_TIME")}</th>              {/* 발생시간 */}
                            <th>Type Desc</th>
                            <th>{t("@COL_OPERATION_NAME")}</th>               {/* 공정명 */}
                            <th>Inspection Desc</th>
                            <th>SPC RULE NG</th>
                            <th>LCL</th>
                            <th>UCL</th>
                            <th>LSL</th>
                            <th>USL</th>
                            <th>{`${t("@COL_MEASUREMENT")} Min`}</th>         {/* 측정 Min */}
                            <th>{`${t("@COL_MEASUREMENT")} Max`}</th>         {/* 측정 Max */}
                          </tr>
                        </thead>
                        <tbody>
                          {spc8RuleList.map((x: Dictionary, i: number) => (
                            (
                              <tr key={i}>
                                <td>{dateFormat(x["inspDate"], "YYYY-MM-DD HH:mm")}</td>
                                <td>{x["typeDesc"]}</td>
                                <td>{x["operName"]}</td>
                                <td>{x["inspectionDesc"]}</td>
                                <td>{(x["spcRuleNgList"])}</td>
                                <td>{x["lcl"]}</td>
                                <td>{x["ucl"]}</td>
                                <td>{x["lsl"]}</td>
                                <td>{x["usl"]}</td>
                                <td>{x["minVal"]}</td>
                                <td>{x["maxVal"]}</td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </Table>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          type="button"
                          color="light"
                          onClick={() => {spc8RulePopoverRef.current.toggle();}}>
                          <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                        </Button>
                      </div>
                    </PopoverBody>
                  </UncontrolledPopover>
                </>
              );
            }

            if(d.data.headerGroupKey && d.data.interlockCodeMajor == '5008'){
              return (
                <>            
                  <a id={`trace-popover-chem-${d.data.rowNo}`} onClick={chemSearch}>
                    <i className="fa fa-search"></i>
                    {' '}
                    { d.data.interlockName }
                  </a>
                  <UncontrolledPopover 
                    // trigger="legacy"
                    ref={chemPopoverRef}
                    target={`trace-popover-chem-${d.data.rowNo}`}
                    className="trace-popover-container"
                  >
                    <PopoverHeader>
                      SPC Detail
                      <a onClick={() => {chemPopoverRef.current.toggle();}}>
                        <i className="uil uil-times me-2"></i>
                      </a>
                    </PopoverHeader>
                    <PopoverBody>
                      <Table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>{t("@COL_OCCURRENCE_TIME")}</th>              {/* 발생시간 */}
                            <th>Type Desc</th>
                            <th>{t("@COL_OPERATION_NAME")}</th>               {/* 공정명 */}
                            <th>Inspection Desc</th>
                            <th>{t("@COL_JUDGMENT")}</th>                     {/* 판정 */}
                            <th>{t("@COL_MANAGEMENT_SCOPE")}</th>             {/* 관리범위 */}
                            <th>{t("@MEASURED_VALUE")}</th>                   {/* 판정 */}
                            <th>LCL</th>
                            <th>UCL</th>
                            <th>LSL</th>
                            <th>USL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chemList.map((x: Dictionary, i: number) => (
                            (
                              <tr key={i}>
                                <td>{dateFormat(x["inspDate"], "YYYY-MM-DD HH:mm")}</td>
                                <td>{x["typeDesc"]}</td>
                                <td>{x["operName"]}</td>
                                <td>{x["inspectionDesc"]}</td>
                                <td>{judgeName(x["judge"])}</td>
                                <td>{x["criteriaDesc"]}</td>
                                <td>{x["val"]}</td>
                                <td>{x["lcl"]}</td>
                                <td>{x["ucl"]}</td>
                                <td>{x["lsl"]}</td>
                                <td>{x["usl"]}</td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </Table>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          type="button"
                          color="light"
                          onClick={() => {chemPopoverRef.current.toggle();}}>
                          <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                        </Button>
                      </div>
                    </PopoverBody>
                  </UncontrolledPopover>
                </>
              );
            }

            if(d.data.interlockCodeMajor != '5003' && d.data.interlockCodeMajor != '5008' && d.data.interlockCodeMajor != '5103')
              return d.data.interlockName;
          }
        },
        {
          headerName: t("@PANEL") ,  //판넬
          field: "panelCnt",
          width: 40,
          filter: false
        },
        {
          headerName: "사유",
          field: "onRemark",
          width: 150,
          tooltipValueGetter: (d:any) => d.data.onRemark,
          cellRenderer: (d: any) => {
            return (
              <>
                { d.data.autoYn == 'Y' ? (<span className="badge bg-info cell-ctq">A</span>) : "" }
                { d.data.onRemark }
              </>
            );
          }
        },
        {
          field: "panelJson",
          width: 0,
          filter: false,
          hide: true,
          suppressToolPanel: true
        },
        // {
        //   headerName: "등록",
        //   field: "onUserName",
        //   width: 80,
        //   tooltipValueGetter: (d:any) => d.data.onUpdateUser,
        // },        
      ]
    },
    {
      headerName: t("@COL_RESULT"), // "결과",
      children: [
        {
          headerName: t("@FINAL_JUDGMENT"), // "최종판정",
          field: "finalName",
          cellClass: "cell-silver",
          width: 100,
          filter: false,
          cellRenderer: (d: any) => {
            const getToStatusBadge = (row: Dictionary) => {
              switch(row.judgeCodeSecond || row.judgeCodeFirst){
                case 'R':
                  if(d.data.reworkApproveDtFirst || d.data.reworkApproveDtSecond){
                    return (<span className="badge bg-success">{t("@APPROVE")}</span>);         {/* 발생시간 */}
                  }
                  if(d.data.reworkRefuseDtFirst || d.data.reworkRefuseDtSecond){
                    return (<span className="badge bg-warning">{t("@COMPANION")}</span>);       {/* 발생시간 */}
                  }

                  // return (<span className="badge bg-secondary">요청</span>);
                case 'D':
                  if(d.data.defectOffDtFirst || d.data.defectOffDtSecond){
                    return (<span className="badge bg-success">{t("@COL_RELEASE")}</span>);     {/* 발생시간 */}
                  }

                  // return (<span className="badge bg-secondary">등록</span>);
                default:
                  break;
              }
            }

            if(!d.data.judgeCodeFirst && !d.data.judgeCodeSecond)
              return null;

            if(d.data.judgeCodeFirst  && d.data.judgeCodeFirst == d.data.settleCodeFirst){
              if(d.data.judgeCodeFirst == 'U') // 양품화는 상세 조회 없음
                return d.data.judgeNameFirst;

              return (
                <>
                  <a className={`interlock-judge-${d.data.judgeCodeFirst?.toLowerCase()}`} onClick={() => {
                    listApi?.toSearchHandler(d.data, 1);
                  }}>
                    <i className="fa fa-search"></i>

                    { d.data.judgeNameFirst }

                    { getToStatusBadge(d.data) }
                  </a>
                </>
              );
            }

            if(d.data.judgeCodeSecond && d.data.judgeCodeSecond == d.data.settleCodeSecond){
              if(d.data.judgeCodeSecond == 'U') // 양품화는 상세 조회 없음
                return d.data.judgeNameSecond;
                
              return (
                <>
                  <a className={`interlock-judge-${d.data.judgeCodeSecond?.toLowerCase()}`} onClick={() => {
                    listApi?.toSearchHandler(d.data, 2);
                  }}>
                    <i className="fa fa-search"></i>
                    {' '}
                    { d.data.judgeNameSecond }
                  </a>
                </>
              );
            }
    
            return null;
          }    
        }
      ]
    },       
    {
      headerName: `${t("@SYSTEM_ISSUE")}`, //"신뢰성",
      children: [
        {
          headerName: t("@REMARKS"), //"비고",
          field: "issueRemark",
          cellClass: "cell-gray",
          width: 100,
          cellRenderer: (d: any) => {
            if(!d.data.issueRemark)
              return null;

            return (
              <>
                <a className="detail-cell" onClick={() => {
                  listApi?.issueHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.issueRemark }
                </a>
              </>
            );
          }
        },           
        {
          headerName: t("@ATTACH"), //첨부,
          field: "issueAttach",
          cellClass: "cell-gray",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.issueAttach)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.issueAttach);
            if(!attachList || attachList.length <= 0)
              return null;

            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.issueAttach)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.issueAttach);
            if(!attachList || attachList.length <= 0)
              return null;

            return (
              <a onClick={async () => {
                const result = await api<any>("download", "file", attachList[0]);
                downloadFile(
                  attachList[0].name,
                  contentType.stream,
                  [result.data]
                );
              }}>
                {attachList[0]["name"]}
              </a>
            );
          }
        },      
      ]  
    }, 
    {
      headerName: t("@OPERATION_TECHNOLOGY"), //"공정기술",
      children: [
        {
          headerName: t("@COUNTERPLAN"), //"대책서[첨부]",
          field: "judgeAttachFirst",
          cellClass: "cell-yellow",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.judgeAttachFirst)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.judgeAttachFirst);
            if(!attachList || attachList.length <= 0)
              return null;

            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.judgeAttachFirst)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.judgeAttachFirst);
            if(!attachList || attachList.length <= 0)
              return null;

            return (
              <a onClick={async () => {
                const result = await api<any>("download", "file", attachList[0]);
                downloadFile(
                  attachList[0].name,
                  contentType.stream,
                  [result.data]
                );
              }}>
                {attachList[0]["name"]}
              </a>
            );
          }
        },      
      ]  
    },
    {
      headerName: t("@PRODUCT_TECHNOLOGY"), //"제품기술",
      children: [
        {
          headerName: t("@FIRST_JUDGMENT"),  //"1차판정",
          field: "judgeNameFirst",
          cellClass: "cell-yellow",
          width: 80,
          filter: false,
          cellRenderer: (d: any) => {
            if(!d.data.judgeCodeFirst)
              return null;

            return (
              <>
                <a className="detail-cell" onClick={() => {
                  listApi?.judgeFirstHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.judgeNameFirst }
                </a>
              </>
            );
          }
        },
        {
          headerName: t("@COL_PROCESSING_METHOD"), //"처리방법",
          field: "judgeMethodFirst",
          cellClass: "cell-yellow",
          width: 100,
        },
        {
          headerName: t("@DETAILED_CODE"), //"상세코드",
          field: "reworkNameFirst",
          cellClass: "cell-yellow",
          width: 120,
          filter: false,
          tooltipValueGetter: (d:any) => d.data.referenceCodeFirst && `[${d.data.referenceCodeFirst}] ${d.data.referenceNameFirstDefect || d.data.referenceNameFirstRework}`,
          cellRenderer: (d: any) => {
            if(!d.data.judgeCodeFirst)
              return null;

            if(d.data.judgeCodeFirst == 'D')
              return (
                <>
                  { d.data.referenceNameFirstDefect }
                </>
              );
            
            if(d.data.judgeCodeFirst == 'R')
              return (
                <>
                  { d.data.referenceNameFirstRework }
                </>
              );
          }
        },
      ]
    },
    {
      headerName: t("@QUALITY_DEPARTMENT"), //"품질부서",
      children: [
        {
          headerName: t("@COUNTERPLAN"), //"대책서[첨부]",
          field: "settleAttachFirst",
          cellClass: "cell-yellow",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.settleAttachFirst)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.settleAttachFirst);
            if(!attachList || attachList.length <= 0)
              return null;

            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.settleAttachFirst)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.settleAttachFirst);
            if(!attachList || attachList.length <= 0)
              return null;

            return (
              <a onClick={async () => {
                const result = await api<any>("download", "file", attachList[0]);
                downloadFile(
                  attachList[0].name,
                  contentType.stream,
                  [result.data]
                );
              }}>
                {attachList[0]["name"]}
              </a>
            );
          }
        },          
        {
          headerName: t("@FIRST_AGREEMENT"), //"1차합의",
          field: "settleNameFirst",
          cellClass: "cell-yellow",
          width: 80,
          filter: false,
          tooltipValueGetter: (d:any) => `[${d.data.settleCodeFirst}] ${d.data.settleNameFirst}`,
          cellRenderer: (d: any) => {
            if(!d.data.settleCodeFirst)
              return null;

            return (
              <>
                <a id={`interlock-popover-to-result1-${d.data.rowNo}`} className="detail-cell" onClick={() => {
                  if(d.data.judgeCodeFirst == d.data.settleCodeFirst)
                    listApi?.settleFirstHandler(d.data);
                  else
                    listApi?.denyFirstHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.settleNameFirst }
                </a>
              </>
            );
          }
        },
        {
          headerName: t("@ITEM_AGREEMENT_REASON"), //"합의사유",
          field: "settleRemarkFirst",
          cellClass: "cell-yellow",
          width: 100,
        },        
      ]
    },    
    {
      headerName: t("@OPERATION_TECHNOLOGY"),  //"공정기술",
      children: [
        {
          headerName: t("@COUNTERPLAN"), //"대책서[첨부]",
          field: "judgeAttachSecond",
          cellClass: "cell-green",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.judgeAttachSecond)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.judgeAttachSecond);
            if(!attachList || attachList.length <= 0)
              return null;

            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.judgeAttachSecond)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.judgeAttachSecond);
            if(!attachList || attachList.length <= 0)
              return null;

            return (
              <a onClick={async () => {
                const result = await api<any>("download", "file", attachList[0]);
                downloadFile(
                  attachList[0].name,
                  contentType.stream,
                  [result.data]
                );
              }}>
                {attachList[0]["name"]}
              </a>
            );
          }
        }
      ]
    },
    {
      headerName: t("@PRODUCT_TECHNOLOGY"), //"제품기술",
      children: [  
        {
          headerName: t("@SECOND_JUDGMNET"),  //"2차판정",
          field: "judgeNameSecond",
          cellClass: "cell-green",
          width: 80, 
          filter: false,
          tooltipValueGetter: (d:any) => `[${d.data.judgeCodeSecond}] ${d.data.judgeNameSecond}`,
          cellRenderer: (d: any) => {
            if(!d.data.judgeCodeSecond)
              return null;

            return (
              <>
                <a className="detail-cell" onClick={() => {
                  listApi?.judgeSecondHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.judgeNameSecond }
                </a>
              </>
            );
          }
        },
        {
          headerName: t("@COL_PROCESSING_METHOD"), //"처리방법",
          field: "judgeMethodSecond",
          cellClass: "cell-green",
          width: 100,
        },
        {
          headerName: t("@DETAILED_CODE"), //"상세코드",
          field: "reworkNameSecond",
          cellClass: "cell-green",
          width: 120,
          filter: false,
          tooltipValueGetter: (d:any) => `[${d.data.referenceCodeSecond}] ${d.data.referenceNameSecondDefect || d.data.referenceNameSecondRework}`,
          cellRenderer: (d: any) => {
            if(!d.data.judgeCodeSecond)
              return null;

            if(d.data.judgeCodeSecond == 'D')
              return (
                <>
                  { d.data.referenceNameSecondDefect }
                </>
              );
            
            if(d.data.judgeCodeSecond == 'R')
              return (
                <>
                  { d.data.referenceNameSecondRework }
                </>
              );
          }
        },
      ]
    },
    {
      headerName: t("@QUALITY_DEPARTMENT"), //"품질부서",
      children: [
        {
          headerName: t("@COUNTERPLAN"), //"대책서[첨부]",
          field: "settleAttachSecond",
          cellClass: "cell-green",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.settleAttachSecond)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.settleAttachSecond);
            if(!attachList || attachList.length <= 0)
              return null;


            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.settleAttachSecond)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.settleAttachSecond);
            if(!attachList || attachList.length <= 0)
              return null;

            return (
              <a onClick={async () => {
                const result = await api<any>("download", "file", attachList[0]);
                downloadFile(
                  attachList[0].name,
                  contentType.stream,
                  [result.data]
                );
              }}>
                {attachList[0]["name"]}
              </a>
            );
          }
        },              
        {
          headerName: t("@SECOND_AGREEMENT"), //"2차합의",
          field: "settleNameSecond",
          cellClass: "cell-green",
          width: 80,
          filter: false,
          tooltipValueGetter: (d:any) => `[${d.data.settleCodeSecond}] ${d.data.settleNameSecond}`,
          cellRenderer: (d: any) => {
            if(!d.data.settleCodeSecond)
              return null;
    
            return (
              <>
                <a id={`interlock-popover-to-result2-${d.data.rowNo}`} className="detail-cell" onClick={() => {
                  listApi?.settleSecondHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.settleNameSecond }
                </a>
              </>
            );
          }    
        },
        {
          headerName: t("@ITEM_AGREEMENT_REASON"), //"합의사유",
          field: "settleRemarkSecond",
          cellClass: "cell-green",
          width: 100,
        },         
      ]
    },
    {
      headerName: t("@FIRST_JUDGMENT"), // 1차
      children: [
        {
          headerName: `${t("@COL_JUDGMENT")} ${t("@COL_DATE")}`, //"판정 일시",
          field: "judgeDtFirst",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.judgeDtFirst, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.judgeDtFirst),
        },
        {
          headerName: `${t("@AGREEMENT")} ${t("@COL_DATE")}`, //"합의 일시",
          field: "settleDtFirst",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.settleDtFirst, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.settleDtFirst),
        },
      ]
    },
    {
      headerName: t("@SECOND_JUDGMNET"), // 2차
      children: [
        {
          headerName: `${t("@COL_JUDGMENT")} ${t("@COL_DATE")}`, //"판정 일시",
          field: "judgeDtSecond",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.judgeDtSecond, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.judgeDtSecond),
        },
        {
          headerName: `${t("@AGREEMENT")} ${t("@COL_DATE")}`, //"합의 일시",
          field: "settleDtSecond",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.settleDtSecond, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.settleDtSecond),
        },
      ]
    },    
    {
      headerName: "4M",
      children: [
        {
          headerName: t("@JUDGE_TIME"), //"판정시간",
          field: "maxOnDt",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.maxOnDt, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.maxOnDt),
        },
        {
          headerName: "4M Start",
          field: "startDt4M",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.startDt4M, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.startDt4M),
        },
        {
          headerName: "4M End",
          field: "endDt4M",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.endDt4M, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.endDt4M),
        },
      ]
    },
    // {
    //   headerName: "제품명",
    //   field: "itemDescription",
    //   width: 150,
    //   tooltipValueGetter: (d:any) => d.data.itemDescription,
    // },

    // {
    //   headerName: "등록자",
    //   field: "onUpdateUserName",
    //   width: 70,
    // },
    // {
    //   headerName: "등록시간",
    //   field: "onDt",
    //   width: 90,
    //   valueFormatter: (d: any) => dateFormat(d.data.onDt, "MM-DD HH:mm"),   
    //   tooltipValueGetter: (d:any) => dateFormat(d.data.onDt),
    // },
  ];

  return defs;
}

export const recipeDefs = (api?: any): Dictionary[] => {
  
  const defs = [
    {
      headerName: "레시피명",
      field: "recipeName",
      width: 120,
      tooltipValueGetter: (d:any) => d.data.recipeCode,
    },
    {
      headerName: "측정값",
      field: "eqpVal",
      width: 80,
      cellRenderer: (d: any) => `${d.data.eqpMinVal}~${d.data.eqpMaxVal}`
    },
    {
      headerName: "판정",
      field: "judge",
      width: 55,
      cellRenderer: (d: any) => {
        if(!d.data.judge)
          return null;

        return (
          <>
            { judgeName(d.data.judge) }
          </>
        );
      }
    },
    {
      headerName: "기준값",
      field: "baseVal",
      width: 55,
      filter: false,
    },
    {
      headerName: "일시",
      field: "eqpStartDt",
      width: 90,
      valueFormatter: (d: any) => dateFormat(d.data.eqpStartDt, "MM-DD HH:mm"),   
      tooltipValueGetter: (d:any) => dateFormat(d.data.eqpStartDt),
    },
  ];

  return defs;
}

export const paramDefs = (api?: any): Dictionary[] => {
  
  const defs = [
    {
      headerName: "파라미터명",
      field: "paramName",
      width: 120,
      tooltipValueGetter: (d:any) => d.data.paramId,
    },
    {
      headerName: "측정값",
      field: "eqpVal",
      width: 80,
      cellRenderer: (d: any) => `${d.data.eqpMinVal}~${d.data.eqpMaxVal}`
    },
    {
      headerName: "판정",
      field: "judge",
      width: 55,
      cellRenderer: (d: any) => {
        if(!d.data.judge)
          return null;

        return (
          <>
            { judgeName(d.data.judge) }
          </>
        );
      }
    },
    {
      headerName: "STD",
      field: "std",
      width: 55,
      filter: false,
    },
    {
      headerName: "LSL~USL",
      field: "lslusl",
      width: 70,
      filter: false,
      cellRenderer: (d: any) => `${d.data.lsl}~${d.data.usl}`
    },
    {
      headerName: "LCL~UCL",
      field: "lclucl",
      width: 70,
      filter: false,
      cellRenderer: (d: any) => `${d.data.lcl}~${d.data.ucl}`
    },
    {
      headerName: "일시",
      field: "eqpStartDt",
      width: 90,
      valueFormatter: (d: any) => dateFormat(d.data.eqpStartDt, "MM-DD HH:mm"),   
      tooltipValueGetter: (d:any) => dateFormat(d.data.eqpStartDt),
    },
  ];

  return defs;
}

export const spcDefs = (api?: any): Dictionary[] => {
  
  const defs = [
    {
      headerName: "Check Type",
      field: "checkTypeDesc",
      width: 100,
      tooltipValueGetter: (d:any) => d.data.checkTypeDesc,
    },
    {
      headerName: "CheckPos",
      field: "checkPositionDesc",
      width: 70,
      filter: false,
      tooltipValueGetter: (d:any) => d.data.checkPositionDesc,
    },
    {
      headerName: "CheckNo",
      field: "checkNumberDesc",
      width: 70,
      filter: false,
      tooltipValueGetter: (d:any) => d.data.checkPositionDesc,
    },
    {
      headerName: "판정",
      field: "csStatus",
      width: 55,
      cellRenderer: (d: any) => {
        return (
          <>
            { judgeName(d.data.csStatus) }
          </>
        );
      }
    },
    {
      headerName: "측정값",
      field: "inspVal",
      width: 80,
    },
    {
      headerName: "고객Min",
      field: "custMin",
      width: 80,
    },
    {
      headerName: "고객Max",
      field: "custMax",
      width: 80,
    },
    {
      headerName: "내부Min",
      field: "innerMin",
      width: 80,
    },
    {
      headerName: "내부Max",
      field: "innerMax",
      width: 80,
    },
  ];

  return defs;
}

export const qtimeDefs = (api?: any): Dictionary[] => {
  
  const defs = [
    {
      headerName: "내부Max",
      field: "innerMax",
      width: 80,
    },
  ];

  return defs;
}

export const defectDefs = (api?: any): Dictionary[] => {
  const { t } = useTranslation();
  const defs = [
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      width: 40,
      filter: false,
    },    
    {
      headerName: t("@COL_PANEL_BARCODE"), //"판넬바코드",
      field: "panelId",
      width: 210,
      tooltipValueGetter: (d:any) => d.data.panelId,
    },
    {
      headerName: t("@COL_DISPOSAL_STATUS"), //"폐기상태",
      field: "defectStatus",
      width: 100,
      cellRenderer: (d: any) => {
        if(d.data.offDt){
          return (
            <>
              <span className="judge-ok">
                {/* 폐기해제 */}
                {`${t("@COL_DISPOSAL")}${t("@COL_RELEASE")}`}
              </span>
            </>
          );
        }else{
          return (
            <>
              <span>
                {/* 폐기사유 */}
              {`${t("@COL_DISPOSAL")}${t("@@COL_REASON")}`}
              </span>
            </>
          );
        }
      }
    },
    {
      headerName: t("@COL_DISPOSAL_CANCELLATION"), //"폐기해제 사유",
      field: "offRemark",
      width: 150,
      tooltipValueGetter: (d:any) => d.data.offRemark,
    },
    {
      headerName: `${t("@COL_RELEASE")}${t("@COL_EMPLOYEE")}`, //"해제 직원",
      field: "offUpdateUser",
      width: 100,
      tooltipValueGetter: (d:any) => d.data.offUpdateUserName,
    },
    {
      headerName: `${t("@COL_RELEASE")}${t("@COL_DATE")}`, //"해제 일시",
      field: "offDt",
      width: 90,
      valueFormatter: (d: any) => dateFormat(d.data.offDt, "MM-DD HH:mm"),   
      tooltipValueGetter: (d:any) => dateFormat(d.data.offDt),
    },    
  ];

  return defs;
}

export const reworkDefs = (api?: any): Dictionary[] => {
  const { t } = useTranslation();
  const defs = [
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      width: 40,
      filter: false,
    },    
    {
      headerName: "판넬바코드",
      field: "panelId",
      width: 210,
      tooltipValueGetter: (d:any) => d.data.panelId,
    },
    {
      headerName: "재처리상태",
      field: "reworkStatus",
      width: 100,
      cellRenderer: (d: any) => {
        if(d.data.approveDt){
          return (
            <>
              <span className="judge-ok">
                재처리승인
              </span>
            </>
          );
        }else if(d.data.refustDt){
          return (
            <>
              <span className="judge-ng">
                재처리반려
              </span>
            </>
          );
        }else{
          return (
            <>
              <span>
                재처리요청
              </span>
            </>
          );
        }
      }
    },
    {
      headerName: "재처리 승인 조건",
      field: "approveRemark",
      width: 130,
      tooltipValueGetter: (d:any) => d.data.approveRemark,
    },
    {
      headerName: "승인 담당자",
      field: "approveUpdateUser",
      width: 100,
      tooltipValueGetter: (d:any) => d.data.approveUpdateUserName,
    },
    {
      headerName: "승인 일시",
      field: "approveDt",
      width: 90,
      valueFormatter: (d: any) => dateFormat(d.data.approveDt, "MM-DD HH:mm"),   
      tooltipValueGetter: (d:any) => dateFormat(d.data.approveDt),
    },      
    {
      headerName: "재처리 반려 사유",
      field: "refuseRemark",
      width: 130,
      tooltipValueGetter: (d:any) => d.data.refuseRemark,
    },
    {
      headerName: "반려 담당자",
      field: "refuseUpdateUser",
      width: 100,
      tooltipValueGetter: (d:any) => d.data.refuseUpdateUserName,
    },
    {
      headerName: "반려 일시",
      field: "refuseDt",
      width: 90,
      valueFormatter: (d: any) => dateFormat(d.data.refuseDt, "MM-DD HH:mm"),   
      tooltipValueGetter: (d:any) => dateFormat(d.data.refuseDt),
    },      
  ];

  return defs;
}