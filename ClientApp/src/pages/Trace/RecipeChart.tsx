import moment from "moment";
import { ChangeEvent, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form } from "reactstrap";
import { Dictionary } from "../../common/types";
import style from "./Trace.module.scss";
import RecipeChartLine from "./RecipeChartLine";
import RecipeChartRange from "./RecipeChartRange";
import { executeIdle } from "../../common/utility";
import Draggable from "react-draggable";

const RecipeChart = forwardRef((props: any, ref: any) => {  
  const [showModal, setShowModal] = useState(false);
  const searchParam = useRef<Dictionary>({});

  const [chartType, setChartType] = useState<string>("L");

  const chartRangeRef = useRef<any>();
  const chartLineRef = useRef<any>();

  const fromDtRef = useRef<any>();
  const toDtRef = useRef<any>();
  const tableNameRef = useRef<any>();
  const columnNameRef = useRef<any>();
  const baseValRef = useRef<any>();
  const recipeNameRef = useRef<any>();

  const chartTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value);

    executeIdle(() => {
      event.target.value == "L" && chartLineRef.current.setChart(searchParam.current);
      event.target.value == "R" && chartRangeRef.current.setChart(searchParam.current);
    });
  }

  useImperativeHandle(ref, () => ({ 
    setShowModal,
    setSearch: (search: Dictionary) => {
      const s: Dictionary = {};
      s["fromDt"] = search["eqp_start_dt"].replace("T" , " ");
      s["toDt"] = search["eqp_end_dt"].replace("T" , " ");
      s["rawType"] = search["raw_type"];
      s["tableName"] = search["table_name"];
      s["columnName"] = search["column_name"];
      s["eqpCode"] = search["eqp_code"];
      s["recipeName"] = search["recipe_name"];

      s["baseVal"] = search["base_val"];

      searchParam.current = s;
    }
  }));

  useEffect(() => {
    
  }, []);

  if(!showModal)
    return null;

  return (
    <Draggable
      handle=".modal-header"
      >
      <Modal
        style={{ minWidth: 1250 }}
        centered={true}
        isOpen={showModal}
        onOpened={() => {
          chartType == "L" && chartLineRef.current.setChart(searchParam.current);
          chartType == "R" && chartRangeRef.current.setChart(searchParam.current);
          
          fromDtRef.current.innerHTML = moment(searchParam.current["fromDt"]).format("YYYY-MM-DD HH:mm:ss");
          toDtRef.current.innerHTML = moment(searchParam.current["toDt"]).format("YYYY-MM-DD HH:mm:ss");
          tableNameRef.current.innerHTML = `${searchParam.current["tableName"]}`;
          columnNameRef.current.innerHTML = `${searchParam.current["columnName"]}`;
          recipeNameRef.current.innerHTML = searchParam.current["recipeName"];

          baseValRef.current.innerHTML = `base val: ${searchParam.current["baseVal"]}`;
        }}
        onExit={() => {
          chartType == "L" && chartLineRef.current.resetChart();
          chartType == "R" && chartRangeRef.current.resetChart();

          setChartType("L");
        }}      
        backdrop="static"
        wrapClassName={style.lotSearchWrap}
        toggle={() => { setShowModal(!showModal); }}>
        <ModalHeader toggle={() => { setShowModal(!showModal)}}>
          Recipe Chart
        </ModalHeader>
        <ModalBody>
          <Row style={{ height: "30px" }}>
            <Col md={11} className="d-flex flex-row gap-2 search-param" style={{ height: "100%" }}>
              <div ref={fromDtRef}></div>
              <div ref={toDtRef}></div>
              <div ref={tableNameRef}></div>
              <div ref={columnNameRef}></div>
              <div ref={baseValRef}></div>
              <div ref={recipeNameRef} className="fw-bold"></div>
            </Col>
            <Col md={1}>
              <select style={{ padding: "5px"}} name="chartType" required={true} className="form-select" onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                chartTypeChangeHandler(event);
              }}>
                <option value="L">Line</option>
                <option value="R">Range</option>
              </select>
            </Col>
          </Row>
          <Row style={{ height: "350px" }}>
            <Col md={12} style={{ height: "100%" }}>
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

export default RecipeChart;
