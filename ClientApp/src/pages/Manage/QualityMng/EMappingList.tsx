import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Row, UncontrolledTooltip } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { NGDefs, TotalDefs } from "./EMappingDefs";
import myStyle from "./EMapping.module.scss";
import AutoCombo from "../../../components/Common/AutoCombo";
import { CellClickedEvent } from "ag-grid-community";
import api from "../../../common/api";
import LotSearch from "../../Trace/LotSearch";
import EMappingUnionView from "./EMappingUnionView";
import { executeIdle, showLoading } from "../../../common/utility";
import { useTranslation } from "react-i18next";

const EMappingList = () => {
  const { t } = useTranslation();
  const workorderRef = useRef<any>();
  const panelIdRef = useRef<any>();
  const ngNmaeRef = useRef<any>();
  const cellData = useRef<any>();

  const viewRef = useRef<any>();
  const spinnerRef = useRef<any>();

  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [gridTotalRef, setTotalList] = useGridRef();

  const { refetch: totalList } = useApi("emapping", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    showLoading(gridRef, true);

    const workorder = lotNoRef.current.value;
    
    const layoutSearch = api<Dictionary>("get", "emapping/layout/byworkorder", { "workorder": workorder });
    const bbtSearch = api<Dictionary[]>("get", "emapping/bbt", { "workorder": workorder });
    const lotSearch = await totalList();

    setTotalList([]);
    workorderRef.current = null;
    panelIdRef.current = null;
    ngNmaeRef.current = null;
    cellData.current = null;

    Promise.allSettled([lotSearch, layoutSearch, bbtSearch]).then((results: any) => {
      const listLot = results[0].value?.data;
      const layout = results[1].value?.data;
      const listBBT = results[2].value?.data;

      const totalRow: Dictionary = { panelId: "TOTAL" };

      let bbtSum = 0;

      listLot.forEach((x: Dictionary) => {
        const panelId = x.matchPanelId;

        const bbt = listBBT?.filter((y: Dictionary) => y.panelId == panelId);
        if(bbt?.length > 0){
          let aoiBbtCnt = 0;
          
          x.bbtCnt = bbt.length - aoiBbtCnt;
          x.bbtExists = bbt.length;
          x.bbtPanelSeq = bbt[0].panelSeq;
          bbtSum += bbt.length;
        }

      });

      totalRow.workorder = workorder;
      totalRow.bbtCnt = bbtSum;

      setList(listLot);

      viewRef.current.setNgDic({ "panel": listLot, "aoi": [], "bbt": listBBT, "blackhole": [] });
      viewRef.current.setLayout(layout);
    });
  
  }

  const showViewLoading = (isShow: boolean) => {
    if(spinnerRef.current)
      spinnerRef.current.style.display = isShow ? "block" : "none";
  }
  
  const cellClickHandler = async (e: CellClickedEvent) => {
    cellData.current = e.data;
    const param: Dictionary = {
      workorder: null,
      panelId: null,
      judgeName: null,
      row: e.data
    }

    switch(e.column["colId"]){
      case "workorder":
      {
        workorderRef.current = param["workorder"] = e.data!.workorder;
        panelIdRef.current = null;
        break;
      }
      case "panelId":
      {
        workorderRef.current = null;
        panelIdRef.current = param["panelId"] = e.data!.panelId;
        break;
      }
    }

    if(workorderRef.current == null && 
      panelIdRef.current == null)
      return;

    const resultSum = await api<any>("get", "emapping/sum", {
      fromDt: getSearch().fromDt,
      toDt: getSearch().toDt,
      itemCode: getSearch().itemCode,
      workorder: workorderRef.current,
      panelId: panelIdRef.current,
    });

    pcsData(param);

    if(resultSum.data) {
      setTotalList(resultSum.data);
      footerCalc(resultSum.data);
    }
  }

  const ngCellClickHandler = async (e: CellClickedEvent) => {
    const param: Dictionary = {
      workorder: workorderRef.current, 
      panelId: panelIdRef.current,
      judgeName: null,
      row: cellData.current,
    }

    switch(e.column["colId"]){
      case "judgeName":
      {
        ngNmaeRef.current = param["judgeName"] = e.data!.judgeName;
        break;
      }
    }

    if(ngNmaeRef.current == null)
      return;
    
    if(workorderRef.current == null && 
      panelIdRef.current == null)
      return;

    
    pcsData(param);
  }

  const footerCalc = (sumData: Dictionary[]) => {
    if(sumData.length) {
      const footerRow: Dictionary = {
        judgeCnt: 0,
        total: sumData[0].total,
        ngRate: 0,
      }

      sumData.forEach((item) => {
        footerRow.judgeCnt += item.judgeCnt;
      });
      footerRow.ngRate = ((footerRow.judgeCnt / sumData[0].total) * 100).toFixed(2);

      gridTotalRef.current!.api.setPinnedTopRowData([footerRow]);
    }
  }
  
  const pcsData = async (param: Dictionary) => {
    showViewLoading(true);
    
    let searchParam = getSearch();
    searchParam["bbtShow"] = "on";


    if(workorderRef.current == lotNoRef.current.value) {
      const bbtSearch = param.row!.panelSeq ? api<Dictionary[]>("get", "emapping/pcs", { "workorder": lotNoRef.current.value }) : Promise.resolve();
      Promise.allSettled([bbtSearch]).then((result: any) => {
        
        const bbt = result[0].value?.data;

        viewRef.current.setTotal(param.row, [], bbt, [], searchParam);
        showViewLoading(false);
      });
    }else{
      const bbtSearch = param.row!.panelSeq ? api<Dictionary[]>("get", "emapping/pcs", { "workorder": lotNoRef.current.value, panelSeq: param.row!.panelSeq }) : Promise.resolve();
      Promise.allSettled([bbtSearch]).then((result: any) => {
        const bbt = result[0].value?.data;

        viewRef.current.setPanel(param.row, [], bbt, [], searchParam);
        showViewLoading(false);
      });
    }
  }
  
  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  useEffect(() => {
    executeIdle(() => {
      showLoading(gridRef, false);
    });    
  }, []);


  return (
    <>
      <ListBase
        className={myStyle.unionGridWrap}
        buttons={[]}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText= {t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
              </Col>
              <Col>
                <DateTimePicker name="toDt" placeholderText= {t("@SEARCH_END_DATE")} required={true} /> {/* 조회종료 */}
              </Col>
              {/* <Col>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ minWidth: "250px" }} placeholder="제품코드" mapCode="item" required={true} />
              </Col> */}
              <Col>
                <Input innerRef={lotNoRef} name="workorder" placeholder="BATCH(WORKORDER)" style={{ minWidth: "236px" }} required={true}/>
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
                <Input name="panelId" type="text" placeholder="PANEL ID" className="form-control" />              
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={3}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase 
                ref={gridRef}
                columnDefs={NGDefs()}
                alwaysShowHorizontalScroll={true}
                onCellClicked={cellClickHandler}
                onGridReady={() => {
                  setList([]);
                }}
              />
            </div>
          </Col>
          <Col md={2}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase 
                ref={gridTotalRef}
                columnDefs={TotalDefs()}
                // onCellClicked={ngCellClickHandler}
                onGridReady={() => {
                  setTotalList([]);
                }}
              />
              </div>
          </Col>
          <Col md={7}>
            <div className="pb-2" style={{ height: "100%" }}>
              <div className={myStyle.layoutEditContainer}>
                <div ref={spinnerRef} className="chart-spinner-wrap">
                  <div className="chart-spinner">
                    <div className="spinner-border text-primary">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
                <Card style={{ height: "100%" }}>
                  <CardBody>
                    <EMappingUnionView
                      ref={viewRef}
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </Col>
        </Row> 
      </ListBase>


      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />
    </>
  )
  
}
export default EMappingList;