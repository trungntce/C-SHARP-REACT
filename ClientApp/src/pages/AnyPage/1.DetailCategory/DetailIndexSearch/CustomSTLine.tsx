import React, { PureComponent, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  LabelProps,
} from "recharts";

interface Props {
  defaultSt: number;
  dataArr: any[];
}

const CustomSTLine = ({ defaultSt, dataArr }: Props) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const newArr = dataArr
      ?.sort(
        (a: any, b: any) =>
          new Date(a.mes_date).getTime() - new Date(b.mes_date).getTime()
      )
      .map((i: any, idx: number) => {
        return {
          time: `${new Date(i.mes_date).getDate()}일`,
          st: i.st,
        };
      });

    setData(newArr);
  }, [dataArr]);

  const renderColorfulLegendText = (value: string, entry: any) => {
    return value === "st" ? "누적 S/T 추이" : "모델 S/T 추이";
  };
  const CustomLabel = (props: any) => {
    return (
      <text
        x={props.viewBox.x}
        y={props.viewBox.y}
        dx={90}
        dy={-10}
        textAnchor="middle"
        fill="#8EA7E9"
        fontSize="1rem"
        fontWeight={300}
      >
        제조 S/T
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        margin={{
          top: 20,
          right: 5,
        }}
        data={data}
      >
        <CartesianGrid stroke="#f6f1e94d" strokeDasharray="1 1" />
        <XAxis type="category" orientation="bottom" dataKey="time" />
        <YAxis type="number" domain={["dataMin", "dataMax"]} />
        <Legend iconType="square" formatter={renderColorfulLegendText} />
        <Tooltip />
        <Line
          strokeWidth={1}
          type="monotone"
          dataKey="st"
          stroke="#8EA7E9cc"
          dot={false}
        />
        <ReferenceLine y={defaultSt} stroke="#8EA7E9" label={<CustomLabel />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomSTLine;
