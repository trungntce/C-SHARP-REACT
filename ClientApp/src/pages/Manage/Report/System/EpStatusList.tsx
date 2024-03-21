import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary, contentType } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox } from "../../../../components/MessageBox/Alert";
import api from "../../../../common/api";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";
import { EpStatusDefs } from "./EpStatusDefs";

const EpStatusList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [statusCnt, setStatusCnt] = useState({
    total: 0,
    run: 0,
    fail: 0,
    down: 0,
    isnull: 0,
  });

  const { refetch } = useApi("barcode/epstatus", getSearch, gridRef);

  const [visiable, setVisiable] = useState(false);
  const [changesList, setChangesList] = useState<any>({});

  const category = useRef<any>();
  const editBtn = useRef<any>();

  useEffect(() => {
    editBtn.current.disabled = true;
    category.current.setCategory("reader");
    //searchHandler();
  }, []);

  const getEditAllRows = () => {
    const rowData: Dictionary[] = [];
    gridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  };

  const setCnt = (result: any) => {
    const total = [...result.data].length;
    const run = [...result.data].filter((f: any) => f.status === "run").length;
    const fail = [...result.data].filter(
      (f: any) => f.status === "failure"
    ).length;
    const down = [...result.data].filter(
      (f: any) => f.status === "down"
    ).length;
    const isnull = [...result.data].filter(
      (f: any) => f.status === null
    ).length;
    setStatusCnt({
      total,
      run,
      fail,
      down,
      isnull,
    });
  };

  const searchHandler = async (_?: Dictionary) => {
    setVisiable(false);
    const result = await refetch();

    if (result.data) {
      editBtn.current.disabled = false;
      setCnt(result);
      setList(result.data);
      setVisiable(true);
    }
  };

  const handleCellValueChanged = useCallback(
    (e: any) => {
      setChangesList({
        ...changesList,
        [e.data["lastDt"]]: e.data,
      });
    },
    [changesList]
  );

  const editHandlers = async () => {
    const rawList = getEditAllRows();

    const param: Dictionary = {};
    //param.rawJson = JSON.stringify(rawList);
    param.rawJson = JSON.stringify(Object.values(changesList));

    const result = await api<any>("post", "barcode/epstatusupdate", param);
    if (result.data > 0) {
      alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));   //일괄저장이 완료되었습니다.
      searchHandler();
      setChangesList({});
    }
  };
  const excelHandler = async () => {
    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4"));   //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const result = await api<any>("download", "barcode/epstatus", param);
    downloadFile(
      `EP_list_excel_export_${yyyymmddhhmmss()}.xlsx`,
      contentType.excel,
      [result.data]
    );
  };
  return (
    <>
      <ListBase
        title="EpStatus"
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button
              innerRef={editBtn}
              type="button"
              color="primary"
              onClick={editHandlers}
            >
              <i className="uil uil-pen me-2"></i> {t("@SAVE")}
            </Button>
          </div>
        }
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                <AutoCombo
                  ref={category}
                  name="deviceId"
                  sx={{ minWidth: "250px" }}
                  placeholder="Device ID"
                  mapCode="healthcheckreader"
                />
              </Col>
              <Col size="auto">
                <Input
                  name="deviceName"
                  placeholder={`Device${t("@COL_NAME")}`}
                  style={{ minWidth: "250px" }}
                />{/* Device명 */}
              </Col>
              <Col style={{ minWidth: "140px" }} className="text-end">
                <Label htmlFor="type" className="form-label">
                  {`${t("@COMMUNICATION_STATUS")}:`} {/* 통신상태: */}
                </Label>
              </Col>
              <Col style={{ minWidth: "150px" }}>
                <select
                  name="readerStatus"
                  className="form-select"
                  defaultValue={""}
                >
                  <option value="">Total</option> {/* Total */}
                  <option value="run">{t("@NORMAL")}</option> {/* 정상 */}
                  <option value="failure">{t("@COMMUNICATIONS_FAILURE")}</option>  {/* 통신장애 */}
                  <option value="down">{t("@DOWN")}</option> {/* 다운 */}
                </select>
              </Col>
              <Col>
                <Button
                  type="button"
                  style={{ width: "150px" }}
                  color="outline-primary"
                  onClick={excelHandler}
                >
                  <i className="mdi mdi-file-excel me-1"></i> EXCEL
                </Button>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <div style={{height:"110px",display:"flex"}}>
            <Col style={{}}>
              <Card style={{ height: "100%", borderColor: "#babfc7" }}>
                <CardHeader style={{backgroundColor: "#F8F8F8",borderBottom: "1px solid #babfc7",fontWeight: "bolder"}}>
                  {t("@COL_BASIC_INFORMATION")}   {/* 기본정보 */}
                </CardHeader>
                <CardBody>
                  {!visiable ? ("") : (
                    <div style={{width:"100%",height:"100%", display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-around",flex:1}}>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                      <div style={{fontSize:"15px"}}>{`${t("@TOTAL")}:`} </div>{/*전체*/}
                      <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.total} EA`}</div>
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                      <div style={{fontSize:"15px",color: "#1B9C85"}}>{`${t("@NORMAL")}:`} </div>{/*정상*/}
                      <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.run} EA`}</div>
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                      <div style={{fontSize:"15px",color: "#FFB84C",}}>{`${t("@COMMUNICATIONS_FAILURE")}:`} </div>{/*통신장애*/}
                      <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.fail} EA`}</div>
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                      <div style={{fontSize:"15px",color: "#FF0060",}}>{`${t("@DOWN")}:`} </div>{/*다운*/}
                      <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.down} EA`}</div>
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                      <div style={{fontSize:"15px"}}>{`${t("@UNCOMMUNICATED")}:`} </div>{/*미통신*/}
                      <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.isnull} EA`}</div>
                     </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-around",flex:1}}>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                     </div>
                       <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                       <div style={{fontSize:"12px"}}>{`(2 ~ 5${t("@MINUTE")} ${t("@COMMUNICATION_INTERRUPTION")})`}</div>{/*2 ~ 5 분 통신중단*/}
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                       <div style={{fontSize:"12px"}}>{`(5 ${t("@MINUTE")} ${t("@MORE")} ${t("@COMMUNICATION_INTERRUPTION")})`}</div>{/*5 분 이상 통신중단*/}
                     </div>
                     <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                       <div style={{fontSize:"12px"}}>( - )</div>
                     </div>
                    </div>
                   </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </div>
          <div style={{height: "calc(100% - 120px)"}}>
          <GridBase
            ref={gridRef}
            columnDefs={EpStatusDefs()}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
            suppressRowClickSelection={true}
            singleClickEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            onGridReady={() => setList([])}
            onCellValueChanged={handleCellValueChanged}
          />
          </div>
        </Row>
      </ListBase>
    </>
  );
};

export default EpStatusList;



{/* <Row style={{ height: "calc(100% - 130px)" }}>
<Col>
  <GridBase
    ref={gridRef}
    columnDefs={EpStatusDefs()}
    tooltipShowDelay={0}
    tooltipHideDelay={1000}
    suppressRowClickSelection={true}
    singleClickEdit={true}
    stopEditingWhenCellsLoseFocus={true}
    onGridReady={() => setList([])}
    onCellValueChanged={handleCellValueChanged}
  />
</Col>
</Row> */}