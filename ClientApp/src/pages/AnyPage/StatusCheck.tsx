import React, { useEffect, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import api from "../../common/api";
import { useSetRecoilState } from "recoil";
import {
  CalcByEqpType,
  EquipForM,
  EquipMentList,
  EquipStatus,
} from "./StateStore/EquipMentList";
import { Dictionary } from "../../common/types";

interface Props {
  query?: any[];
  children: React.ReactNode;
}

const StatusCheck = ({ children, query }: Props) => {
  const { facno, roomname, eqptype } = useParams();
  const setEqpStatusList = useSetRecoilState(EquipStatus);
  const setEqp4mModelList = useSetRecoilState(EquipForM);
  const setCalcByEqpTypeList = useSetRecoilState(CalcByEqpType);

  useQueries([
    {
      queryKey: "EquipMentStatus",
      queryFn: async () => {
        const { data } = await api<any>("get","MonitoringDetail/eqprealstatus",{});
        const { data: eqp4mModelList } = await api<Dictionary[]>("get","MonitoringDetail/eqp4mmodel",{});

        data.forEach((x: any) => {
          const any = eqp4mModelList.find((y) => y.eqpCode == x.eqpCode);
          if (any) {
            x.workorder = any.workorder;
            x.modelName = any.modelName;
          }
        });

        setEqp4mModelList(eqp4mModelList);
        setEqpStatusList(data);
      },
      refetchInterval: 5 * 60 * 1000,
    },
  ]);

  return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
};

export default StatusCheck;

// 가동
export const isRun = (x: Dictionary) =>
  x.step == "1" && x.eqpStatus == "O" && x.status != "X";
// 비가동
export const isWait = (x: Dictionary) =>
  x.step == "1" && x.eqpStatus == "O" && x.status == "X";
// 고장
export const isFail = (x: Dictionary) => x.step == "1" && x.eqpStatus == "F";
// 이상
export const isNg = (x: Dictionary) => false;
// 2차
export const isNext = (x: Dictionary) => x.step != "1";
