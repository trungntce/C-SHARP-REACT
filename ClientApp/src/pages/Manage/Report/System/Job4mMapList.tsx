import moment from "moment";
import { useRef } from "react";
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
import { job4mMapDefs } from "./Job4mMapDefs";

const Job4mMapList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("job4mmap", getSearch, gridRef);
  

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data) {
      const list: Dictionary[] = result.data;
      setList(list);

      const footerRow: Dictionary = {
        jobNo: 0,
        ngJudge: 0,
      };

      if(list.length) {
        list.forEach((item) => {
          footerRow.equipmentDescription = `Total: ${list.length}`

          footerRow.jobNo += item.ngCnt;
        });
        footerRow.ngJudge = ((footerRow.jobNo / list.length) * 100).toFixed(2) + '%';

        gridRef.current!.api.setPinnedTopRowData([footerRow]);
      }


    }
  }

  const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "job4mmap", param);
    downloadFile(`job4M_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  return (
    <>
      <ListBase
        title="4M NG Judge"
        buttons={ [] }
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
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="fromDt"
                  defaultValue={moment().add(-1, "days").toDate()}
                  placeholderText={t("@SEARCH_START_DATE")} // 조회시작
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="toDt"
                  defaultValue={moment().add(-1, "days").toDate()}
                  placeholderText={t("@SEARCH_END_DATE")} //조회종료
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col>
                  {/* 제품코드 */}
                  <AutoCombo name="itemCode" parentname="inventoryItemId" placeholder={t("@COL_ITEM_CODE")} mapCode="item" />
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" /> {/* 모델코드 */}
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <AutoCombo name="workcenterCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_WORKCENTER_NAME")} mapCode="workcenter" />{/* 작업장 */}
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />{/*설비코드*/}
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <Input name="workorder" placeholder="BATCH" style={{ minWidth: "120px" }} />
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <select name="status" className="form-select" style={{ minWidth: 80 }} defaultValue={""}>
                    <option value="">{t("@TOTAL")}</option>
                    <option value="NG">NG</option>
                    <option value="RUN">RUN</option>
                    <option value="END">END</option>
                  </select>
                </Col>
              </div>
            </Row>

          </SearchBase>
        }
      >
        <GridBase 
          ref={gridRef}
          columnDefs={job4mMapDefs()}
          onGridReady={() => {
            setList([]);
          }}
        />
        
      </ListBase>
    </>
  )

};

export default Job4mMapList;