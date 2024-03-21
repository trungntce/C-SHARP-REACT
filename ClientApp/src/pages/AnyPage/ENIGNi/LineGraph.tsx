import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { TimeFormat } from "../utills/getTimes";
import { Dictionary } from "../../../common/types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import api from "../../../common/api";
import style from "./ENIGNiRealChart/ENIGNiChart.module.scss";
import { Button } from "reactstrap";

interface Props {
  searchData: Dictionary;
  deleteHandler: (index: number) => void;
  updateHandle: (index: number) => void;
  idx: number;
}

const LineGraph = forwardRef(
  ({ searchData, deleteHandler, updateHandle, idx }: Props, ref: any) => {
    const [voltage, setVoltage] = useState<any[]>([]);
    const [current, setCurrent] = useState<any[]>([]);
    const [lastData, setLastData] = useState<any>({});

    const RowData = async () => {
      const para = {
        fromDt: searchData.fromDt,
        eqpCode: searchData.eqpCode,
      };
      const data = await api<any>("get", "enig/getlist", para);

      const voltageArr = [...data.data].map((di: any) => {
        return { date: di.converttime, values: di.value };
      });
      const currentArr = [...data.data].map((di: any) => {
        return { date: di.converttime, values1: di.value1 };
      });

      const _lastData = [...data.data].reduce((last: any, cur: any) => {
        return new Date(cur["converttime"]).getTime() >
          new Date(last["converttime"]).getTime()
          ? cur
          : last;
      });

      setVoltage(
        voltageArr.sort(
          (a: any, b: any) =>
            new Date(a.converttime).getDate() -
            new Date(b.converttime).getDate()
        )
      );
      setCurrent(
        currentArr.sort(
          (a: any, b: any) =>
            new Date(a.converttime).getDate() -
            new Date(b.converttime).getDate()
        )
      );
      setLastData(_lastData);
    };

    useEffect(() => {
      RowData();
    }, []);

    const CustomLegend = ({ payload }: any) => {
      return (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          {payload.map((entry: any, index: any) => (
            <div
              key={`legend-${index}`}
              style={{ color: entry.color, margin: "0px 10px" }}
            >
              {entry.value === "values"
                ? "* Voltage"
                : entry.value === "values1"
                ? "* Current"
                : entry.value === "values2"
                ? "* OUTPUT"
                : ""}
            </div>
          ))}
        </div>
      );
    };

    const CustomTooltip = ({ payload }: any) => {
      if (payload !== "undefined") {
        return (
          <div
            style={{
              width: "17rem",
              height: "5rem",
              backgroundColor: "#000000b3",
              border: "1px solid white",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            <div>{`Data : ${TimeFormat(payload[0]?.payload?.date)}`}</div>
            {payload.map((entry: any, index: any) => (
              <div key={`$Tooltip-${index}`} style={{ color: entry.stroke }}>
                {`${
                  entry?.dataKey === "values"
                    ? "Voltage"
                    : entry?.dataKey === "values1"
                    ? "Current"
                    : entry?.dataKey === "values2"
                    ? "OUTPUT"
                    : ""
                } : ${entry?.value?.toFixed(2)}`}
              </div>
            ))}
          </div>
        );
      }

      return null;
    };
    return (
      <div className={style.graphBox}>
        <div
          style={{
            height: "48px",
            fontSize: "1rem",
            fontWeight: "bold",
            display: "flex",
          }}
        >
          <div
            style={{
              flex: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >{`${lastData.eqpName}`}</div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {`Last Update : ${TimeFormat(lastData.converttime)}`}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ flex: 3 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="95%" height="95%">
                  <LineChart
                    data={[...voltage]}
                    margin={{ left: 20, right: -30 }}
                  >
                    <YAxis
                      stroke="#ffffff80"
                      type="number"
                      allowDataOverflow={true}
                      orientation="right"
                      tickCount={10}
                      domain={[0, 1.5]}
                    />
                    <XAxis
                      stroke="#ffffff80"
                      tickCount={5}
                      tickFormatter={(e: any) => TimeFormat(e).split(" ")[1]}
                      dataKey="date"
                    />
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="2"
                      fill="#0000004d"
                    />
                    {/* <Tooltip /> */}
                    <Tooltip content={CustomTooltip} />
                    <Legend content={CustomLegend} />
                    <Line
                      type="monotone"
                      dataKey={"values"}
                      stroke="#FEFFAC"
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine
                      y={1}
                      stroke="#7091F5"
                      strokeWidth={2}
                      strokeDasharray={"5,5"}
                      label={{
                        value: "USL",
                        stroke: "#7091F5",
                        dy: -15,
                        fontWeight: 200,
                        fontSize: "11px",
                      }}
                    />
                    <ReferenceLine
                      y={0.5}
                      stroke="#FF6969"
                      strokeWidth={2}
                      strokeDasharray={"5,5"}
                      label={{
                        value: "LSL",
                        stroke: "#FF6969",
                        dy: -15,
                        fontWeight: 200,
                        fontSize: "11px",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="95%" height="95%">
                  <LineChart
                    data={[...current]}
                    margin={{ left: 20, right: -30 }}
                  >
                    <YAxis
                      stroke="#ffffff80"
                      type="number"
                      allowDataOverflow={true}
                      orientation="right"
                      tickCount={10}
                      domain={[0, 0.6]}
                    />
                    <XAxis
                      stroke="#ffffff80"
                      tickCount={5}
                      tickFormatter={(e: any) => TimeFormat(e).split(" ")[1]}
                      dataKey="date"
                    />
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="2"
                      fill="#0000004d"
                    />

                    <Tooltip content={CustomTooltip} />
                    <Legend content={CustomLegend} />
                    <Line
                      type="monotone"
                      dataKey={"values1"}
                      stroke="#ff373d"
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine
                      y={0.5}
                      stroke="#FF6969"
                      strokeWidth={2}
                      strokeDasharray={"5,5"}
                      label={{
                        value: "USL",
                        stroke: "#FF6969",
                        dy: -15,
                        fontWeight: 200,
                        fontSize: "11px",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "5px 0px",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff1a",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1rem",
                    flexWrap: "wrap",
                  }}
                >{`VOLTAGE`}</div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    fontSize: "3rem",
                    paddingBottom: "2rem",
                  }}
                >
                  {lastData?.value?.toFixed(2)}
                  <div
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    V
                  </div>
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",paddingBottom:"10px"}}>( LSL 0.5 V ~ USL 1.0 V )</div>
              </div>

              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff1a",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1rem",
                    flexWrap: "wrap",
                  }}
                >{`CURRENT`}</div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    fontSize: "3rem",
                    paddingBottom: "2rem",
                  }}
                >
                  {lastData?.value1?.toFixed(2)}
                  <div style={{ fontSize: "1rem" }}>A</div>
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",paddingBottom:"10px"}}>( USL 0.5 A )</div>
              </div>
            </div>
            <div
              style={{
                height: "40px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Button
                onClick={(i:any) => {
                  updateHandle(idx);
                  RowData();
                }}
              >
                update
              </Button>
              <Button
                onClick={() => {
                  return deleteHandler(searchData.index);
                }}
              >
                delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LineGraph;
