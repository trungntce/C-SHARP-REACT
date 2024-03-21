import { CellDoubleClickedEvent, FirstDataRenderedEvent, IRowNode, RowClassParams, RowDataUpdatedEvent, RowHeightParams, RowSelectedEvent } from "ag-grid-community";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import { traceDefs } from "./TraceDefs";
import style from "./Trace.module.scss";
import LotInfo from "./LotInfo";
import LotSearch from "./LotSearch";
import { rollDefs } from "./TraceRollDefs";
import api from "../../common/api";
import { panelDefs } from "./PanelDefs";
import PieceSearch from "./PieceSearch";
import ParamChart from "./ParamChart";
import RecipeChart from "./RecipeChart";
import ParamChartEx from "./ParamChartEx";
import RecipeChartEx from "./RecipeChartEx";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useParams } from "react-router";
import { executeIdle, showLoading } from "../../common/utility";
import { useTranslation } from "react-i18next";

const TraceList4M = () => {
  let { workorder, operSeqNo } = useParams();

  const { t } = useTranslation();

  const lotInfoRef = useRef<any>();
  const lotNoRef = useRef<any>();
  const pieceSearchRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();

  const paramChartRefEx = useRef<any>();
  const recipeChartRefEx = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [rollGridRef, setRollList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();
  
  const { refetch } = useApi("trace/4m", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    lotInfoRef.current.searchLot(null, lotNoRef.current.value);

    setPanelList([]);
    setRollList([]);
    rollGridRef.current!.api.setPinnedTopRowData([]);    
    gridRef.current!.api.setPinnedTopRowData([]);

    const refetched = refetch();

    refetched.then((result: Dictionary) => {
      // -> 블랙홀 추가해서 최초 바인딩
      // if(result.data?.length){
      //   const list: Dictionary[] = result.data;

      //   bindList(list, false);
      // }else{
      //   alertBox("조회된 데이터가 없습니다.");
      // }
    });

    const blackHole = api<Dictionary[]>("get", "trace/blackholecnt", { workorderList: lotNoRef.current.value });
    const chemJudge = api<Dictionary[]>("get", "trace/chemjudgeworkorder", { workorder: lotNoRef.current.value });
    const aoiTotal = api<Dictionary[]>("get", "trace/aoitotal", { workorder: lotNoRef.current.value });

    Promise.allSettled([refetched, blackHole]).then((results: any) => {
      if(results[0].value?.data && results[1].value?.data){
        const list4M = results[0].value?.data;
        const listBlack = results[1].value?.data;

        listBlack.forEach((black: Dictionary) => {
          const find = list4M.find((item4M: Dictionary) => item4M.operCode == black.operCode);
          if(!find)
            return;

          find.blackHoleList = [...find.blackHoleList ?? [], black];
        });

        bindList(list4M, true);
      }else{
        if(results[0].value?.data?.length)
          bindList(results[0].value?.data, false);
      }
    });

    Promise.allSettled([refetched, chemJudge, blackHole, aoiTotal]).then((results: any) => {
      if(results[0].value?.data && results[1].value?.data && results[2].value?.data && results[3].value?.data){
        const list4M = results[0].value?.data;
        const listChem = results[1].value?.data;
        const listBlack = results[2].value?.data;
        const listAoi = results[3].value?.data;

        listChem.forEach((chem: Dictionary) => {
          const find = list4M.find((item4M: Dictionary) => item4M.rowKey == chem.rowKey);
          if(!find)
            return;

          find.chemJudge = chem.judge;
          find.eqpId = chem.eqpId;
        });

        listAoi.forEach((aoi: Dictionary) => {
          const find = list4M.find((item4M: Dictionary) => item4M.operSeqNo == aoi.operSeqNo);
          if(!find)
            return;

          find.aoiPcsTotal = aoi.pcsTotal;
          find.aoiNgPcsTotal = aoi.ngPcsTotal;
        })

        bindList(list4M, true);
      }else{
        if(results[0].value?.data?.length)
          bindList(results[0].value?.data, true);
      }
    });
  };

  const fakePanelList = (list: Dictionary[]) => {
    const laserOper = list.find(x => x.laserOperCode);
    if(laserOper && laserOper.operSeqNo <= 500){ // 500번 이내만
      const prevLaserOperList = list.filter(x => x.operSeqNoScan < laserOper.operSeqNoScan)
      if(!prevLaserOperList.length)
        return;

        prevLaserOperList.forEach(x => {
          if(x.operSeqNo >= laserOper.operSeqNo)
            return;
          x.itemExistKey = 'F';
          x.itemCnt = laserOper.itemCnt;
          x.fakeGroupKey = laserOper.groupKey;
        });
    }
  }

  const bindList = (list: Dictionary[], isAllDone: boolean) => {
    fakePanelList(list);    

    setList(list);

    if(!isAllDone)
      return;   

    const headerRow: Dictionary = {
      spcJudge: "",
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

    if(headerRow.spcJudge == "N" || headerRow.qtimeJudge == "N" || headerRow.chemJudge == "NG"){
      headerRow.totalJudge = "N";
    }else if(headerRow.spcJudge == "C" || headerRow.qtimeJudge == "C" || headerRow.chemJudge == "CHK"){
      headerRow.totalJudge = "C";
    }else if(headerRow.qtimeJudge == "O" || headerRow.chemJudge == "O" || headerRow.spcJudge == "O"){
      headerRow.totalJudge = "O";
    }

    gridRef.current!.api.setPinnedTopRowData([headerRow]);
  }

  const scrollToOperSeqNo = () => {
    if(!operSeqNo)
      return;

    // if(lotNoRef.current.value != workorder) // 쿼리로 넘어온 batch와 다른 경우 공정 이동 안함
    //   return;    

    gridRef.current!.api.forEachNode((node: IRowNode, index: number) => {
      if(node.data.operSeqNo == operSeqNo){
        gridRef.current!.api.ensureIndexVisible(node.rowIndex!, "middle");
        node.setData({...node.data, selectedRow: true});

        // 재검색 후 표시 방지
        //operSeqNo = undefined;
        return false;
      }
    });
  }

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const rollSearchHandler = (rollId: string, groupKey: string) => {
    rollGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/rollmap", { "rollId": rollId, "groupKey": groupKey }).then((result: Dictionary) => {
      if(result.data){        
        setRollList(result.data[0]);

        const row = result.data[1][0];
        row.operDescription = "Scan Barcode";
        row.parentId = row.rollId;

        rollGridRef.current!.api.setPinnedTopRowData([row]);        
      }
    });
  }

  const panelSearchHandler = (groupKey: string) => {
    panelGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/panelbygroup", { "groupKey": groupKey }).then((result: Dictionary) => {
      if(result.data)
        setPanelList(result.data);
    });
  }

  const fakePanelSearchHandler = (groupKey: string) => {
    panelGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/panelbygroup", { "groupKey": groupKey }).then((result: Dictionary) => {
      if(result.data){
        const list: Dictionary[] = result.data;

        list.forEach(x => {
          x.paramJson = null;
          x.recipeJson = null;
          x.createDt = null;
          x.interlockYn = null;
        });

        setPanelList(list);
      }
    });
  }

  const getPanelDefs = () => {
    const panel = panelDefs().filter(x => x.headerClass != "multi4m");
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

  const merge = (a: any[], b: any[], i = 0) => {
    return a.slice(0, i).concat(b, a.slice(i));
  }

  useEffect(() => {
    if(workorder){
      executeIdle(() => {
        lotSelectedHandler({workorder});
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
            searchHandler={() => { workorder = ""; operSeqNo = ""; searchHandler(); }}            
          >
            <Row>
              <Col style={{ minWidth: "280px" }}>
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 250 }} className="form-control" placeholder="BATCH(WORKORDER)" required={true} />
              </Col>
              <Col style={{ maxWidth: 280 }}>
                <Button type="button" color="info" style={{ width: 210 }} onClick={() => {
                  lotSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  {`BATCH(WORKORDER) ${t("@SEARCH")}`} {/* BATCH(WORKORDER) 검색 */}
                </Button>
              </Col>
              <Col>
                <Button type="button" color="success" style={{ width: 220 }} onClick={() => {
                  pieceSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  {`PCS/SHEET/TRAY/BOX ${t("@SEARCH")}`} {/* PCS/SHEET/TRAY/BOX 검색 */}
                </Button>
              </Col>
              <Col>
                <select name="operType" className="form-select">
                  <option value="">{`${t("@TOTAL")}${t("@OPERATION")}`}</option> {/* 전체공정 */}
                  <option value="B">{t("@4MSCNA_OPER")}</option>  {/* 4M스캔 공정 */}
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
          <Col md={8}>
            <Row style={{ height: "100px" }}>
              <Col className="pb-2">
                <LotInfo 
                  ref={lotInfoRef}
                />
              </Col>
            </Row>
            <Row style={{ height: "calc(100% - 100px)" }}>
              <Col>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={gridRef}
                    className="ag-grid-groupheader"
                    columnDefs={traceDefs((defs: Dictionary[]) => {
                      const operDescription = defs.find(x => x.field == "operDescription");
                      if(operDescription){
                        operDescription.maxWidth = 210;
                      }
                      
                      const eqpName = defs.find(x => x.field == "eqpName");
                      if(eqpName){
                        eqpName.maxWidth = 230;
                      }
                      
                      return defs.filter(x => x.headerClass == "all" || x.headerClass == "4m");
                    }, { 
                      rollSearch: rollSearchHandler,
                      panelSearch: panelSearchHandler,
                      fakePanelSearch: fakePanelSearchHandler,
                      paramChartEx: (row: Dictionary) => {
                        paramChartRefEx.current.setSearch(row);
                        paramChartRefEx.current.setShowModal(true);
                      },
                      recipeChartEx: (row: Dictionary) => {
                        recipeChartRefEx.current.setSearch(row);
                        recipeChartRefEx.current.setShowModal(true);
                      },
                      panelReJudge: (row: Dictionary) => {
                        confirmBox("처리하시겠습니까?", async () => {
                          showLoading(panelGridRef, true);
                          const result = await api("get", "trace/panelrejudge", { groupKey: row.groupKey });
                          if(result.data){
                            alertBox("처리되었습니다.");
                            panelSearchHandler(row.groupKey);
                          }
                        }, async () => {                    
                        });   
                      }
                    })}
                    rowMultiSelectWithClick={false}
                    suppressRowClickSelection={true}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                    onGridReady={() => {
                      setList([]);
                    }}
                    onRowDataUpdated={(e: RowDataUpdatedEvent) => {
                      executeIdle(() => {
                        scrollToOperSeqNo();
                      });                      
                    }}
                    onRowClicked={(e: RowSelectedEvent) => {
                      gridRef.current!.api.forEachNode((node: IRowNode, index: number) => {
                        node.setData({...node.data, selectedRow: false});
                      });

                      e.node.setData({...e.node.data, selectedRow: true});
                    }}
                    rowClassRules={{
                      'top-row-ok': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "O";
                      },
                      'top-row-chk': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "C";
                      },
                      'top-row-warn': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "W";
                      },
                      'top-row-ng': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && param.data.totalJudge == "N";
                      },
                      'top-row-normal': (param: RowClassParams) => { 
                        return param.node.rowPinned == "top" && !param.data.totalJudge;
                      },
                      'top-row': (param: RowClassParams) => { 
                        return !!param.data.workorder;
                      },
                      'scan-row': (param: RowClassParams) => { 
                        return !!param.data.workorder;
                      },
                      'roll-scan-row': (param: RowClassParams) => { 
                        return !!param.data.rollId;
                      },
                      'lot-row': (param: RowClassParams) => { 
                        return param.data.workorderJob == param.data.workorder4M;
                      },
                      'not-lot-row': (param: RowClassParams) => { 
                        return param.data.workorderJob != param.data.workorder4M;
                      },
                      'not-job-oper': (param: RowClassParams) => { 
                        return param.node.rowPinned != "top" &&!param.data.operSeqNo;
                      },
                      'param-row-ng': (param: RowClassParams) => { 
                        return !!param.data.paramItemNgCnt;
                      },
                      'recipe-row-ng': (param: RowClassParams) => { 
                        return !!param.data.recipeItemNgCnt;
                      },
                      // 'recipe-param-row-ng': (param: RowClassParams) => { 
                      //   return !!param.data.recipeItemNgCnt || !!param.data.paramItemNgCnt;
                      // },
                      'work-type-r': (param: RowClassParams) => { 
                        return param.data.workType == 'R';
                      },
                      'work-type-i': (param: RowClassParams) => { 
                        return param.data.workType == 'I';
                      },
                      'selected-row': (param: RowClassParams) => { 
                        return !!param.data.selectedRow;
                      },
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={4}>
            <div style={{ height: "100%" }}>
              <Row className="pb-2" style={{ height: "25%" }}>
                <Col>
                  <GridBase
                    ref={rollGridRef}
                    className="roll-list-wrap"
                    columnDefs={rollDefs({})}
                    rowMultiSelectWithClick={false}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}                    
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
              <Row className="pb-2" style={{ height: "75%" }}>
                <Col>
                  <GridBase
                    ref={panelGridRef}
                    columnDefs={getPanelDefs()}
                    rowMultiSelectWithClick={false}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}     
                    onGridReady={() => {
                      setPanelList([]);
                    }}
                    rowClassRules={{
                      'workorder-row': (param: RowClassParams) => { 
                        return param.data.workorderReal == lotNoRef.current.value;
                      },
                      'not-workorder-row ': (param: RowClassParams) => { 
                        return param.data.workorderReal != lotNoRef.current.value;
                      },
                    }}
                  />
                </Col>
              </Row>              
            </div>
          </Col>
        </Row>
      </ListBase>

      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />

      <PieceSearch
        ref={pieceSearchRef}
        onPanelSelected={lotSelectedHandler}
      />

      <ParamChart
        ref={paramChartRef}
        initHandler={() => {}}
      />
      <RecipeChart
        ref={recipeChartRef}
        initHandler={() => {}}
      />

      <ParamChartEx
        ref={paramChartRefEx}
        initHandler={() => {}}
      />

      <RecipeChartEx
        ref={recipeChartRefEx}
        initHandler={() => {}}
      />
    </>
  );
};

export default TraceList4M;
