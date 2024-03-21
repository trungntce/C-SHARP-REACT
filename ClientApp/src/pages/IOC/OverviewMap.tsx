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

type Position = {
  top: string;
  left: string;
  width: string;
  height: string;
};

const OverviewMap = forwardRef((props: any, ref: any) => {
  const [items, setItems] = useState<any>([]);

  useImperativeHandle(ref, () => ({
    setItems,
  }));

  const nav = useNavigate();
  const Navigation = useCallback((i: any) => nav(i), []);

  return (
    <>
      {RoomLayout(
        { top: "107px", left: "51px", width: "161px", height: "75px" },
        "PRESS",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1019"
          ),
        ],
        {
          width: "6px",
          height: "5px",
        },
        Navigation,
        false,
        true,
        true
      )}
      {RoomLayout(
        { top: "191px", left: "51px", width: "150px", height: "102px" },
        "HOT PRESS",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1011"
          ),
        ],
        {
          width: "15px",
          height: "11px",
        },
        Navigation,
        false,
        true,
        true
      )}
      {RoomLayout(
        { top: "77px", left: "223px", width: "85px", height: "217px" },
        "Auto Mount",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1012"
          ),
        ],
        {},
        Navigation
      )}
      {RoomLayout(
        { top: "139px", left: "319px", width: "57px", height: "146px" },
        "Auto BBT",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1013"
          ),
        ],
        {
          width: "7.5px",
          height: "7px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "99px", left: "375px", width: "33px", height: "92px" },
        "SDC 1",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1014"
          ),
        ],
        {},
        Navigation
      )}
      {RoomLayout(
        { top: "35px", left: "518px", width: "61px", height: "276px" },
        "LASER",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1000"
          ),
        ],
        {
          width: "15.5px",
          height: "10.5px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "35px", left: "667px", width: "87px", height: "276px" },
        "IR",
        [...Array(0)],
        {},
        Navigation
      )}
      {RoomLayout(
        { top: "35px", left: "753px", width: "210px", height: "276px" },
        "표면처리",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1010"
          ),
        ],
        {
          width: "37.5px",
          height: "33px",
        },
        Navigation,
        true
      )}
      {RoomLayout(
        { top: "35px", left: "962px", width: "191px", height: "276px" },
        "PSR",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1009"
          ),
        ],
        {
          width: "23.5px",
          height: "15.2px",
        },
        Navigation
      )}
      {RoomLayout(
        { top: "35px", left: "1152px", width: "228px", height: "276px" },
        "HP",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1008"
          ),
        ],
        {
          width: "29.3px",
          height: "18px",
        },
        Navigation
      )}
      {RoomLayout(
        { top: "35px", left: "1379px", width: "51px", height: "276px" },
        "가접",
        [...Array(0)],
        {},
        Navigation
      )}
      {RoomLayout(
        { top: "35px", left: "1429px", width: "77px", height: "276px" },
        "센서",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1007"
          ),
        ],
        {},
        Navigation
      )}
      {RoomLayout(
        { top: "328px", left: "795px", width: "351px", height: "275px" },
        "동도금",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1001"
          ),
        ],
        {
          width: "52px",
          height: "23px",
        },
        Navigation
      )}
      {RoomLayout(
        { top: "328px", left: "1145px", width: "55px", height: "275px" },
        "전처리",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1002"
          ),
        ],
        {
          width: "20px",
          height: "17.5px",
        },
        Navigation
      )}
      {RoomLayout(
        { top: "328px", left: "1199px", width: "159px", height: "275px" },
        "노광",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1004"
          ),
        ],
        {
          width: "19.2px",
          height: "15.2px",
        },
        Navigation
      )}
      {RoomLayout(
        { top: "328px", left: "1357px", width: "148px", height: "275px" },
        "에칭",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1005"
          ),
        ],
        {
          width: "44px",
          height: "26px",
        },
        Navigation
      )}
    </>
  );
});

export default OverviewMap;

const RoomLayout = (
  position: Position,
  roomName: string,
  data: any[],
  boxStyle: any = {},
  navi: (i: any) => void,
  disableNewline?: boolean,
  disableNumber?: boolean,
  hide2thLabel?: boolean
) => {
  let prevEqpType: any = null;
  const newline = <div className="eqp-newline"></div>;

  return (
    <div
      onClick={() => navi(data[0].url)}
      className="room-layer"
      style={{ ...position }}
    >
      {roomName}
      <div className="eqp-container">
        <div>
          {[...data]
            .filter((x) => x.step == "1")
            .map((x, i) => {
              if (x.eqpCode) {
                const eqpNo: string = x.eqpCode.substring(x.eqpCode.length - 3);
                if (isNumber(eqpNo)) {
                  x["eqpNo"] = parseInt(eqpNo, 10);
                } else {
                  const eqpNo2: string = x.eqpCode.substring(
                    x.eqpCode.length - 1
                  );
                  if (isNumber(eqpNo2)) {
                    x["eqpNo"] = parseInt(eqpNo2, 10);
                  }
                }
              }

              if (x.eqpNo > 99) x.eqpNo = null;

              const gap =
                !disableNewline && prevEqpType && prevEqpType != x.eqpType
                  ? newline
                  : "";
              prevEqpType = x.eqpType;

              let eqpStatusClass = "layer-eqp-item";
              if (x.step != "1")
                // 2,3,4차
                eqpStatusClass = "layer-eqp-nextstep";
              else if (x.eqpStatus === "X")
                // 미사용
                eqpStatusClass = "layer-eqp-gray";
              else if (x.eqpStatus == "F")
                // 고장
                eqpStatusClass = "layer-eqp-down";
              else if (x.status == "X")
                // 미가동
                eqpStatusClass = "layer-eqp-warn";
              else if (x.status != "X")
                // 가동
                eqpStatusClass = "";

              return (
                <React.Fragment key={i}>
                  {gap}
                  <div
                    style={{ ...boxStyle }}
                    className={`layer-eqp-item ${eqpStatusClass}`}
                  >
                    {disableNumber ? "" : x.eqpNo}
                  </div>
                </React.Fragment>
              );
            })}
        </div>
        {hide2thLabel ? "" : "2차"}
        <div>
          {[...data]
            .filter((x) => x.step != "1")
            .map((x, i) => {
              let eqpStatusClass = "layer-eqp-item";
              if (x.step != "1") eqpStatusClass = "layer-eqp-nextstep";
              else if (x.eqp_status === "X") eqpStatusClass = "layer-eqp-gray";
              else if (x.status == "X") eqpStatusClass = "layer-eqp-warn";

              return (
                <React.Fragment key={i}>
                  <div
                    key={i}
                    style={{ ...boxStyle }}
                    className={`layer-eqp-item ${eqpStatusClass}`}
                  ></div>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};
