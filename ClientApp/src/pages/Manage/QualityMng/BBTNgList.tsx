import { CellClickedEvent, CellDoubleClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { contentType, Dictionary } from "../../../common/types";
import { downloadFile, yyyymmddhhmmss } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import Select from "../../../components/Common/Select";
import { ngTypes } from "./BBTDefs";
import myStyle from "./BBTAndDetailList.module.scss";
import { alertBox } from "../../../components/MessageBox/Alert";
import { showProgress } from "../../../components/MessageBox/Progress";
import api from "../../../common/api";
import { useParams } from "react-router";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { columnDefs } from "./BBTNgDefs";
import { useTranslation } from "react-i18next";


const BBTNgList = () => {
  const { t } = useTranslation();
  const { type } = useParams();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("bbt/ng", () => {
    const param = getSearch();
    param.type = type;
    return param;
  }, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) {
      const list: Dictionary[] = result.data;

      setList(list);

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
          footerRow.ngCnt += item.ngCnt;

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

        footerRow.ngRate = (footerRow.ngCnt * 100) / (footerRow.ngCnt + footerRow.totalCnt);

        gridRef.current!.api.setPinnedTopRowData([footerRow]);
      }
    }
  };

  // useEffect(() => {
  //   searchHandler();
  // }, []);

  const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4")); //@MSG_ALRAM_TYPE4
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "bbt/ng", param);
    downloadFile(`bbtng_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

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
                  Excel
                </Button>            
              </>
            }>
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText={t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText={t("@SEARCH_END_DATE")} required={true} /> {/* 조회종료 */}
              </div>
              <div>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ minWidth: "250px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" /> {/* 제품코드 */}
              </div>
              <div>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" /> {/* 모델코드 */}
              </div>
              <div>
                <AutoCombo name="operCode" sx={{ minWidth: "170px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" /> {/* 공정코드 */}
              </div>
              <div style={{ minWidth: "1200px" }}>
                <MultiAutoCombo name="eqpCode" placeholder={t("@COL_EQP_SELECT")} mapCode="eqp" maxSelection={20} sx={{ width: "100%" }} /> {/* 설비선택 */}
              </div>
            </div>
          </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Col id="grid-bbt-container" md={12}>
            <GridBase
              ref={gridRef}
              columnDefs={columnDefs()}
              className="ag-grid-bbt"
              containerId="grid-bbt-wrap"
              alwaysShowHorizontalScroll={true}
              onGridReady={() => {
                setList([]);
              }}
            />
          </Col>
        </Row>
      </ListBase>
    </>
  );

};

export default BBTNgList;