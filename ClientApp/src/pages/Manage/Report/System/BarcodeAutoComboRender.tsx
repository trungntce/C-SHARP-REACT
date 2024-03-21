import { useEffect, useState } from "react";
import AutoCombo from "../../../../components/Common/AutoCombo";

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
    <div style={{ width: "100%", height: "100%" }}>
      <select name="commStatus" className="form-select" defaultValue={""}>
        <option value="">Total</option>
        <option value="run">정상</option>
        <option value="failure">통신장애</option>
        <option value="down">다운</option>
      </select>
    </div>
  );
};
