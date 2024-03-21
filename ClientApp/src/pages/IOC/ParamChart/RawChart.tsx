import React, { ChangeEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { Row, Col, Label, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import style from "./RawChart.module.scss";
import IOCMenu from "../IOCMenu";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import Select from "../../../components/Common/Select";
import AutoCombo from "../../../components/Common/AutoCombo";
import { Dictionary } from "../../../common/types";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { useSubmitHandler, useSubmitRef } from "../../../common/hooks";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { alertBox } from "../../../components/MessageBox/Alert";
import ParamChartBody from "./ChartList";
import { ListItemSecondaryAction } from "@mui/material";

const RawChart = () => {
  const { t } = useTranslation();
  
  const roomRef = useRef<any>();
  const eqpRef = useRef<any>();
  const colRef = useRef<any>();
  const listRef = useRef<any>();
  
  const [formRef, setForm] = useSubmitRef();
  const submitHandler = useSubmitHandler((formData: FormData, data: Dictionary) => {
    const fromDt = moment.utc(data["fromDt"]);
    const toDt = moment.utc(data["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

    if(days > 14)
    {
      alertBox("조회기간은 최대 14일입니다.");
      return;
    }

    if(!data.colList){
      alertBox("항목을 선택해 주세요.");
      return;
    }

    const cols = JSON.parse(data.colList);
    if(cols.length <= 0){
      alertBox("항목을 선택해 주세요.");
      return;
    }

    const items = [...listRef.current.getItems()];
    if(items.length >= 3)
    {
      alertBox("최대 3개까지 추가 가능합니다.");
      return;
    }

    data.index = items.length;
    items.push(data);

    listRef.current.setItems(items);
  });

  const rawTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>, value: string) => {
    if(value == 'P'){ // PC
      roomRef.current.setMapCode("inforoompc");
      eqpRef.current.setMapCode("infoeqptablepc");
      colRef.current.setMapCode("infocolbytablepc");
    }else{ // PLC
      roomRef.current.setMapCode("inforoom");
      eqpRef.current.setMapCode("infoeqp");
      colRef.current.setMapCode("infocol");
    }
  }

  const roomChangeHandler = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => {
    eqpRef.current.setCategory(value?.value);
    colRef.current.setValue([]);
  };

  const eqpChangeHandler = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => {
    colRef.current.setValue([]);
    colRef.current.setCategory(value?.value);
  };

  useEffect(() => {
  }, []);

  return (
    <>
      <div className={`${style.matrix4Container} min-vh-100 p-3`}>
      <Row style={{ height: "35px" }} className="mb-2">
          <Col>
            <IOCMenu title="Parameter Chart"></IOCMenu>
          </Col>
        </Row>
        <Row style={{ height: "47px" }} className="mb-2">
          <Col>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-body">
                <Form 
                  innerRef={formRef}
                  onSubmit={submitHandler}>
                  <Row>
                    <Col md={10}>
                      <Row className="search-container">
                        <Col style={{ maxWidth: "120px" }}>
                          <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()}  placeholderText="조회시작" dateFormat="yyyy-MM-dd" required={true} />
                          <input type="hidden" name="eqpCode" />
                        </Col>
                        <Col style={{ maxWidth: "120px" }}>
                          <DateTimePicker name="toDt" placeholderText="조회종료" dateFormat="yyyy-MM-dd" required={true} />
                        </Col>
                        <Col style={{ maxWidth: "100px" }}>
                          <Select name="rawType" placeholder="수집장비유형" defaultValue="L" mapCode="code" category="HC_TYPE" className="form-select" onChange={rawTypeChangeHandler} required={true} />
                        </Col>
                        <Col style={{ maxWidth: "200px" }}>
                          <AutoCombo ref={roomRef} name="roomName" placeholder="Room 구분" onChange={roomChangeHandler} mapCode="inforoom" />
                        </Col>
                        <Col style={{ maxWidth: "200px" }}>
                          <AutoCombo ref={eqpRef} name="eqpCode" labelname="eqpName" placeholder="설비코드" onChange={eqpChangeHandler} mapCode="infoeqp" required={true} />
                        </Col>
                        <Col style={{ maxWidth: "140px" }}>
                          <select name="chartType" defaultValue="L" className="form-select" required={true}>
                            <option value="L">Line(1분 라인)</option>
                            <option value="R">Range(범위)</option>
                          </select>
                        </Col>
                        <Col style={{ maxWidth: "750px" }}>
                          <MultiAutoCombo ref={colRef} name="colList" placeholder="컬럼선택" mapCode="infocol" maxSelection={9} sx={{ width: "100%" }} required={true} />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} className="text-end">
                      <Button type="submit" color="primary">
                        <i className="uil uil-plus me-2"></i> 추가
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        <ParamChartBody ref={listRef} />
      </div>
    </>
  );
};

export default RawChart;