import React, { useEffect, useState } from "react";
import Chart, {
  ArgumentAxis,
  Series,
  Legend,
  ValueAxis,
  Label,
} from "devextreme-react/chart";

interface Props {
  value?: any[];
}

const CustomBar2 = ({ value }: Props) => {
  // const [data, setData] = useState<any[]>();
  // useEffect(() => {
  //   setData([...value]);
  // }, [value]);

  const CustomLabel = (arg: any) => {
    return `${arg.valueText} %`;
  };

  return (
    <Chart resolveLabelOverlapping="stack" rotated={true} dataSource={value}>
      <Series barPadding={0.2} type="bar" color="#34C1C1" barWidth="50">
        <Label
          visible={true}
          backgroundColor="#605CA8"
          customizeText={CustomLabel}
        />
      </Series>

      <Legend visible={false} />
      <ArgumentAxis
        label={{
          font: {
            color: "white",
            size: "1.2rem",
            weight: "bold",
          },
        }}
        grid={{ color: "red" }}
      />
      <ValueAxis
        label={{
          font: {
            color: "#00000000",
          },
        }}
        grid={{ color: "#717171", opacity: 0.5, width: 2 }}
      />
    </Chart>
  );
};

export default CustomBar2;

// resolveLabelOverlapping="stack"> {/* or 'hide' | 'none' */}
