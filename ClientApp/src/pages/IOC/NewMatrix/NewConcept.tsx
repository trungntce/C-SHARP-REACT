import { useCallback, useEffect, useState, useRef } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { getMap } from "../../../common/utility";
import ApiLayout from "../../AnyPage/ApiLayout";
import { EquipMentList } from "../../AnyPage/StateStore/EquipMentList";
import myStyle from "./NewConcept.module.scss";
import NonLayout from "./NonLayout";
import StatusLayout from "./StatusLayout";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";

type LayoutPosition = {
  [key: string]: string[];
};

const NewConcept = () => {
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

  useEffect(() => {
    const Status = async () => {
      const { data } = await api<Dictionary[]>(
        "get",
        "MonitoringDetail/eqprealstatus",
        {}
      );
      if (data) {
        eqpList.current = data;
      }
    };
    Status();
    window.setInterval(async () => {
      Status();
    }, 5 * 60 * 1000);
  }, []);

  return (
    <ApiLayout>
      <div className={myStyle.layout}>
        {Object.entries(layout).map((i: any, idx: number) => (
          <StatusLayout
            first={idx === 0 ? true : false}
            filter={i}
            roomList={roomList}
            data={eqpList.current
              .map((eqp: any) => (i[1]?.includes(eqp.roomName) ? eqp : null))
              .filter((f: any) => f !== null)}
            onSubAddhandler={onSubAddhandler}
            onCancelHandler={onCancel}
          />
        ))}
        {[...Array(4 - Object.keys(layout).length > 0 ? 1 : 0)].map(() => (
          <NonLayout roomList={roomList} onAddHandler={onAddHandler} />
        ))}
      </div>
    </ApiLayout>
  );
};

export default NewConcept;
