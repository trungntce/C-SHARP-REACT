import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { contentType, Dictionary } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import myStyle from "./BBTAndDetailList.module.scss";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { columnDefs, ngTypes } from "./AOIVRSNgDefs";
import { alertBox } from "../../../components/MessageBox/Alert";
import { showProgress } from "../../../components/MessageBox/Progress";
import { downloadFile, yyyymmddhhmmss } from "../../../common/utility";
import api from "../../../common/api";
import { useTranslation } from "react-i18next";


const AOIVRSNgList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("aoivrs/modeleqpng", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) {
      const list: Dictionary[] = result.data;

      setList(list);

      const headerRow: Dictionary = {
        panelCnt: 0,
        ngCnt: 0
      }

      ngTypes.forEach(ng=> {
        headerRow[ng.field] = 0;
      });

      if(list.length) {
        list.forEach((item) => {
          headerRow.panelCnt += item.panelCnt;
          headerRow.ngCnt += item.ngCnt;

          ngTypes.forEach(ng=> {
            headerRow[ng.field] += item[ng.field];
          });
        });

        gridRef.current!.api.setPinnedTopRowData([headerRow]);
      }

      console.log(headerRow);
    }
  };

  // useEffect(() => {
  //   searchHandler();
  // }, []);

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

    const result = await api<any>("download", "aoivrs/modeleqpng", param);
    downloadFile(`aoivrs_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
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
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <div>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ minWidth: "250px" }} placeholder="제품코드" mapCode="item" />
              </div>
              <div>
                {/* 모델코드 */}
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </div>
              <div>
                {/* 공정코드 */}
                <AutoCombo name="operCode" sx={{ minWidth: "170px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" />
              </div>
              <div style={{ minWidth: "1200px" }}>
                {/* 설비선택 */}
                <MultiAutoCombo name="eqpCode" placeholder={t("@COL_EQP_SELECT")} mapCode="eqp" maxSelection={20} sx={{ width: "100%" }} />
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

export default AOIVRSNgList;