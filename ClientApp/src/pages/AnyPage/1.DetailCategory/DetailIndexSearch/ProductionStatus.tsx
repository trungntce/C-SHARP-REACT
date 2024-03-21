import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../common/api";
import myStyle from './ProductionStatus.module.scss';
import LinkBox from "../Components/LinkBox/LinkBox";
import CustomPie from "./CustomPie";
import CustomSTLine from "./CustomSTLine";
import CustomLine from "./CustomLine";


const ProductionStatus = ({ data }: any) => {

  return (
    <div className={myStyle.layout}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          color: "thistle",
          fontSize: "1.2rem",
        }}
      >
        
      </div>
      <div className={myStyle.chart}>
        {"y" === "y" ? (
          <div className={myStyle.pieChart}>
            <div className={myStyle.tip}>
              {pieTip("70% 미만", "#e63404")}
              {pieTip("70% 이상", "#e6a304")}
              {pieTip("85% 이상", "#B5F10E")}
            </div>
            <div className={myStyle.pie}>
              <CustomPie oeeValue={data?.time_rate || 0} />
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LinkBox
              title={"Day-Week-Month 기간별 현황 그래프 조회"}
              equipName={data?.real?.eqpCode}
            />
          </div>
        )}

        <div className={myStyle.chart}>
          {"y" === "y" ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomLine
                dataArr={[]}
              />
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LinkBox
                title={"Day-Week-Month 기간별 현황 그래프 조회"}
                equipName={data?.real?.eqpCode}
              />
            </div>
          )}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomSTLine
                defaultSt={data?.real?.defaultSt}
                dataArr={data?.tar}
              />
            </div>
        </div>
      </div>
        <div className={myStyle.timelayout}>
          <div className={myStyle.st}>
            {TimeCard("누적 S/T", "-", "#F73D93cc", "")}
            {TimeCard("제조 S/T", "0", "#8EA7E9cc", "s")}
            {TimeCard(
              data?.real?.stUnit === "m/min" ? "실시간 속도" : "실시간 S/T",
              data?.st ? data?.st : "0",
              "#93ffd899",
              data?.real?.stUnit === "m/min" ? data?.real?.stUnit : "s"
            )}
          </div>
          <div className={myStyle.time}>
            {TimeCard(
              "계획시간",
              `${Math.round(data?.real?.totalTime / 60)}분`
            )}
            {TimeCard(
              "비가동시간",
              `${Math.round(data?.real?.offTime / 60)}분`
            )}
          </div>
        </div>
    </div>
  );
};

export default ProductionStatus;

//components

const TimeCard = (
  title: string,
  value: any,
  color: string = "#42464e",
  unit?: string
) => {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #838383",
        color: "#FAF0E4",
        fontSize: "1.6rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color,
          borderRight: "1px solid #838383",
        }}
      >
        {title}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>{value}</div>
        {unit && <div>{unit}</div>}
      </div>
    </div>
  );
};

const pieTip = (text: string, color: string) => {
  return (
    <div
      style={{
        display: "flex",
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        margin: "0px 0.3rem",
      }}
    >
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: `${color}`,
        }}
      />
      <div style={{ color: "white", marginLeft: "0.5rem", fontSize: "17px" }}>
        {text}
      </div>
    </div>
  );
};

const CountCard = (
  title: string,
  value: any,
  bgcolor: string,
  fontColor?: string
) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "#f2f2f2",
        border: "1px solid #838383",
        margin: "0px 5px",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2.2rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `${bgcolor}`,
          color: `${fontColor ? fontColor : null}`,
          fontSize: "1.4rem",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
    </div>
  );
};
