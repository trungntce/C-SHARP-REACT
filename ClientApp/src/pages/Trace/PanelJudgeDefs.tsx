import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PopoverBody, PopoverHeader, Table, UncontrolledPopover, UncontrolledTooltip } from "reactstrap";
import api from "../../common/api";
import { Dictionary } from "../../common/types";
import { dateFormat, dayFormat, executeIdle, percentFormat, floatFormat, devideFormat, currencyFormat, toHHMM, isNullOrWhitespace } from "../../common/utility";
import LotInfo from "./LotInfo";
import { judgeName } from "./TraceDefs";

export const workorderOperDefs = (): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      field: "operSeqNo",
      headerName: "공순",
      width: 55,
    },
    {
      field: "operName",
      headerName: "공정명",
      width: 155,
    },
    {
      field: "eqpName",
      headerName: "설비명",
      width: 130,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },
    {
      field: "panelCnt",
      headerName: "판넬",
      width: 55,
      filter: 'agNumberColumnFilter',
    },    
    {
      headerName: "인터락발생설정",
      headerClass: "no-leftborder",
      children: [
        {
          field: "recipeInterlockYn",
          headerName: "SV",
          width: 55,
          filter: false,
          cellRenderer: (d: any) => {
            if(d.data.recipeInterlockYn != 'Y')
              return null;
    
            return (
              <>
                <i className="fa fa-check judge-ok"></i>
              </>
            );
          }
        },      
        {
          field: "paramInterlockYn",
          headerName: "PV",
          width: 55,
          filter: false,
          cellRenderer: (d: any) => {
            if(d.data.paramInterlockYn != 'Y')
              return null;
    
            return (
              <>
                <i className="fa fa-check judge-ok"></i>
              </>
            );
          }
        },      
          ]
    },
    {
      field: "startDt",
      headerName: "Start",
      valueFormatter: (d: any) => dateFormat(d.data.startDt, "MM-DD HH:mm"),
      width: 90,
    },
    {
      field: "endDt",
      headerName: "End",
      valueFormatter: (d: any) => dateFormat(d.data.endDt, "MM-DD HH:mm"),
      width: 90,
    },
  ];

  return defs;
}

export const panelJudgeDefs = (): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: "판넬바코드",
      field: "panelId",
      width: 210,
      tooltipValueGetter: (d:any) => d.data.panelId,
      cellRenderer: (d: any) => {
        return (
          <>
            { d.data.deviceId == "AUTO_GEN_ID" ? (<span className="badge bg-success cell-re-ini">A</span>) : null }
            { d.data.deviceId == "AUTO_GEN_BY_LOG" ? (<span className="badge bg-primary cell-re-ini">R</span>) : null }
            {d.data.panelId}
          </>
        );
      }
    },
    {
      field: "interlockYn",
      headerName: "인터락",
      filter: false,
      width: 50,
      cellRenderer: (d: any) => {
        if(!d.data.panelInterlockYn || d.data.panelInterlockYn == 'N')
          return null;

        return (
          <>
            <i className="fa fa-check judge-ng"></i>
          </>
        );
      }
    },

    {
      field: "spcJudge",
      headerName: "SPC",
      width: 40,
      filter: false,
      cellRenderer: (d: any) => judgeName(d.data.spcJudge)
    },
    {
      field: "qtimeJudge",
      headerName: "QTime",
      width: 50,
      filter: false,
      cellRenderer: (d: any) => judgeName(d.data.qtimeJudge)
    },
    {
      field: "chemJudge",
      headerName: "약품",
      width: 40,
      filter: false,
      cellRenderer: (d: any) => judgeName(d.data.chemJudge)
    },
    {
      field: "recipe",
      headerName: "SV 정상/전체/결과",
      width: 120,
      filter: false,
      cellRenderer: (d: any) => `${d.data.recipeValidCnt || 'X'}/${d.data.recipeAllCnt || 'X'}/${d.data.panelRecipeCnt || 'X'}`
    }, 
    {
      field: "recipe",
      headerName: "PV 정상/전체/결과",
      width: 120,
      filter: false,
      cellRenderer: (d: any) => `${d.data.paramValidCnt || 'X'}/${d.data.paramAllCnt || 'X'}/${d.data.panelParamCnt || 'X'}`
    }, 
    {
      field: "panelInterlockRecipeCnt",
      headerName: "SV인터락",
      width: 70,
      filter: false,
    },     
    {
      field: "panelInterlockParamCnt",
      headerName: "PV인터락",
      width: 70,
      filter: false,
    },
    {
      field: "recipeJudgeTest",
      headerName: "SV재판정",
      width: 100,
      filter: false,
      cellRenderer: (d: any) => {
        const popoverRef = useRef<any>();

        const [list, setList] = useState<any>([]);

        const searchHandler = async () => {
          setList([]);
          const result = await api<Dictionary[]>("get", "trace/recipeex", 
          {
            fromDt: d.data.createDt,
            toDt: d.data.nextCreateDt,
            eqpCode: d.data.eqpCode, 
            modelCode: d.data.modelCode,
            operSeqNo: d.data.operSeqNo
          });

          if(result?.data?.length){
            setList(result.data);
          }
        }

        return (
          <>
            <a id={`dx-popover-recipe-${d.data.itemKey}`} onClick={searchHandler}>
              재판정</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`dx-popover-recipe-${d.data.itemKey}`} 
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
                      <th>BaseVal</th>
                      <th>Eqp Val</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>
                            <span
                              id={`trace-popover-recipe-inner-${i}`}>
                              {x["recipeName"]}
                            </span>
                            <UncontrolledTooltip
                              target={`trace-popover-recipe-inner-${i}`}
                              placement="top"
                              className="raw-tooltip-container"
                            >
                              <span className="raw-tablename">[{x["tableName"]}]</span> {x["columnName"]}
                              <br />
                              {x["recipeName"]}
                            </UncontrolledTooltip>
                          </td>
                          <td>{judgeName(x["judge"])}</td>
                          <td>{x["baseVal"]}</td>
                          <td>
                            {x["minVal"]} ~ {x["maxVal"]}
                          </td>
                          <td>{dateFormat(x["minDt"], 'HH:mm:ss')}</td>
                          <td>{dateFormat(x["maxDt"], 'HH:mm:ss')}</td>
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
      field: "paramJudgeTest",
      headerName: "PV재판정",
      width: 100,
      filter: false,
      cellRenderer: (d: any) => {
        const popoverRef = useRef<any>();

        const [list, setList] = useState<any>([]);

        const searchHandler = async () => {
          setList([]);
          const result = await api<Dictionary[]>("get", "trace/paramex", 
          {
            fromDt: d.data.createDt,
            toDt: d.data.nextCreateDt,
            eqpCode: d.data.eqpCode, 
            modelCode: d.data.modelCode,
            operSeqNo: d.data.operSeqNo
          });

          if(result?.data?.length){
            setList(result.data);
          }
        }

        return (
          <>
            <a id={`dx-popover-param-${d.data.itemKey}`} onClick={searchHandler}>
              재판정</a>
            <UncontrolledPopover 
              // trigger="legacy"
              ref={popoverRef}
              target={`dx-popover-param-${d.data.itemKey}`} 
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
                    {list.map((x: Dictionary, i: number) => (
                      (
                        <tr key={i}>
                          <td>
                            <span
                              id={`trace-popover-param-inner-${i}`}>
                              {x["paramName"]}
                            </span>
                            <UncontrolledTooltip
                              target={`trace-popover-param-inner-${i}`}
                              placement="top"
                              className="raw-tooltip-container"
                            >
                              <span className="raw-tablename">[{x["tableName"]}]</span> {x["columnName"]}
                              <br />
                              {x["paramName"]}
                            </UncontrolledTooltip>
                          </td>
                          <td>{judgeName(x["judge"])}</td>
                          <td>{x["lsl"]}</td>
                          <td>{x["usl"]}</td>
                          <td>{x["lcl"]}</td>
                          <td>{x["ucl"]}</td>
                          <td>
                            {x["minVal"]} ~ {x["maxVal"]}
                          </td>
                          <td>{dateFormat(x["minDt"], 'HH:mm:ss')}</td>
                          <td>{dateFormat(x["maxDt"], 'HH:mm:ss')}</td>
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
  ];

  return defs;
}