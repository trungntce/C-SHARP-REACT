import { useEffect, useState } from "react";

export default (param: any) => {
  const [style, setStyle] = useState({
    color: "none",
  });
  useEffect(() => {
    if (param.value === "run") {
      setStyle({
        color: "#1B9C85",
      });
    } else if (param.value === "failure") {
      setStyle({
        color: "#FFB84C",
      });
    } else if (param.value === "down") {
      setStyle({
        color: "#FF0060",
      });
    }
  }, [param]);
  return (
    <div style={{ display: "flex", width: "40%" }}>
      {
       param.value === null ? <div>-</div> : <>
       <div style={{ flex: 1, ...style }}>
        {param.data.status === "run"
          ? "정상"
          : param.data.status === "down"
          ? "다운"
          : "통신장애" }
      </div>
      <div style={{ flex: 1 }}>{`( ${param.data.diff}분 )`}</div></>
      }
    </div>
  );
};
