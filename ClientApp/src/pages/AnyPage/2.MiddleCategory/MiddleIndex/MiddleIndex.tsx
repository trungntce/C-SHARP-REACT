import { Button, IconButton, Drawer, Typography, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import CustomMui from "../../scss/CustomMui";
import { CalcByEqpType, EquipMentList, EquipStatus } from "../../StateStore/EquipMentList";
import CstAggird from "../Components/CstAggird/CstAggird";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InputIcon from "@mui/icons-material/Input";
import { MiddleIndexDefs } from "./MiddleIndexDefs";
import myStyle from "./MiddleIndex.module.scss";
import DrawerPage from "../Components/DrawerPage/DrawerPage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMap } from "../../../../common/utility";
import { AgGridReact } from "ag-grid-react";
import api from "../../../../common/api";
import WestIcon from "@mui/icons-material/West";
import RoomEquip from "./RoomEquip/RoomEquip";
import { Dictionary } from "../../../../common/types";
import { isFail, isNext, isNg, isRun, isWait } from "../../../IOC/Overview";
import StatusCheck from "../../StatusCheck";


const MiddleIndex = () => {
  const { facno, roomname } = useParams();

  const [roomList, setRoomList] = useState<any[]>([]);

  const [eqpList, setEqpList] = useRecoilState(EquipStatus);
  const CalcByEqpTypeList = useRecoilValue(CalcByEqpType);


  const nav = useNavigate();
  const location = useLocation();

  const gridRef = useRef<AgGridReact>(null);

  const [rowData, setRowData] = useState<any[]>([]);

  const [statusCnt, SetStatusCnt] = useState<{ [key: string]: any }>({
    totol: 0,
    run: 0,
    wait: 0,
    fail: 0,
    ng: 0,
    next: "dev",
  });

  const [fill, setfill] = useState<Dictionary[]>([]);

  useEffect(() => {
    const totalData = [...eqpList]?.filter(
      (f: any) => f.facNo === facno && f.roomName === roomname
    );

    const reduceArra = [...totalData].reduce((pre: any, cur: any) => {
      pre[cur.eqpType]
        ? pre[cur.eqpType].push(cur)
        : (pre[cur.eqpType] = [cur]);
      return pre;
    }, {});

    setfill(reduceArra);

    // 가동 설비 중 가동
    const runList = eqpList.filter(
      (x: Dictionary) => x.roomName === roomname && isRun(x)
    );
    // 가동 설비 중 비가동
    const waitList = eqpList.filter(
      (x: Dictionary) => x.roomName === roomname && isWait(x)
    );
    // 미사용 리스트
    const failList = eqpList.filter(
      (x: Dictionary) => x.roomName === roomname && isFail(x)
    );
    // 고장리스트
    const ngList = eqpList.filter(
      (x: Dictionary) => x.roomName === roomname && isNg(x)
    );
    // 2차이후 리스트
    const nextList = eqpList.filter(
      (x: Dictionary) => x.roomName === roomname && isNext(x)
    );

    SetStatusCnt({
      totol: [...totalData].length,
      run: runList.length,
      wait: waitList.length,
      fail: failList.length,
      ng: ngList.length,
      next: nextList.length,
    });

    const res = async () => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/eqptypestatistics",
        {
          roomname,
        }
      );
      if (data) {
        setRowData(data);
      }
    };

    res();
  }, [eqpList]);

  useEffect(() => {
    getMap("roomlist", facno).then(({ data }: any) => setRoomList(data));
  }, []);

  return (
    <StatusCheck>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div style={{ flex: 3.15 }}>
          <CustomMui>
            <div className={myStyle.layout}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className={myStyle.headerv}>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                      }}
                    >
                      <IconButton
                        onClick={() => nav(`/overview`, { replace: true })}
                        sx={{ color: "white" }}
                      >
                        <WestIcon />
                      </IconButton>
                    </div>
                    {
                      roomList.filter((i: any) => i.value === roomname)[0]
                        ?.label
                    }
                  </div>
                  <div className={myStyle.bodyv}>
                    <div className={myStyle.roomInfo}>
                      <div className={myStyle.roomInfoInnser}>
                        <div
                          style={{
                            gridTemplateRows: `repeat(${Math.round(
                              Object.entries(fill).length / 2
                            )},210px)`,
                          }}
                          className={myStyle.maplayout}
                        >
                          {Object.values(fill).map((i: any) => (
                            <RoomEquip roomfilter={i[0]} alldata={[...i]} />
                          ))}
                        </div>
                        <div className={myStyle.infolayout}>
                          <div className={myStyle.header}>
                            <Typography
                              sx={{
                                fontWeight: "400",
                                fontSize: "2.7rem",
                                letterSpacing: "15px",
                                color: "white",
                              }}
                            >
                              공정정보
                            </Typography>
                          </div>
                          <div className={myStyle.body}>
                            <div
                              style={{
                                flex: 2,
                                display: "flex",
                                flexDirection: "column",
                                fontSize: "1.5rem",
                                letterSpacing: "3px",
                              }}
                            >
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                }}
                              >
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "white",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>* 전체설비 </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {statusCnt.totol}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#7F8487",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>* 대기설비 </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {statusCnt.next}
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                }}
                              >
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#38E54D",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>* 가동중</div>
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {statusCnt.run}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#FFE569",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>* 비가동중 </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {statusCnt.wait}
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                }}
                              >
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#E90064",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>* 설비이상 </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {statusCnt.fail}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#7F8487",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>* 고장 </div>
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {statusCnt.ng}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={myStyle.girdlayout}>
                      <CstAggird
                        ref={gridRef}
                        rowDataProps={CalcByEqpTypeList}
                        columnDefs={MiddleIndexDefs}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomMui>
        </div>
        <div
          style={{
            flex: 1,
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          {AlarmBox(
            "Parameter NG 설비 리스트",
            "8월 오픈 ",
            {
              marginBottom: "5px",
            },
            { backgroundColor: "#ff898980" },
            {}
          )}
          {AlarmBox(
            "고장 설비 리스트",
            "8월 오픈 ",
            {
              marginTop: "5px",
            },
            { backgroundColor: "#717171" },
            {}
          )}
        </div>
      </div>
    </StatusCheck>
  );
};

export default MiddleIndex;

const AlarmBox = (
  header: string,
  contenets: string,
  boxStyle: any,
  headerStyle?: any,
  contentStyle?: any
) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        border: "1px solid gray",
        ...boxStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          minHeight: "55px",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
          color: "black",
          fontWeight: "bold",
          ...headerStyle,
        }}
      >
        {header}
      </div>
      <div
        style={{
          flex: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
          color: "white",
          ...contentStyle,
        }}
      >
        {contenets}
      </div>
    </div>
  );
};

const Card2 = (i: any, onNav: (type: any) => void) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "45%",
        margin: "4px 0px",
        border: "1px solid #9db2bf1a",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.4em",
          width: "100%",
        }}
      >
        {i?.ft_descriptioon}
      </div>
      <div
        style={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.3em",
          width: "100%",
        }}
      >{`S/T : ${i?.st} , CAPA : ${i?.capa}`}</div>
      <Button
        onClick={() => onNav(i.eqp_type)}
        sx={{
          width: "auto",
          borderRadius: "20px",
        }}
        endIcon={<InputIcon />}
      >
        유형 종합
      </Button>
    </div>
  );
};
