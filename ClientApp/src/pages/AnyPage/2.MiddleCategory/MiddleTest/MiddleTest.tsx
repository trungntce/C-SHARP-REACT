import AlarmLayout from "../../AlarmLayout/AlarmLayout";
import myStyle from "./MiddleTest.module.scss";
import { useRecoilValue } from "recoil";
import { EquipMentList } from "../../StateStore/EquipMentList";
import ApiLayout from "../../ApiLayout";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MiddleTest = () => {
  const eqpList = useRecoilValue(EquipMentList);
  const nav = useNavigate();

  return (
    <AlarmLayout list={[]}>
      <div className={myStyle.layout}>
        <div
          style={{ border: "1px solid #AFD3E2", width: "20%", margin: "1rem" }}
        >
          <Button
            onClick={() => nav("/anypage/1/laser/equip")}
            sx={{ fontSize: "2rem", width: "100%" }}
          >
            레이저
          </Button>
        </div>
        <div
          style={{ border: "1px solid #AFD3E2", width: "20%", margin: "1rem" }}
        >
          <Button
            onClick={() => nav("/anypage/2/preprocessing/equip")}
            sx={{ fontSize: "2rem", width: "100%" }}
          >
            전처리
          </Button>
        </div>
      </div>
    </AlarmLayout>
  );
};

export default MiddleTest;

const Box = (i: any, key: number) => {
  return (
    <div key={key} className={myStyle.boxLayout}>
      {i.eqpName}
    </div>
  );
};
