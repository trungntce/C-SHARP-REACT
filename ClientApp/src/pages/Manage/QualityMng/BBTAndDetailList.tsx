import { CellClickedEvent, CellDoubleClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { contentType, Dictionary } from "../../../common/types";
import { downloadFile, easeOutQuad, executeIdle, isNullOrWhitespace, showLoading, toQueryString, yyyymmddhhmmss } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import Select from "../../../components/Common/Select";
import { columnDefs, ngTypes } from "./BBTDefs";
import { columnDetailDefs } from "./BBTAndDetailDefs";
import myStyle from "./BBTAndDetailList.module.scss";
import { alertBox } from "../../../components/MessageBox/Alert";
import { showProgress } from "../../../components/MessageBox/Progress";
import { getWeeksInMonthWithOptions } from "date-fns/fp";
import api from "../../../common/api";
import { ReactQueryDevtoolsPanel } from "react-query/types/devtools";
import { useParams } from "react-router";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { useTranslation } from "react-i18next";


const BBTAndDetailList = () => {
  const { t } = useTranslation();
  const { type, workorder, dt } = useParams();

  const itemRef = useRef<string | null>(null);
  const workorderRef = useRef<string | null>(null);
  const panelIdRef = useRef<string | null>(null);
  const [searchRef, getSearch] = useSearchRef();

  const fromDtRef = useRef<any>();
  const toDtRef = useRef<any>();
  const lotNoRef = useRef<any>();

  const [gridRef, setList] = useGridRef();
  const [detailRef, setDetailList] = useGridRef();

  const { refetch } = useApi("bbt", () => {
    const param = getSearch();
    param.type = type;
    return param;
  }, gridRef);
  const { get } = useApi("bbt/detail", () => { return {}; }, gridRef);

  const bbtRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) {
      const list: Dictionary[] = result.data;
      const param = getSearch();
      const api = gridRef.current!.columnApi;

      list.forEach(x => {
        switch(param.groupby){
          case "VENDOR":
            api.setColumnVisible("vendorName", true);
            api.setColumnVisible("itemCode", false);
            api.setColumnVisible("itemName", false);
            api.setColumnVisible("modelCode", false);
            api.setColumnVisible("workorder", false);
            api.setColumnVisible("panelId", false);
            api.setColumnVisible("matchPanelId", false);
            // x.itemCode = "";
            // x.itemName = "";
            // x.modelCode = "";
            // x.workorder = "";
            // x.panelId = "";
            break;
          case "ITEM":
            api.setColumnVisible("vendorName", true);
            api.setColumnVisible("itemCode", true);
            api.setColumnVisible("itemName", true);
            api.setColumnVisible("modelCode", false);
            api.setColumnVisible("workorder", false);
            api.setColumnVisible("panelId", false);
            api.setColumnVisible("matchPanelId", false);
            // x.modelCode = "";
            // x.workorder = "";
            // x.panelId = "";
            break;
          case "MODEL":
            api.setColumnVisible("vendorName", true);
            api.setColumnVisible("itemCode", true);
            api.setColumnVisible("itemName", true);
            api.setColumnVisible("modelCode", true);
            api.setColumnVisible("workorder", false);
            api.setColumnVisible("panelId", false);
            api.setColumnVisible("matchPanelId", false);
            // x.workorder = "";
            // x.panelId = "";
            break;
            case "LOT":
              api.setColumnVisible("vendorName", true);
              api.setColumnVisible("itemCode", true);
              api.setColumnVisible("itemName", true);
              api.setColumnVisible("modelCode", true);
              api.setColumnVisible("workorder", true);
              api.setColumnVisible("panelId", false);
              api.setColumnVisible("matchPanelId", false);
              // x.panelId = "";
              break;
            case "PANEL":
              api.setColumnVisible("vendorName", true);
              api.setColumnVisible("itemCode", true);
              api.setColumnVisible("itemName", true);
              api.setColumnVisible("modelCode", true);
              api.setColumnVisible("workorder", true);
              api.setColumnVisible("panelId", true);
              api.setColumnVisible("matchPanelId", true);
              // x.panelId = "";
              break;
            case "EQP":
            api.setColumnVisible("vendorName", false);
            api.setColumnVisible("itemCode", false);
            api.setColumnVisible("itemName", false);
            api.setColumnVisible("modelCode", false);
            api.setColumnVisible("workorder", false);
            api.setColumnVisible("panelId", false);
            api.setColumnVisible("matchPanelId", false);
            // x.vendorName = "";
            // x.itemCode = "";
            // x.itemName = "";
            // x.modelCode = "";
            // x.workorder = "";
            // x.panelId = "";
            break;
        }
      });

      setList(list);

      setDetailList([]);

      const footerRow: Dictionary = {
        panelCnt: 0,
        totalCnt: 0,
        ngCnt: 0,

        "4WCnt": 0,
        auxCnt: 0,
        bothCnt: 0,
        cCnt: 0,
        erCnt: 0,
        openCnt: 0,
        spkCnt: 0,
        shortCnt: 0,
      };

      ngTypes.forEach(ng => {
        footerRow[ng.field] = 0;
      });

      if (list.length) {
        list.forEach((item) => {
          footerRow.mesDate = `Total: ${list.length} rows`;

          footerRow.panelCnt += item.panelCnt;
          footerRow.totalCnt += item.totalCnt;
          footerRow.ngCnt += item.ngCnt

          footerRow["4WCnt"] += item["4WCnt"];
          footerRow.auxCnt += item.auxCnt;
          footerRow.bothCnt += item.bothCnt;
          footerRow.cCnt += item.cCnt;
          footerRow.erCnt += item.erCnt;
          footerRow.openCnt += item.openCnt;
          footerRow.spkCnt += item.spkCnt;
          footerRow.shortCnt += item.shortCnt;

          ngTypes.forEach(ng => {
            footerRow[ng.field] += item[ng.field];
          });
        });

        footerRow.ngRate = (footerRow.ngCnt * 100) / footerRow.totalCnt;
      }

      gridRef.current!.api.setPinnedTopRowData([footerRow]);
    }
  };

  useEffect(() => {
    if(workorder && dt){
      const fromDt = moment(dt).add(-30, 'days').toDate();
      const toDt = moment(dt).add(30, 'days').toDate();

      fromDtRef.current.setDate(fromDt);
      toDtRef.current.setDate(toDt);

      lotNoRef.current.value = workorder;

      executeIdle(() => {
        searchHandler();
      });
    }
  }, []);

  const splitHandler = (direction: string) => {
    const bbt = document.getElementById("grid-bbt-container");    
    const detail = document.getElementById("grid-detail-container");

    switch(direction){
      case "V":
        bbt?.classList.remove("col-md-12");
        bbt?.classList.add("col-md-6");

        detail?.classList.remove("col-md-12");
        detail?.classList.add("col-md-6");
        break;
      case "H":
        bbt?.classList.remove("col-md-6");
        bbt?.classList.add("col-md-12");

        detail?.classList.remove("col-md-6");
        detail?.classList.add("col-md-12");
        break;
      }

      localStorage.setItem('bbt.split', direction)
  };

  const cellClickHandler = async (event: CellClickedEvent<Dictionary>) => {
    const bbtParam = getSearch();
    const param: Dictionary = {
      pageNo: 1,
      pageSize: 999999,
      fromDt: bbtParam.fromDt,
      toDt: bbtParam.toDt,
      type: bbtParam.type,
    };        
    
    switch(event.column["colId"]){
      // case "itemCode":
      // {
      //   itemRef.current = param["itemCode"] = event.data!.itemCode;
      //   panelIdRef.current = null;
      //   workorderRef.current = null;
      //   break;
      // }
      case "workorder":
      {
        itemRef.current = null;
        panelIdRef.current = null;
        workorderRef.current = param["workorder"] = event.data!.workorder;
        break;
      }
      case "panelId":
      {
        panelIdRef.current = param["panelId"] = event.data!.panelId;
        itemRef.current = null;
        workorderRef.current = null;
        break;
      }
      default:
        return;
    }

    if(itemRef.current == null && 
      panelIdRef.current == null && 
      workorderRef.current == null)
      return;

    showLoading(detailRef, true);

    const result = await get!(param);
    if(result.data){
      setDetailList(result.data);

      const label = document.getElementsByClassName("grid-top-detail-label");
      if(label && label.length){
        label[0].innerHTML = `, [${workorderRef.current || panelIdRef.current}] Detail: ${result.data.length} rows`;
      }
    }
  }

  const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4"));  //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "bbt", param);
    downloadFile(`bbt_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  const excelDetailHandler = async (e:any) => {
    e.preventDefault();

    if(isNullOrWhitespace(itemRef.current) && 
      isNullOrWhitespace(workorderRef.current) &&
      isNullOrWhitespace(panelIdRef.current))
    {
      alertBox(t("@SELECT_VENDOR_OR_BATCH"));  // 고객코드나 BATCH을 선택해 주세요
      return;
    }

    const bbtParam = getSearch();

    const param: Dictionary = {
      pageNo: 1,
      pageSize: 999999,
      fromDt: bbtParam.fromDt,
      toDt: bbtParam.toDt,
      type: bbtParam.type,
      itemCode: itemRef.current,
      workorder: workorderRef.current,
      panelId: panelIdRef.current,
      isExcel: true
    };        

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "bbt/detail", param);
    downloadFile(`bbt_excel_export_detail_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  const defaultSplit = localStorage.getItem('bbt.split') || "V";

  return (
    <>
      <ListBase
        className={myStyle.bbtContainer}
        folder="Quality Management"
        title="BBT"
        postfix="검사DATA조회"
        icon="menu"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  {/* 목록 */}
                  {t("@COL_LIST")}
                </Button>            
                <Button type="button" color="outline-secondary" onClick={excelDetailHandler}>
                <i className="mdi mdi-file-excel me-1"></i>{" "}
                  {/* 상세 */}
                  {t("@COL_DETAILS")}
                </Button>
              </>
            }>
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker ref={fromDtRef} name="fromDt" defaultValue={moment().add(-3, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker ref={toDtRef} name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <div>
                {/* 고객사 */}
                <AutoCombo name="vendorCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_VENDOR_NAME")} mapCode="vendor" category="customer" />
              </div>
              <div>
                {/* 제품코드 */}
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ minWidth: "250px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" />
              </div>
              <div>
                {/* 제품명 */}
                <Input name="itemName" placeholder={t("@COL_ITEM_NAME")} style={{ minWidth: "250px" }} />
              </div>
              <div>
                {/* 모델코드 */}
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </div>
              <div>
                <Input innerRef={lotNoRef} name="workorder" placeholder="BATCH No" style={{ minWidth: "236px" }} />
              </div>
              <div>
                {/* 설비코드 */}
                <MultiAutoCombo name="eqpCode" display="inline" category="M-005" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
              </div>
              <div>
                {/* 어플리케이션 */}
                <AutoCombo name="appCode" sx={{ minWidth: "170px" }} placeholder={t("@APPLICATION")} mapCode="app" />
              </div>
              <div>
                <Row>
                  <Col style={{ minWidth: "70px"}} className="text-end">
                    {/* 조회기준 */}
                    <Label htmlFor="groupby" className="form-label">{`${t("@COL_LOOKUP_STANDARD")}:`}</Label>
                  </Col>
                  <Col style={{ minWidth: "100px" }}>
                    <Select name="groupby" label={t("@COL_LOOKUP_STANDARD")} placeholder={t("@COL_LOOKUP_STANDARD")} defaultValue="LOT" mapCode="code" category="BBT_GROUPBY" required={true} className="form-select" />
                  </Col>
                </Row>
              </div>
              <div className="radio-container">
                <Row>
                  <Col style={{ minWidth: "80px"}} className="text-end">
                    {/* 화면분할 */}
                    <Label htmlFor="groupby" className="form-label">{`${t("@COL_SCREEN_DIVISION")}:`}</Label>
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
              <div>
                <Row>
                  <Col style={{ maxWidth: "80px"}} className="text-end">
                    {/* 산출기준 */}
                    <Label htmlFor="type" className="form-label">{`${t("@COL_CALCULATION_STANDARD")}:`}</Label>
                  </Col>
                  <Col style={{ minWidth: "100px" }}>
                    <Select name="type" label={t("@COL_CALCULATION_STANDARD")} placeholder={t("@COL_CALCULATION_STANDARD")} defaultValue="D" mapCode="code" category="BBT_DETAIL" required={true} className="form-select" />
                  </Col>
                </Row>
                
              </div>
            </div>
          </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Col id="grid-bbt-container" md={defaultSplit == "V" ? 6 : 12}>
            <GridBase
              ref={gridRef}
              columnDefs={columnDefs()}
              className="ag-grid-bbt"
              containerId="grid-bbt-wrap"
              alwaysShowHorizontalScroll={true}
              onCellClicked={cellClickHandler}
              onGridReady={() => {
                setList([]);
              }}
            />
          </Col>
          <Col id="grid-detail-container" md={defaultSplit == "V" ? 6 : 12}>
            <GridBase
              ref={detailRef}
              columnDefs={columnDetailDefs()}
              className="ag-grid-bbt"
              containerId="grid-detail-wrap"
              alwaysShowHorizontalScroll={true}
              onGridReady={() => {
                setDetailList([]);
              }}
            />
          </Col>
        </Row>
      </ListBase>
    </>
  );

};

export default BBTAndDetailList;