import React, { useRef, useState, useEffect, useCallback } from "react";
import myStyle from "./CuPlating.module.scss";
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
import currentcu from "../../../assets/cu.png";
import current from "../../../assets/current.png";
import dayjs from "dayjs";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "react-router-dom";
import { CuPlatingDefs, CuPlatingMonthDefs } from "./CuPlatingDefs";
import { TimeFormat } from "../utills/getTimes";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import api from "../../../common/api";
import IOCMenu from "../../IOC/IOCMenu";

const MonthChart = ({ data, dataName, referLine, limits }: any) => {
  const limit = { ...limits[0] };
  let upperLimit = 0;
  let lowerLimit = 0;
  if (dataName === "D001") {
    upperLimit = limits?.filter((i: any) => i.recipe_code === "c1")[0]?.usl;
    lowerLimit = limits?.filter((i: any) => i.recipe_code === "c1")[0]?.lsl;
  } else if (dataName === "D002") {
    upperLimit = limits?.filter((i: any) => i.recipe_code === "c2")[0]?.usl;
    lowerLimit = limits?.filter((i: any) => i.recipe_code === "c2")[0]?.usl;
  } else if (dataName === "D003") {
    upperLimit = limits?.filter((i: any) => i.recipe_code === "c3")[0]?.usl;
    lowerLimit = limits?.filter((i: any) => i.recipe_code === "c3")[0]?.usl;
  } else if (dataName === "D004") {
    upperLimit = limits?.filter((i: any) => i.recipe_code === "c4")[0]?.usl;
    lowerLimit = limits?.filter((i: any) => i.recipe_code === "c4")[0]?.usl;
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
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

const LineTimeChart = ({ data, dataKey, referenceLine, syncId }: any) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<any, any>) => {
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
  return (
    <ResponsiveContainer width="95%" height="95%">
      <LineChart
        syncId={syncId}
        data={[...data]}
        margin={{ left: 20, right: -30 }}
      >
        <YAxis
          stroke="#ffffff80"
          type="number"
          allowDataOverflow={true}
          orientation="right"
          tickCount={4}
          domain={[0, 300]}
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
          stroke="#83C6FB"
          strokeWidth={2}
          dot={false}
        />
        {/* <ReferenceLine
          strokeWidth={1.3}
          y={referenceLine[0]}
          label={{ value: "Min", fill: "#FAEA48" }}
          stroke="#FAEA48"
        />
        <ReferenceLine
          strokeWidth={1.3}
          y={referenceLine[1]}
          label={{ value: "Max", fill: "#06FF00" }}
          stroke="#06FF00"
        /> */}
      </LineChart>
    </ResponsiveContainer>
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

const CuPlating = () => {
  const { eqpCode } = useParams();
  const [data, setData] = useState(startData);
  const [monthData, setMonthData] = useState([
    {
      time: "",
      maxd001: 0,
      mind001: 0,
      avgd001: 0,
      maxd002: 0,
      mind002: 0,
      avgd002: 0,
      maxd003: 0,
      mind003: 0,
      avgd003: 0,
      maxd004: 0,
      mind004: 0,
      avgd004: 0,
    },
  ]);
  const [flag, setFlag] = useState(false);
  const [nowTime, setNowTime] = useState("2000-01-01");
  const [intervalId, setIntervalId] = useState(0);
  const [monthMode, setMonthMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [limits, setLimits] = useState([]);

  const timee = useRef("");
  const selectedDate = useRef<number>(1);
  const gridRef = useRef<AgGridReact>(null);

  const loadFirstDatas = async (day: any) => {
    setIsLoading(true);
    await axios
      .get("/api/cuplating", {
        params: { duration: day, eqpCode },
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

  const loadLimits = async () => {
    await axios
      .get("/api/cuplating/limits", {
        params: { eqpCode },
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
    //loadLimits();
    loadFirstDatas(1);
  }, [eqpCode]);

  //최신 이후의 데이터 가져와서 최신 데이터가 있으면 첫 데이터에 합치는 로직
  const loadLastDatas = async () => {
    await axios
      .get("/api/cuplating/afterlast", {
        params: { lastTime: timee.current, eqpCode },
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

  return (
    <div className={myStyle.all}>
      <div className={myStyle.header}>
        <IOCMenu title="동도금 전류 " />
        <div
          style={{ color: "white", fontSize: "2rem", letterSpacing: "10px" }}
        >
          동도금 전류 MONITORING
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
              loadFirstDatas(1);
              selectedDate.current = 1;
            }}
          >
            DAY
          </button>
          <button
            type="button"
            className="btn btn-soft-primary"
            onClick={() => {
              setMonthMode(false);
              loadFirstDatas(7);
              selectedDate.current = 7;
            }}
          >
            WEEK
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
          >
            <Button
              startIcon={<FileDownloadIcon />}
              sx={{
                width: "50%",
                height: "34px",
                color: "white",
                border: "1px solid white",
              }}
              variant="outlined"
              onClick={() =>
                window.open(
                  `/api/cuplating?eqpCode=${eqpCode}&duration=${selectedDate.current}&isExcel=true`
                )
              }
            >
              File DownLoad
            </Button>
          </div>
        </div>
        {/* <button
          type="button"
          className="btn btn-soft-secondary"
          onClick={() => {
            setMonthMode(true);
            loadMonthDatas(eqpCode);
          }}
        >
          MONTH
        </button> */}
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
                  <img src={current} alt="d001" width={66} /> 전류1
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"D001"}
                  referLine={[70, 100, 130]}
                  limits={limits}
                />
              </div>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={current} alt="d002" width={66} /> 전류2
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"D002"}
                  referLine={[40, 85, 110]}
                  limits={limits}
                />
              </div>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={current} alt="d003" width={66} /> 전류3
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"D003"}
                  referLine={[10, 25, 40]}
                  limits={limits}
                />
              </div>
              <div className={myStyle.monthBodyRow}>
                <div className={myStyle.monthBodyRowExplain}>
                  <img src={current} alt="d004" width={66} /> 전류4
                </div>
                <MonthChart
                  data={monthData}
                  dataName={"D004"}
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
                  columnDefs={CuPlatingMonthDefs}
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
                    data={[...data].sort(
                      (a: any, b: any) =>
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                    )}
                    dataKey="d001"
                    referenceLine={[100, 150]}
                    syncId="any1"
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={current}
                    imgSize={60}
                    title={"전류1 (A)"}
                    num={data[0]?.d001}
                  />
                </div>
              </div>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={[...data].sort(
                      (a: any, b: any) =>
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                    )}
                    dataKey="d002"
                    referenceLine={[100, 150]}
                    syncId="any1"
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={current}
                    imgSize={60}
                    title={"전류2 (A)"}
                    num={data[0]?.d002}
                  />
                </div>
              </div>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={[...data].sort(
                      (a: any, b: any) =>
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                    )}
                    dataKey="d003"
                    referenceLine={[100, 150]}
                    syncId="any2"
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={current}
                    imgSize={60}
                    title={"전류3 (A)"}
                    num={data[0]?.d003}
                  />
                </div>
              </div>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <LineTimeChart
                    data={[...data].sort(
                      (a: any, b: any) =>
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                    )}
                    dataKey="d004"
                    referenceLine={[100, 150]}
                    syncId="any2"
                  />
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={current}
                    imgSize={60}
                    title={"전류4 (A)"}
                    num={data[0]?.d004}
                  />
                </div>
              </div>
            </div>
            <div className={myStyle.bodyRight}>
              <div
                className={`ag-theme-alpine-dark ${myStyle.agGridCss}`}
                style={{ height: "100%", width: "100%" }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={data}
                  columnDefs={CuPlatingDefs}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CuPlating;

const startData = [
  {
    d001: 0,
    d002: 0,
    d003: 0,
    d004: 0,
    eqCode: "",
    time: "",
  },
];
