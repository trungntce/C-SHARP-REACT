import React, { useCallback, useEffect, useState } from "react";
import NoticeList from "../NoticeList/NoticeList";
import myStyle from "./DetailIndex.module.scss";
import AlarmLayout from "../../AlarmLayout/AlarmLayout";
import EquipMain from "../EquipMain/EquipMain";
import EquipList from "../EquipList/EquipList";
import { SearchDate } from "../../utills/getTimes";
import api from "../../../../common/api";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { LayoutOptionState } from "../../StateStore/LayoutOption";
import { useParams } from "react-router-dom";
import TimeTable from "../Components/TimeTable/TimeTable";
import StatusCheck from "../../StatusCheck";
import { EquipStatus } from "../../StateStore/EquipMentList";

const DetailIndex = () => {
  const { facno, roomname, eqptype, eqp } = useParams();

  const [selectedData, setSelectedData] = useState<any>({
    real: {},
    tar: [],
    form: [],
  });

  const SelectItem = useCallback(
    async (item: any) => {
      const { data } = await api<any>(
        "get",
        "MonitoringDetail/detailcontents",
        {
          eqpcode: item?.eqpCode?.toString(),
        }
      );
      setSelectedData({
        ...selectedData,
        real: item,
        tar: data,
      });
    },

    [selectedData]
  );

  return (
    <StatusCheck>
      <div className={myStyle.container}>
        <div style={{ flex: 7, width: "100%", height: "100%" }}>
          <AlarmLayout list={[]} selectedData={selectedData}>
            <div className={myStyle.layout}>
              <div className={myStyle.notice}>
                <NoticeList />
              </div>
              <div className={myStyle.equipment}>
                <div className={myStyle.equipMain}>
                  <div className="d-none d-lg-block" style={{ flex: 1 }}>
                    <EquipList selectFnc={SelectItem} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 2.5,
                    }}
                  >
                    <EquipMain selectedData={selectedData} />
                  </div>
                </div>
              </div>
            </div>
          </AlarmLayout>
        </div>
        <div className={myStyle.timeTable}>
          <TimeTable />
        </div>
      </div>
    </StatusCheck>
  );
};

export default DetailIndex;
