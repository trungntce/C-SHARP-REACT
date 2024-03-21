import { CellDoubleClickedEvent, RowClassParams } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import api from "../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { alertBox } from "../../components/MessageBox/Alert";
import LotSearch from "../Trace/LotSearch";
import { panelDefs } from "../Trace/PanelDefs";
import PanelSearch from "../Trace/PanelSearch";
import ParamChart from "../Trace/ParamChart";
import RecipeChart from "../Trace/RecipeChart";
import { traceDefs } from "../Trace/TraceDefs";
import style from "./Affect.module.scss";
import { paramDefs } from "./AffectParamDefs";
import { useTranslation } from "react-i18next";

const AffectParamList = () => {
  const { t } = useTranslation();
  const data4MRef = useRef<Dictionary>({});

  const panelIdRef = useRef<any>();
  const panelSearchRef = useRef<any>();
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();
  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();
  const { refetch } = useApi("affectpanel/param", getSearch, gridRef); 

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }
  
  const panelSelectedHandler = (panel: Dictionary) => {
    panelIdRef.current.value = panel.panelId;

    searchHandler();
  }
  
  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();

    const fromDt = moment.utc(search["fromDt"]);
    const toDt = moment.utc(search["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

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

  const panelSearchHandler = (row: Dictionary) => {
    data4MRef.current = row;

    panelGridRef.current!.api.showLoadingOverlay();
    api("get", "affectpanel/param/panel", row).then((result: Dictionary) => {
      if(result.data)
      setPanelList(result.data);
    });
  }

  const getPanelRef = () => {
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

    return panel.concat(trace);
  }

  useEffect(() => {    
    searchHandler();    
  }, []);

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
                {/* 고객사 */}
                <AutoCombo name="vendorCode" parentname="vendorId" sx={{ width: "150px" }} placeholder={t("@COL_VENDOR_NAME")} mapCode="vendor" category="customer" />
              </Col>
              {/* <Col>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "180px" }} placeholder="제품코드" mapCode="item" />
              </Col> */}
              <Col>
              {/* 모델코드 */}
                <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </Col>
              <Col>
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 180 }} className="form-control" placeholder="LOT(WORKORDER)" />  
              </Col>
              <Col style={{ maxWidth: 180 }}>
                <Button type="button" color="info" style={{ width: 120 }} onClick={() => {
                  lotSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  BATCH {t("@SEARCH")}
                </Button>
              </Col>
              <Col style={{ minWidth: "220px" }}>
              {/* 판넬바코드 */}
                <Input innerRef={panelIdRef} name="panelId" type="text" className="form-control" placeholder={t('@COL_PANEL_BARCODE')} />
              </Col>
              <Col style={{ maxWidth: 180 }}>
                <Button type="button" color="success" style={{ width: 150 }} onClick={() => {
                  panelSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  {/* 판넬 바코드 검색 */}
                  {t("@COL_PANEL_BARCODE")}{t("@SEARCH")}
                </Button>
              </Col>
              <Col style={{ maxWidth: 80 }}>
                <select name="judge" className="form-select" defaultValue={"N"}>
                  <option value="">{t("@TOTAL")}</option>
                  <option value="O">OK</option>
                  <option value="N">NG</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={9}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase 
                  ref={gridRef}
                  columnDefs={paramDefs({ 
                    panelSearch: (row: Dictionary) => {
                      panelSearchHandler(row);
                    },
                  })}
                  alwaysShowHorizontalScroll={true}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={panelGridRef}
                  columnDefs={getPanelRef()}
                  rowMultiSelectWithClick={false}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}                    
                  onGridReady={() => {
                    setPanelList([]);
                  }}
                  rowClassRules={{
                    'workorder-row': (param: RowClassParams) => { 
                      return param.data.workorderReal == data4MRef.current.workorder;
                    },
                    'not-workorder-row': (param: RowClassParams) => { 
                      return param.data.workorderReal != data4MRef.current.workorder;
                    },
                  }}
                />
              </div>
            </Col>
          </Row>
      </ListBase>

      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />

      <PanelSearch
        ref={panelSearchRef}
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

export default AffectParamList;