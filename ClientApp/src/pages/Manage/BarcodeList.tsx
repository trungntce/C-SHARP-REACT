import { CellClickedEvent, CellDoubleClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import {
  useApi,
  useEditRef,
  useGridRef,
  useSearchRef,
} from "../../common/hooks";
import { contentType, Dictionary } from "../../common/types";
import { downloadFile, yyyymmddhhmmss } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { columnDefs } from "./BarcodDefs";
import { alertBox } from "../../components/MessageBox/Alert";
import { showProgress } from "../../components/MessageBox/Progress";
import api from "../../common/api";
import { useTranslation } from "react-i18next";

const BarcodeList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("barcode", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    refetch().then((result: any) => {
      if (result.data) {
        const list: Dictionary[] = result.data;

        setList(list);

        if (list.length) {
          const footerRow: Dictionary = {
            panelId: `Total: ${list.length} rows`,
          };

          gridRef.current!.api.setPinnedBottomRowData([footerRow]);
        }
      }
    });
  };

  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다. 
      return;
    }

    const param = getSearch();
    param["isExcel"] = true;

    const result = await api<any>("download", "barcode", param);

    downloadFile(
      `BARCODE_excel_export_${yyyymmddhhmmss()}.xlsx`,
      contentType.excel,
      [result.data]
    );
  };

  // useEffect(() => {
  //   searchHandler();
  // }, []);

  return (
    <>
      <ListBase
        folder="Quality Management"
        title="BARCODE"
        postfix="히스토리 조회"
        icon="menu"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker
                  name="fromDt"
                  defaultValue={moment().add(-2, "days").toDate()}
                  placeholderText="조회시작"
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker
                  name="toDt"
                  placeholderText="조회종료"
                  required={true}
                />
              </div>
              <div>
                <Input
                  name="panelId"
                  placeholder="PANEL BARCODE"
                  style={{ minWidth: "120px" }}
                />
              </div>
              <div>
                {/* <AutoCombo name="vendorCode" parentname="vendorId" sx={{ width: "180px" }} placeholder="고객사" mapCode="vendor" category="customer" /> */}
              </div>
              <div>
                <AutoCombo
                  name="itemCode"
                  parentname="inventoryItemId"
                  sx={{ width: "220px" }}
                  // 제품코드
                  placeholder={t("@COL_ITEM_CODE")}
                  mapCode="item"
                />
              </div>
              <div>
                <AutoCombo
                  name="modelCode"
                  placeholder={t("@COL_MODEL_CODE")} //모델코드
                  mapCode="model"
                />
              </div>
              <div>
                <Input
                  name="workorder"
                  placeholder="BATCH"
                  style={{ minWidth: "120px" }}
                />
              </div>
              <div style={{ maxWidth: "150px" }}>
                <Button
                  type="button"
                  color="outline-primary"
                  onClick={excelHandler}
                >
                  <i className="mdi mdi-file-excel me-1"></i> EXCEL
                </Button>
              </div>
            </div>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col id="grid-list-container">
            <GridBase
              ref={gridRef}
              columnDefs={columnDefs()}
              alwaysShowHorizontalScroll={true}
              onGridReady={() => setList([])}
            />
          </Col>
          {/* <Col id="grid-error-container" md={defaultSplit == "V" ? 4 : 12}>
            <GridBase
              ref={errorRef}
              columnDefs={errorDefs}
              alwaysShowHorizontalScroll={true}
            />
          </Col> */}
        </Row>
      </ListBase>
    </>
  );
};

export default BarcodeList;
