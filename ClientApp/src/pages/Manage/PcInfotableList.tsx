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
  getMap,
  showLoading,
  yyyymmddhhmmss,
} from "../../common/utility";
import { alertBox } from "../../components/MessageBox/Alert";
import { columnDefs } from "./PcInfotableDefs";
import { showProgress } from "../../components/MessageBox/Progress";
import api from "../../common/api";
import { useParams } from "react-router-dom";

const PcInfotableList = (props: any) => {
  const { t } = useTranslation();
  const { eqpcode } = useParams();

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
  const { refetch } = useApi("pcInfotable", getSearchParam, gridRef);

  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const eqpRef = useRef<any>();
  const colRef = useRef<any>();
  const roomRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const params = getSearch();

    if (!params["eqpTableCode"]) {
      alertBox(t("@SELECT_EQP_CODE"));  //설비코드를 선택해 주세요.
      return;
    }

    const result = await refetch();
    if (result.error) {
      alertBox((result.error as Dictionary).response.data.detail);
      setList([]);
    } else if (result.data) {
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
    }
  };

  useEffect(() => {
    if(eqpcode){      //vrs 조회 전용
      showLoading(gridRef, true);
      roomRef.current.setSelect("vrs");
      getMap("infoeqptablepc").then(({data}:any) =>{
        const vrs = [...data].find((item:any)=>item.value.includes(eqpcode) && item.value.includes("error"));
        eqpRef.current.setCategory("vrs");
        eqpRef.current.setSelect(vrs.value.toString());
        executeIdle(()=>{
          searchHandler();
        });
      })
    }else{
      executeIdle(() => {
        showLoading(gridRef, false);
      });
    }
  }, []);

  const roomChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    eqpRef.current.setCategory(value?.value);
    colRef.current.setCategory("");
  };

  const eqpTableChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    var spts = value?.value.split(":");
    colRef.current.setCategory(value?.value);
  };

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  };

  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4"));    //데이터가 없습니다.
      return;
    }

    const param = getSearchParam();
    param["isExcel"] = true;
    param["pageNo"] = 1;
    param["pageSize"] = 900000;

    const { hideProgress, startFakeProgress } = showProgress(
      "Excel export progress",
      "progress"
    );
    startFakeProgress();

    const result = await api<any>("download", "pcInfotable", param);
    downloadFile(
      `${param["eqpTableCode"]}_excel_export_${yyyymmddhhmmss()}.xlsx`,
      contentType.excel,
      [result.data]
    );

    hideProgress();
  };

  return (
    <>
      <ListBase
        folder="System Management"
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
                <div style={{ maxWidth: "270px" }}>
                {/* Room 구분 */}
                  <AutoCombo
                    ref={roomRef}
                    name="roomName"
                    placeholder={`Room ${t("@COL_DIVISION")}`}
                    onChange={roomChangeHandler}
                    mapCode="inforoompc"
                  />
                </div>
                <div style={{ maxWidth: "200px" }}>
                {/* 설비코드 */}
                  <AutoCombo
                    ref={eqpRef}
                    name="eqpTableCode"
                    placeholder={t("@COL_EQP_CODE")}
                    onChange={eqpTableChangeHandler}
                    mapCode="infoeqptablepc"
                    required={true}
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
              </Row>
              <Row>
                <Col className="mb-1">
                {/* 컬럼선택 */}
                  <MultiAutoCombo
                    ref={colRef}
                    name="colList"
                    placeholder={t("@SELECT_COLUMN")}
                    mapCode="infocolbytablepc"
                    sx={{ width: "100%" }}
                  />
                </Col>
              </Row>
            </div>
          </SearchBase>
        }
      >
        <GridBase ref={gridRef} columnDefs={columnDefs()} />
      </ListBase>
    </>
  );
};

export default PcInfotableList;
