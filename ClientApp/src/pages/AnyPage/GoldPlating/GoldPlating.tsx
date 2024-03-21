import React, { useRef, useState, useEffect, useCallback } from "react";
import myStyle from "./GoldPlating.module.scss";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  LineChart,
  TooltipProps,
} from "recharts";
import currentcu from "../../../assets/cu.png";
import current from "../../../assets/current.png";
import ohm from "../../../assets/ohm.png";
import dayjs from "dayjs";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "react-router-dom";
import { GoldPlatingDefs } from "./GoldPlatingDefs";
import { TimeFormat } from "../utills/getTimes";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import api from "../../../common/api";
import { useQuery } from "react-query";
import { alertBox } from "../../../components/MessageBox/Alert";
import { downloadFile, yyyymmddhhmmss } from "../../../common/utility";
import { contentType } from "../../../common/types";
import IOCMenu from "../../IOC/IOCMenu";
import useRangeData from "../utills/useRangData";

const CustomReferenceLineLabel = (props: any) => {
  return (
    <g>
      <text
        x={props.viewBox.x}
        y={props.viewBox.y}
        dy={-10}
        fill={"white"}
        fontSize={"1.4rem"}
      >
        {`${props.value}`}
      </text>
    </g>
  );
};

const LineTimeChart = ({ data, dataKey, syncId }: any) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#dbdfeacc",
            width: "20rem",
            height: "5rem",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "1rem",
            color: "black",
            borderRadius: "10px",
            padding: "1rem",
            fontWeight: "bold",
          }}
        >
          <div style={{ flex: 1 }}>{`UpDate : ${TimeFormat(
            payload[0].payload.updateDt
          )}`}</div>
          <div
            style={{ flex: 1 }}
          >{`Value : ${payload[0].payload.paramValue.toFixed(3)}`}</div>
        </div>
      );
    }

    return null;
  };
  return (
    <ResponsiveContainer width="95%" height="95%">
      <LineChart
        syncId={syncId}
        data={[...data]}
        margin={{ left: 20, right: -30 }}
      >
        <YAxis
          stroke="#ffffff80"
          type="number"
          allowDataOverflow={true}
          orientation="right"
          tickCount={4}
          domain={[0, 30]}
        />
        <XAxis
          stroke="#ffffff80"
          tickCount={5}
          tickFormatter={(e: any) => TimeFormat(e).split(" ")[1]}
          dataKey="updateDt"
        />
        <CartesianGrid strokeDasharray="2" fill="#ffffff1a" />
        <Tooltip content={CustomTooltip} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#83C6FB"
          strokeWidth={2}
          dot={false}
        />
        <ReferenceLine
          strokeWidth={2}
          y={1.1}
          label={{ value: "LCL : 1.1 MΩ", stroke: "#207DFF", dy: -10 }}
          //label={<CustomReferenceLineLabel value={""} stroke="#207DFF" />}
          stroke="#207DFF"
          strokeDasharray="10 5"
        />
        <ReferenceLine
          strokeWidth={2}
          y={1.0}
          label={{ value: "LSL : 1 MΩ", stroke: "#FB3569", dy: 10 }}
          //label={<CustomReferenceLineLabel value={""} stroke="#FB3569" />}
          stroke="#FB3569"
          strokeDasharray="10 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const GoldPlating = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(1);
  //const selectedDate = useRef<number>(1);
  const gridRef = useRef<AgGridReact>(null);

  const [lastDt, setLastDt] = useState<null | string>();
  const [initData, pushData, isSearch] = useRangeData();

  const { refetch } = useQuery(
    "getGoldPlatingData",
    async () => {
      const { data } = await api<any>("get", "monitoringparam/susedi", {
        range: selectedDate,
        lastDt,
        isExcel: false,
      });
      if ([...data].length > 1) {
        const timeList = [...data].map((m: any) =>
          new Date(m["updateDt"]).getTime()
        );
        const _lastDt = timeList.reduce((max: number, cur: number) => {
          return cur > max ? cur : max;
        });
        setLastDt(TimeFormat(new Date(_lastDt)));
        pushData(data);
        setIsLoading(false);
      }
    },
    {
      refetchInterval: 60 * 1000,
    }
  );

  useEffect(() => {
    refetch();
  }, [selectedDate]);

  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox("데이터가 없습니다.");
      return;
    }

    const result = await api<any>("download", "monitoringparam/susedi", {
      range: selectedDate,
      lastDt,
      isExcel: true,
    });

    downloadFile(
      `surface_11015_excel_export_${yyyymmddhhmmss()}.xlsx`,
      contentType.excel,
      [result.data]
    );
  };

  const searchHandler = async (range: number) => {
    setIsLoading(true);
    isSearch(true);
    setSelectedDate(range);
    setLastDt(null);
  };

  return (
    <div className={myStyle.all}>
      <div className={myStyle.header}>
        <IOCMenu title="수세단 DI 비전도도 " />
        <div
          style={{ color: "white", fontSize: "2rem", letterSpacing: "10px" }}
        >
          수세단 DI 비전도도 MONITORING
        </div>
      </div>
      <div className={myStyle.secondHeader}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className={myStyle.holymoly}>조회 기간 : </div>
          <button
            type="button"
            className={
              selectedDate === 1
                ? "btn btn-outline-primary"
                : "btn btn-soft-primary"
            }
            onClick={() => {
              searchHandler(1);
            }}
          >
            DAY
          </button>
          <button
            type="button"
            className={
              selectedDate === 7
                ? "btn btn-outline-primary"
                : "btn btn-soft-primary"
            }
            onClick={() => {
              searchHandler(7);
            }}
          >
            WEEK
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              height: "4rem",
              paddingBottom: "0.5rem",
            }}
          >
            <Button
              startIcon={<FileDownloadIcon />}
              sx={{
                width: "50%",
                height: "34px",
                color: "white",
                border: "1px solid white",
              }}
              variant="outlined"
              onClick={excelHandler}
            >
              File DownLoad
            </Button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className={myStyle.modal}>
          <div className={myStyle.modalContent}>Data Loading...</div>
        </div>
      ) : (
        <>
          <div className={myStyle.body}>
            <div className={myStyle.bodyLeft}>
              <div className={myStyle.row}>
                <div className={myStyle.rowLeft}>
                  <div
                    style={{
                      width: "100%",
                      height: "400px",
                    }}
                  >
                    <LineTimeChart
                      data={[...initData].sort(
                        (a: any, b: any) =>
                          new Date(a.updateDt).getTime() -
                          new Date(b.updateDt).getTime()
                      )}
                      dataKey="paramValue"
                      syncId="any1"
                    />
                  </div>
                </div>
                <div className={myStyle.rowMid}>
                  <MidBox
                    img={ohm}
                    title={"비전도도 ( MΩ )"}
                    num={initData[initData.length - 1]?.paramValue}
                  />
                </div>
              </div>
            </div>
            <div className={myStyle.bodyRight}>
              <div
                className={`ag-theme-alpine-dark ${myStyle.agGridCss}`}
                style={{ height: "100%", width: "100%" }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={initData.reverse()}
                  columnDefs={GoldPlatingDefs}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GoldPlating;

const MidBox = ({ img, title, num }: any) => {
  return (
    <div className={myStyle.midBox}>
      <div className={myStyle.midBoxLeftImg}>
        <img src={img} alt="My SVG" width={"100%"} />
      </div>
      <div className={myStyle.midBoxRight}>
        <div className={myStyle.midBoxRightTitle}>{title}</div>
        <div className={myStyle.midBoxRightNum}>{num}</div>
      </div>
    </div>
  );
};
