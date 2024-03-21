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
  UncontrolledTooltip,
} from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import style from "./Trace.module.scss";
import { executeIdle, isNumber } from "../../common/utility";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router";
import React from "react";
import { isNg, isNext, isRun, isFail, isWait } from "./Overview";

type Position = {
  top: string;
  left: string;
  width: string;
  height: string;
};

const OverviewMapTile = forwardRef((props: any, ref: any) => {
  const [items, setItems] = useState<any>([]);

  useImperativeHandle(ref, () => ({
    setItems,
  }));

  const nav = useNavigate();
  const Navigation = useCallback((i: any) => nav(i), []);

  return (
    <>
      {RoomLayout(
        { top: "0px", left: "0px", width: "216px", height: "409px" },
        "PRESS",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1019"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "417px", left: "0px", width: "216px", height: "169px" },
        "HOT PRESS",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1011"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "594px", left: "0px", width: "216px", height: "84px" },
        "ETC",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1015"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true,
        "",
        "float-left"
      )}
      {RoomLayout(
        { top: "0px", left: "223px", width: "245px", height: "166px" },
        "SDC 1",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1014"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true,
        "",
        "float-left"
      )}
      {RoomLayout(
        { top: "175px", left: "223px", width: "245px", height: "294px" },
        "Auto Mount",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1012"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "477px", left: "223px", width: "245px", height: "201px" },
        "Auto BBT",
        [
          ...items.filter(
            (f: any) => f.facNo === "0001" && f.roomName === "1013"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "0px", left: "475px", width: "124px", height: "469px" },
        "LASER",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1000"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true,
        "title-break"
      )}
      {RoomLayout(
        { top: "477px", left: "475px", width: "95px", height: "201px" },
        "LASER2",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1020"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true,
        "title-break title-mini"
      )}
      {RoomLayout(
        { top: "0px", left: "606px", width: "65px", height: "469px" },
        "IR",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1018"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        true,
        true,
        "title-break"
      )}
      {RoomLayout(
        { top: "0px", left: "678px", width: "125px", height: "349px" },
        "표면처리",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1010"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "0px", left: "809px", width: "185px", height: "349px" },
        "PSR",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1009"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "0px", left: "1000px", width: "214px", height: "349px" },
        "HP",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1008"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "0px", left: "1220Px", width: "65px", height: "349px" },
        "가접",
        [
          ...items.filter(
            (f: any) =>
              f.facNo === "0002" &&
              f.roomName === "1003" &&
              (isRun(f) || isWait(f))
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        true,
        false
      )}
      {RoomLayout(
        { top: "0px", left: "1291px", width: "124px", height: "469px" },
        "AOI",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1006"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "0px", left: "1421px", width: "125px", height: "469px" },
        "센서",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1007"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        false,
        "title-mini"
      )}
      {RoomLayout(
        { top: "357px", left: "678px", width: "607px", height: "112px" },
        "본딩",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1017"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        false
      )}
      {RoomLayout(
        { top: "477px", left: "576px", width: "215px", height: "201px" },
        "동도금",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1001"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "477px", left: "797px", width: "155px", height: "201px" },
        "전처리",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1002"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true,
        "title-mini"
      )}
      {RoomLayout(
        { top: "477px", left: "958px", width: "425px", height: "201px" },
        "노광",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1004"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
      {RoomLayout(
        { top: "477px", left: "1389px", width: "157px", height: "201px" },
        "에칭",
        [
          ...items.filter(
            (f: any) => f.facNo === "0002" && f.roomName === "1005"
          ),
        ],
        {
          width: "23px",
          height: "23px",
        },
        Navigation,
        false,
        true
      )}
    </>
  );
});

export default OverviewMapTile;

const RoomLayout = (
  position: Position,
  roomName: string,
  list: any[],
  boxStyle: any = {},
  navi: (i: any) => void,
  disableCount?: boolean,
  disableNumber?: boolean,
  titleClass?: string,
  containerClass?: string
) => {
  // 가동 설비 중 가동
  const runList = list.filter((x: Dictionary) => isRun(x));
  // 가동 설비 중 비가동
  const waitList = list.filter((x: Dictionary) => isWait(x));
  // 고장 리스트
  const failList = list.filter((x: Dictionary) => isFail(x));
  // 이상 리스트(파라미터)
  const ngList = list.filter((x: Dictionary) => isNg(x));
  // 2차이후 리스트
  const nextList = list.filter((x: Dictionary) => isNext(x));

  const totalCnt =
    runList.length +
    waitList.length +
    failList.length +
    ngList.length +
    nextList.length;

  return (
    <div
      onClick={() => navi(list[0].url)}
      className="room-layer"
      style={{ ...position }}
    >
      <div className="next-count">{("00" + nextList.length).slice(-2)}</div>
      <div className={titleClass}>
        <div className="room-title">{roomName}</div>
        {!disableCount && (
          <div className="title-count">
            <div className="title-total">{("00" + totalCnt).slice(-2)}</div>
            <div className="title-run">{("00" + runList.length).slice(-2)}</div>
            <div className="title-wait">
              {("00" + waitList.length).slice(-2)}
            </div>
            <div className="title-fail">
              {("00" + failList.length).slice(-2)}
            </div>
            <div className="title-ng">{("00" + ngList.length).slice(-2)}</div>
            {/* <div className="title-next">{('00'+nextList.length).slice(-2)}</div> */}
          </div>
        )}
      </div>
      <div className={`eqp-container ${containerClass}`}>
        <div>
          {[...list]
            .map((inC: any) => ({
              ...inC,
              eqpCode:
                inC?.eqpCode?.trim().slice(-2).includes("-C") !== true
                  ? inC?.eqpCode
                  : inC?.eqpCode?.slice(0, -2),
            }))
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

              let eqpStatusClass = "";
              if (isNext(x))
                // 2,3,4차
                eqpStatusClass = "layer-eqp-nextstep";
              else if (isNg(x))
                // NG
                eqpStatusClass = "layer-eqp-ng";
              else if (isFail(x))
                // 고장
                eqpStatusClass = "layer-eqp-fail";
              else if (isWait(x))
                // 미가동
                eqpStatusClass = "layer-eqp-wait";
              else if (isRun(x))
                // 가동
                eqpStatusClass = "layer-eqp-run";

              return (
                <React.Fragment key={i}>
                  <div
                    id={`overview-tooltip-${x.roomName}-${i}`}
                    style={{ ...boxStyle }}
                    className={`layer-eqp-item ${eqpStatusClass}`}
                  >
                    {x.workorder ? <i className="fa-solid fa-play"></i> : ""}
                  </div>
                  <UncontrolledTooltip
                    target={`overview-tooltip-${x.roomName}-${i}`}
                    placement="top"
                    className="overview-tooltip-container"
                  >
                    [{x.eqpCode}] {x.eqpName || x.eqpCode}
                    <br></br>
                    {x.workorder ? (
                      <>
                        <span className="overview-workorder">
                          {x.workorder}
                        </span>
                        <br></br>
                        {x.modelName}
                      </>
                    ) : (
                      ""
                    )}
                  </UncontrolledTooltip>
                </React.Fragment>
              );
            })}
        </div>
        <div>
          {[...list]
            .map((inC: any) => ({
              ...inC,
              eqpCode:
                inC?.eqpCode?.trim().slice(-2).includes("-C") !== true
                  ? inC?.eqpCode
                  : inC?.eqpCode?.slice(0, -2),
            }))
            .filter((x) => x.step != "1")
            .map((x, i) => {
              return (
                <React.Fragment key={i}>
                  <div
                    id={`overview-tooltip-${x.roomName}-next-${i}`}
                    style={{ ...boxStyle }}
                    className={`layer-eqp-item layer-eqp-nextstep`}
                  >
                    {x.workorder ? <i className="fa-solid fa-play"></i> : ""}
                  </div>
                  <UncontrolledTooltip
                    target={`overview-tooltip-${x.roomName}-next-${i}`}
                    placement="top"
                    className="overview-tooltip-container"
                  >
                    [{x.eqpCode}] {x.eqpName || x.eqpCode}
                    <br></br>
                    {x.workorder ? (
                      <>
                        <span className="overview-workorder">
                          {x.workorder}
                        </span>
                        <br></br>
                        {x.modelName}
                      </>
                    ) : (
                      ""
                    )}
                  </UncontrolledTooltip>
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};
