import { useCallback, useEffect, useState, useRef } from "react";
import { getMap } from "../../../common/utility";
import ApiLayout from "../../AnyPage/ApiLayout";
import myStyle from "./NewConcept.module.scss";
import StatusLayout from "./StatusLayout";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";

type LayoutPosition = {
  [key: string]: string[];
};

const layoutType3: LayoutPosition = {
  ["topleft"]: ["1013"],
  ["topright"]: ["1008"],
  ["bottomleft"]: ["1015"],
  ["bottomright"]: ["1020"],
};

const NewConceptType3 = () => {
  const [roomList, setRoomList] = useState<any[]>([]);
  useEffect(() => {
    getMap("roomlist").then(({ data }: any) => setRoomList(data));
  }, []);

  const [layout, setlayout] = useState<LayoutPosition>({});

  // const eqpList = useRecoilValue(EquipMentList);
  const eqpList = useRef<any>();

  const onAddHandler = (i: string) => {
    if (Object.keys(layout).length < 4) {
      const generateRandomKey = () => Math.random().toString(36).substring(2);
      setlayout({
        ...layout,
        [generateRandomKey()]: [i],
      });
    }
  };

  const onSubAddhandler = (filter: string, i: any) => {
    if (layout[filter].includes(i)) {
      const fff = layout[filter].filter((a: any) => a !== i);
      if (fff.length === 0) {
        onCancel(filter);
      } else {
        setlayout({
          ...layout,
          [filter]: [...fff],
        });
      }
    } else {
      setlayout({
        ...layout,
        [filter]: [...layout[filter], i],
      });
    }
  };

  const onCancel = useCallback(
    (key: string) => {
      const newObj = { ...layout };
      delete newObj[key];
      setlayout(newObj);
    },
    [layout]
  );
  const [newEqpList, setNewEqpList] = useState<any[]>([]);

  useEffect(() => {
    const Status = async () => {
      const req = await api<Dictionary[]>(
        "get",
        "MonitoringDetail/eqprealstatus",
        {}
      );

      const { data: eqp4mModelList } = await api<Dictionary[]>(
        "get",
        "MonitoringDetail/eqp4mmodel",
        {}
      );

      req.data.forEach((x: any) => {
        const any = eqp4mModelList.find((y) => y.eqpCode == x.eqpCode);
        if (any) {
          x.workorder = any.workorder;
          x.modelName = any.modelName;
        }
      });
      
      if(req.data){
        setNewEqpList(req.data);
        setlayout(layoutType3);
      }
      
    };
    Status();
    const inter = setInterval(() => {
      Status();
    }, 30000)
  }, []);

  return (
    <div className={myStyle.layout}>
      {Object.entries(layout).map((i: any, idx: number) => (
        <StatusLayout
          first={idx === 0 ? true : false}
          filter={i}
          roomList={roomList}
          data={newEqpList
            .map((eqp: any) => (i[1]?.includes(eqp.roomName) ? eqp : null))
            .filter((f: any) => f !== null)}
          onSubAddhandler={onSubAddhandler}
          onCancelHandler={onCancel}
        />
      ))}
    </div>
  );
};

export default NewConceptType3;
