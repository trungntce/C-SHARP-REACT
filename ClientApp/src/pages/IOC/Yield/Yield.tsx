import  { useRef, useState } from "react";
import myStyle from "./Yield.module.scss";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { aoiListDefs, bbtDefs, diffDefs } from "./YieldDefs";
import { useQuery } from "react-query";
import api from "../../../common/api";
import IOCMenu from "../IOCMenu";
import { useEditRef } from "../../../common/hooks";
import YieldDetail from "./YieldDetail";
import { RowSelectedEvent } from "ag-grid-community";
import { useTranslation } from "react-i18next";

const Yield = () => {
  const { t } = useTranslation();
  const [fqcdiffData, setFqcDiffData] = useState<any[]>([]);
  const [aoiMainData, setAoiMainData] = useState<any[]>([]);
  const [aoiListData, setAoiListData] = useState<any[]>([]);
  const [bbtListData, setBBTListData] = useState<any[]>([]);
  const [aoiMonth, setAoiMonth] = useState("");
  const [aoiWeek, setAoiWeek] = useState("");
  const [aoiDay, setAoiDay] = useState("");
  const [fqcMonth, setFqcMonth] = useState("");
  const [fqcWeek, setFqcWeek] = useState("");
  const [fqcDay, setFqcDay] = useState("");
  const [bbtMonth, setBbtMonth] = useState("");
  const [bbtWeek, setBbtWeek] = useState("");
  const [bbtDay, setBbtDay] = useState("");
  const [editRef, setForm, closeModal] = useEditRef();


  const loadDiffData = async () =>
    await axios.get("/api/monitoringdetail/fqcyielddiff").then((res) => {
      setFqcDiffData(res.data[0]);
      setFqcMonth(res.data[1][0].yieldRate);
      setFqcWeek(res.data[2][0].yieldRate);
      setFqcDay(res.data[3][0].yieldRate);
    });

  const loadBbtData = async () =>
    await axios.get("/api/monitoringdetail/bbtyield").then((res) => {
      setBBTListData(res.data[0]);

      setBbtMonth(res.data[1][0].totalMonthYield);
      setBbtWeek(res.data[1][0].totalWeekYield);
      setBbtDay(res.data[1][0].totalDayYield);
    });
  const { data: diffData } = useQuery("fqcyielddiff", loadDiffData, { refetchInterval: 600000 });
  const { data: bbtData } = useQuery("bbtyield", loadBbtData, { refetchInterval: 600000 });

  const loadAoiData = async () => {
    api<any>("get", "monitoringdetail/aoiyield", {}).then((result) => {
      setAoiMainData(result.data[0]);
      setAoiListData(result.data[1]);
      setAoiMonth(result.data[2][0].rateMonth);
      setAoiWeek(result.data[2][0].rateWeek);
      setAoiDay(result.data[2][0].rateToday);
    });
  };

  const { data: aoiData } = useQuery("aoiyield", loadAoiData, { refetchInterval: 600000 });
  
  const detailAoi = (e: RowSelectedEvent) => {
    // setForm(e.data);
    
  }

  const SimpleBox = (name: any, value: any) => {
    return (
      <div className={myStyle.box}>
        <div className={myStyle.boxName}>{name}</div>
        <div className={myStyle.boxValue}>{value} %</div>
      </div>
    );
  };

  return (
    <>
    <div className={myStyle.background}>
      <div className={myStyle.left}>
        <div className={myStyle.summary}>
          <div className={myStyle.titleBox}>전체 수율(금액)</div>
          {SimpleBox("월간수율", fqcMonth)}
          {SimpleBox("주간수율", fqcWeek)}
          {SimpleBox("금일수율", fqcDay)}
        </div>
        <div className={myStyle.tab}>
          <div className={myStyle.title}>
            <IOCMenu title="Menu"></IOCMenu>
            FQC 수율 현황
          </div>
          <div className={myStyle.grid}>
            <div className="ag-theme-alpine-dark" style={{ height: "100%", width: "100%", fontSize: "14px" }}>
              <AgGridReact rowData={fqcdiffData} columnDefs={diffDefs}></AgGridReact>
            </div>
          </div>
        </div>
      </div>
      <div className={myStyle.right}>
        <div className={myStyle.summary}>
          <div className={myStyle.titleBox}>AOI 수율</div>
          {SimpleBox("월간수율", aoiMonth)}
          {SimpleBox("주간수율", aoiWeek)}
          {SimpleBox("금일수율", aoiDay)}
        </div>
        <div className={myStyle.tab}>
          <div className={myStyle.title}>AOI 수율 현황</div>
          <div className={myStyle.grid}>
            <div className="ag-theme-alpine-dark" style={{ height: "100%", width: "100%", fontSize: "14px" }}>
              <AgGridReact rowData={aoiListData} columnDefs={aoiListDefs} onRowClicked= {(e: RowSelectedEvent) => detailAoi(e)}></AgGridReact>
            </div>
          </div>
        </div>
        {/* <div className={myStyle.right}> */}
        <div className={myStyle.summary}>
          <div className={myStyle.titleBox}>BBT 수율</div>
          {SimpleBox("월간수율", bbtMonth)}
          {SimpleBox("주간수율", bbtWeek)}
          {SimpleBox("금일수율", bbtDay)}
        </div>
        <div className={myStyle.tab}>
          <div className={myStyle.title}>BBT 수율 현황</div>
          <div className={myStyle.grid}>
            <div className="ag-theme-alpine-dark" style={{ height: "100%", width: "100%", fontSize: "14px" }}>
              <AgGridReact rowData={bbtListData} columnDefs={bbtDefs}></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    </div>
    <YieldDetail ref={editRef} />
    </>
  );
};

export default Yield;
