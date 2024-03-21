import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary, contentType } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import { columnDefs } from "./RollPnlPcsMapDefs";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";
import { showProgress } from "../../../../components/MessageBox/Progress";
import api from "../../../../common/api";

const RollPnlMapList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("rollpanelmap/pcsmatch", getSearch, gridRef);

  const options = {
    searchform : {
      maxWidth : "155px"
    }
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const searchHandler = async (_?: Dictionary) => {
    let paramData = getSearch();
    const result = await refetch();

    if(result.data)
      setList(result.data);
  };

  const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox("데이터가 없습니다.");
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "rollpanelmap/pcsmatch", param);
    downloadFile(`rollpnlsheetpcsmap_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  return (
    <>
      <ListBase
        title="Roll-PNL-SHEET-PCS 매칭이력조회"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <Row style={{ flex: "0 0 100%" }}>
            <div style={{ maxWidth: '150px' }}>
              <Col>
                <select name="searchcolumn" className="form-select">
                  <option value="workindt">{t("@COL_INPUT_DATE")}</option> {/* 투입일자 */}
                  <option value="completedt">{t("@COL_COMPLETION_DATE")}</option> {/* 완료일자 */}
                  <option value="outdt">{t("@COL_SHIPMENT_DATE")}</option> {/* 출하일자 */}
                </select>
              </Col>
              </div>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="fromDt"
                  defaultValue={moment().add(-2, "days").toDate()}
                  placeholderText={t("@SEARCH_START_DATE")}
                  required={true}
                />{/* 조회시작 */}
              </div>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="toDt"
                  placeholderText={t("@SEARCH_END_DATE")}
                  required={true}
                />{/* 조회종료 */}
              </div>
              <div style={{ maxWidth: options.searchform.maxWidth }}>
                <Col size="auto">
                  <Input name="rollid" type="text" placeholder="ROLL Code" />
                </Col>
              </div>
              <div style={{ maxWidth: options.searchform.maxWidth }}>
                <Col size="auto">
                  <Input name="batch" type="text" placeholder="Batch Code" />
                </Col>
              </div>
              <div style={{ maxWidth: options.searchform.maxWidth }}>
                <Col size="auto">
                  <Input name="panelid" type="text" placeholder="PNL Code" />
                </Col>
              </div>
              <div style={{ maxWidth: options.searchform.maxWidth }}>
                <Col size="auto">
                  <Input name="sheetid" type="text" placeholder="Sheet Code" />
                </Col>
              </div>
              <div style={{ maxWidth: options.searchform.maxWidth }}>
                <Col size="auto">
                  <Input name="pieceid" type="text" placeholder="PCS Code" />
                </Col>
              </div>
              {/* <div style={{ maxWidth: '170px' }}>
              <Col>
                <select name="LimitColumn" className="form-select">
                  <option value="">Sheet or PCS 제외</option>
                  <option value="PCS">Sheet or PCS 포함</option>
                </select>
              </Col>
              </div> */}
            </Row>
          </SearchBase>
        }
        >
          <GridBase
            ref={gridRef}
            columnDefs={columnDefs()}
          />
        </ListBase>
    </>
  )
}

export default RollPnlMapList;
