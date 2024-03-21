import { Legend } from "chart.js";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default (param: any) => {
  return (
    // <LineChart
    //   width={250}
    //   height={80}
    //   data={[
    //     { oee: 33 },
    //     { oee: 50 },
    //     { oee: 100 },
    //     { oee: 57 },
    //     { oee: 60 },
    //     { oee: 83 },
    //     { oee: 83 },
    //   ]}
    // >
    //   <CartesianGrid stroke="#f6f1e933" strokeDasharray="1 1" />

    //   {/* <ReferenceLine y="80" stroke="#FFFDE1" label="oee-avg" />
    // <ReferenceLine y="55" stroke="#FFFDE1" label="st-avg" /> */}
    //   <Tooltip />
    //   <Line type="linear" dataKey="oee" stroke="#FFFDE1" />
    // </LineChart> // 행 높이 수정 컬럼defs 에서 cell넓이 수정
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          borderRadius: "5px",
          backgroundColor: "black",
          width: "100%",
          height: "70%",
          position: "relative",
        }}
      >
        <div
          style={{
            borderRadius: "5px",
            height: "100%",
            width: `${
              param.data.oee > 100
                ? "100"
                : param.data.total_target_cnt.toFixed(1)
            }%`,
            backgroundColor: `${
              param.data.oee > 100 ? "#FFDBA480" : "#F6F1F180"
            }`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 5,
            top: -8,
            color: "white",
            fontSize: "17px",
            fontWeight: "500",
            letterSpacing: "3px",
          }}
        >{`${param.data.total_target_cnt.toFixed(1)}%`}</div>
      </div>
    </div>
  );
};
