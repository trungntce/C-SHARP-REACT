import { CellDoubleClickedEvent, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import api from "../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import { listToCamelCase } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { alertBox } from "../../components/MessageBox/Alert";
import LotSearch from "../Trace/LotSearch";
import ParamChart from "../Trace/ParamChart";
import RecipeChart from "../Trace/RecipeChart";
import { traceDefs } from "../Trace/TraceDefs";
import style from "./Affect.module.scss";
import { ngPanelDefs } from "./NGPanelDefs";
import { paramDefs } from "./NGParamDefs";
import { recipeDefs } from "./NGRecipeDefs";
import { useTranslation } from "react-i18next";

const NGPanelList = () => {
  const { t } = useTranslation();
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();
  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const [recipeGridRef, setRecipeList] = useGridRef();
  const [paramGridRef, setParamList] = useGridRef();

  const { refetch } = useApi("affectpanel/panel", getSearch, gridRef); 

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }
  
  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();

    const fromDt = moment.utc(search["fromDt"]);
    const toDt = moment.utc(search["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

    console.log(fromDt, toDt, days);

    if(days > 2)
    {
      alertBox(t("@MSG_SELECT_MAX_DAY_3")); //조회기간은 최대 3일입니다.
      return;
    }

    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;

      setList(list);
    }
  };

  const recipeParamSearchHandler = async (row: Dictionary) => {
    recipeGridRef.current!.api.showLoadingOverlay();
    paramGridRef.current!.api.showLoadingOverlay();

    const result = await api<any>("get", "affectpanel/recipeparam", { itemKey: row.itemKey });
    if(result.data){
      setParamList(result.data[0]);
      setRecipeList(result.data[1]);
    }
  }

  const panelRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    recipeParamSearchHandler(e.data);
  }

  // useEffect(() => {    
  //   searchHandler();    
  // }, []);

  return (
    <>
      <ListBase 
        className={style.affectWrap}
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(0, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col>
                <AutoCombo name="vendorCode" parentname="vendorId" sx={{ width: "180px" }} placeholder={t("@COL_VENDOR_NAME")} mapCode="vendor" category="customer" />    {/* 고객사 */}
              </Col>
              <Col>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "220px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" />   {/* 제품코드 */}
              </Col>
              <Col>
                <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" />   {/* 모델코드 */}
              </Col>
              <Col>
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 200 }} className="form-control" placeholder="LOT(WORKORDER)" />
              </Col>
              <Col style={{ maxWidth: 220 }}>
                <Button type="button" color="info" style={{ width: 210 }} onClick={() => {
                  lotSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                   {`BATCH(WORKORDER) ${t("@SEARCH")}`}   {/* 검색 */}
                </Button>
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase 
                  ref={gridRef}
                  columnDefs={ngPanelDefs()}
                  alwaysShowHorizontalScroll={true}
                  onRowSelected={panelRowSelectedHandler}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                  onGridReady={() => {
                    setList([]);
                  }}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <Row className="pb-2" style={{ height: "50%" }}>
                  <Col>
                    <GridBase 
                      ref={recipeGridRef}
                      columnDefs={recipeDefs()}
                      alwaysShowHorizontalScroll={true}
                      tooltipShowDelay={0}
                      tooltipHideDelay={1000}
                      onGridReady={() => {
                        setRecipeList([]);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="pb-2" style={{ height: "50%" }}>
                  <Col>
                    <GridBase 
                      ref={paramGridRef}
                      columnDefs={paramDefs()}
                      alwaysShowHorizontalScroll={true}
                      tooltipShowDelay={0}
                      tooltipHideDelay={1000}
                      onGridReady={() => {
                        setParamList([]);
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

export default NGPanelList;