import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import style from "./Trace.module.scss";
import { executeIdle } from "../../common/utility";
import ParamChartRange from "./ParamChartRange";
import ParamChartLine from "./ParamChartLine";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";

const ParamChartEx = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const searchParam = useRef<Dictionary>({});
  const eqpList = useRef<Dictionary[]>([]);

  const eqpCodeRef = useRef<any>();
  const chartRangeRef = useRef<any>();
  const chartLineRef = useRef<any>();

  const [paramList, setParamList] = useState<Dictionary[]>([]);
  const [chartType, setChartType] = useState<string>("L");

  const paramSearchHandler = async () => {
    const result = await api<Dictionary[]>("get", "trace/paramex", 
    {
      fromDt: searchParam.current.startDt,
      toDt: searchParam.current.endDt || moment().format("YYYY-MM-DDTHH:mm:ss"),
      eqpCode: eqpCodeRef.current.value, 
      modelCode: searchParam.current.modelCode,
      operSeqNo: searchParam.current.operSeqNo
    });

    setParamList(result?.data || []);

    chartType == "L" && chartLineRef.current.resetChart();
    chartType == "R" && chartRangeRef.current.resetChart();
  }

  const chartTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value);
  }

  useImperativeHandle(ref, () => ({
    setShowModal,
    setSearch: (search: Dictionary) => {
      searchParam.current = search;
      eqpList.current = JSON.parse(searchParam.current.eqpJson);
    }
  }));

  useEffect(() => {
  }, []);

  if (!showModal)
    return null;

  return (
    <Draggable
      handle=".modal-header"
      >
      <Modal
        style={{ minWidth: 1400 }}
        centered={true}
        isOpen={showModal}
        onOpened={() => {
          executeIdle(() => {
            paramSearchHandler();
          });
        }}
        onExit={() => {
          chartType == "L" && chartLineRef.current.resetChart();
          chartType == "R" && chartRangeRef.current.resetChart();

          setChartType("L");
        }}
        backdrop="static"
        wrapClassName={style.lotSearchWrap}
        toggle={() => { setShowModal(!showModal); }}>
        <ModalHeader toggle={() => { setShowModal(!showModal) }}>
          Parameter Chart
        </ModalHeader>
        <ModalBody>
          <Row style={{ height: "350px" }}>
            <Col md={5} style={{ height: "100%" }}>
              <Row style={{ height: "12%" }}>
                <Col md={9}>
                  <select ref={eqpCodeRef} name="eqpCode" required={true} className="form-select" onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    paramSearchHandler();
                  }}>
                    {eqpList.current.map((x: Dictionary, i: number) => (
                      (
                        <option key={i} value={x["eqp_code"]}>{x["eqp_name"]}</option>
                      )
                    ))}
                  </select>
                </Col>
                <Col md={3}>
                  <select name="chartType" required={true} className="form-select" onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    chartTypeChangeHandler(event);
                  }}>
                    <option value="L">Line</option>
                    <option value="R">Range</option>
                  </select>
                </Col>
              </Row>
              <Row style={{ height: "88%" }}>
                <Col style={{ height: "100%", overflowY: "auto" }}>
                  <Table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        {/*파마미터명*/}
                        <th>{t("@COL_PARAMETER_NAME")}</th> 
                        <th>STD</th>
                        <th>LCL</th>
                        <th>UCL</th>
                        <th>LSL</th>
                        <th>USL</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paramList.map((x: Dictionary, i: number) => (
                        (
                          <tr key={i} className="selected-target" data-rowno={i}>
                            <td>
                              <div
                                id={`raw-tooltip-${i}`}
                                className="d-inline-block text-truncate" 
                                style={{ maxWidth: 200 }}
                              >
                                {x["eqpCodeCtq"] ? (<span className="badge bg-danger cell-ctq">CTQ</span>) : ""}
                                {' '}
                                {x["paramName"]}
                              </div>
                              <UncontrolledTooltip
                                target={`raw-tooltip-${i}`}
                                placement="top"
                                className="raw-tooltip-container"
                              >
                                <span className="raw-tablename">[{x["tableName"]}]</span> {x["columnName"]}
                                <br />
                                {x["paramName"]}
                              </UncontrolledTooltip>
                            </td>
                            <td>{x["std"]}</td>
                            <td>{x["lcl"]}</td>
                            <td>{x["ucl"]}</td>
                            <td>{x["lsl"]}</td>
                            <td>{x["usl"]}</td>
                            <td className={x["judge"] == 'O' ? "judge-ok" : "judge-ng"}>
                              <a onClick={() => {
                                const rows = document.getElementsByClassName("selected-target");
                                for (let index = 0; index < rows.length; index++) {
                                  const row = rows[index] as HTMLTableRowElement;
                                  row.classList.remove("selected");

                                  if(row.dataset.rowno == i.toString())
                                    row.classList.add("selected");
                                }

                                const param = {...x};
                                param.eqpCode = eqpCodeRef.current.value;
                                param.fromDt = searchParam.current.startDt;
                                param.toDt = searchParam.current.endDt;

                                chartType == "L" && chartLineRef.current.setChart(param);
                                chartType == "R" && chartRangeRef.current.setChart(param);
                              }}>
                                <i className="fa fa-search"></i>
                              </a>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
            <Col md={7} style={{ height: "100%" }}>
              {
                chartType == "L" ? (
                <>
                  <ParamChartLine
                    ref={chartLineRef}
                  ></ParamChartLine>
                </>) : (
                <>
                  <ParamChartRange 
                    ref={chartRangeRef}
                  ></ParamChartRange>
                </>)
              }
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Draggable>
  );
});

export default ParamChartEx;
