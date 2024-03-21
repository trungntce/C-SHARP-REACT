import React, { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";

interface Props {
  oeeValue: number;
}

const CustomPie = ({ oeeValue }: Props) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    let color = "red";
    if (oeeValue < 70) {
      color = "#e63404";
    } else if (oeeValue >= 70 && oeeValue < 85) {
      color = "#e6a304";
    } else if (oeeValue >= 85) {
      color = "#B5F10E";
    }
    setData([
      { name: "Data", value: oeeValue, color },
      { name: "NonData", value: 100 - oeeValue, color: "#00000000" },
    ]);
  }, [oeeValue]);

  const CustomLabel = (i: any) => {
    return (
      <>
        <text
          fontSize="2em"
          fill="white"
          x={i.viewBox.cx}
          y={i.viewBox.cy - 70}
          textAnchor="middle"
        >
          <tspan>실시간</tspan>
        </text>
        <text
          fontSize="5em"
          fill="white"
          x={i.viewBox.cx}
          y={i.viewBox.cy}
          textAnchor="middle"
          dominantBaseline="central"
        ></text>
        <text
          fontSize="3em"
          fill="white"
          x={i.viewBox.cx}
          y={i.viewBox.cy - 20}
          textAnchor="middle"
        >
          <tspan>시간가동률</tspan>
        </text>
        <text
          fontSize="6em"
          fill="white"
          x={i.viewBox.cx}
          y={i.viewBox.cy + 20}
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan>{`${Math.round(data[0]?.value)}%`}</tspan>
        </text>
      </>
    );
  };

  return (
    <ResponsiveContainer width="95%" height="95%">
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={[
            {
              name: "1",
              value: 1,
            },
          ]}
          innerRadius="99.9%"
          outerRadius="100%"
          dataKey="value"
        ></Pie>
        <Pie
          data={data}
          innerRadius="70%"
          outerRadius="95%"
          dataKey="value"
          startAngle={90}
          endAngle={450}
        >
          {data.map((i: any) => (
            <Cell key={i.value} fill={i.color} stroke={i.color} />
          ))}
          <Label
            fontSize="3rem"
            content={CustomLabel}
            fill="white"
            position="center"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPie;
