import { CellDoubleClickedEvent, RowClassParams, RowHeightParams } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
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

const TraceMultiList = () => {
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();

  const paramChartRefEx = useRef<any>();
  const recipeChartRefEx = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [grid4MRef, set4MList] = useGridRef();
  const [gridItemRef, setItemList] = useGridRef();

  const { refetch: refetch4M } = useApi("trace/4m/multi", getSearch, grid4MRef); 
  const { refetch: refetchItem } = useApi("trace/multi", getSearch, gridItemRef); 

  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();

    const fromDt = moment.utc(search["fromDt"]);
    const toDt = moment.utc(search["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

    console.log(fromDt, toDt, days);

    if(days > 2)
    {
      alertBox("조회기간은 최대 3일입니다.");
      return;
    }

    if(!search["eqpCode"] && 
      !search["workerCode"] && 
      !search["toolCode"] && 
      !search["materialLot"] && 
      !search["materialCode"]){
        alertBox("검색조건을 하나이상 입력해 주세요.");
        return;
    }

    refetch4M().then((result: Dictionary) => {
      if(result.data)
      set4MList(result.data);
    });

    refetchItem().then((result: Dictionary) => {
      if(result.data)
      setItemList(result.data);
    });
  };

  const splitHandler = (direction: string) => {
    const left = document.getElementById("grid-left-container");    
    const right = document.getElementById("grid-right-container");

    switch(direction){
      case "V":
        left?.classList.remove("col-md-12");
        left?.classList.add("col-md-6");

        right?.classList.remove("col-md-12");
        right?.classList.add("col-md-6");
        break;
      case "H":
        left?.classList.remove("col-md-6");
        left?.classList.add("col-md-12");

        right?.classList.remove("col-md-6");
        right?.classList.add("col-md-12");
        break;
      }

      localStorage.setItem('tracemulti.split', direction)
  };


  useEffect(() => {    
  }, []);

  const defaultSplit = localStorage.getItem('tracemulti.split') || "V";

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
            <div className="search-row">
              <div style={{ maxWidth: "120px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()}  placeholderText="조회시작" dateFormat="yyyy-MM-dd" required={true} />
                <input type="hidden" name="eqpCode" />
              </div>
              <div style={{ maxWidth: "120px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" dateFormat="yyyy-MM-dd" required={true} />
              </div>
              <div>
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder="설비코드" mapCode="eqp" />
              </div>
              <div>
                <AutoCombo name="workerCode" sx={{ width: "120px" }} placeholder="작업자" mapCode="person" />
              </div>
              <div>
                <Input name="toolCode" type="text" className="form-control" placeholder="툴코드" />
              </div>
              <div>
                <Input name="materialLot" type="text" className="form-control" placeholder="자재BATCH" />
              </div>
              <div>
                <Input name="materialCode" type="text" className="form-control" placeholder="자재코드" />
              </div>
              <div className="radio-container">
                <Row>
                  <Col style={{ minWidth: "80px"}} className="text-end">
                    <Label htmlFor="groupby" className="form-label">화면분할:</Label>
                  </Col>
                  <Col style={{ minWidth: "75px" }}>
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                      <input type="radio" className="btn-check" name="split-radio" id="bbt-radio-split-v" onClick={() => { splitHandler("V"); }}  defaultChecked={defaultSplit == "V"} />
                      <label className="btn btn-outline-primary" htmlFor="bbt-radio-split-v" >
                        <i className="uil-border-vertical"></i>
                      </label>

                      <input type="radio" className="btn-check" name="split-radio" id="bbt-radio-split-h" onClick={() => { splitHandler("H"); }}  defaultChecked={defaultSplit == "H"} />
                      <label className="btn btn-outline-primary" htmlFor="bbt-radio-split-h" >
                        <i className="uil-border-horizontal"></i>
                      </label>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </SearchBase>
        }
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
          <Col id="grid-left-container" md={defaultSplit == "V" ? 6 : 12}>
            <Row style={{ height: "100%" }}>
              <Col>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={grid4MRef}
                    columnDefs={traceDefs((defs: Dictionary[]) => {
                      const operDescription = defs.find(x => x.field == "operDescription");
                      if(operDescription){
                        operDescription.maxWidth = 210;
                      }
                      
                      const eqpName = defs.find(x => x.field == "eqpName");
                      if(eqpName){
                        eqpName.maxWidth = 230;
                      }
                      
                      return defs.filter(x => x.headerClass == "all" || x.headerClass == "4m" || x.field == "workorder4M");
                    }, { 
                      rollSearch: () => {},
                      panelSearch: () => {},
                      paramChartEx: (row: Dictionary) => {
                        paramChartRefEx.current.setSearch(row);
                        paramChartRefEx.current.setShowModal(true);
                      },
                      recipeChartEx: (row: Dictionary) => {
                        recipeChartRefEx.current.setSearch(row);
                        recipeChartRefEx.current.setShowModal(true);
                      },
                    })}
                    rowMultiSelectWithClick={false}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}                    
                    onGridReady={() => {
                      setItemList([]);
                    }}
                    rowClassRules={{
                      // 'scan-row': (param: RowClassParams) => { 
                      //   return !!param.data.workorder;
                      // },
                      // 'roll-scan-row': (param: RowClassParams) => { 
                      //   return !!param.data.rollId;
                      // },
                      // 'lot-row': (param: RowClassParams) => { 
                      //   return param.data.workorderJob == param.data.workorder4M;
                      // },
                      // 'not-lot-row': (param: RowClassParams) => { 
                      //   return param.data.workorderJob != param.data.workorder4M;
                      // },
                      // 'not-job-oper': (param: RowClassParams) => { 
                      //   return !param.data.operSeqNo;
                      // },
                    }}
                  />                                  
                </div>              
              </Col>
            </Row>
          </Col>
          <Col id="grid-right-container" md={defaultSplit == "V" ? 6 : 12}>
            <Row style={{ height: "100%" }}>
              <Col>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={gridItemRef}
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
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                    onGridReady={() => {
                      set4MList([]);
                    }}
                    rowClassRules={{
                      // 'lot-row': (param: RowClassParams) => { 
                      //   return param.data.workorderJob == param.data.workorder4M;
                      // },
                      // 'not-lot-row': (param: RowClassParams) => { 
                      //   return param.data.workorderJob != param.data.workorder4M;
                      // },
                    }}
                  />  
                </div>              
              </Col>
            </Row>
          </Col>
        </Row>
      </ListBase>

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

export default TraceMultiList;
