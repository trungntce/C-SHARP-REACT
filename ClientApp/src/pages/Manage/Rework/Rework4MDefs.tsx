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

export const rework4MDefs = (listApi?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: t("@COL_BASIC_INFORMATION"),  //"기본정보",
      children: [
        { 
          headerCheckboxSelection: true,
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
      ]
    },
    {
      headerName: "재처리 진행상태",
      children: [
        {
          headerName: "진행/반려",
          field: "judgeNameFirst",
          cellClass: "cell-yellow",
          width: 80,
          filter: false,
        },
        {
          headerName: "사유",
          field: "judgeNameFirst",
          cellClass: "cell-yellow",
          width: 80,
          filter: false,
        },
        {
          headerName: "지정설비",
          field: "judgeNameFirst",
          cellClass: "cell-yellow",
          width: 80,
          filter: false,
        },
        {
          headerName: "담당자",
          field: "judgeNameFirst",
          cellClass: "cell-yellow",
          width: 80,
          filter: false,
        },
      ]
    },        
    {
      headerName: t("@COL_INTERLOCK"), //"인터락",
      children: [
        {
          headerName: t("@COL_DIVISION"), // "구분",
          field: "gubun",
          width: 55,
        },        
        {
          headerName: t("@CLASSIFICATION"), // "분류",
          field: "interlockNameMajor",
          width: 120,
          tooltipValueGetter: (d:any) => `[${d.data.interlockCodeMajor}] ${d.data.interlockNameMajor}`,
          valueFormatter: (d: any) => getLang(d.data.interlockNameMajor),
        },
        {
          headerName: t("@PANEL") ,  //판넬
          field: "panelCnt",
          width: 40,
          filter: false
        },
        {
          headerName: "재처리 판정사유", 
          field: "judgeNameFirst",
          cellClass: "cell-yellow",
          width: 120,
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
          field: "panelJson",
          width: 0,
          filter: false,
          hide: true,
          suppressToolPanel: true
        },
      ]
    },
    {
      headerName: "4M",
      children: [
        {
          headerName: "등록시간",
          field: "maxOnDt",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.maxOnDt, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.maxOnDt),
        },
        {
          headerName: "처리시간",
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
  ];

  return defs;
}