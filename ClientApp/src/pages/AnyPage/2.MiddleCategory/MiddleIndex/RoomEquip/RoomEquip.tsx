import React, { useEffect, useState } from "react";
import myStyle from "./RoomEquip.module.scss";
import { Tooltip } from "@mui/material";
import { tenBelow } from "../../../utills/getTimes";
import { Dictionary } from "../../../../../common/types";
import { isWait, isRun, isFail, isNg, isNext } from "../../../../IOC/Overview";
import { isNumber } from "../../../../../common/utility";
import { UncontrolledTooltip } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  roomfilter: any;
  alldata: any[];
}
const RoomEquip = ({ roomfilter, alldata }: Props) => {
  const [statusCnt, setStatusCnt] = useState({
    total: 0,
    run: 0,
    wait: 0,
    fail: 0,
    ng: 0,
  });

  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const runCnt = [
      ...alldata?.filter(
        (i: any) =>
          i.facNo === roomfilter.facNo && i.eqpType === roomfilter.eqpType
      ),
    ].filter((x: any) => isRun(x)).length;
    const waitCnt = [
      ...alldata?.filter(
        (i: any) =>
          i.facNo === roomfilter.facNo && i.eqpType === roomfilter.eqpType
      ),
    ].filter((x: any) => isWait(x)).length;
    const failCnt = [
      ...alldata?.filter(
        (i: any) =>
          i.facNo === roomfilter.facNo && i.eqpType === roomfilter.eqpType
      ),
    ].filter((x: any) => isFail(x)).length;
    const ngCnt = [
      ...alldata?.filter(
        (i: any) =>
          i.facNo === roomfilter.facNo && i.eqpType === roomfilter.eqpType
      ),
    ].filter((x: any) => isNg(x)).length;

    setStatusCnt({
      total: tenBelow(runCnt + waitCnt + failCnt + ngCnt),
      run: tenBelow(runCnt),
      wait: tenBelow(waitCnt),
      fail: tenBelow(failCnt),
      ng: tenBelow(ngCnt),
    });
  }, [roomfilter]);

  return (
    <div
      onClick={() => {
        nav(
          `${location.pathname.slice(0, 20)}eqptype/${roomfilter.eqpType}/${
            roomfilter.eqpCode
          }`
        );
      }}
      className={myStyle.layout}
    >
      <div className={myStyle.title}>
        {roomfilter.eqptypeDes}
        <div style={{ display: "flex", marginLeft: "20px" }}>
          <div style={{ color: "#fff", marginRight: "5px" }}>
            {statusCnt.total}
          </div>
          <div style={{ color: "#38e54d", marginRight: "5px" }}>
            {statusCnt.run}
          </div>
          <div style={{ color: "#ffe569", marginRight: "5px" }}>
            {statusCnt.wait}
          </div>
          <div style={{ color: "#7f8487", marginRight: "5px" }}>
            {statusCnt.ng}
          </div>
          <div style={{ color: "#e90064", marginRight: "5px" }}>
            {statusCnt.fail}
          </div>
        </div>
      </div>

      {/* <div className={myStyle.list}> */}
      {RePosition([...alldata], {
        width: "30px",
        height: "30px",
      })}
      {/* </div> */}
    </div>
  );
};

export default RoomEquip;

const RePosition = (list: any[], boxStyle: any = {}) => {
  // 2차이후 리스트
  const nextList = list.filter((x: Dictionary) => isNext(x));

  return (
    <div className={myStyle.roomLayer} style={{}}>
      <div className="next-count">{("00" + nextList.length).slice(-2)}</div>
      <div className="eqp-container">
        <div>
          {[...list]
            .filter((f: any) => f.step == "1")
            .map((x: any, i: any) => {
              if (x.eqpCode) {
                const eqpNo: string = x.eqpCode.substring(x.eqpCode.length - 3);
                if (isNumber(eqpNo)) {
                  if (Object.isExtensible(x)) {
                    x.eqpNo = parseInt(eqpNo.split("-").join(""), 10);
                  }
                } else {
                  const eqpNo2: string = x.eqpCode.substring(
                    x.eqpCode.length - 1
                  );
                  if (isNumber(eqpNo2)) {
                    if (Object.isExtensible(x)) {
                      x.eqpNo = parseInt(eqpNo2.split("-").join(""), 10);
                    }
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
                    id={`middle-tooltip-${x.eqpType}-${i}`}
                    style={{ ...boxStyle }}
                    className={`layer-eqp-item ${eqpStatusClass}`}
                  >
                    {x.workorder ? <i className="fa-solid fa-play"></i> : ""}
                  </div>
                  <UncontrolledTooltip
                    target={`middle-tooltip-${x.eqpType}-${i}`}
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
                    id={`middle-tooltip-${x.eqpType}-next-${i}`}
                    style={{ ...boxStyle }}
                    className={`layer-eqp-item layer-eqp-nextstep`}
                  >
                    {x.workorder ? <i className="fa-solid fa-play"></i> : ""}
                  </div>
                  <UncontrolledTooltip
                    target={`middle-tooltip-${x.eqpType}-next-${i}`}
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
