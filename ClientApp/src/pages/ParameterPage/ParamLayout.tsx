import moment from "moment";
import React, { createContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import api from "../../common/api";
import CstAggird from "./Components/CstAggird/CstAggird";
import ParamLineChart from "./Components/ParamLineChart";
import myStyle from "./ParameterPage.module.scss";
import { useParams } from "react-router-dom";
import { getMap } from "../../common/utility";
import { ColDef } from "ag-grid-community";
import { Button, IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ParamEqp, PcEquip } from "./Components/EqpList";

const ParamLayout = () => {
  const [header, setHeader] = useState("Parameter Monitoring");
  const [rowData, setRowData] = useState<any[]>([]);
  const [recentData, setRecentData] = useState<any>();
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [lastDt, setLastDt] = useState<Date | null>();
  const [symbol, setSymbol] = useState<any[]>();
  const [selectedRange, setSelectedRange] = useState("hour");

  const { eqpcode } = useParams();

  function arrayToString(array: any) {
    return array
      .map(function (item: any) {
        if (Array.isArray(item)) {
          return arrayToString(item);
        }
        return item;
      })
      .join(", ");
  }
  useEffect(() => {
    const Header = async () => {
      const { data } = await api<any>("get", "MonitoringParam/header", {
        eqpcode,
      });
      if (data) {
        setHeader(`${data} parameter`);
      }
    };
    const SymbolComment = async () => {
      const { data } = await api<any>("get", "MonitoringParam/symbolcomment", {
        eqpcode,
        column: arrayToString(ParamEqp[eqpcode]).replace(/ /g, ""),
        colltype: PcEquip.includes(eqpcode) ? "pc" : null,
      });
      if (data) {
        setSymbol(data);
        const tt = ParamEqp[eqpcode].map((i: string[]) => i[0]);
        const d: any[] = [...data]
          .map((i: any, idx: number) => {
            if (tt.includes(i.columnname)) {
              return {
                field: i.columnname,
                headerName: i.comment?.indexOf("||")
                  ? i.comment.split("||")[1]
                  : i.comment,
                resizable: true,
              };
            }
            return null;
          })
          .filter((f: any) => f !== null);
        setColumnDefs([
          ...d,
          {
            field: "inserttime",
            headerName: "업데이트시간",
            resizable: true,
            valueFormatter: (e: any) =>
              moment(e.data.inserttime).format("yyyy-MM-DD HH:mm:ss"),
          },
        ]);
      }
    };
    Header();
    SymbolComment();
  }, []);

  const { refetch } = useQuery(
    "getRowData",
    async () => {
      const { data } = await api<any>("get", "MonitoringParam", {
        lastDt,
        eqpcode,
        column: arrayToString(ParamEqp[eqpcode]).replace(/ /g, ""),
        range: selectedRange,
        colltype: PcEquip.includes(eqpcode) ? "pc" : null,
      });
      if ([...data].length > 0) {
        if (rowData.length === 0) {
          let newName = [...data].map((i: any) => {
            return {
              ...i,
              comment: i?.comment?.indexOf("||")
                ? i.comment.split("||")[1]
                : i.comment,
            };
          });
          setRowData(data);
        } else {
          const spliced = rowData.slice(0, rowData.length - [...data].length);
          const merged = [...data, ...spliced];
          setRowData(merged);
        }
        setIsLoading(false);
        setLastDt(data[0]["inserttime"]);
        setRecentData(data[0]);
      }
    },
    {
      refetchInterval: 30000,
    }
  );

  useEffect(() => {
    refetch();
  }, [selectedRange]);

  const colors = ["#B3FFAE", "#548CFF", "#2CD3E1", "#D58BDD", "#FF6D28"];
  return (
    <div className={myStyle.layout}>
      <div className={myStyle.header}>{header}</div>
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "5rem",
          }}
        >
          Loading...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div className={myStyle.menu}>
            <div
              style={{
                flex: 1,
                border: "1px solid yellow",
                display: "flex",
                color: "white",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff6f44d",
                }}
              >
                최신 업데이트
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {moment(recentData?.inserttime).format("yyyy-MM-DD HH:mm:ss")}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                border: "1px solid yellow",
                display: "flex",
                color: "white",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff6f44d",
                }}
              >
                조회 기간
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ height: "60%", margin: "0px 10px" }}
                  variant={selectedRange === "hour" ? "contained" : "outlined"}
                  onClick={() => {
                    setSelectedRange("hour");
                    setLastDt(null);
                    setRowData([]);
                    setIsLoading(true);
                  }}
                >
                  6시간
                </Button>
                <Button
                  sx={{ height: "60%", margin: "0px 10px" }}
                  variant={selectedRange === "day" ? "contained" : "outlined"}
                  onClick={() => {
                    setSelectedRange("day");
                    setLastDt(null);
                    setRowData([]);
                    setIsLoading(true);
                  }}
                >
                  1일
                </Button>
                <Button
                  sx={{ height: "60%", margin: "0px 10px" }}
                  variant={selectedRange === "week" ? "contained" : "outlined"}
                  onClick={() => {
                    setSelectedRange("week");
                    setLastDt(null);
                    setRowData([]);
                    setIsLoading(true);
                  }}
                >
                  1주일
                </Button>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                border: "1px solid yellow",
                display: "flex",
                color: "white",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#fff6f44d",
                }}
              >
                개발중
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  startIcon={<FileDownloadIcon />}
                  sx={{ height: "60%", margin: "0px 10px" }}
                  variant="outlined"
                >
                  File DownLoad
                </Button>
              </div>
            </div>
          </div>
          <div className={myStyle.contents}>
            <div className={myStyle.lineChartLayout}>
              <div className={myStyle.scollLayout}>
                {[...Array(ParamEqp[eqpcode].length)].map(
                  (i: any, idx: number) => (
                    <div className={myStyle.rowBox}>
                      <div className={myStyle.chart}>
                        <ParamLineChart
                          rowData={[...rowData].sort(
                            (a: any, b: any) =>
                              new Date(a.inserttime).getTime() -
                              new Date(b.inserttime).getTime()
                          )}
                          linekey={ParamEqp[eqpcode][idx]}
                          range={selectedRange}
                        />
                      </div>
                      <div className={myStyle.value}>
                        <div className={myStyle.valueheader}>
                          {[...Array(ParamEqp[eqpcode][idx].length)].map(
                            (i: any, sidx: number) => {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent:
                                      sidx % 2 === 0
                                        ? "flex-start"
                                        : "flex-end",
                                    padding:
                                      sidx % 2 === 0
                                        ? "0rem 0rem 0rem 1rem"
                                        : "0rem 1rem 0rem 0rem",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                    color: `${
                                      sidx === ParamEqp[eqpcode][idx].length - 1
                                        ? colors[colors.length - 1]
                                        : colors[sidx]
                                    }`,
                                  }}
                                >
                                  {
                                    symbol?.find(
                                      (f: any) =>
                                        f.columnname ===
                                        ParamEqp[eqpcode][idx][sidx]
                                    )?.comment
                                  }
                                </div>
                              );
                            }
                          )}
                        </div>
                        <div className={myStyle.valuecontents}>
                          {[...Array(ParamEqp[eqpcode][idx].length)].map(
                            (i: any, sidx: number) => {
                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent:
                                      sidx % 2 === 0
                                        ? "flex-start"
                                        : "flex-end",
                                    padding:
                                      sidx % 2 === 0
                                        ? "0rem 0rem 0rem 3rem"
                                        : "0rem 3rem 0rem 0rem",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                    color: `${
                                      sidx === ParamEqp[eqpcode][idx].length - 1
                                        ? colors[colors.length - 1]
                                        : colors[sidx]
                                    }`,
                                  }}
                                >
                                  {recentData[ParamEqp[eqpcode][idx][sidx]]}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={myStyle.gridLayout}>
              <CstAggird rowDataProps={rowData} columnDefs={columnDefs} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ParamLayout;
