import { Table } from "reactstrap";
import style from "./ENIGNiNgTable.module.scss";
import { useEffect, useState } from "react";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";

interface Props {
  items: any[];
  searchData: Dictionary;
  idx: number;
}
const StaticTable = ({ items, searchData, idx }: Props) => {
  const [tableData, setTableData] = useState<any[]>([]);

  const getRow = async () => {
    const para = {
      fromDt: searchData.fromDt,
      eqpCode: searchData.eqpCode,
    };
    const data = await api<any>("get", "enig/getngcountlist", para);
    setTableData(data.data);
  };

  useEffect(() => {
    getRow();
  }, [items]);

  return (
    <tbody>
      {[...tableData].map((i: any, n: number) => {
        return (
          <tr
            style={{
              marginBottom: "0.5rem",
              backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
            }}
          >
            <th
              style={{
                minWidth: "10rem",
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
              }}
            >
              {i.eqpCode}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.twoMonthAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.oneMonthAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.thisMonthAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.sevenDayAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.sixDayAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.fiveDayAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.fourDayAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.threeDayAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.twoDayAgo}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.oneDayAgo}
            </th>
          </tr>
        );
      })}
    </tbody>
  );
};

export default StaticTable;
