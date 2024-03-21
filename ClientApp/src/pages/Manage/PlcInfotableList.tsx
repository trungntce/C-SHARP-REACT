import { contentType, Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { SyntheticEvent, useEffect, useRef, useTransition } from "react";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import MultiAutoCombo from "../../components/Common/MultiAutoCombo";
import DateTimePicker from "../../components/Common/DateTimePicker";
import moment from "moment";
import {
  downloadFile,
  executeIdle,
  showLoading,
  yyyymmddhhmmss,
} from "../../common/utility";
import { alertBox } from "../../components/MessageBox/Alert";
import { columnDefs } from "./PlcInfotableDefs";
import { showProgress } from "../../components/MessageBox/Progress";
import api from "../../common/api";

const PlcInfotableList = (props: any) => {
  const { t } = useTranslation();

  const getSearchParam = () => {
    const params = getSearch();

    params["pageNo"] = pageNo.current;
    params["pageSize"] = 1000;
    if (params["colList"]) {
      const list = JSON.parse(params["colList"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["cols"] = values.join(",");
    }

    return params;
  };

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const eqpRef = useRef<any>();
  const colRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const params = getSearch();

    if (!params["eqpCode"]) {
      alertBox(t("@SELECT_EQP_CODE")); //"설비코드를 선택해 주세요."
      return;
    }

    showLoading(gridRef, true);

    const queryParam = getSearchParam();
    const cols = queryParam["cols"];

    delete queryParam["colList"];
    delete queryParam["cols"];

    const query = new URLSearchParams(queryParam);

    api<any>("post", `plcinfotable?${query.toString()}`, { cols }).catch(error => {
      alertBox(error.response.data?.detail ?? t("@SYSTEM_ERROR_TO_OCCUR"));  //시스템 오류가 발생했습니다.
      showLoading(gridRef, false);
      return;
    }).then((result: any) => {
      if (result.data) {
        const colList: Dictionary[] = result.data.item1;
        const rawList: Dictionary[] = result.data.item2;
        const rawCount: number = result.data.item3;
  
        var colDefs = columnDefs();
        colList.forEach((row: Dictionary) => {
          const desc = row["colDesc"];
          if(desc && desc.indexOf("||") > 0){
  
            const spts = desc.split("||");
  
            colDefs.push(
              {
                headerClass: "header-left",
                headerName: spts[1],
                children: [
                  {
                    headerName: spts[0],
                    field: row["colName"],
                    maxWidth: 250,          
                  }   
                ]
              });
          }else{
            colDefs.push(
              {
                headerName: row["colDesc"],
                field: row["colName"],
                maxWidth: 250,          
              }   
            );
          }        
        });
  
        gridRef.current!.api.setColumnDefs(colDefs);
  
        setList(rawList);
  
        listRef.current.setPaging(pageNo.current, 100, rawCount);

        showLoading(gridRef, false);
      }
    });    
  };

  useEffect(() => {
    executeIdle(() => {
      showLoading(gridRef, false);
    });
  }, []);

  const roomChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    eqpRef.current.setCategory(value?.value);
    colRef.current.setCategory("");
  };

  const eqpChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    colRef.current.setCategory(value?.value);
  };

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  };

  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4"));  //데이터가 없습니다.
      return;
    }

    const queryParam = getSearchParam();
    queryParam["isExcel"] = true;
    queryParam["pageNo"] = 1;
    queryParam["pageSize"] = 900000;

    const cols = queryParam["cols"];

    delete queryParam["colList"];
    delete queryParam["cols"];

    const query = new URLSearchParams(queryParam);

    const { hideProgress, startFakeProgress } = showProgress(
      "Excel export progress",
      "progress"
    );
    startFakeProgress();

    api<any>("downpost", `plcinfotable?${query.toString()}`, { cols }).catch(error => {
      alertBox(error.response.data?.detail ?? t("@SYSTEM_ERROR_TO_OCCUR")); //시스템 오류가 발생했습니다.
      
      hideProgress();
    }).then((result: any) => {
      downloadFile(
        `${queryParam["eqpCode"]}_excel_export_${yyyymmddhhmmss()}.xlsx`,
        contentType.excel,
        [result.data]
      );
  
      hideProgress();
    });  
  };

  return (
    <>
      <ListBase
        folder="System Management"
        title="PlcInfotable"
        postfix="Management"
        icon="bold"
        ref={listRef}
        buttons={[]}
        showPagination={true}
        onPaging={pagingHandler}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <div style={{ flex: "0 0 100%" }}>
              <Row className="mb-1">
                <div style={{ maxWidth: "125px" }}>
                  <DateTimePicker
                    name="fromDt"
                    defaultValue={moment().add(-1, "days").toDate()}
                    placeholderText={t("@SEARCH_START_DATE")} 
                    required={true}
                  /> {/* 조회시작 */}
                </div>
                <div style={{ maxWidth: "125px" }}>
                  <DateTimePicker
                    name="toDt"
                    placeholderText={t("@SEARCH_END_DATE")}
                    required={true}
                  />{/* 조회종료 */}
                </div>
                <div style={{ maxWidth: "270px" }}>
                  <AutoCombo
                    name="roomName"
                    placeholder={`Room ${t("@COL_DIVISION")}`}  
                    onChange={roomChangeHandler}
                    mapCode="inforoom"
                  /> {/* Room 구분 */}
                </div>
                <div style={{ maxWidth: "200px" }}>
                  <AutoCombo
                    ref={eqpRef}
                    name="eqpCode"
                    placeholder={t("@COL_EQP_CODE")}
                    onChange={eqpChangeHandler}
                    mapCode="infoeqp"
                    required={true}
                  /> {/* 설비코드 */}
                </div>
                <div style={{ maxWidth: "220px" }}>
                  <Row>
                    <Col style={{ maxWidth: "140px" }} className="text-end">
                      <Label htmlFor="type" className="form-label">
                        {t("@SEARCH_ONLY_ENDTIME")}  {/* End Time만 조회 */}
                      </Label>
                    </Col>
                    <Col style={{ maxWidth: "80px" }}>
                      <select
                        name="endtimeYn"
                        className="form-select"
                        defaultValue={"N"}
                        required
                      >
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                      </select>
                    </Col>
                  </Row>
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
              </Row>
              <Row>
                <Col className="mb-1">
                  <MultiAutoCombo
                    ref={colRef}
                    name="colList"
                    placeholder={t("@SELECT_COLUMN")}
                    mapCode="infocol"
                    sx={{ width: "100%" }}
                  /> {/* 컬럼선택 */}
                </Col>
              </Row>
            </div>
          </SearchBase>
        }
      >
        <GridBase 
          ref={gridRef} 
          columnDefs={columnDefs()}
          suppressFieldDotNotation={true}
        />
      </ListBase>
    </>
  );
};

export default PlcInfotableList;
