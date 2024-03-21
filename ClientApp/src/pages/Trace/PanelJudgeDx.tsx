import { CellDoubleClickedEvent, RowClassParams, RowHeightParams, RowSelectedEvent } from "ag-grid-community";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import { traceDefs } from "./TraceDefs";
import style from "./PanelJudge.module.scss";
import LotInfo from "./LotInfo";
import LotSearch from "./LotSearch";
import { rollDefs } from "./TraceRollDefs";
import api from "../../common/api";
import { panelDefs } from "./PanelDefs";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useParams } from "react-router";
import { executeIdle, showLoading } from "../../common/utility";
import { panelJudgeDefs, workorderOperDefs } from "./PanelJudgeDefs";
import ParamChart from "./ParamChart";
import RecipeChart from "./RecipeChart";

const PanelJudgeDx = () => {
  const { workorder } = useParams();

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
  
  const { refetch } = useApi("trace/panel4m", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      setList(result.data);
    }
  };

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const operRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

      panelSearchHandler(e.data.workorder, e.data.operSeqNo);
  }

  const panelSearchHandler = (workorder: string, operSeqNo: number) => {
    panelGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/paneljudgedx", { workorder, operSeqNo }).then((result: Dictionary) => {
      if(result.data)
        setPanelList(result.data);
    });
  }

  const getPanelDefs = () => {
    const panel = panelJudgeDefs();
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

    return merge(panel, trace, 2);
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
        className={style.panelJudgekWrap}
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
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 250 }} className="form-control" placeholder="BATCH(WORKORDER)" required={true} />
              </Col>
              <Col style={{ maxWidth: 280 }}>
                <Button type="button" color="info" style={{ width: 210 }} onClick={() => {
                  lotSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  BATCH(WORKORDER) 검색
                </Button>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
          <Col md={4}>
            <Row style={{ height: "100%" }}>
              <Col>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={gridRef}
                    columnDefs={workorderOperDefs()}
                    onRowSelected={operRowSelectedHandler}
                    rowMultiSelectWithClick={false}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                    onGridReady={() => {
                      setList([]);
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <div style={{ height: "100%" }}>
              <Row className="pb-2" style={{ height: "100%" }}>
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

export default PanelJudgeDx;
