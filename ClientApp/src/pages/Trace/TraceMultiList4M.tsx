import { CellDoubleClickedEvent, RowClassParams, RowHeightParams, SelectionChangedEvent } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Modal, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import { traceDefs } from "./TraceDefs";
import style from "./Trace.module.scss";
import ParamChart from "./ParamChart";
import RecipeChart from "./RecipeChart";
import DateTimePicker from "../../components/Common/DateTimePicker";
import AutoCombo from "../../components/Common/AutoCombo";
import ParamChartEx from "./ParamChartEx";
import RecipeChartEx from "./RecipeChartEx";
import { alertBox } from "../../components/MessageBox/Alert";
import { panelDefs } from "./PanelDefs";
import api from "../../common/api";
import { pieceDefs } from "./TracePieceDefs";
import PanelDefectEdit from "./PanelDefectEdit";
import PanelInserlockEdit from "./PanelInserlockEdit";
import MultiAutoCombo from "../../components/Common/MultiAutoCombo";
import { isNullOrWhitespace, showLoading } from "../../common/utility";
import { useTranslation } from "react-i18next";

const TraceMultiList4M = () => {
  const { t } = useTranslation(); 
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();

  const paramChartRefEx = useRef<any>();
  const recipeChartRefEx = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [grid4MRef, set4MList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();
  const [pcsGridRef, setPcsList] = useGridRef();

  const panelInterlockEditRef = useRef<any>();
  const panelDefectEditRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();

    const fromDt = moment.utc(search["fromDt"]);
    const toDt = moment.utc(search["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

    if(days > 365)
    {
      alertBox(t("@MSG_SELECT_MAX_DAY_365"));          //조회기간은 최대 365일입니다.
      return;
    }

    const isJsonEmpty = (json: string) => {
      if(isNullOrWhitespace(json))
        return true;
        
      const parse = JSON.parse(json);
      return !parse || !parse.length;
    }

    if(isJsonEmpty(search["operJson"]) && 
      isJsonEmpty(search["modelJson"]) && 
      isJsonEmpty(search["eqpJson"]) && 
      isJsonEmpty(search["workerJson"]) && 
      isJsonEmpty(search["toolJson"]) && 
      isJsonEmpty(search["matLotJson"]) && 
      isJsonEmpty(search["matCodeJson"]) && 
      isJsonEmpty(search["recipeJson"]) && 
      isJsonEmpty(search["paramJson"])){
        alertBox(t("@SEARCH_ONE_MORE_SELECT"));  //검색조건을 하나이상 입력해 주세요.
        return;
    }

    showLoading(grid4MRef, true);

    const queryParam = { fromDt: search["fromDt"], toDt: search["toDt"] };
    const query = new URLSearchParams(queryParam);

    const postParam = { ...search };
    delete postParam["fromDt"];
    delete postParam["toDt"];

    api<any>("post", `trace/4m/multi?${query.toString()}`, postParam).catch(error => {
      alertBox(error.response.data?.detail ?? t("SYSTEM_ERROR_TO_OCCUR"));           //시스템 오류가 발생했습니다.
      showLoading(grid4MRef, false);
      return;
    }).then((result: any) => {
      if(result.data)
        set4MList(result.data);
        setPanelList([]);
        setPcsList([]);
    });
  };

  const getPanelRef = () => {
    const panel = panelDefs({pcsSearch});
    const trace = traceDefs((defs: Dictionary[]) => {
      return defs.filter(x => x.field == "recipeJudgeName" || x.field == "paramJudgeName");
    }, { 
      paramChart: (row: Dictionary) => {
        paramChartRef.current.setSearch(row);
        paramChartRef.current.setShowModal(true);
      },
      recipeChart: (row: Dictionary) => {
        recipeChartRef.current.setSearch(row);
        recipeChartRef.current.setShowModal(true);
      },
    });

    return merge(panel, trace, 3);
  }

  const lotSelectionChangedHandler = () => {
    const rows = grid4MRef.current!.api.getSelectedRows();
    if(rows.length <= 0)
      return;

    const groupList = rows.map(({ groupKey }) => groupKey).join(',');

    panelGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/panelbygroup", { "groupKey": groupList }).then((result: Dictionary) => {
      if(result.data)
      setPanelList(result.data);
    });
  }

  const pcsSearch = (row: Dictionary) => {
    showLoading(pcsGridRef, true);
    api("get", "trace/piecemap", { "panelId": row.panelId }).then((result: Dictionary) => {
      if(result.data)
      setPcsList(result.data);
    });
  }

  const merge = (a: any[], b: any[], i = 0) => {
    return a.slice(0, i).concat(b, a.slice(i));
  }

  useEffect(() => {    
  }, []);

  return (
    <>
      <ListBase
        className={style.traceMulti4MContainer}
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button type="button" color="primary" onClick={() => {
              const rows = panelGridRef.current!.api.getSelectedRows();
              if(rows.length <= 0)
              {
                alertBox(t("@MSG_PLEASE_SELECT_PANEL"));     //판넬을 선택해 주세요.
                return;
              }

              panelInterlockEditRef.current.setList(rows);
              panelInterlockEditRef.current.setShowModal(true);
            }}>
              <i className="uil uil-edit me-2"></i> {t("@SELECT_LIST_INTERLOCK_YN")} {/*선택항목 인터락 설정/해제*/}
            </Button>
            <Button type="button" color="info" onClick={() => {
              const rows = panelGridRef.current!.api.getSelectedRows(); 
              if(rows.length <= 0)
              {
                alertBox(t("@MSG_PLEASE_SELECT_PANEL"));     //판넬을 선택해 주세요.
                return;
              }

              panelDefectEditRef.current.setList(rows);
              panelDefectEditRef.current.setShowModal(true);
            }}>
              <i className="uil uil-edit me-2"></i> {t("@SELECT_LIST_DEFECT_YN")} {/*선택항목 불량 등록/해제*/} 
            </Button>
          </div>
        }
        editHandler={() => {
        }}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
          >
            <Row>
              <Col style={{ minWidth: "155px", maxWidth: "155px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-2, 'days').toDate()}  placeholderText={t("@SEARCH_START_DATE")} 
                  showTimeInput={true}  required={true} /> {/* 조회시작 */}
              </Col>
              <Col style={{ minWidth: "155px", maxWidth: "155px" }}>
                <DateTimePicker name="toDt" placeholderText={t("@SEARCH_END_DATE")} 
                  showTimeInput={true}  required={true} /> {/* 조회종료 */}
              </Col>
              <Col>
                <MultiAutoCombo name="operJson" sx={{ minWidth: "230px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="operext" /> {/* 공정코드 */}
              </Col>
              <Col>
                <MultiAutoCombo name="modelJson" sx={{ minWidth: "230px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" /> {/* 모델코드 */}
              </Col>
              <Col>
                <MultiAutoCombo name="eqpJson" sx={{ minWidth: "230px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" /> {/* 설비코드 */}
              </Col>
              <Col>
                <MultiAutoCombo name="workerJson" sx={{ minWidth: "230px" }} placeholder={t("@WORKER")} mapCode="person" /> {/* 작업자 */}
              </Col>
              <Col>
                <MultiAutoCombo name="toolJson" sx={{ minWidth: "230px" }} placeholder={`${t("@COL_TOOL")}`} mapCode="tool4m" />     {/*툴코드*/}
              </Col>
              <Col>
                <MultiAutoCombo name="matLotJson" sx={{ minWidth: "230px" }} placeholder={`${t("@MATERIAL")}BATCH`} mapCode="matlot4m" /> {/* 자재BATCH */}
              </Col>
              <Col>
                <MultiAutoCombo name="matCodeJson" sx={{ minWidth: "230px" }} placeholder={t("@MATERIAL_CODE")} mapCode="matcode4m" /> {/* 자재코드 */}
              </Col>
              <Col>
                <MultiAutoCombo name="recipeJson" sx={{ minWidth: "230px" }} placeholder="SV" mapCode="recipe" />
              </Col>
              <Col>
                <MultiAutoCombo name="paramJson" sx={{ minWidth: "230px" }} placeholder="PV" mapCode="param" />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
          <Col id="grid-left-container">
            <Row style={{ height: "100%" }}>
              <Col md={8} className={style.traceWrap}>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={grid4MRef}
                    columnDefs={traceDefs((defs: Dictionary[]) => {
                      const fieldList = [
                        "modelCode", "operSeqNo", "operDescription", "workorder4M", "eqpName", 
                        "materialName", "toolName", "workerName", 
                        "recipeJudgeName4M", "paramJudgeName4M", 
                        "startDt", "endDt"];

                      const filtered = defs.filter(x => fieldList.indexOf(x.field) >= 0 || x.headerClass == "multi4m");
                      
                      return filtered;
                    }, { 
                      paramChartEx: (row: Dictionary) => {
                        paramChartRefEx.current.setSearch(row);
                        paramChartRefEx.current.setShowModal(true);
                      },
                      recipeChartEx: (row: Dictionary) => {
                        recipeChartRefEx.current.setSearch(row);
                        recipeChartRefEx.current.setShowModal(true);
                      },
                    })}
                    rowSelection={'multiple'}
                    onSelectionChanged={() => { lotSelectionChangedHandler(); }}
                    suppressRowClickSelection={true}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}                                        
                    onGridReady={() => {
                      set4MList([]);
                    }}
                  />
                </div>              
              </Col>
              <Col md={4}>
                <div style={{ height: "100%" }}>
                  <Row className="pb-2" style={{ height: "60%" }}>
                    <Col>
                      <GridBase
                        ref={panelGridRef}
                        columnDefs={(() => {
                          return getPanelRef();
                        })()}
                        rowSelection={'multiple'}
                        suppressRowClickSelection={true}
                        tooltipShowDelay={0}
                        tooltipHideDelay={1000}                    
                        onGridReady={() => {
                          setPanelList([]);
                        }}
                      />
                    </Col>
                  </Row>
                    <Row className="pb-2" style={{ height: "40%" }}>
                    <Col>
                      <GridBase
                        ref={pcsGridRef}
                        columnDefs={(() => {
                          return pieceDefs().filter(x => x.field != "operDescription");
                        })()}
                        rowMultiSelectWithClick={false}
                        tooltipShowDelay={0}
                        tooltipHideDelay={1000}                            
                        onGridReady={() => {
                          setPcsList([]);
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>          
        </Row>
      </ListBase>

      <PanelInserlockEdit
        ref={panelInterlockEditRef}
        onComplete={() => {
          lotSelectionChangedHandler();
          panelInterlockEditRef.current.setShowModal(false);
        }}
      />

      <PanelDefectEdit
        ref={panelDefectEditRef}
        onComplete={() => {
          lotSelectionChangedHandler();
          panelDefectEditRef.current.setShowModal(false);
        }}
      />

      <ParamChart
        ref={paramChartRef}
        initHandler={() => {}}
      />

      <ParamChartEx
        ref={paramChartRefEx}
        initHandler={() => {}}
      />

      <RecipeChart
        ref={recipeChartRef}
        initHandler={() => {}}
      />

      <RecipeChartEx
        ref={recipeChartRefEx}
        initHandler={() => {}}
      />
    </>
  );
};

export default TraceMultiList4M;
