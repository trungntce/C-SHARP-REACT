import { Table } from "reactstrap";
import style from "./DiNgTable.module.scss";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import StaticTable from "./StaticTable";
import moment from "moment";

type DateType = "day" | "month";

const DiNgTable = forwardRef((props: any, ref: any) => {
  const [items, setItems] = useState<Dictionary[]>([]);

  useImperativeHandle(ref, () => ({
    setItems,
    getItems: () => items,
  }));

  const DateFormat = (d: DateType, diff: number = 0) => {
    if (d === "day") {
      return `${moment().add(diff, "day").format("DD")} 일`;
    } else if (d === "month") {
      return `${moment().add(diff, "month").format("MM")} 월`;
    }
    return "";
  };

  return (
    <div className={style.tableLayout}>
      <Table className="table table-bordered striped" size="md">
        <thead>
          <tr>
            <th style={{minWidth:"10rem"}}>설비명</th>
            <th>{DateFormat("month", -2)}</th>
            <th>{DateFormat("month", -1)}</th>
            <th>{DateFormat("month", 0)}</th>
            <th>{DateFormat("day", -7)}</th>
            <th>{DateFormat("day", -6)}</th>
            <th>{DateFormat("day", -5)}</th>
            <th>{DateFormat("day", -4)}</th>
            <th>{DateFormat("day", -3)}</th>
            <th>{DateFormat("day", -2)}</th>
            <th>{DateFormat("day", -1)}</th>
          </tr>
        </thead>
        {[...items].map((e: any, idx: any) => (
          <StaticTable idx={idx} items={items} searchData={e} />
        ))}
      </Table>
    </div>
  );
});

export default DiNgTable;
