import { useEffect, useState } from "react";
import myStyle from "./TimeTable.module.scss";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { EquipForM, TimeStatus } from "../../../StateStore/EquipMentList";
import { useParams } from "react-router-dom";
import api from "../../../../../common/api";
import moment from "moment";
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const TimeTable = () => {
  const hourArr = [
    "8am",
    "9am",
    "10am",
    "11am",
    "12am",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
    "12pm",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
  ];
  const minArr = [];
  for (let m = 0; m < 24 * 6; m++) {
    minArr.push(
      <div
        style={{
          borderLeft: `${m === 0 ? "0px" : "1px"} solid gray`,
          borderTop: "1px solid gray",
          borderRight: "0px solid gray",
          borderBottom: "0px solid gray",
          width: `${(24 * 6) / 100}%`,
          flex: 1,
        }}
      />
    );
  }
  const TestModel = [
    {
      startTime: "2023-04-18 10:00:00", //8시 기준으로 부터 시작시간 차이(초) / width 100% 24시간을 초로바꾼 86400
      endTime: "2023-04-18 15:00:00", //시작시간과 끝시간 차이(초)
      color: "#A6D0DD",
      modelName: "model1",
    },
    {
      startTime: "2023-04-18 15:30:00",
      endTime: "2023-04-18 18:30:00",
      color: "#FFD3B0",
      modelName: "model2",
    },
    {
      startTime: "2023-04-18 19:10:00",
      endTime: "2023-04-18 21:40:00",
      color: "#43d8c9",
      modelName: "model3",
    },
    {
      startTime: "2023-04-18 22:00:00",
      endTime: "2023-04-19 04:00:00",
      color: "#43ff64",
      modelName: "model4",
    },
    {
      startTime: "2023-04-19 04:20:00",
      endTime: "2023-04-19 07:55:00",
      color: "#ff731d",
      modelName: "model5",
    },
  ];

  const colors = [
    "#97FEED",
    "#C4B0FF",
    "#ff731d",
    "#FFD3B0",
    "#43ff64",
    "#43d8c9",
    "#E49393",
    "#86A7FC",
    "#FAEF5D",
    "#B4D4FF"
  ];

  const eqp4m = useRecoilValue(EquipForM);

  const { eqp } = useParams();
  const [modelHis, setModelHis] = useState<any[]>([]);
  const [realHis, setRealHis] = useState<any[]>([]);
  const [nowPos, setNowPos] = useState<any>(null);

  const [popupIndex, setPopupIndex] = useState<number>(-1);
  const setTimeStatusList = useSetRecoilState(TimeStatus);
  
  useEffect(() => {
    const forMInfo = [...eqp4m].filter((f: any) => f.eqpCode === eqp); //4M 정보

    const now = moment(new Date()).format("yyyy-MM-DDTHH:mm:ss");
    const timeWidth = moment(
      new Date().setMinutes(new Date().getMinutes() + 10)
    ).format("yyyy-MM-DDTHH:mm:ss");

    const nowTime = {
      start_dt: now,
      startTime: now,
      endTime: timeWidth,
      end_dt: timeWidth,
      color: "#ff0000",
      modelName: "현재시간",
      today: now,
    };

    const calcNowDt = (today:string|Date) => {
      const now = new Date().getTime();
      const am8 = new Date(today).getTime();

      const timeDiff = (((now - am8) / 1000)/86400) * 100;
      setNowPos(timeDiff);
    }

    const realHisReq = async () => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/getmodelrealhis",
        {
          eqpcode: eqp,
        }
      );

      if (data) {
        const res = [...data].map((i: any, idx: number) => {
          return {
            ...i,
            startTime: i.startDt,
            endTime: i.endDt,
          };
        });
        calcNowDt(data[0]["today"]);
        setRealHis([...res]);
        setTimeStatusList([...res])
      }
    };

    const Std_4M = async () => {
      const { data } = await api<any>("get", "MonitoringDetail/getmodelhis", {
        eqpcode: eqp,
      });

      if (data) {
        const Test = [...data].map((i: any, idx: number) => {
          return {
            ...i,
            modelName: i.BOM_ITEM_DESCRIPTION,
            color: colors[idx % 7],
            startTime: i.start_dt,
            endTime: i.end_dt,
          };
        });
        setModelHis(Test);
      }
    };

    Std_4M();
    realHisReq();

  }, [eqp, eqp4m]);
  return (
    <div className={myStyle.layout}>
      <div className={myStyle.description}>
        시간
        <div
          style={{
            height: "20%",
            width: "auto",
            position: "absolute",
            bottom: "40%",
          }}
        >
          비가동 상태
        </div>
        <div
          style={{
            height: "20%",
            width: "auto",
            position: "absolute",
            bottom: "10%",
          }}
        >
          4M 기준
        </div>
      </div>
      <div className={myStyle.time}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {hourArr.map((i: any, key: number) => (
            <div
              key={key}
              style={{
                borderLeft: `1px solid gray`,
                width: `${24 / 100}%`,
                height: "100%",
                flex: 1,
              }}
            >
              {i}
            </div>
          ))}
          <FmdGoodIcon style={{color:"white",fontSize:"25px", position:"absolute", bottom:"60%",marginLeft:"-12.5px", left:`${nowPos}%`}}/>
          {/* 가동 / 비가동 상태 */}
          <div
            style={{
              height: "20%",
              width: "100%",
              backgroundColor: "green",
              position: "absolute",
              bottom: "40%",
            }}
          >
            {realHis.map((i: any, idx: number) =>
              RealRangeBar(idx, i.startTime, i.endTime, "#77D970", i.today)
            )}
            <div style={{
              height: "100%",
              width: `${100 - nowPos}%`,
              backgroundColor: "white",
              position: "absolute",
              bottom: "0%",
              left:`${nowPos}%`
            }} />
          </div>
          {/* 4M 기준 */}
          <div
            style={{
              height: "20%",
              width: "100%",
              position: "absolute",
              bottom: "10%",
            }}
          >
            {modelHis.map((i: any, idx: number) =>
              RangeBar(
                idx,
                i.startTime,
                i.endTime,
                i.color,
                i.modelName,
                i.today,
                setPopupIndex,
                idx,
                popupIndex
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;

const RangeBar = (
  key: number,
  startTime: string,
  endTime: string,
  color: string,
  modelName: string,
  today: string,
  setPopupIndex: any,
  idx: number,
  popupIndex: number
) => {
  const st = new Date(today).getTime();

  const barStart = (new Date(startTime).getTime() - st) / 1000;
  const barLength =
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
  let isShow = false;

  return (
    <div
      key={key}
      className={myStyle.rangeBar}
      style={{
        left: `${(barStart / 86400) * 100}%`,
        width: `${(barLength / 86400) * 100}%`,
        border: `1px solid ${color}80`,
        backgroundColor: `${color}4d`,
        color,
      }}
      onMouseOver={() => setPopupIndex(idx)}
      onMouseOut={() => setPopupIndex(-1)}
    >
      {RangeBarPopup(modelName, idx, popupIndex)}
    </div>
  );
};

const RealRangeBar = (
  key: number,
  startTime: string,
  endTime: string,
  color: string,
  today: string
) => {
  const st = new Date(today).getTime();
  const barStart = (new Date(startTime).getTime() - st) / 1000;
  const barLength =
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;

  return (
    <div
      key={key}
      className={myStyle.rangeBar}
      style={{
        left: `${(barStart / 86400) * 100}%`,
        width: `${(barLength / 86400) * 100}%`,
        border: `1px solid ${color}80`,
        backgroundColor: `#FBF46D`,
        color,
      }}
    ></div>
  );
};

const RangeBarPopup = (modelName: string, idx: number, popupIndex: number) => {
  return (
    <div
      style={{
        display: idx === popupIndex ? "flex" : "none",
        width: "25%",
        position: "fixed",
        marginLeft: "400px",
        marginTop: "-100px",
        backgroundColor: "#000000cc",
        justifyContent: "center",
        alignItems:"center",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          fontSize: "1.2rem",
          display: "flex",
          flexDirection: "column",
          padding: "5px",
        }}
      >
        <div style={{letterSpacing:"6px"}}>모델명</div>
        <div style={{fontSize: "1.5rem",}}>{modelName}</div>
      </div>
    </div>
  );
};
