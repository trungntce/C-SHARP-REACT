import { ColDef } from "ag-grid-community";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import api from "../../../common/api";
import { contentType, Dictionary, UploadFile } from "../../../common/types";
import { dateFormat, downloadFile, executeIdle, getLang, getLangAll, percentFormat } from "../../../common/utility";
import LotInfo from "../../Trace/LotInfo";
import { judgeName } from "../../Trace/TraceDefs";
import { fdcDefectTypeName, fdcdetailGroupName } from "./FdcOperStdDefs";

export const fdcInterlockDefs = (listApi?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: "상태",
      headerClass: "no-leftborder",
      children: [
        { 
          headerClass: "multi4m", 
          headerCheckboxSelection: false,
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
          field: "status",
          headerName: t("@COMPLETE"),//"완료",
          filter: false,
          width: 40,
          cellRenderer: (d: any) => {
            if(d.data.handleDt  && d.data.settleDt){
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
          headerName: t("@COL_INTERLOCK"),//"인터락",
          filter: false,
          width: 50,
          cellRenderer: (d: any) => {
            if(!d.data.workorderInterlockCode)
              return null;
    
            return (
              <>
                <i className="fa fa-check judge-ng"></i>
              </>
            );
          },
          pinned: true
        },  
      ]
    },
    {
      headerName: t("@COL_BASIC_INFORMATION"),//"기본정보",
      headerClass: "no-leftborder",
      children: [
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
                <a id={`trace-popover-lot-${d.node.rowIndex}`} onClick={searchHandler}>
                  <i className="fa fa-search text-muted"></i>
                  {' '}
                  <span>
                    {d.data.workorder}
                  </span>
                </a>
                <UncontrolledPopover 
                  // trigger="legacy"
                  ref={popoverRef}
                  target={`trace-popover-lot-${d.node.rowIndex}`}
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
                        <i className="uil uil-times me-2"></i> {t("@CLOSE")} {/* 닫기 */}
                      </Button>
                    </div>
                  </PopoverBody>
                </UncontrolledPopover>
              </>
            );
          }
        },        
        {
          headerName: t("@COL_MODEL_CODE"),//"모델코드",
          field: "modelCode",
          width: 160,
          tooltipValueGetter: (d:any) => d.data.modelCode,
        },
        {
          headerName: t("@COL_MODEL_NAME"),//"모델명",
          field: "modelName",
          width: 200,
          tooltipValueGetter: (d:any) => d.data.modelName,
        },
        {
          headerName: t("@COL_EQP_NAME"),//"설비명",
          field: "eqpName",
          width: 160,
          cellRenderer: (d: any) => {
            if(!d.data.eqpJson)
              return null;

            const list = JSON.parse(d.data.eqpJson);
            if(!list || !list.length)
              return null;
    
            return (
              <>
                <a id={`fdc-popover-eqp-${d.node.rowIndex}`}>
                  { list.length > 1 ? (
                    <>
                      <i className="fa fa-search"></i>{' '}
                    </>) : "" }
                  <span>
                    {list[0].eqpName}
                  </span>
                </a>
                <UncontrolledPopover
                  trigger="legacy"
                  target={`fdc-popover-eqp-${d.node.rowIndex}`}
                  placement="right"
                  className="trace-popover-container"
                >
                  <PopoverHeader>설비 List</PopoverHeader>
                  <PopoverBody>
                    <Table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>{t("@COL_EQP_CODE")}</th>  {/* 설비코드 */}
                          <th>{t("@COL_EQP_NAME")}</th>  {/* 설비명 */}
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((x: Dictionary, i: number) => (
                          <tr key={i}>
                            <th>{x["eqpCode"]}</th>
                            <th>{x["eqpName"]}</th>
                          </tr>
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
          headerName: t("@COL_DIVISION"),//"구분",
          field: "fdcTypeName",
          width: 150,
          valueFormatter: (d: any) => getLang(d.data.fdcTypeName),
        },
        {
          headerName: t("@DEFECT_GROUP"), //"불량그룹",
          field: "detailTypeName",
          width: 80,
          cellRenderer: fdcdetailGroupName
        },
        {
          headerName: t("@DETAILED_ITEM_NAME"), //"세부항목명",
          field: "defectName",
          width: 100,
          cellRenderer: fdcDefectTypeName
        },
        {
          headerName: t("@PANEL"),//"판넬",
          field: "panelCnt",
          width: 40,
          filter: false
        },
      ]
    },
    {
      headerName: t("@COL_STANDARD_INFORMATION"),//"기준정보",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: t("@COL_DIVISION"),//"구분",
          field: "fdcTypeName",
          width: 150,
          valueFormatter: (d: any) => getLang(d.data.fdcTypeName),
        },
        {
          field: "stdDefectRate",
          headerName: t("@COL_STANDARD_DEFECTRATE"),//"기준불량률",
          width: 80,
          filter: false,
          cellClass: "cell-purple cell-right fw-bold",
          cellRenderer: (d: any) => {
            if(!d.data.stdDefectRate && d.data.stdDefectRate != 0)
              return null;
    
            return percentFormat(d.data.stdDefectRate, 2);
          }
        },
        // {
        //   headerName: "공정구분",
        //   field: "operTypeName",
        //   width: 90,
        //   tooltipValueGetter: (d:any) => `${d.data.operTypeName}`,
        // },
      ]
    },    
    {
      headerName: t("@COL_PROCESSING"),//"처리",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: "처리구분",
          field: "handleName",
          cellClass: "cell-yellow fw-bold",
          width: 80,
        },        
        {
          headerName: t("@COL_PROCESSING_METHOD"),//"처리방법",
          field: "handleRemark",
          cellClass: "cell-yellow",
          width: 150,
          filter: false,
          cellRenderer: (d: any) => {
            if(!d.data.handleRemark)
              return null;

            return (
              <>
                <a className="detail-cell" onClick={() => {
                  listApi?.handleHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.handleRemark }
                </a>
              </>
            );
          }
        },
        {
          headerName: t("@ATTACH"),//"첨부",
          field: "handleAttach",
          cellClass: "cell-yellow",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.handleAttach)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.handleAttach);

            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.handleAttach)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.handleAttach);

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
      headerName: t("@AGREEMENT"),//"합의",
      children: [
        {
          headerName: t("@ITEM_AGREEMENT_REASON"),//"합의사유",
          field: "settleRemark",
          cellClass: "cell-green",
          width: 150,
          filter: false,
          tooltipValueGetter: (d:any) => `${d.data.settleRemark}`,
          cellRenderer: (d: any) => {
            if(!d.data.settleRemark)
              return null;

            return (
              <>
                <a className="detail-cell" onClick={() => {
                  listApi?.settleHandler(d.data);
                }}>
                  <i className={`fa fa-search`}></i>
                  {' '}
                  { d.data.settleRemark }
                </a>
              </>
            );
          }
        },
        {
          headerName: t("@ATTACH"),//"첨부",
          field: "settleAttach",
          cellClass: "cell-green",
          width: 130,
          filter: false,
          tooltipValueGetter: (d: any) => {
            if(!d.data.settleAttach)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.settleAttach);

            return attachList[0]["name"];

          },
          cellRenderer: (d: any) => {
            if(!d.data.settleAttach)
              return;

            const attachList: UploadFile[] = JSON.parse(d.data.settleAttach);

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
      headerName: t("@COL_TARGET_PROCESS"),     //"대상공정",
      headerClass: "no-leftborder",
      children: [
        {
          field: "operSeqNo",
          headerName: t("@OPER_SEQ"),           //"공순",
          maxWidth: 55,
          tooltipValueGetter: (d:any) => `[${d.data.operSeqNo}] ${d.data.operCode}`,
        },
        {
          field: "operName",
          headerName: t("@COL_OPERATION_NAME"), //"공정명",
          width: 130,
          tooltipValueGetter: (d:any) => d.data.operName,
          cellRenderer: (d: any) => {
            if(!d.data.operName)
              return null;

            if(d.data.operType == "AOI"){
              return (
                <>
                  <a onClick={() => {
                    window.open(`/aoivrs/${d.data.workorder}/${dateFormat(d.data.endDt4M, "YYYY-MM-DD")}`)
                  }}>
                    <i className="uil uil-external-link-alt me-1"></i>
                    {d.data.operName}
                  </a>
                </>
              );    
            }
    
            if(d.data.operType == "BBT"){
              return (
                <>
                  <a onClick={() => {
                    window.open(`/bbtanddetail/${d.data.workorder}/${dateFormat(d.data.endDt4M, "YYYY-MM-DD")}`)
                  }}>
                    <i className="uil uil-external-link-alt me-1"></i>
                    {d.data.operName}
                  </a>
                </>
              );    
            }

            return (
              <>
                {d.data.operName}
              </>
            );
          }
        },
        {
          field: "defectRate",
          headerName: t("@COL_DEFECT_RATE"),//"불량률",
          width: 70,
          cellClass: "cell-silver cell-right fw-bold",
          cellRenderer: (d: any) => {
            if(!d.data.defectRate && d.data.defectRate != 0)
              return null;
    
            return percentFormat(d.data.defectRate, 2);
          }
        },
        {
          field: "openDefectRate",
          headerName: "Open",
          width: 70,
          cellClass: "cell-silver cell-right text-primary",
          cellRenderer: (d: any) => {
            if(!d.data.openDefectRate && d.data.openDefectRate != 0)
              return null;
    
            return percentFormat(d.data.openDefectRate, 2);
          }
        },
        {
          field: "shortDefectRate",
          headerName: "Short",
          width: 70,
          cellClass: "cell-silver cell-right text-danger",
          cellRenderer: (d: any) => {
            if(!d.data.shortDefectRate && d.data.shortDefectRate != 0)
              return null;
    
            return percentFormat(d.data.shortDefectRate, 2);
          }
        },
        // {
        //   headerName: "공정구분",
        //   field: "operTypeName",
        //   width: 90,
        //   tooltipValueGetter: (d:any) => `${d.data.operTypeName}`,
        // },
      ]
    },
    {
      headerName: `${t("@COL_TARGET_PROCESS")}2`,//"대상공정2",
      headerClass: "no-leftborder",
      children: [
        {
          field: "plusOperSeqNo",
          headerName: t("@OPER_SEQ"),//"공순",
          maxWidth: 55,
          tooltipValueGetter: (d:any) => `[${d.data.plusOperSeqNo}] ${d.data.plusOperCode}`,
        },
        {
          field: "plusOperName",
          headerName: t("@COL_OPERATION_NAME"),//"공정명",
          width: 130,
          tooltipValueGetter: (d:any) => d.data.plusOperName,
          cellRenderer: (d: any) => {
            if(!d.data.plusOperName)
              return null;
    
            return (
              <>
                <a onClick={() => {
                  window.open(`/aoivrs/${d.data.workorder}/${dateFormat(d.data.endDt4M, "YYYY-MM-DD")}`)
                }}>
                  <i className="uil uil-external-link-alt me-1"></i>
                  {d.data.plusOperName}
                </a>
              </>
            );    
          }
        },
        {
          field: "plusDefectRate",
          headerName: t("@COL_DEFECT_RATE"),//"불량률",
          width: 70,
          cellClass: "cell-silver cell-right fw-bold",
          cellRenderer: (d: any) => {
            if(!d.data.plusDefectRate && d.data.plusDefectRate != 0)
              return null;
    
            return percentFormat(d.data.plusDefectRate, 2);
          }
        },
        {
          field: "plusOpenDefectRate",
          headerName: "Open",
          width: 70,
          cellClass: "cell-silver cell-right text-primary",
          cellRenderer: (d: any) => {
            if(!d.data.plusOpenDefectRate && d.data.plusOpenDefectRate != 0)
              return null;
    
            return percentFormat(d.data.plusOpenDefectRate, 2);
          }
        },
        {
          field: "plusShortDefectRate",
          headerName: "Short",
          width: 70,
          cellClass: "cell-silver cell-right text-danger",
          cellRenderer: (d: any) => {
            if(!d.data.plusShortDefectRate && d.data.plusShortDefectRate != 0)
              return null;
    
            return percentFormat(d.data.plusShortDefectRate, 2);
          }
        },
      ]
    },
    {
      headerName: t("@COL_COMPARATIVE_PROCESS"),//"비교공정",
      headerClass: "no-leftborder",
      children: [
        {
          field: "toOperSeqNo",
          headerName: t("@OPER_SEQ"),//"공순",
          maxWidth: 55,
          tooltipValueGetter: (d:any) => `[${d.data.toOperSeqNo}] ${d.data.toOperCode}`,
        },
        {
          field: "toOperName",
          headerName: t("@COL_OPERATION_NAME"),//"공정명",
          width: 130,
          tooltipValueGetter: (d:any) => d.data.toOperName,
          cellRenderer: (d: any) => {
            if(!d.data.toOperName)
              return null;
    
            return (
              <>
                <a onClick={() => {
                  window.open(`/bbtanddetail/${d.data.workorder}/${dateFormat(d.data.endDt4M, "YYYY-MM-DD")}`)
                }}>
                  <i className="uil uil-external-link-alt me-1"></i>
                  {d.data.toOperName}
                </a>
              </>
            );    
          }
        },
        {
          field: "toDefectRate",
          headerName: t("@COL_DEFECT_RATE"),//"불량률",
          width: 70,
          cellClass: "cell-silver cell-right fw-bold",
          cellRenderer: (d: any) => {
            if(!d.data.toDefectRate && d.data.toDefectRate != 0)
              return null;
    
            return percentFormat(d.data.toDefectRate, 2);
          }
        },
        {
          field: "toOpenDefectRate",
          headerName: "Open",
          width: 70,
          cellClass: "cell-silver cell-right text-primary",
          cellRenderer: (d: any) => {
            if(!d.data.toOpenDefectRate && d.data.toOpenDefectRate != 0)
              return null;
    
            return percentFormat(d.data.toOpenDefectRate, 2);
          }
        },
        {
          field: "toShortDefectRate",
          headerName: "Short",
          width: 70,
          cellClass: "cell-silver cell-right text-danger",
          cellRenderer: (d: any) => {
            if(!d.data.toShortDefectRate && d.data.toShortDefectRate != 0)
              return null;
    
            return percentFormat(d.data.toShortDefectRate, 2);
          }
        },        
      ]
    },      
    {
      headerName: t("@COL_DATE"),//"일시",
      children: [
        {
          headerName: t("@COL_OCCURRENCE_TIME"),//"발생시간",
          field: "createDt",
          width: 90,
          filter: false,
          valueFormatter: (d: any) => dateFormat(d.data.createDt, "MM-DD HH:mm"),   
          tooltipValueGetter: (d:any) => dateFormat(d.data.createDt),
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