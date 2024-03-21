import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";
import { TimeFormat } from "../../AnyPage/utills/getTimes";

interface Props {
  rowData: any[];
  linekey: string[];
  range: any;
}

const ParamLineChart = ({ rowData, linekey, range }: Props) => {
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
            backgroundColor: "#222222d3",
            border: "1px solid #eb455fcc",
            width: "20rem",
            height: "5rem",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
            color: "black",
            borderRadius: "10px",
            padding: "1rem",
            fontWeight: "bold",
          }}
        >
          <div style={{ color: "white" }}>{`Update : ${TimeFormat(
            payload[0].payload.inserttime
          )}`}</div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {payload.map((i: any, idx: number) => (
              <div style={{ color: i.color }}>{i.payload[i.name]}</div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const [newdata, setNewdata] = useState<any[]>([]);
  useEffect(() => {
    const division =
      range === "hour" ? 15 : range === "day" ? 30 : range === "week" ? 150 : 1;

    setNewdata(
      rowData
        .map((i: any, idx: number) => {
          if (idx % division == 0) {
            return i;
          }
          return null;
        })
        .filter((f: any) => f !== null)
    );
  }, [rowData, range]);
  const colors = ["#B3FFAE", "#548CFF", "#2CD3E1", "#D58BDD", "#FF6D28"];

  return (
    <ResponsiveContainer width="95%" height="95%">
      <LineChart data={newdata} margin={{ left: 0, right: -10 }}>
        <YAxis
          stroke="#ffffff80"
          type="number"
          allowDataOverflow={true}
          orientation="right"
          tickCount={4}
          domain={["dataMin-2", "dataMax+2"]}
        />
        <XAxis
          stroke="#ffffff80"
          tickCount={5}
          tickFormatter={(e: any) => TimeFormat(e).split(" ")[1]}
          dataKey="inserttime"
        />
        <CartesianGrid strokeDasharray="2" fill="#ffffff1a" />
        <Tooltip content={CustomTooltip} />
        {linekey.map((i: string, idx: number) => (
          <Line
            type="monotone"
            dataKey={i}
            stroke={
              idx === linekey.length - 1
                ? colors[colors.length - 1]
                : colors[idx]
            }
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ParamLineChart;
