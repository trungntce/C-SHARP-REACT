import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { contentType, Dictionary } from "../../../../common/types";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showProgress } from "../../../../components/MessageBox/Progress";
import { columnDefs } from "./BarcodeRecognitionDefs";

const BarcodeRecognitionList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("barcode/recognition", getSearch, gridRef);

  // useEffect(() => {
  //   searchHandler();
  // }, []);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if (result.data) {
      const list: Dictionary[] = result.data;
      setList(list);

      const footerRow: Dictionary = {
        erpCnt: 0,
        sumBarcodeCnt: 0,
        barcodeCnt: 0,
        panelCnt: 0,
      };

      if (list.length) {
        list.forEach((item) => {
          // footerRow.eqpCode = `Total: ${list.length} rows`

          footerRow.erpCnt += parseInt(item.erpCnt);
          footerRow.sumBarcodeCnt += parseInt(item.sumBarcodeCnt);
          footerRow.barcodeCnt += parseInt(item.barcodeCnt);
          footerRow.panelCnt += parseInt(item.panelCnt);
        });

        gridRef.current!.api.setPinnedTopRowData([footerRow]);
      }
    }
  };

  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress(
      "Excel export progress",
      "progress"
    );
    startFakeProgress();

    const result = await api<any>("download", "barcode/recognition", param);
    downloadFile(
      `barcodereco_excel_export_${yyyymmddhhmmss()}.xlsx`,
      contentType.excel,
      [result.data]
    );

    hideProgress();
  };

  return (
    <>
      <ListBase
        title="BarcodeRecognition"
        buttons={[]}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button
                  type="button"
                  color="outline-primary"
                  onClick={excelHandler}
                >
                  <i className="mdi mdi-file-excel me-1"></i> Excel
                </Button>
              </>
            }
          >
            <Row style={{ flex: "0 0 100%" }}>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="fromDt"
                  defaultValue={moment().add(-1, "days").toDate()}
                  placeholderText="조회시작"
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="toDt"
                  placeholderText="조회종료"
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  {/* 모델코드 */}
                  <AutoCombo
                    name="modelCode"
                    placeholder={t("@COL_MODEL_CODE")}
                    mapCode="model"
                  />
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  {/* 설비코드 */}
                  <AutoCombo
                    name="eqpCode"
                    sx={{ minWidth: "200px" }}
                    placeholder={t("@COL_EQP_CODE")}
                    mapCode="eqp"
                  />
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <Input
                    name="workorder"
                    placeholder="BATCH"
                    style={{ minWidth: "120px" }}
                  />
                </Col>
              </div>
              <div style={{ maxWidth: "120px" }}>
                <Col size="auto">
                  <select
                    name="rtrSheet"
                    className="form-select"
                    style={{ minWidth: 80 }}
                    defaultValue={"SHEET"}
                  >
                    <option value="">{t("@TOTAL")}</option>
                    <option value="RTR">RTR</option>
                    <option value="SHEET">SHEET</option>
                  </select>
                </Col>
              </div>
              <div style={{ maxWidth: "90px" }}>
                <Col size="auto">
                  <select
                    name="barcode"
                    className="form-select"
                    style={{ minWidth: 80 }}
                    defaultValue={"Y"}
                  >
                    <option value="">{t("@TOTAL")}</option>
                    <option value="Y">Y</option>
                  </select>
                </Col>
              </div>
              <div style={{ maxWidth: "90px" }}>
                <Col size="auto">
                  <select
                    name="dupe"
                    className="form-select"
                    style={{ minWidth: 100 }}
                  >
                    <option value="">{t("@TOTAL")}</option>
                    <option value="CHK">중복 제거</option>
                  </select>
                </Col>
              </div>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={columnDefs()}
          tooltipShowDelay={0}
          tooltipHideDelay={1000}
          onGridReady={() => {
            setList([]);
          }}
        />
      </ListBase>
    </>
  );
};

export default BarcodeRecognitionList;
