import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  Legend,
  XAxis,
  CartesianGrid,
} from "recharts";

interface Props {
  dataArr: any[];
}

const CstBarChart = ({ dataArr }: Props) => {
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
    const { color } = entry;
    return (
      <span style={{ color, fontSize: "1.2rem" }}>{`현재 모델 추이`}</span>
    );
  };
  return (
    <ResponsiveContainer width="98%" height="98%">
      <BarChart data={data}>
        <CartesianGrid
          stroke="#f6f1e94d"
          strokeDasharray="1 1"
          fillOpacity={0.1}
        />
        <YAxis stroke="#ffffffa1" />
        <XAxis stroke="#ffffffa1" dataKey="time" />
        <Legend
          align="right"
          margin={{ top: 0, left: 0, right: 0, bottom: 100 }}
          formatter={renderColorfulLegendText}
        />

        <Bar
          barSize={35}
          width={10}
          dataKey="st"
          fill="#93FFD8"
          fillOpacity={0.4}
          stroke="#93FFD8"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CstBarChart;
