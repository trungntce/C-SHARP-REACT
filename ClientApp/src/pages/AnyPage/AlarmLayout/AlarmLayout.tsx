import myStyle from "./AlarmLayout.module.scss";
import { toComma } from "../utills/toComma";
import { Button, Menu, Popover } from "@mui/material";
import NorthWestIcon from "@mui/icons-material/NorthWest";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import api from "../../../common/api";
import { useRecoilValue } from "recoil";
import { EquipForM } from "../StateStore/EquipMentList";
import moment from "moment";

type Item = {
  title: string;
  description: string;
  line: string;
  time: string;
};

interface Props {
  children: React.ReactNode;
  list: Item[];
  selectedData?: any;
}

const AlarmLayout = ({ children, list, selectedData }: Props) => {
  const nav = useNavigate();

  const alarms: Item[] = [
    {
      title: "M-005-03-C001",
      description: "A1900_LH_원형피다소재끼임",
      line: "ST 1900",
      time: "0.93",
    },
    {
      title: "M-005-03-C002",
      description: "A2100_RH_직선피다소재끼임",
      line: "ST 원점",
      time: "14.86",
    },
    {
      title: "M-005-03-C003",
      description: "#1100 LH O/S 스트로크검사",
      line: "ST 2700",
      time: "27.86",
    },
  ];

  const eqp4m = useRecoilValue(EquipForM);
  const { eqp } = useParams();

  const [alarmList, setAlarmList] = useState<any[]>([]);

  const [onView, setOnView] = useState(false);

  useEffect(() => {
    const forMInfo = [...eqp4m].filter((f: any) => f.eqpCode === eqp); //4M 정보

    const getAlarmInfo = async () => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/getequipalarmlist",
        {
          eqpcode: eqp,
        }
      );

      if (data) {
        //건조온도
        //77.000    84.222222  	83.000
        //2023-07-16 17:16:50.987	2023-07-16 17:28:22.110
        // param_name   //이름
        // ucl          //상한
        // eqp_avg_val  //평균값
        // lcl          //하한
        // eqp_min_dt   //시작시간
        // eqp_max_dt   //끝시간

        // eqp_max_val
        // eqp_min_val
        const listMap = [...data].map((i: any, idx: number) => {
          return {
            ...i,

            // line: moment(i.time).format("HH시 mm분"),

            start: moment(i.eqp_min_dt).format("hh:mm:ss"),
            end: moment(i.eqp_max_dt).format("hh:mm:ss"),
            second:
              (new Date(i.eqp_max_dt).getTime() -
                new Date(i.eqp_min_dt).getTime()) /
              1000,
          };
        });

        setAlarmList(listMap);
      }
    };
    //getAlarmInfo();
  }, [eqp, eqp4m]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "5px",
      }}
    >
      <div style={{ display: "flex", marginBottom: "5px", flex: 1 }}>
        <div className={myStyle.childrenlayout}>{children}</div>
        <div
          className="d-none d-lg-block"
          style={{ flex: 0.8, marginLeft: "10px" }}
        >
          <div className={myStyle.mainContainer}>
            <div className={myStyle.container}>
              <div className={myStyle.header}>
                <div className={myStyle.title}>
                  <div>이상 리스트</div>
                  <div style={{ fontSize: "1rem" }}>
                  </div>
                </div>
              </div>
              <div className={myStyle.body}>
                <div className={myStyle.bodyinner}>
                  {[...alarmList].map((i: Item, idx: number) =>
                    ItemCard(i, idx)
                  )}
                </div>
              </div>
            </div>
            {selectedData?.real?.paramMonitor === "Y" ? (
              <Button
                variant="text"
                sx={{ fontSize: "1.2rem", color: "red" }}
                startIcon={<TimelineIcon />}
                onClick={() => nav(`/parameter/${selectedData?.real?.eqpCode}`)}
              >
                Parmeter 보기
              </Button>
            ) : null}
            <div className={myStyle.bottomContainer}>
              <div className={myStyle.count}>
                {CountCard("계획 수량", "-", "#0A356C", "", "")}
                <div
                  onClick={() => setOnView((prev: boolean) => !prev)}
                  className={myStyle.countClickCard}
                >
                  <div className={myStyle.valuelayout}>
                    {toComma(selectedData?.real?.prodCnt? selectedData?.real?.prodCnt: 0)}
                    <div style={{ fontSize: "25px" }}>{selectedData?.real?.prodCntUnit? selectedData?.real?.prodCntUnit: "PNL"}
                    </div>
                  </div>
                  <div
                    className={myStyle.titlelayout}
                    style={{backgroundColor: "#f6bf0a",color: "#f2f2f2",position: "relative"}}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {onView ? (
                        <ArrowRightIcon
                          sx={{ fontWeight: "bold", fontSize: 45 }}
                        />
                      ) : (
                        <ArrowLeftIcon
                          sx={{ fontWeight: "bold", fontSize: 45 }}
                        />
                      )}
                    </div>
                    생산수량
                  </div>
                </div>
              </div>
              <div
                style={{
                  right: "210px",
                  bottom: "220px",
                  position: "absolute",
                  width: "300px",
                  height: "400px",
                  backgroundColor: "black",
                  display: `${onView ? "flex" : "none"}`,
                  flexDirection: "column",
                  border: "1px solid #f6bf0a",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    fontSize: "1rem",
                    borderBottom: "1px solid #f6bf0a",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  LIST
                </div>
                <div style={{ flex: 10, width: "100%" }}></div>
              </div>
              <div className={myStyle.count}>
                {CountCard("BATCH 생산량", "-", "#8c53ac", "", "")}
                {CountCard("설비속도", selectedData?.real?.rtrSpeed?.toFixed(1), "#227A7D", "", selectedData?.real?.rtrSpeed ? "m/min":"")}
                {/* { selectedData.real.collectionType === "RTRWet" || "NormalWet" ? CountCard("BATCH 생산량", "-", "#8c53ac", "", "") : CountCard("예상 생산량", "-", "#227A7D", "", "")}
                { selectedData.real.collectionType === "RTRWet" || "NormalWet" ? CountCard("설비속도", selectedData?.real?.rtrSpeed, "#227A7D", "", selectedData?.real?.rtrSpeed ? "m/min":"") :  CountCard("BATCH 생산량", "-", "#8c53ac", "", "") } */}
              </div>
              <div className={myStyle.count}>
                {CountCard(
                  "시간 가동률",
                  `${
                    selectedData?.real?.timeRate
                      ? selectedData?.real?.timeRate?.toFixed(0)
                      : 0
                  } %`,
                  "#FFBDFF"
                )}
                {CountCard("성능 가동률", "-", "#00C9EC")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmLayout;

const ItemCard = (item: any, key: number) => {
  return (
    <div key={key} className={myStyle.alarmItem}>
      <div
        style={{
          border: "1px solid #033f3b",
          backgroundColor: "#033f3b1a",
          borderRadius: "10px",
          padding: "5px",
        }}
      >
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
              width: "100%",
              display: "flex",
              paddingLeft: "0.5rem",
              fontSize: "1.4rem",
            }}
          >
            {item?.param_name}
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: 1,
                fontSize: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <div>
                    발생시간
                     {item?.end}
                  </div> */}
                <div>{item?.start}</div>
                {/* <div>
                    {item?.end}
                  </div> */}
              </div>
              <div>( ~ {item?.second ? item?.second.toFixed(0) : 0}초)</div>
            </div>
            <div
              style={{
                flex: 2.1,
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  fontSize: "1.2rem",
                }}
              >
                <div>하한</div>
                <div>상한</div>
                <div>측정값</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  fontSize: "1.4rem",
                }}
              >
                <div>{item?.lcl}</div>
                <div>{item?.ucl}</div>
                {/* <div style={{color:item?.ucl < item?.eqp_avg_val ? "#ff6666" : 'blue'}}>{item?.eqp_avg_val.toFixed(1)}</div> */}
                <div
                  style={{
                    color:
                      item?.ucl < item?.eqp_avg_val ? "#6666ff" : "#ff6666",
                  }}
                >
                  {item?.eqp_avg_val.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//건조온도
//77.000    84.222222  	83.000
//2023-07-16 17:16:50.987	2023-07-16 17:28:22.110
// param_name   //이름
// ucl          //상한
// eqp_avg_val  //평균값
// lcl          //하한
// eqp_min_dt   //시작시간
// eqp_max_dt   //끝시간

// eqp_max_val
// eqp_min_val

const CountCard = (
  title: string,
  value: any,
  bgcolor: string,
  fontColor?: string,
  unit?: string
) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "#f2f2f2",
        border: "1px solid #838383",
        // margin: "0 5px 0 0",
        width: "49%",
        height: "100px",
      }}
    >
      <div
        style={{
          flex: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          fontSize: "2.4rem",
        }}
      >
        <div>{value}</div>
        <div
          style={{
            fontSize: "25px",
            display: "flex",
            justifyItems: "flex-end",
          }}
        >
          {unit}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `${bgcolor}`,
          color: `${fontColor ? fontColor : null}`,
          fontSize: "1.6rem",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
    </div>
  );
};
