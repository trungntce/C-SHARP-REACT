import { Table } from "reactstrap";
import style from "./DiNgTable.module.scss";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import { getLang } from "../../../../common/utility";

interface Props {
  items: any[];
  searchData: Dictionary;
  idx: number;
}
const StaticTable = ({ items, searchData, idx }: Props) => {
  const [tableData, setTableData] = useState<any[]>([]);

  const getRow = async () => {
    const param = {
      eqpCode: searchData.eqpCode,
      diwater: searchData.diwater
    };
    const data = await api<any>("get", "diwater/getngcountlist",param);
    setTableData(data.data);
  };

  useEffect(() => {
    getRow();
  }, [searchData]);

  const EqpNameFormat = (item:any):string =>{
    const {eqp_name, param_name} = item;

    const test = param_name === "diwater" ? "(비저항)" : param_name === 'input' ? "INPUT (비저항)" : "OUTPUT(전도도)"

    return `${getLang(eqp_name)}${test}`;
  }

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
             {EqpNameFormat(i)}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago2month}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago1month}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.cur_month}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago7day}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago6day}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago5day}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago4day}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago3day}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago2day}
            </th>
            <th
              style={{
                backgroundColor: `${idx % 2 === 0 ? "black" : ""}`,
                textAlign: "end",
              }}
            >
              {i.ago1day}
            </th>
          </tr>
        );
      })}
    </tbody>
  );
};

export default StaticTable;
