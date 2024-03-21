import moment from "moment";
import {
  ChangeEvent,
  ChangeEventHandler,
  forwardRef,
  SyntheticEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Table,
} from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import style from "./Trace.module.scss";
import { executeIdle, isNumber } from "../../common/utility";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router";
import React from "react";
import { isNg, isNext, isRun, isFail, isWait } from "./Overview";

const NgList = forwardRef((props: any, ref: any) => {
  const [ngItems, setNgItems] = useState<Dictionary[]>([]);
  const [failItems, setFailItems] = useState<Dictionary[]>([]);

  useImperativeHandle(ref, () => ({
    setNgItems,
    setFailItems,
  }));

  return (
    <>
      <Row style={{ height: "50%" }}>
        <Col>
          <div
            className="dark-card ng-list"
            style={{ height: "100%", overflowY: "auto" }}
          >
            <div className="dark-header">Parameter NG설비 리스트</div>
            <div className="dark-body">
              <div className="alarm-item alarm-eqp">
                <div className="alarm-header">NO EQP</div>
                <div className="alarm-body">현재 Parameter NG설비 없음</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row style={{ height: "50%" }}>
        <Col style={{ paddingTop: "10px" }}>
          <div
            className="dark-card fail-list"
            style={{ height: "100%", overflowY: "auto" }}
          >
            <div className="dark-header">고장설비 리스트</div>
            <div className="dark-body">
              {/* {failItems.map((x, i) => (
                <div key={i} className="alarm-item alarm-eqp">
                  <div className="alarm-header">{x.eqpCode}</div>
                  <div className="alarm-body">{x.eqpDesc || x.eqpCode}</div>
                </div>
              ))} */}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
});

export default NgList;
