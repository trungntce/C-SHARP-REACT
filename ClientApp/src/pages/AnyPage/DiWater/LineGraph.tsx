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
import style from "./DiRealChart/DiRealChart.module.scss";
import { Button } from "reactstrap";
import { getLang } from "../../../common/utility";

interface Props {
  searchData: Dictionary;
  deleteHandler: (index: number) => void;
  updateHandle: (index: number) => void;
  idx: number;
}

const LineGraph = forwardRef(
  ({ searchData, deleteHandler,updateHandle, idx }: Props, ref: any) => {
    const [diInput, setDiInput] = useState<any[]>([]);
    const [output, setOutput] = useState<any[]>([]);
    const [lastDate, setLastDate] = useState<any>({});

    useImperativeHandle(ref, () => ({
      RowData,
      getLastData: () => lastDate,
    }));

    const RowData = async () => {
      const para = {
        fromDt: searchData.fromDt,
        eqpCode: searchData.eqpCode,
        diwater: searchData.diwater
      };
      const { data } = await api<any>("get", "diwater/getlist", para);

      if(data){
        const di_input_list = [...data].map((i:any)=>{
          return{
            date:i?.std_time,
            di:i?.di,
            input:i?.input
          }
        });
        const output_list = [...data].map((i:any)=>{
          return{
            date:i?.std_time,
            output:i?.output
          }
        });

        const lastDate = [...data].reduce((last: any, cur: any) => {
          return new Date(cur["std_time"])?.getTime() >
            new Date(last["std_time"])?.getTime()
            ? cur
            : last;
        });

        setDiInput(di_input_list);
        setOutput(output_list);
        setLastDate(lastDate);
      }
    };

    useEffect(() => {
      RowData();
    }, [searchData]);

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
              {entry.value === "di"
                ? "* DI WATER"
                : entry.value === "input"
                ? "* INPUT"
                : entry.value === "output"
                ? "* OUTPUT"
                : ""}
            </div>
          ))}
        </div>
      );
    };

    const CustomTooltip = ({ payload, active }: any) => {
      if (active && payload && payload.length) {
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
            <div>{`Date : ${payload[0]?.payload?.date ? TimeFormat(payload[0]?.payload?.date): TimeFormat(new Date())}`}</div>
            {payload.map((entry: any, index: any) => (
              <div key={`$Tooltip-${index}`} style={{ color: entry.stroke }}>
                {`${
                  entry?.dataKey === "di"
                    ? "Di water"
                    : entry?.dataKey === "input"
                    ? "INPUT"
                    : entry?.dataKey === "output"
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
          >{`${getLang(lastDate.di_name)} / ${getLang(lastDate.input_name|| lastDate.output_name||'-')}`}</div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {`Last Update : ${TimeFormat(lastDate.std_time||null)}`}
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
              <div style={{ flex: 2 }}>
                <ResponsiveContainer width="95%" height="95%">
                  <LineChart data={[...diInput]} margin={{ left: 20, right: -30 }}>
                    <YAxis
                      stroke="#ffffff80"
                      type="number"
                      allowDataOverflow={true}
                      orientation="right"
                      tickCount={10}
                      domain={[0, 30]}
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
                      dataKey={"di"}
                      stroke="#0099ec"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey={"input"}
                      stroke="#fffa1e"
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine
                      y={12}
                      stroke="#7091F5"
                      strokeWidth={3}
                      strokeDasharray={"6,7"}
                      label={{
                        value: "DI WATER STANDARD",
                        stroke: "#7091F5",
                        dy: -15,
                        fontWeight: 200,
                        fontSize: "11px",
                      }}
                    />
                    <ReferenceLine
                      y={10}
                      stroke="#FEFFAC"
                      strokeWidth={3}
                      strokeDasharray={"6,7"}
                      label={{
                        value: "INPUT STANDARD",
                        stroke: "#FEFFAC",
                        dy: 15,
                        fontWeight: 200,
                        fontSize: "11px",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1.5 }}>
                <ResponsiveContainer width="95%" height="95%">
                  <LineChart
                    data={[...output]}
                    margin={{ left: 20, right: -30 }}
                  >
                    <YAxis
                      stroke="#ffffff80"
                      type="number"
                      allowDataOverflow={true}
                      orientation="right"
                      tickCount={10}
                      domain={[0, 15]}
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
                      dataKey={"output"}
                      stroke="#ff373d"
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine
                      y={10}
                      stroke="#FF6969"
                      strokeWidth={3}
                      strokeDasharray={"6,7"}
                      label={{
                        value: "OUTPUT STANDARD",
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
                >{`${getLang(lastDate?.di_name||"_")} 비저항`}</div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    fontSize: "3rem",
                    paddingBottom: "1rem",
                  }}
                >
                  {lastDate?.di?.toFixed(2)||''}
                  <div
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    MΩ
                  </div>
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",paddingBottom:"10px"}}>( DIWATER STANDARD : 12 MΩ 이상 )</div>
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
                >{`${getLang(lastDate.input_name)|| '_'} 비저항`}</div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    fontSize: "3rem",
                    paddingBottom: "1rem",
                  }}
                >
                  {lastDate?.input?.toFixed(2)||""}
                  <div style={{ fontSize: "1rem" }}>MΩ</div>
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",paddingBottom:"10px"}}>( INPUT STANDARD : 10 MΩ 이상 )</div>
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
                >{`${getLang(lastDate?.output_name)||"_"} 전도도`}</div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    fontSize: "3rem",
                    paddingBottom: "1rem",
                  }}
                >
                  {lastDate?.output?.toFixed(2)||""}
                  <div style={{ fontSize: "1rem" }}>uS/㎝</div>
                </div>
                <div style={{width:"100%",display:"flex",justifyContent:"center",paddingBottom:"10px"}}>( OUTPUT STANDARD : 10 uS/㎝ 이하 )</div>
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
                onClick={() => {
                  RowData();
                  updateHandle(idx);
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
