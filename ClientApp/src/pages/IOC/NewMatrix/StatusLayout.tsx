import {
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import api from "../../../common/api";
import CstAggird from "./CstAggird/CstAggird";
import { GirdDefs } from "./GirdDefs";
import myStyle from "./NewConcept.module.scss";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { Dictionary } from "../../../common/types";
import { isFail, isNext, isNg, isRun, isWait } from "../Overview";
import { isNumber } from "../../../common/utility";
import { UncontrolledTooltip } from "reactstrap";
import IOCMenu from "../IOCMenu";

interface Props {
  filter: any;
  roomList: any[];
  data: any[];
  onCancelHandler: (e: any) => void;
  onSubAddhandler: (key: any, item: any) => void;
  first?: boolean;
}

export default ({
  filter,
  roomList,
  data,
  onSubAddhandler,
  onCancelHandler,
  first,
}: Props) => {
  const rowIndex = useRef<number>(0);
  const [roomInfo, setRoomInfo] = useState<any>();
  const [scrolling, setScrolling] = useState(true);

  const [rowData, setRowData] = useState<any[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const nav = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    let vvv: NodeJS.Timeout;
    if (gridRef.current && scrolling) {
      vvv = setInterval(() => {
        rowIndex.current =
          rowIndex.current > data.length ? 0 : rowIndex.current + 3;
        gridRef?.current?.api.ensureIndexVisible(
          rowIndex.current > data.length ? data.length - 1 : rowIndex.current,
          "bottom"
        );
      }, 5000);
    }
    return () => clearInterval(vvv);
  }, [rowIndex, scrolling]);

  useEffect(() => {
    const res = async () => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/eqptypestatistics",
        {
          roomname: filter.join(","),
        }
      );
      if (data) {
        setRowData(data);
      }
    };
    res();
  }, [data]);

  const Title = (children: string[]): JSX.Element | null => {
    if (children.length > 0) {
      return <div>{children.join("+ ")}</div>;
    }
    return null;
  };

  return (
    <div className={myStyle.statuslayout}>
      <div className={myStyle.title}>
        {first && (
          <div
            style={{
              position: "absolute",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: 0,
            }}
          >
            <IOCMenu title="Menu"></IOCMenu>
          </div>
        )}
        {Title(
          roomList
            .map((i: any) =>
              filter[1]?.includes(i.value) === true ? i.label : null
            )
            .filter((f: any) => f !== null)
        )}
        <div
          style={{
            position: "absolute",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            right: 0,
          }}
        >
          {/* <IconButton onClick={handleClick} sx={{ color: "white" }}>
            <AddIcon />
          </IconButton> */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            {roomList?.map((i: any, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  width: "10rem",
                  height: "2em",
                  fontSize: "1rem",
                  position: "relative",
                  alignItems: "center",
                  paddingLeft: "1rem",
                  fontWeight: "400",
                  backgroundColor: `${
                    filter[1]?.includes(i.value) ? "#DBDFEA" : null
                  }`,
                }}
              >
                {i.label}
                <div
                  style={{
                    height: "100%",
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <IconButton
                    disabled={
                      filter[1].length === 3 && !filter[1]?.includes(i.value)
                        ? true
                        : false
                    }
                    onClick={() => {
                      onSubAddhandler(filter[0], i?.value);
                      handleClose();
                    }}
                    sx={{ color: "black" }}
                  >
                    {filter[1]?.includes(i.value) ? <ClearIcon /> : <AddIcon />}
                  </IconButton>
                </div>
              </div>
            ))}
          </Menu>
          {/* <IconButton
            onClick={(e: any) => onCancelHandler(filter[0])}
            sx={{ color: "white" }}
          >
            <ClearIcon />
          </IconButton> */}
        </div>
      </div>
      <div className={myStyle.body}>
        <div className={myStyle.contents}>
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ flex: 1.2, display: "flex" }}>
              {filter[1].map((i: any, idx: number) => {
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      border: "1px solid gray",
                      margin: "0px 2px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {RePosition(
                      data.filter((f: any) =>
                        f.roomName === "1016"
                          ? f.roomName === i &&
                            (f.eqpStatus === "F" || f.step != "1")
                          : f.roomName === i
                      ),
                      {
                        width: "30px",
                        height: "30px",
                      }
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                flex: 0.7,
                border: "1px solid #545B77",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "2.2em",
                  fontWeight: 400,
                }}
              >
                {`전체설비 : ${
                  data.filter((x: Dictionary) => x.step != "1").length +
                  data.filter(
                    (x: Dictionary) =>
                      x.step == "1" && x.eqpStatus == "O" && x.status != "X"
                  ).length +
                  data.filter(
                    (x: Dictionary) =>
                      x.step == "1" && x.eqpStatus == "O" && x.status == "X"
                  ).length +
                  data.filter(
                    (x: Dictionary) => x.step == "1" && x.eqpStatus == "F"
                  ).length
                }`}
                <div
                  style={{
                    fontSize: "1.3rem",
                    color: "#999999",
                    margin: "5px 0 0 10px ",
                  }}
                >
                  {`[대기 : ${
                    data.filter((x: Dictionary) => x.step != "1").length
                  }]`}
                </div>
              </div>
              <div className={myStyle.cntlayout}>
                <div className={myStyle.cntBox}>
                  <div
                    style={{ color: "#49FF00" }}
                    className={myStyle.cntBoxTitle}
                  >
                    가동중
                  </div>
                  <div className={myStyle.cntBoxContents}>
                    {
                      data.filter(
                        (x: Dictionary) =>
                          x.step == "1" && x.eqpStatus == "O" && x.status != "X"
                      ).length
                    }
                    {/* {roomInfo?.onCnt} */}
                  </div>
                </div>
                <div className={myStyle.cntBox}>
                  <div
                    style={{ color: "#ffe569" }}
                    className={myStyle.cntBoxTitle}
                  >
                    비가동중
                  </div>
                  <div className={myStyle.cntBoxContents}>
                    {
                      data.filter(
                        (x: Dictionary) =>
                          x.step == "1" && x.eqpStatus == "O" && x.status == "X"
                      ).length
                    }
                    {/* {roomInfo?.offCnt} */}
                  </div>
                </div>
                <div className={myStyle.cntBox}>
                  <div
                    style={{ color: "#FF1700" }}
                    className={myStyle.cntBoxTitle}
                  >
                    설비이상
                  </div>
                  <div className={myStyle.cntBoxContents}>0</div>
                </div>
                <div className={myStyle.cntBox}>
                  <div
                    style={{ color: "#808080" }}
                    className={myStyle.cntBoxTitle}
                  >
                    설비고장
                  </div>
                  <div className={myStyle.cntBoxContents}>
                    {
                      data.filter(
                        (x: Dictionary) => x.step == "1" && x.eqpStatus == "F"
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ flex: 1, backgroundColor: "#EAEAEA1a", marginTop: "3px" }}
          >
            <CstAggird
              ref={gridRef}
              rowDataProps={rowData}
              columnDefs={GirdDefs}
              eventHandle={(e: any) =>
                setScrolling(e.type === "cellMouseOver" ? false : true)
              }
            />
          </div>
        </div>
        <div className={myStyle.alram}></div>
      </div>
    </div>
  );
};

const RePosition = (list: any[], boxStyle: any = {}) => {
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
    runList.length + waitList.length + failList.length + ngList.length;

  return (
    <div className={myStyle.roomLayer} style={{}}>
      <div className="next-count">{("00" + nextList.length).slice(-2)}</div>
      <div className="eqp-container">
        <div>
          {[...list]
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
