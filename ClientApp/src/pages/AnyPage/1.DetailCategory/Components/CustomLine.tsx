import React, { PureComponent, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  dataArr: any[];
}

const CustomLine = ({ dataArr }: Props) => {
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
          timeoperation: i.time_rate,
          performanceutili: i.perfor_rate,
        };
      });

    setData(newArr);
  }, [dataArr]);

  const renderColorfulLegendText = (value: string, entry: any) => {
    const { color } = entry;

    return (
      <span style={{ color }}>
        {value === "timeoperation" ? "시간 가동률" : "성능 가동률"}
      </span>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#f6f1e94d" strokeDasharray="1 1" />
        <XAxis type="category" orientation="bottom" dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend
          iconType="square"
          verticalAlign="bottom"
          formatter={renderColorfulLegendText}
        />
        <Line
          type="monotone"
          dataKey="timeoperation"
          stroke="#FFBDD1"
          activeDot={{ r: 3 }}
          strokeWidth={2}
        />
        {/* <Line
          type="monotone"
          dataKey="performanceutili"
          stroke="#00C9EC"
          activeDot={{ r: 3 }}
          strokeWidth={2}
        /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLine;
