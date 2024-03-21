import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip } from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import style from "./Trace.module.scss";
import { executeIdle } from "../../common/utility";
import RecipeChartLine from "./RecipeChartLine";
import RecipeChartRange from "./RecipeChartRange";
import Draggable from "react-draggable";

const RecipeChartEx = forwardRef((props: any, ref: any) => {
  const [showModal, setShowModal] = useState(false);
  const searchParam = useRef<Dictionary>({});
  const eqpList = useRef<Dictionary[]>([]);

  const eqpCodeRef = useRef<any>();
  const chartRangeRef = useRef<any>();
  const chartLineRef = useRef<any>();

  const [recipeList, setRecipeList] = useState<Dictionary[]>([]);
  const [chartType, setChartType] = useState<string>("L");

  const recipeSearchHandler = async () => {
    const result = await api<Dictionary[]>("get", "trace/recipeex",
    {
      fromDt: searchParam.current.startDt,
      toDt: searchParam.current.endDt || moment().format("YYYY-MM-DDTHH:mm:ss"),
      eqpCode: eqpCodeRef.current.value, 
      modelCode: searchParam.current.modelCode,
      operSeqNo: searchParam.current.operSeqNo
    });

    setRecipeList(result?.data || []);

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
            recipeSearchHandler();
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
          Recipe Chart
        </ModalHeader>
        <ModalBody>
          <Row style={{ height: "350px" }}>
            <Col md={4} style={{ height: "100%" }}>
              <Row style={{ height: "12%" }}>
                <Col md={9}>
                  <select ref={eqpCodeRef} name="eqpCode" required={true} className="form-select" onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    recipeSearchHandler();
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
                        <th>레시피명</th>
                        <th>Setting Value</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipeList.map((x: Dictionary, i: number) => (
                        (
                          <tr key={i} className="selected-target" data-rowno={i}>
                            <td>
                              <div
                                id={`raw-tooltip-${i}`}
                                className="d-inline-block text-truncate" 
                                style={{ maxWidth: 240 }}
                                >
                                {x["eqpCodeCtq"] ? (<span className="badge bg-danger cell-ctq">CTQ</span>) : ""}
                                {' '}
                                {x["recipeName"]}
                              </div>
                              <UncontrolledTooltip
                                target={`raw-tooltip-${i}`}
                                placement="top"
                                className="raw-tooltip-container"
                              >
                                <span className="raw-tablename">[{x["tableName"]}]</span> {x["columnName"]}
                                <br />
                                {x["recipeName"]}
                              </UncontrolledTooltip>
                            </td>
                            <td>{x["baseVal"]}</td>
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
            <Col md={8} style={{ height: "100%" }}>
              {
                chartType == "L" ? (
                <>
                  <RecipeChartLine
                    ref={chartLineRef}
                  ></RecipeChartLine>
                </>) : (
                <>
                  <RecipeChartRange 
                    ref={chartRangeRef}
                  ></RecipeChartRange>
                </>)
              }
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Draggable>
  );
});

export default RecipeChartEx;
