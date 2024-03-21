import { useEffect, useRef, useState } from "react";
import { toComma } from "../../utills/toComma";
import listStyle from "./EquipList.module.scss";
import { useRecoilValue } from "recoil";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { EquipStatus } from "../../StateStore/EquipMentList";
import api from "../../../../common/api";

interface Props {
  selectFnc: (data: any) => void;
}

const EquipList = ({ selectedData }: any) => {
  const { eqp, facno, eqptype } = useParams();

  const data = useRecoilValue(EquipStatus);

  const [total, setTotal] = useState<any>();
  const [getData, setGetData] = useState<any[]>();

  const [models, setModels] = useState("");

  const location = useLocation();
  const nav = useNavigate();


  const TextOver = (name: string) => {
    return name.length > 18 ? `${name.substring(0, 18) + "..."}` : name;
  };
  return (
    <div className={listStyle.layout}>
      <div className={listStyle.header}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* {Cell(
              total?.planCnt > 100000
                ? new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(total?.planCnt)
                : toComma(total?.planCnt ? total?.planCnt : 0),
              "#3d79c6"
            )} */}
            {Cell(toComma(total?.planCnt ? "-" : "-"), "#3d79c6")}
            {HeaderTip("계획", "#3d79c6")}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* {Cell(
              toComma(
                Math.round(total?.expectedProd ? total?.expectedProd : 0)
              ),
              "#07e4c2"
            )} */}
            {Cell(toComma(total?.expectedProd ? "-" : "-"), "#07e4c2")}
            {HeaderTip("목표", "#07e4c2")}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {Cell(toComma(total?.prodCnt ? total?.prodCnt : 0), "#f6bf0a")}
            {HeaderTip("생산", "#f6bf0a")}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {Cell(toComma(Math.round(total?.oee ? total?.oee : 0)), "#F28705")}
            {HeaderTip("효율", "#F28705")}
          </div>
        </div>
      </div>
      <div className={listStyle.list}>
        <div className={listStyle.listContent}>
          {getData?.map((i: any, idx: number) =>
            i.step === "X" || i.step > 1 ? null : (
              <div
                onClick={() => {
                  //history.pushState(null, "null", i.equipmentcode);
                  nav(`${location.pathname.slice(0, 33)}${i.eqpCode}`, {
                    replace: true,
                  });
                  const ttttt = [...models].filter(
                    (f: any) => f.eqpCode === i.eqpCode
                  );
                  
                }}
                key={idx}
                style={{
                  backgroundColor: eqp === i.eqpCode ? "#292d36" : "",
                }}
                className={listStyle.listBox}
              >
                <div className={listStyle.listBoxContent}>
                  <div style={{ padding: "3px 10px" }}>
                    <div style={{ display: "flex" }}>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "21px",
                          color: `${
                            i.step == "1" &&
                            i.eqpStatus == "O" &&
                            i.status != "X"
                              ? "#00d659"
                              : i.step == "1" &&
                                i.eqpStatus == "O" &&
                                i.status == "X"
                              ? "#e2de00"
                              : i.step == "1" && i.eqpStatus == "F"
                              ? "#585858"
                              : "#c40000"
                          }`,
                        }}
                      >
                        {i.eqpDes}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          display: "flex",
                          color: "white",
                          fontSize: "1.1rem",
                        }}
                      >
                        {
                          new Set(
                            [...models].map((m: any) =>
                              m.eqpCode === i.eqpCode
                                ? TextOver(m.modelName)
                                : ""
                            )
                          )
                        }
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        height: "48px",
                        paddingTop: "4px",
                      }}
                    >
                      {Cell(toComma(i?.planCnt ? "-" : "-"), "#3d79c6")}
                      {/* {Cell(
                        toComma(
                          Math.round(i?.expectedProd ? i?.expectedProd : 0)
                        ),
                        "#07e4c2"
                      )} */}
                      {Cell(toComma(i?.expectedProd ? "-" : "-"), "#07e4c2")}
                      {Cell(toComma(i?.prodCnt ? i?.prodCnt : 0), "#f6bf0a")}

                      {Cell(
                        toComma(Math.round(i?.timeRate ? i?.timeRate : 0)),
                        "#F28705"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipList;

const HeaderTip = (content: string, color: string) => {
  return (
    <div
      className={listStyle.headerTip}
      style={{
        color: `${color}`,
      }}
    >
      <div
        style={{ width: "12px", height: "12px", backgroundColor: `${color}` }}
      />
      <div style={{ margin: "5px" }}>{content}</div>
    </div>
  );
};

const Cell = (value: string, color: string) => {
  return (
    <span
      style={{
        fontSize: "27px",
        display: "block",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        color: `${color}`,
      }}
    >
      {value}
    </span>
  );
};
