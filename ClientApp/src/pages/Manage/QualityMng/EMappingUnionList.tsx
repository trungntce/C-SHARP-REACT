import { Dictionary } from "../../../common/types";
import { Row, Col, Button, Input, Label, Card, CardHeader, InputGroup, InputGroupText, CardBody, Form } from "reactstrap";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { CellClickedEvent, RowSelectedEvent } from "ag-grid-community";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import { executeIdle, showLoading } from "../../../common/utility";
import api from "../../../common/api";
import style from "./EMapping.module.scss";
import LotSearch from "../../Trace/LotSearch";
import LotInfo from "../../Trace/LotInfo";
import { panelDefs } from "../../Trace/PanelDefs";
import { columnDefs } from "./EMappingUnionDefs";
import EMappingUnionView from "./EMappingUnionView";

const EMappingUnionList = (props: any) => {
  const { t } = useTranslation();

  const viewRef = useRef<any>();
  const spinnerRef = useRef<any>();

  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const listRef = useRef<any>();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  // 데이터 표시 기준은 BBT
  const bbtList = useRef<Dictionary[]>([]);

  const searchHandler = async (_?: Dictionary) => {
    showLoading(gridRef, true);

    const workorder = lotNoRef.current.value;

    
    const lotSearch = api<Dictionary[]>("get", "emapping/panel", {"workorder": workorder});
    const layoutSearch = api<Dictionary>("get", "emapping/layout/byworkorder", { "workorder": workorder });
    const bbtSearch = api<Dictionary[]>("get", "emapping/bbt", { "workorder": workorder });
    const aoiSearch = api<Dictionary[]>("get", "emapping/aoi", { "workorder": workorder });
    const blackholeSearch = api<Dictionary[]>("get", "emapping/blackhole", { "workorder": workorder });

    Promise.allSettled([lotSearch, layoutSearch, bbtSearch, aoiSearch, blackholeSearch]).then((results: any) => {
      if(!results[0].value?.data?.length){
        alertBox(t("@NOT_PNL_INFO_IN_BATCH")); //해당 Batch에 판넬 정보가 없습니다.
        return;
      }

      const listLot = results[0].value?.data;
      const layout = results[1].value?.data;
      const listBBT = results[2].value?.data;
      const listAOI = results[3].value?.data;
      const listBlackHole = results[4].value?.data;

      const totalRow: Dictionary = { panelId: "TOTAL" };
      let bbtSum = 0;
      let aoiSum = 0;
      let blackholeSum = 0;

      listLot.forEach((x: Dictionary) => {
        const panelId = x.panelId;

        const aoi = listAOI?.filter((y: Dictionary) => y.panelId == panelId);
        if(aoi?.length > 0){
          x.aoiCnt = aoi.length;
          x.aoiPanelSeq = parseInt(aoi[0].panelSeq, 10);
          x.aoiPanelList = aoi.map((x: Dictionary) => x.panelSeq).join(',');
          aoiSum += aoi.length;
        }

        const bbt = listBBT?.filter((y: Dictionary) => y.panelId == panelId);
        if(bbt?.length > 0){
          // aoi+bbt 중복 카운트
          let aoiBbtCnt = 0;
          if(aoi?.length){
            bbt.forEach((x: Dictionary) => {
              aoi.some((y: Dictionary) => {
                if(x.pieceNo == y.pieceNo)
                  aoiBbtCnt++;
              });
            });
          } 

          x.bbtCnt = bbt.length - aoiBbtCnt;
          x.bbtExists = bbt.length;
          x.bbtPanelSeq = bbt[0].panelSeq;
          bbtSum += bbt.length;
        }
        // else{
        //   return;
        // }

        const blackhole = listBlackHole?.filter((y: Dictionary) => y.panelId == panelId);
        if(blackhole?.length > 0){
          x.blackholeCnt = blackhole.length;
          x.blackholePanelSeq = blackhole[0].pieceNo;
          blackholeSum += blackhole.length;
        }
      });

      totalRow.workorder = workorder;
      totalRow.bbtCnt = bbtSum;
      totalRow.aoiCnt = aoiSum;
      totalRow.blackholeCnt = blackholeSum;

      gridRef.current!.api.setPinnedTopRowData([totalRow]);


      // const bbtData = listLot.filter((x: Dictionary) => x.bbtCnt > 0);
      // const aoiData = listLot.filter((x: Dictionary) => x.aoiCnt > 0);
      // const blackHoleData = listLot.filter((x: Dictionary) => x.blackholeCnt > 0);

      // console.log(aoiData, "aoi");

      // if(bbtData.length > 0 )
      //   bbtList.current = bbtData;
      // else if (aoiData.length > 0 )
      //   bbtList.current = aoiData;
      // else if (blackHoleData.length > 0 )
      //   bbtList.current = blackHoleData;
      // else{
      //   alertBox(t("@NOT_PNL_INFO_IN_BATCH"));  //"해당 Batch의 판넬에 매칭되는 정보가 없습니다."
      //   return;
      // }
      bbtList.current = listLot;

      setList(bbtList.current);

      // 기존 : BBT 데이터 있는것만 보여줌
      // 변경 : 진행된 공정 까지만 보여줌 
      // 순서 : BlackHole - AOI - BBT
      const aoiFiltered = listAOI?.filter((x: Dictionary) => bbtList.current.find((y: Dictionary) => y.panelId == x.panelId));
      const blackholeFiltered = listBlackHole?.filter((x: Dictionary) => bbtList.current.find((y: Dictionary) => y.panelId == x.panelId));

      viewRef.current.setNgDic({ "panel": listLot, "aoi": aoiFiltered, "bbt": listBBT, "blackhole": blackholeFiltered });
      viewRef.current.setLayout(layout);
    });
  }

  const showViewLoading = (isShow: boolean) => {
    if(spinnerRef.current)
      spinnerRef.current.style.display = isShow ? "block" : "none";
  }

  const cellClickedHandler = (e: CellClickedEvent<Dictionary>) => {
    showViewLoading(true);

    if(e.data?.panelId == "TOTAL"){      

      const aoiSearch = api<Dictionary[]>("get", "aoivrs/bypanel", { "workorder": e.data?.workorder });
      const bbtSearch = api<Dictionary[]>("get", "bbt/bypanel", { "workorder": e.data?.workorder });
      const blackholeSearch = api<Dictionary[]>("get", "emapping/blackhole/bypanel", { "workorder": e.data?.workorder });
  
      Promise.allSettled([aoiSearch, bbtSearch, blackholeSearch]).then((results: any) => {
        const aoi = results[0].value?.data;
        const bbt = results[1].value?.data;
        const blackhole = results[2].value?.data;

        const aoiFiltered = aoi.filter((x: Dictionary) => !!bbtList.current.find((y: Dictionary) => { 
          return x.panelSeqList.split(',').indexOf(y.aoiPanelSeq?.toString()) >= 0;
        }));

        const blackholeFiltered = blackhole.filter((x: Dictionary) => !!bbtList.current.find((y: Dictionary) => {
          return x.panelIdList.split(',').indexOf(y.panelId) >= 0;
        }));

        viewRef.current.setTotal(
          e.data, 
          aoiFiltered, 
          bbt, 
          blackholeFiltered, 
          getSearch());

        showViewLoading(false);
      });
    }else{
      //const aoiSearch = e.data?.aoiPanelSeq ? api<Dictionary[]>("get", "aoivrs/bypanel", { "workorder": e.data?.workorder, panelSeq: e.data?.aoiPanelSeq }) : Promise.resolve();
      const aoiSearch = e.data?.aoiPanelList ? api<Dictionary[]>("get", "aoivrs/bypanellist", { "workorder": e.data?.workorder, panelList: e.data?.aoiPanelList }) : Promise.resolve();
      const bbtSearch = e.data?.bbtPanelSeq ? api<Dictionary[]>("get", "bbt/bypanel", { "workorder": e.data?.workorder, panelSeq: e.data?.bbtPanelSeq }) : Promise.resolve();
      const blackholeSearch = e.data?.blackholePanelSeq ? api<Dictionary[]>("get", "emapping/blackhole/bypanel", { "workorder": e.data?.workorder, panelId: e.data?.panelId }) : Promise.resolve();
  
      Promise.allSettled([aoiSearch, bbtSearch, blackholeSearch]).then((results: any) => {
        const aoi = results[0].value?.data;
        const bbt = results[1].value?.data;
        const blackhole = results[2].value?.data;

        viewRef.current.setPanel(e.data, aoi, bbt, blackhole, getSearch());

        showViewLoading(false);
      });
    }
  }

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const getDefs = () => {
    const cnt = columnDefs();
    const panel = panelDefs().filter(x => x.headerClass != "multi4m" && x.field != "workorderReal" && x.field != "interlockYn");

    const find = panel.find(x => x.field == "panelId");
    if(find){
      find.width = 230;
      find.cellClass = "cell-link";
    }

    return merge(panel, cnt, 2);
  }

  const merge = (a: any[], b: any[], i = 0) => {
    return a.slice(0, i).concat(b, a.slice(i));
  }

  useEffect(() => {
    executeIdle(() => {
      showLoading(gridRef, false);
    });    
  }, []);


  return (
    <>
      <ListBase
        ref={listRef}
        className={style.unionGridWrap}
        buttons={
          <>
            
          </>
        }
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
                  BATCH(WORKORDER) {t("@SEARCH")}
                </Button>
              </Col>
              <Col>
                <span className="search-label search-aoi d-flex gap-2 justify-content-end">
                  <Input name="aoiShow" type="checkbox" defaultChecked={true} />
                  AOI
                </span>
              </Col>
              <Col>
                <span className="search-label search-bbt d-flex gap-2 justify-content-end">
                  <Input name="bbtShow" type="checkbox" defaultChecked={true} />
                  BBT
                  </span>
              </Col>
              {/* <Col>
                <span className="search-label search-aoi-bbt">AOI+BBT</span>
              </Col> */}
              <Col>
                <span className="search-label search-blackhole d-flex gap-2 justify-content-end">
                  <Input name="blackholeShow" type="checkbox" defaultChecked={true} />
                  BlackHole
                  </span>
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={getDefs()}
                  onCellClicked={cellClickedHandler}
                  rowMultiSelectWithClick={false}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <div className={style.layoutEditContainer}>
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
  );
};

export default EMappingUnionList;
