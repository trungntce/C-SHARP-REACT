import moment from "moment";
import { useEffect, useRef, useState } from "react";
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
import { readerDefs } from "./BarcodeReaderDefs";
import { alertBox } from "../../../../components/MessageBox/Alert";
import api from "../../../../common/api";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";

const BarcodeReaderList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [statusCnt, setStatusCnt] = useState({
    total: 0,
    run: 0,
    fail: 0,
    down: 0,
  });

  const { refetch } = useApi("barcode/reader", getSearch, gridRef);

  const [visiable, setVisiable] = useState(false);

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
    setStatusCnt({
      total,
      run,
      fail,
      down,
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

  const editHandlers = async () => {
    const rawList = getEditAllRows();

    const param: Dictionary = {};
    param.rawJson = JSON.stringify(rawList);

    const result = await api<any>("post", "barcode/readerusupdate", param);
    if (result.data > 0) {
      alertBox("일괄저장이 완료되었습니다.");
      searchHandler();
    }
  };
  const excelHandler = async () => {
    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox("데이터가 없습니다.");
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const result = await api<any>("download", "barcode/reader", param);
    downloadFile(
      `EP_list_excel_export_${yyyymmddhhmmss()}.xlsx`,
      contentType.excel,
      [result.data]
    );
  };
  return (
    <>
      <ListBase
        title="BarcodeReader"
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button
              innerRef={editBtn}
              type="button"
              color="primary"
              onClick={editHandlers}
            >
              <i className="uil uil-pen me-2"></i> 저장
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
                  placeholder="Device명"
                  style={{ minWidth: "250px" }}
                />
              </Col>
              <Col style={{ minWidth: "140px" }} className="text-end">
                <Label htmlFor="type" className="form-label">
                  통신상태:
                </Label>
              </Col>
              <Col style={{ minWidth: "150px" }}>
                <select
                  name="readerStatus"
                  className="form-select"
                  defaultValue={""}
                >
                  <option value="">Total</option>
                  <option value="run">정상</option>
                  <option value="failure">통신장애</option>
                  <option value="down">다운</option>
                </select>
              </Col>
              <Col>
                <Button
                  type="button"
                  style={{ width: "150px" }}
                  color="outline-primary"
                  onClick={excelHandler}
                >
                  <i className="mdi mdi-file-excel me-1"></i> 엑셀 다운로드
                </Button>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col>
            <Row style={{ height: "85px" }}>
              <Col className="pb-2">
                <Card style={{ height: "100%", borderColor: "#babfc7" }}>
                  <CardHeader
                    style={{
                      backgroundColor: "#F8F8F8",
                      borderBottom: "1px solid #babfc7",
                      fontWeight: "bolder",
                    }}
                  >
                    기본정보
                  </CardHeader>
                  <CardBody>
                    {!visiable ? (
                      ""
                    ) : (
                      <>
                        <Row>
                          <Col md={2} className="text-truncate">
                            <Label
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                                marginRight: ".5rem",
                              }}
                            >
                              전체:
                            </Label>
                            <Label
                              style={{ fontSize: "15px", fontWeight: "500" }}
                            >
                              {`${statusCnt.total} EA`}
                            </Label>
                          </Col>
                          <Col md={2} className="text-truncate">
                            <Label
                              style={{
                                color: "#1B9C85",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginRight: ".5rem",
                              }}
                            >
                              정상:
                            </Label>
                            <Label
                              style={{ fontSize: "15px", fontWeight: "500" }}
                            >
                              {`${statusCnt.run} EA`}
                            </Label>
                          </Col>
                          <Col md={2} className="text-truncate">
                            <Label
                              style={{
                                color: "#FFB84C",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginRight: ".5rem",
                              }}
                            >
                              통신장애:
                            </Label>
                            <Label
                              style={{ fontSize: "15px", fontWeight: "500" }}
                            >
                              {`${statusCnt.fail} EA`}
                            </Label>
                          </Col>
                          <Col md={2} className="text-truncate">
                            <Label
                              style={{
                                color: "#FF0060",
                                fontSize: "15px",
                                fontWeight: "500",
                                marginRight: ".5rem",
                              }}
                            >
                              다운:
                            </Label>
                            <Label
                              style={{ fontSize: "15px", fontWeight: "500" }}
                            >
                              {`${statusCnt.down} EA`}
                            </Label>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: "-1rem" }}>
                          <Col md={2} className="text-truncate"></Col>
                          <Col md={2} className="text-truncate"></Col>
                          <Col md={2} className="text-truncate">
                            {`(2 ~ 5 분 통신중단)`}
                          </Col>
                          <Col md={2} className="text-truncate">
                            <Label style={{ marginRight: ".5rem" }}>
                              {`(5분 이상 통신중단)`}
                            </Label>
                          </Col>
                        </Row>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
          <Row style={{ height: "calc(100% - 120px)" }}>
            <Col>
              <GridBase
                ref={gridRef}
                columnDefs={readerDefs}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
                suppressRowClickSelection={true}
                singleClickEdit={true}
                stopEditingWhenCellsLoseFocus={true}
                onGridReady={() => setList([])}
              />
            </Col>
          </Row>
        </Row>
      </ListBase>
    </>
  );
};

export default BarcodeReaderList;
