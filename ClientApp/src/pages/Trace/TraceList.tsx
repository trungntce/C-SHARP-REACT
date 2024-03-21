import { CellDoubleClickedEvent, RowClassParams, RowHeightParams } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import PanelSearch from "./PanelSearch";
import { traceDefs } from "./TraceDefs";
import style from "./Trace.module.scss";
import LotInfo from "./LotInfo";
import { rollDefs } from "./TraceRollDefs";
import api from "../../common/api";
import { layupDefs } from "./TraceLayupDefs";
import { pieceDefs } from "./TracePieceDefs";
import { boxDefs } from "./TraceBoxDefs";
import PieceSearch from "./PieceSearch";
import ParamChart from "./ParamChart";
import RecipeChart from "./RecipeChart";
import { alertBox } from "../../components/MessageBox/Alert";
import { useParams } from "react-router";
import { executeIdle } from "../../common/utility";

const TraceList = () => {
  const { panelId } = useParams();

  const lotRef = useRef<any>();
  const panelIdRef = useRef<any>();
  const panelSearchRef = useRef<any>();
  const pieceSearchRef = useRef<any>();
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [rollGridRef, setRollList] = useGridRef();
  const [layupGridRef, setLayupList] = useGridRef();
  const [pcsGridRef, setPcsList] = useGridRef();
  const [boxGridRef, setBoxList] = useGridRef();

  const { refetch } = useApi("trace", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    lotRef.current.searchLot(panelIdRef.current.value);

    gridRef.current!.api.setPinnedTopRowData([]);
    
    const refetched = refetch();

    refetched.then((result: Dictionary) => {
      if(result.data?.length){
        const list: Dictionary[] = result.data;

        bindList(list, false);
      }else{
        alertBox("조회된 데이터가 없습니다.");
      }
    });

    const blackHole = api<Dictionary[]>("get", "trace/blackholecnt", { panelId: panelIdRef.current.value });
    const chemJudge = api<Dictionary[]>("get", "trace/chemjudgepanelid", { panelId: panelIdRef.current.value });
    const aoiTotal = api<Dictionary[]>("get", "trace/aoipnltotal", { panelId: panelIdRef.current.value });


    Promise.allSettled([refetched, blackHole]).then((results: any) => {
      if(results[0].value?.data && results[1].value?.data){
        const listItem = results[0].value?.data;
        const listBlack = results[1].value?.data;

        executeIdle(() => {
          listBlack.forEach((black: Dictionary) => {
            const find = listItem.find((item: Dictionary) => item.operCode == black.operCode && item.workorder4M == black.workorder);
            if(!find)
              return;

              find.blackHoleList = [...find.blackHoleList ?? [], black];
          });

          bindList(listItem, false);
        });
      }else{
        if(results[0].value?.data?.length)
          bindList(results[0].value?.data, true);
      }
    });

    Promise.allSettled([refetched, chemJudge, blackHole]).then((results: any) => {
      if(results[0].value?.data && results[1].value?.data){
        const listItem = results[0].value?.data;
        const listChem = results[1].value?.data;

        executeIdle(() => {
          listChem.forEach((chem: Dictionary) => {
            const find = listItem.find((item: Dictionary) => item.rowKey4M == chem.rowKey);
            if(!find)
              return;

            find.chemJudge = chem.judge;
            find.eqpId = chem.eqpId;
          });

          bindList(listItem, true);
        });
      }else{
        if(results[0].value?.data?.length)
          bindList(results[0].value?.data, true);
      }
    });

    Promise.allSettled([refetched, aoiTotal]).then((results: any) => {
      if(results[0].value?.data && results[1].value?.data){
        const listItem = results[0].value?.data;
        const listAoi = results[1].value?.data;

        executeIdle(() => {
          listAoi.forEach((aoi: Dictionary) => {
            const find = listItem.find((item: Dictionary) => item.operSeqNo == aoi.operSeqNo);
            if(!find)
              return;

            find.aoiPcsTotal = aoi.aoiPcsTotal;
            find.aoiNgPcsTotal = aoi.aoiNgPcsTotal;
          });

          bindList(listItem, true);
        });
      }else{
        if(results[0].value?.data?.length)
          bindList(results[0].value?.data, true);
      }
    });

    rollGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/rollmap", { "panelId": panelIdRef.current.value }).then((result: Dictionary) => {
      if(result.data){
        setRollList(result.data[0]);
      }
    });

    layupGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/layup", { "panelId": panelIdRef.current.value }).then((result: Dictionary) => {
      if(result.data)
      setLayupList(result.data);
    });

    pcsGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/panelpiecemap", { "panelId": panelIdRef.current.value }).then((result: Dictionary) => {
      if(result.data)
      setPcsList(result.data);
    });
  };

  const bindList = (list: Dictionary[], isAllDone: boolean) => {
    setList(list);

    const headerRow: Dictionary = {
      recipeJudge: "",
      paramJudge: "",
      spcJudge: "",
    }
    
    if(list.some(x => x.recipeJudge == "N")){
      headerRow.recipeJudge = "N";
    }else if(list.some(x => x.recipeJudge == "C")){
      headerRow.recipeJudge = "C";
    }else if(list.some(x => x.recipeJudge == "O")){
      headerRow.recipeJudge = "O";
    }

    if(list.some(x => x.paramJudge == "N")){
      headerRow.paramJudge = "N";
    }else if(list.some(x => x.paramJudge == "C")){
      headerRow.paramJudge = "C";
    }else if(list.some(x => x.paramJudge == "O")){
      headerRow.paramJudge = "O";
    }

    if(list.some(x => x.ipqcStatus == "NG")){
      headerRow.spcJudge = "N";
    }else if(list.some(x => x.ipqcStatus == "CHK")){
      headerRow.spcJudge = "C";
    }else if(list.some(x => x.ipqcStatus == "OK")){
      headerRow.spcJudge = "O";
    }

    if(list.some(x => x.qtimeJudge == "N")){
      headerRow.qtimeJudge = "N";
    }else if(list.some(x => x.qtimeJudge == "C")){
      headerRow.qtimeJudge = "C";
    }else if(list.some(x => x.qtimeJudge == "O")){
      headerRow.qtimeJudge = "O";
    }

    if(list.some(x => x.chemJudge == "NG")){
      headerRow.chemJudge = "NG";
    }else if(list.some(x => x.chemJudge == "CHK")){
      headerRow.chemJudge = "CHK";
    }else if(list.some(x => x.chemJudge == "OK")){
      headerRow.chemJudge = "OK";
    }

    if(headerRow.recipeJudge == "N" || headerRow.paramJudge == "N" || headerRow.spcJudge == "N" || headerRow.qtimeJudge == "N" || headerRow.chemJudge == "NG"){
      headerRow.totalJudge = "N";
    }else if(headerRow.recipeJudge == "C" || headerRow.paramJudge == "C" || headerRow.spcJudge == "C" || headerRow.qtimeJudge == "C" || headerRow.chemJudge == "CHK"){
      headerRow.totalJudge = "C";
    }else if(headerRow.recipeJudge == "O" && headerRow.paramJudge == "O" && !headerRow.spcJudge){ // null 인 경우가 O로 나옴
      headerRow.totalJudge = "O";
    }

    gridRef.current!.api.setPinnedTopRowData([headerRow]);
  }

  const panelSelectedHandler = (panel: Dictionary) => {
    panelIdRef.current.value = panel.panelId;

    searchHandler();
  }

  const getRowHeight = useCallback((params: RowHeightParams) => {
    if(params.data.panelId)
      return 60;
    else
      return 35;
  }, []);

  useEffect(() => {
    if(panelId){
      executeIdle(() => {
        panelSelectedHandler({panelId});
      });      
    } 
  }, []);

  return (
    <>
      <ListBase
        className={style.traceWrap}
        buttons={[]}
        editHandler={() => {
        }}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}            
          >
            <Row>
              <Col style={{ minWidth: "280px" }}>
                <Input innerRef={panelIdRef} name="panelId" type="text" className="form-control" placeholder="판넬바코드" required={true} />
              </Col>
              <Col style={{ maxWidth: 180 }}>
                <Button type="button" color="info" style={{ width: 170 }} onClick={() => {
                  panelSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  판넬 바코드 검색
                </Button>
              </Col>
              <Col>
                <Button type="button" color="success" style={{ width: 220 }} onClick={() => {
                  pieceSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  PCS/SHEET/TRAY/BOX 검색
                </Button>       
              </Col>
              <Col>
                <select name="operType" className="form-select">
                  <option value="">전체공정</option>
                  <option value="B">고속스캔 공정</option>
                  <option value="R">레시피/파라미터 공정</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
          <Col md={9}>
            <Row style={{ height: "100px" }}>
              <Col className="pb-2">
                <LotInfo 
                  ref={lotRef}
                />
              </Col>
            </Row>
            <Row style={{ height: "calc(100% - 100px)" }}>
              <Col>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={gridRef}
                    columnDefs={traceDefs((defs: Dictionary[]) => {
                      return defs.filter(x => x.headerClass == "all" || x.headerClass == "item");
                    }, { 
                      paramChart: (row: Dictionary) => {
                        paramChartRef.current.setSearch(row);
                        paramChartRef.current.setShowModal(true);
                      },
                      recipeChart: (row: Dictionary) => {
                        recipeChartRef.current.setSearch(row);
                        recipeChartRef.current.setShowModal(true);
                      },
                    })}
                    rowMultiSelectWithClick={false}
                    suppressRowClickSelection={true}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                    onGridReady={() => {
                      setList([]);
                    }}
                    rowClassRules={{
                      'top-row-ok': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "O";
                      },
                      'top-row-chk': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "C";
                      },
                      'top-row-ng': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "N";
                      },
                      'top-row-normal': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && !param.data.totalJudge;
                      },
                      'scan-row': (param: RowClassParams) => { 
                        return !!param.data.panelId && !!param.data.operSeqNo && !!param.data.operSeqNo4M && param.data.panelId == panelIdRef.current.value;
                      },
                      'scan-row-layup': (param: RowClassParams) => { 
                        return !!param.data.panelId && !!param.data.operSeqNo && !!param.data.operSeqNo4M && param.data.panelId != panelIdRef.current.value;
                      },
                      'scan-row-warn': (param: RowClassParams) => { 
                        return !!param.data.panelId && !param.data.operSeqNo && !!param.data.operSeqNo4M;
                      },
                      'not-scan-row ': (param: RowClassParams) => { 
                        return !param.data.panelId;
                      },
                      'lot-row': (param: RowClassParams) => { 
                        return param.data.workorderJob == param.data.workorder4M;
                      },
                      'not-lot-row': (param: RowClassParams) => { 
                        return param.data.workorderJob != param.data.workorder4M;
                      },
                    }}
                  />
                </div>              
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <div style={{ height: "100%" }}>
              <Row className="pb-2" style={{ height: "25%" }}>
                <Col>
                  <GridBase
                    ref={rollGridRef}
                    columnDefs={rollDefs({})}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setRollList([]);
                    }}
                    rowClassRules={{
                      'panel-row': (param: RowClassParams) => { 
                        return !!param.data.panelId;
                      },
                      'not-panel-row ': (param: RowClassParams) => { 
                        return !param.data.panelId 
                      },
                    }}
                  />
                </Col>
              </Row>
              <Row className="pb-2"  style={{ height: "25%" }}>
                <Col>
                  <GridBase
                    ref={layupGridRef}
                    columnDefs={layupDefs()}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setLayupList([]);
                    }}
                    rowClassRules={{
                      'main-row': (param: RowClassParams) => { 
                        return param.data.mainYn == 'Y';
                      },
                      'not-main-row ': (param: RowClassParams) => { 
                        return param.data.mainYn != 'Y';
                      },
                    }}
                  />
                </Col>
              </Row>
              <Row className="pb-2"  style={{ height: "30%" }}>
                <Col>
                  <GridBase
                    ref={pcsGridRef}
                    columnDefs={(() => {
                      return pieceDefs().filter(x => x.headerClass != "multi4m");
                    })()}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setPcsList([]);
                    }}
                  />
                </Col>
              </Row>
              <Row className="pb-2"  style={{ height: "20%" }}>
                <Col>
                  <GridBase
                    ref={boxGridRef}
                    columnDefs={boxDefs()}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setBoxList([]);
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </ListBase>

      <PanelSearch
        ref={panelSearchRef}
        onPanelSelected={panelSelectedHandler}
      />

      <PieceSearch
        ref={pieceSearchRef}
        onPanelSelected={panelSelectedHandler}
      />

      <ParamChart
        ref={paramChartRef}
        initHandler={() => {}}
      />

      <RecipeChart
        ref={recipeChartRef}
        initHandler={() => {}}
      />
    </>
  );
};

export default TraceList;
