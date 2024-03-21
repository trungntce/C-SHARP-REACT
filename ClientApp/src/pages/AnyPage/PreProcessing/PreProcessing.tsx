import { Dictionary } from "../../../common/types";
import React, { useRef, useState, useEffect } from "react";
import myStyle from "./PreProcessing.module.scss";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
  ComposedChart,
  Line,
  LineChart,
  TooltipProps,
} from "recharts";
import temp from "../../../assets/temp.png";
import blueBeaker from "../../../assets/beaker_blue.png";
import redBeaker from "../../../assets/beaker_red.png";
import yellowBeaker from "../../../assets/beaker_yellow.png";
import dayjs from "dayjs";
import { AgGridReact } from "ag-grid-react";
import { PreProcessingDefs, PreProcessingMonthDefs } from "./PreProcessingDefs";
import { numberWithCommas } from "../../../common/utility";
import { useParams } from "react-router-dom";
import { TimeFormat } from "../utills/getTimes";
import IOCMenu from "../../IOC/IOCMenu";

const LineTimeChart = ({ data, dataKey, referLine, color, limits }: any) => {
  const limit = { ...limits[0] };
  let upperLimit = 0;
  let lowerLimit = 0;
  if (dataKey === "h2so4Pv") {
    upperLimit = limit?.h2so4UpperLimit;
    lowerLimit = limit?.h2so4LowerLimit;
  } else if (dataKey === "h2o2Pv") {
    upperLimit = limit?.h2o2UpperLimit;
    lowerLimit = limit?.h2o2LowerLimit;
  } else if (dataKey === "cuPv") {
    upperLimit = limit?.cuUpperLimit;
    lowerLimit = limit?.cuLowerLimit;
  } else if (dataKey === "tempPv") {
    upperLimit = limit?.tempUpperLimit;
    lowerLimit = limit?.tempLowerLimit;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#dbdfeacc",
            width: "20rem",
            height: "5rem",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "1rem",
            color: "black",
            borderRadius: "10px",
            padding: "1rem",
            fontWeight: "bold",
          }}
        >
          <div style={{ flex: 1 }}>{`UpDate : ${TimeFormat(
            payload[0].payload.time
          )}`}</div>
          <div style={{ flex: 1 }}>{`Value : ${payload[0].value}`}</div>
        </div>
      );
    }

    return null;
  };

  const ReferenceLabel = (props: {
    fill: any;
    value: any;
    textAnchor: any;
    fontSize: any;
    viewBox: any;
    dy: any;
    dx: any;
  }) => {
    const { fill, value, fontSize, viewBox, dy, dx, textAnchor } = props;
    const x = viewBox.width + viewBox.x + 20;
    const y = viewBox.y - 6;
    return (
      <text
        x={x}
        y={y}
        dy={dy}
        dx={dx}
        fill={fill}
        fontSize={fontSize || 10}
        textAnchor={textAnchor}
      >
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="95%" height="95%">
      <LineChart
        data={[...data].sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        )}
        margin={{ left: 20, right: -20 }}
      >
        <YAxis
          stroke="#ffffff80"
          type="number"
          allowDataOverflow={true}
          orientation="right"
          tickCount={4}
          domain={[
            referLine[0] - referLine[0] * 0.5,
            referLine[1] + referLine[1] * 0.9,
          ]}
        />
        <XAxis
          stroke="#ffffff80"
          tickCount={5}
          tickFormatter={(e: any) => TimeFormat(e).split(" ")[1]}
          dataKey="time"
        />
        <CartesianGrid strokeDasharray="2" fill="#ffffff1a" />
        <Tooltip content={CustomTooltip} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={false}
        />
        <ReferenceLine
          strokeWidth={1.3}
          y={referLine[0]}
          label={
            <ReferenceLabel
              dx={"-85%"}
              dy={0}
              fill="rgb(60,150,256)"
              fontSize={20}
              value={`Lo: ${referLine[0]}`}
              viewBox="0,0,0,0"
              key={2}
              textAnchor="end"
            />
          }
          stroke="rgb(60,150,256)"
        />

        <ReferenceLine
          strokeWidth={1.3}
          y={referLine[1]}
          label={
            <ReferenceLabel
              dx={"-55%"}
              dy={0}
              fill="#D09CFA"
              fontSize={20}
              value={`Sv: ${referLine[1]}`}
              viewBox="0,0,0,0"
              key={3}
              textAnchor="end"
            />
          }
          stroke="#D09CFA"
        />
        <ReferenceLine
          strokeWidth={1.3}
          y={referLine[2]}
          label={
            <ReferenceLabel
              dx={"-85%"}
              dy={0}
              fill="rgb(255,100,100)"
              fontSize={20}
              value={`Hi: ${referLine[2]}`}
              viewBox="0,0,0,0"
              key={1}
              textAnchor="end"
            />
          }
          stroke="rgb(255,100,100)"
        />
        <ReferenceLine
          strokeWidth={1.3}
          y={upperLimit}
          label={
            <ReferenceLabel
              dx={"-70%"}
              dy={0}
              fill="#61BFAD"
              fontSize={20}
              value={`+3σ: ${upperLimit}`}
              viewBox="0,0,0,0"
              key={2}
              textAnchor="end"
            />
          }
          stroke="#61BFAD"
        />
        <ReferenceLine
          strokeWidth={1.3}
          y={lowerLimit}
          label={
            <ReferenceLabel
              dx={"-68%"}
              //dy={'28px'}
              dy={20}
              fill="#61BFAD"
              fontSize={20}
              value={`-3σ: ${lowerLimit}`}
              viewBox="0,0,0,0"
              key={2}
              textAnchor="end"
            />
          }
          stroke="#61BFAD"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const MonthChart = ({ data, dataName, referLine, limits }: any) => {
  const limit = { ...limits[0] };
  let upperLimit = 0;
  let lowerLimit = 0;
  if (dataName === "H2so4") {
    upperLimit = limit?.h2so4UpperLimit;
    lowerLimit = limit?.h2so4LowerLimit;
  } else if (dataName === "H2o2") {
    upperLimit = limit?.h2o2UpperLimit;
    lowerLimit = limit?.h2o2LowerLimit;
  } else if (dataName === "Cu") {
    upperLimit = limit?.cuUpperLimit;
    lowerLimit = limit?.cuLowerLimit;
  } else if (dataName === "Temp") {
    upperLimit = limit?.tempUpperLimit;
    lowerLimit = limit?.tempLowerLimit;
  }

  const ReferenceLabel = (props: {
    fill: any;
    value: any;
    textAnchor: any;
    fontSize: any;
    viewBox: any;
    dy: any;
    dx: any;
  }) => {
    const { fill, value, fontSize, viewBox, dy, dx, textAnchor } = props;
    const x = viewBox.width + viewBox.x + 20;
    const y = viewBox.y - 6;

    return (
      <text
        x={x}
        y={y}
        dy={dy}
        dx={dx}
        fill={fill}
        fontSize={fontSize || 10}
        textAnchor={textAnchor}
      >
        {value}
        {}
      </text>
    );
  };

  const dayFormatter = (timeStr: any) => {
    const hour = timeStr.slice(5, 11);
    return hour;
  };

  return (
    <>
      <ResponsiveContainer width="99%" height="99%">
        <ComposedChart
          width={200}
          height={40}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            xAxisId={0}
            dataKey="time"
            tickFormatter={dayFormatter}
            reversed={true}
            tick={{ fill: "rgb(120,120,120)" }}
          />
          <XAxis xAxisId={"long"} dataKey="time" hide reversed={true} />
          <XAxis xAxisId={"short"} dataKey="time" hide reversed={true} />
          <Bar
            barSize={30}
            xAxisId={"long"}
            dataKey={`max${dataName}`}
            fill="rgb(3, 90, 166)"
          ></Bar>
          <Bar
            barSize={35}
            xAxisId={"short"}
            dataKey={`min${dataName}`}
            fill="rgb(10, 10, 10)"
          ></Bar>
          <Line
            data={data}
            dataKey={`avg${dataName}`}
            stroke="rgb(120,120,120)"
          />

          <YAxis
            domain={[
              referLine[0] - referLine[0] / 2,
              referLine[2] + referLine[2] / 5,
            ]}
          />

          <Tooltip />

          <ReferenceLine
            y={referLine[2]}
            stroke="red"
            label={
              <ReferenceLabel
                dx={"-45%"}
                dy={0}
                fill="rgb(255,100,100)"
                fontSize={20}
                value={`Hi: ${referLine[2]}`}
                viewBox="0,0,0,0"
                key={1}
                textAnchor="end"
              />
            }
          />
          <ReferenceLine
            y={referLine[1]}
            stroke="beige"
            label={
              <ReferenceLabel
                dx={"-45%"}
                dy={0}
                fill="beige"
                fontSize={20}
                value={`Sv: ${referLine[1]}`}
                viewBox="0,0,0,0"
                key={3}
                textAnchor="end"
              />
            }
          />
          <ReferenceLine
            y={referLine[0]}
            stroke="rgb(60,150,256)"
            label={
              <ReferenceLabel
                dx={"-45%"}
                dy={0}
                fill="rgb(60,150,256)"
                fontSize={20}
                value={`Lo: ${referLine[0]}`}
                viewBox="0,0,0,0"
                key={3}
                textAnchor="end"
              />
            }
          />
          <ReferenceLine
            y={upperLimit}
            stroke="#22BABB"
            label={
              <ReferenceLabel
                dx={"-37%"}
                dy={0}
                fill="#22BABB"
                fontSize={20}
                value={`+3σ: ${upperLimit}`}
                viewBox="0,0,0,0"
                key={2}
                textAnchor="end"
              />
            }
          />
          <ReferenceLine
            y={lowerLimit}
            stroke="#22BABB"
            label={
              <ReferenceLabel
                dx={"-31%"}
                //dy={'12%'}
                dy={0}
                fill="#22BABB"
                fontSize={20}
                value={`-3σ: ${lowerLimit}`}
                viewBox="0,0,0,0"
                key={2}
                textAnchor="end"
              />
            }
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

const MidBox = ({ img, title, num, imgSize }: any) => {
  return (
    <div className={myStyle.midBox}>
      <div className={myStyle.midBoxLeftImg}>
        <img src={img} alt="My SVG" width={imgSize} />
      </div>
      <div className={myStyle.midBoxRight}>
        <div className={myStyle.midBoxRightTitle}>{title}</div>
        <div className={myStyle.midBoxRightNum}>{num}</div>
      </div>
    </div>
  );
};

const PreProcessing = () => {
  const { equipName } = useParams();
  const [eqpName, setEqpName] = useState("M-102-01-V001");
  const [data, setData] = useState(startData);
  const [monthData, setMonthData] = useState([
    {
      time: "",
      maxH2so4: 0,
      minH2so4: 0,
      avgH2so4: 0,
      maxH2o2: 0,
      minH2o2: 0,
      avgH2o2: 0,
      maxCu: 0,
      minCu: 0,
      avgCu: 0,
      maxTemp: 0,
      minTemp: 0,
      avgTemp: 0,
    },
  ]);
  const [flag, setFlag] = useState(false);
  const [nowTime, setNowTime] = useState("2000-01-01");
  const [intervalId, setIntervalId] = useState(0);
  const [monthMode, setMonthMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [limits, setLimits] = useState([]);

  const timee = useRef("");

  const loadFirstDatas = async (day: any, equipName: any) => {
    setIsLoading(true);
    await axios
      .get("/api/preprocessing", {
        params: { duration: day, equipName: equipName },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        if (res.data.length > 0) {
          setData(res.data);
          timee.current = res.data[0]?.time;
          setFlag(true);
        } else {
          setData(startData);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  //첫 데이터 가져오기

  const loadLimits = async (equipName: any) => {
    await axios
      .get("/api/preprocessing/limits", {
        params: { equipName: equipName },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        setLimits(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setEqpName(equipName);
    loadLimits(equipName);
    loadFirstDatas(1, equipName);
  }, [equipName]);

  //최신 이후의 데이터 가져와서 최신 데이터가 있으면 첫 데이터에 합치는 로직
  const loadLastDatas = async () => {
    await axios
      .get("/api/preprocessing/afterlast", {
        params: { lastTime: timee.current, equipName: eqpName },
        //params: { lastTime: "2023-04-04 14:30:00.000" },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        if (res.data.length !== 0) {
          timee.current = res.data[0].time;
          const slicedData = data.slice(0, data.length - res.data.length);
          const mergedData = [...res.data, ...slicedData];
          setData(mergedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setNowTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  };

  //첫 데이터 불러와지면 loadLastDatas 로직 실행
  useEffect(() => {
    if (flag) {
      setNowTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
      const id = window.setInterval(() => {
        loadLastDatas();
      }, 60000);
      setIntervalId(id);
      setFlag(false);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [flag]);

  //월단위 데이터 소환
  const loadMonthDatas = async (equipName: any) => {
    setIsLoading(true);
    clearInterval(intervalId);
    await axios
      .get("/api/preprocessing/month", {
        params: { equipName: equipName },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
      .then((res) => {
        setMonthData(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={myStyle.all}>
      <div className={myStyle.header}>
        <IOCMenu title="ETCHING" />
        <div
          style={{ color: "white", fontSize: "2rem", letterSpacing: "10px" }}
        >
          ETCHIG
          <div
            style={{
              display: "inline-block",
              fontSize: "1.2rem",
              letterSpacing: "0px",
            }}
          >{`( ${equipName} )`}</div>{" "}
          MONITORING
        </div>
      </div>
      <div className={myStyle.secondHeader}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className={myStyle.holymoly}>조회 기간 : </div>
          <button
            type="button"
            className="btn btn-soft-info"
            onClick={() => {
              setMonthMode(false);
              loadFirstDatas(1, equipName);
            }}
          >
            DAY
          </button>
          <button
            type="button"
            className="btn btn-soft-primary"
            onClick={() => {
              setMonthMode(false);
              loadFirstDatas(7, equipName);
            }}
          >
            WEEK
          </button>
          <button
            type="button"
            className="btn btn-soft-secondary"
            onClick={() => {
              setMonthMode(true);
              loadMonthDatas(eqpName);
            }}
          >
            MONTH
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              height: "4rem",
              paddingBottom: "0.5rem",
            }}
          ></div>
        </div>
      </div>
      {isLoading ? (
        <div className={myStyle.modal}>
          <div className={myStyle.modalContent}>Data Loading...</div>
        </div>
      ) : monthMode ? (
        <>
          <div className={myStyle.monthBody}>
            <div className={myStyle.monthBodyTop}>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={redBeaker} alt="H2so4" width={60} /> H₂SO₄
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"H2so4"}
                  referLine={[70, 100, 130]}
                  limits={limits}
                />
              </div>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={blueBeaker} alt="H2o2" width={60} /> H₂O₂
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"H2o2"}
                  referLine={[40, 85, 110]}
                  limits={limits}
                />
              </div>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={yellowBeaker} alt="Cu" width={60} /> Cu
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"Cu"}
                  referLine={[10, 25, 40]}
                  limits={limits}
                />
              </div>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={temp} alt="Temp" width={55} /> Temp
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"Temp"}
                  referLine={[20, 30, 50]}
                  limits={limits}
                />
              </div>
            </div>
            <div className={myStyle.monthBodyBottom}>
              <div
                className={`ag-theme-alpine-dark ${myStyle.agGridCss}`}
                style={{ height: "100%", width: "100%" }}
              >
                <AgGridReact
                  rowData={monthData}
                  columnDefs={PreProcessingMonthDefs}
                ></AgGridReact>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={myStyle.body}>
            <div className={myStyle.bodyLeft}>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={data}
                    dataKey={"h2so4Pv"}
                    referLine={[70, 100, 130]}
                    color={"#FF1700"}
                    limits={limits}
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={redBeaker}
                    imgSize={60}
                    title={"H₂SO₄ (g/l)"}
                    num={data[0]?.h2so4Pv}
                  />
                </div>
                <div className={myStyle.rowRight}>
                  <div className={myStyle.wordPart}>DAY</div>
                  <div className={myStyle.numPart}>{data[0]?.h2so41Day}</div>
                  <div className={myStyle.wordPart}>TOTAL</div>
                  <div className={myStyle.numPart2}>
                    {numberWithCommas(data[0]?.h2so4Total)}
                  </div>
                </div>
              </div>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={data}
                    dataKey={"h2o2Pv"}
                    referLine={[40, 85, 110]}
                    color={"#7DEDFF"}
                    limits={limits}
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={blueBeaker}
                    imgSize={60}
                    title={"H₂O₂ (g/l)"}
                    num={data[0]?.h2o2Pv}
                  />
                </div>
                <div className={myStyle.rowRight}>
                  <div className={myStyle.wordPart}>DAY</div>
                  <div className={myStyle.numPart}>{data[0]?.h2o21Day}</div>
                  <div className={myStyle.wordPart}>TOTAL</div>
                  <div className={myStyle.numPart2}>
                    {numberWithCommas(data[0]?.h2o2Total)}
                  </div>
                </div>
              </div>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={data}
                    dataKey={"cuPv"}
                    referLine={[10, 25, 40]}
                    color={"#F7FD04"}
                    limits={limits}
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={yellowBeaker}
                    imgSize={60}
                    title={"Cu (g/l)"}
                    num={data[0]?.cuPv}
                  />
                </div>
                <div className={myStyle.rowRight}>
                  <div className={myStyle.wordPart}>DAY</div>
                  <div className={myStyle.numPart}>{data[0]?.cu1Day}</div>
                  <div className={myStyle.wordPart}>TOTAL</div>
                  <div className={myStyle.numPart2}>
                    {numberWithCommas(data[0]?.cuTotal)}
                  </div>
                </div>
              </div>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={data}
                    dataKey={"tempPv"}
                    referLine={[20, 30, 50]}
                    color={"#E74646"}
                    limits={limits}
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={temp}
                    imgSize={50}
                    title={"TEMP (°C)"}
                    num={data[0]?.tempPv}
                    limits={limits}
                  />
                </div>
                <div className={myStyle.rowRight}>
                  <div className={myStyle.wordPart}>CIRCULATION</div>
                  <div className={myStyle.numPart3}>{data[0]?.h2so41Day}</div>
                </div>
              </div>
            </div>
            <div className={myStyle.bodyRight}>
              <div
                className={`ag-theme-alpine-dark ${myStyle.agGridCss}`}
                style={{ height: "100%", width: "100%" }}
              >
                <AgGridReact
                  rowData={data}
                  columnDefs={PreProcessingDefs}
                ></AgGridReact>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PreProcessing;

const startData = [
  {
    equip: "",
    h2so4Pv: 0,
    h2so41Day: 0,
    h2so4Total: 0,
    h2o2Pv: 0,
    h2o21Day: 0,
    h2o2Total: 0,
    cuPv: 0,
    cu1Day: 0,
    cuTotal: 0,
    tempPv: 0,
    cirflow: 0,
    time: "",
  },
];
// const { isLoading, error, data, refetch } = useQuery(
//   "pre",
//   () => axios.get("/api/preprocessing").then((res) => res.data)
//   //{ staleTime: 5000 }
// );
// console.log(data);

// useEffect(() => {
//   refetch();
// }, []);

// if (isLoading) {
//   return <>로딩중...</>;
// }
// if (error) {
//   return <>에러 발생</>;
// }
