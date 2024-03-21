import ProductionStatus from "../ProductionStatus/ProductionStatus";
import myStyle from "./EquipMain.module.scss";
import { TimeFormat } from "../../utills/getTimes";
import { dayFormat } from "../../../../common/utility";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../../common/api";

const EquipMain = ({ selectedData }: any) => {
  const nav = useNavigate();

  const { eqp } = useParams();
  // const [status, setStatus] = useState("");
  // const [real, setReal] = useState<any[]>([]);

  // useEffect(() => {
  //   const T = async () => {
  //     const { data } = await api<any>(
  //       "get",
  //       "MonitoringDetail/eqprealstatus",
  //       {}
  //     );
  //     if (data) {
  //       const tttt = [...data].filter((i: any) => i.eqpCode === eqp);
  //       setStatus(tttt[0]?.eqpStatus);
  //     }
  //   };
  //   T();
  // }, [selectedData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#42464e",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "85px",
            backgroundColor: "#42464e",
            paddingLeft: "10px",
            paddingRight: "10px",
            justifyContent: "space-between",
          }}
        >
          <div className={myStyle.operation}>
            {selectedData.real?.eqpStatus === "O" &&
            selectedData.real?.status != "X" ? (
              <div style={{ color: "#00d659" }}>가동중</div>
            ) : selectedData.real?.eqpStatus === "O" &&
              selectedData.real?.status == "X" ? (
              <div style={{ color: "#e2de00" }}>비가동중</div>
            ) : selectedData.real?.step === "1" &&
              selectedData.real?.eqpStatus != "F" ? (
              <div style={{ color: "#585858" }}>설비고장</div>
            ) : (
              <div style={{ color: "#c40000" }}>설비이상</div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: "2.1rem",
                color: "#f5d900",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {selectedData?.real?.eqpDes}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: "1.3rem",
                color: "white",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {`[ ${selectedData?.real?.eqpCode} ]`}
            </div>
          </div>
          <div
            style={{
              flex: 0.5,
              fontSize: "18px",
              color: "#dcdcdc66",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              className={myStyle.date}
              style={{
                flex: 1,
                fontSize: "2.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                letterSpacing: 2,
                color: "white",
              }}
            >
              <span>{dayFormat(selectedData?.real?.mesDt)}</span>
            </div>
            <div
              className={myStyle.date}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div>{`UPDATE : ${
                selectedData?.real?.updateDt
                  ? TimeFormat(selectedData?.real?.updateDt)
                  : ""
              }`}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 10, display: "flex", flexDirection: "column" }}>
        <ProductionStatus data={selectedData} />
      </div>
    </div>
  );
};

export default EquipMain;
