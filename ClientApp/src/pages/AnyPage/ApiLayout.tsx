import React, { useEffect, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import api from "../../common/api";
import { useSetRecoilState } from "recoil";
import { EquipMentList } from "./StateStore/EquipMentList";

interface Props {
  query?: any[];
  children: React.ReactNode;
}

const ApiLayout = ({ children, query }: Props) => {
  const { facno, roomname, eqptype } = useParams();
  const setEqpList = useSetRecoilState(EquipMentList);

  useQueries([
    {
      queryKey: "EquipMentList",
      queryFn: async () => {
        const { data } = await api<any>("get", "MonitoringDetail/eqpreallist", {
          facno: facno,
          roomname,
          eqptype,
        });
        setEqpList(data);
      },
      refetchInterval: 5 * 60 * 1000,
    },
  ]);

  return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
};

export default ApiLayout;
