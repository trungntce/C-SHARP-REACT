import { Button, Col, Row } from "reactstrap";
import style from "./DiRealChart.module.scss";
import useRangeData from "../../utills/useRangData";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dictionary } from "../../../../common/types";
import LineGraph from "../LineGraph";

interface Props {
  deleteHandler: (index: number) => void;
  updateHandle: (index:number) => void;
}

const DiRealChart = forwardRef(({ deleteHandler,updateHandle }: Props, ref: any) => {
  const [items, setItems] = useState<Dictionary[]>([]);

  const linegraphRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    setItems,
    getItems: () => items,
  }));

  useEffect(()=>{
    console.log()
  },[items])
  return (
    <div className={style.layout}>
      <div className={style.graphLayout}>
        <div className={style.graphInner}>
          {[...items].map((e: any, idx: number) => (
            <LineGraph
              ref={linegraphRef}
              searchData={e}
              updateHandle={updateHandle}
              deleteHandler={deleteHandler}
              idx={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
export default DiRealChart;
