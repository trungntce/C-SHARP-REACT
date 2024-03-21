import { Dictionary } from "../../../common/types";
import {
  Row,
  Col,
  Button,
  Input,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import GridBase from "../../../components/Common/Base/GridBase";
import {
  useApi,
  useEditRef,
  useGridRef,
  useSearchRef,
} from "../../../common/hooks";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { takeactionDefs, waterColumnDefs } from "./WaterDefs";
import { useCallback, useEffect, useState } from "react";
import { alertBox } from "../../../components/MessageBox/Alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import myStyle from "./WaterList.module.scss";
import myImage from "../../../assets/water2.png";
import myBg from "../../../assets/bg.png";
import dayjs from "dayjs";
import { TimeFormat } from "../../AnyPage/utills/getTimes";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import api from "../../../common/api";

const WaterList = () => {
  const [searchRef, getSearch] = useSearchRef();
  const [nglistRef, setNgList] = useGridRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("diwater", getSearch, gridRef);

  const [filteredData, setFilteredData] = useState([]);
  const [minData, setMinData] = useState([]);
  const [maxData, setMaxData] = useState([]);
  const [dataFlag, setDataFlag] = useState(false);

  const today = dayjs(new Date()).format("YYYY-MM-DD HH:MM"); // 오늘
  const today2 = dayjs().subtract(5, "minute").format("YYYY-MM-DD HH:MM"); //

  const [stDate, setStDate] = useState(today2);
  const [edDate, setEdDate] = useState(today);
  const [changesList, setChangesList] = useState<any>({});

  const takeActionHandler = () => {
    api("get", "diwater/takeactionlist", {
      fromDt: stDate,
      toDt: edDate,
    }).then((result: Dictionary) => {
      if (result.data) {
        setNgList(result.data);
      }
    });
  };
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data.length > 0) {
      setDataFlag(true);
      let minDataa: any = [];
      let maxDataa: any = [];
      result.data.map((e: any, i: number) => {
        (minDataa[i] = Math.min(...e.map((item: any) => item?.d006))),
          (maxDataa[i] = Math.max(...e.map((item: any) => item?.d006)));
      });
      setMinData(minDataa);
      setMaxData(maxDataa);
      setFilteredData(result.data);
      takeActionHandler();
    }
  };

  const getStDt = (e: any) => {
    setStDate(e.target.value);
  };
  const getEdDt = (e: any) => {
    setEdDate(e.target.value);
  };

  const putIntoList = (data: any) => {
    let startTimeArray: any = [];
    let endTimeArray: any = [];
    if (data?.length > 0) {
      data?.map((e: any, index: any) => {
        if (e?.length > 0) {
          if (e[0]?.d006 < 12) {
            // 첫 시작이 12보다 작으면
            startTimeArray.push({ ...e[0] });
          }
          if (Math.max(...e.map((item: any) => item?.d006)) < 12) {
            // 전체 값이 모두 12보다 작으면
            endTimeArray.push({ ...e[e.length - 1] });
          }
          for (let i = 0; i < e.length; i++) {
            if (i < e.length - 1) {
              if (e[i]?.d006 > 12 && e[i + 1]?.d006 < 12) {
                startTimeArray.push({ ...e[i + 1] });
              }
            }
            if (i > 1) {
              if (e[i - 1]?.d006 < 12 && e[i]?.d006 > 12) {
                endTimeArray.push({ ...e[i - 1] });
              }
            }
          }
        }
      });
      const kData:
        | Dictionary[]
        | {
            eqcode: any;
            d006: string;
            time: string;
            originTime: any;
            originendTime: any;
            maxValue: any;
            minValue: any;
          }[] = [];
      startTimeArray?.map((e: any, i: any) => {
        kData.push({
          eqcode: e.eqcode,
          d006: e?.d006 + "/" + endTimeArray[i]?.d006,
          time: TimeFormat(e?.time) + " ~ " + TimeFormat(endTimeArray[i]?.time),
          // time:
          //   e?.time?.slice(2, 19) + " ~ " + endTimeArray[i]?.time?.slice(2, 19),
          originTime: e?.time,
          originendTime: endTimeArray[i]?.time,
          maxValue: e?.d006,
          minValue: endTimeArray[i]?.d006,
        });
      });
      kData.sort((a, b) => b?.time?.localeCompare(a?.time));

      setList(kData);
      setDataFlag(false);
    }
  };

  useEffect(() => {
    searchHandler();
    takeActionHandler();
  }, []);

  useEffect(() => {
    if (dataFlag) {
      putIntoList(filteredData);
    }
  }, [dataFlag]);

  const tickFormatter = (timeStr: any) => {
    const hour = timeStr.slice(11, 16);
    return hour;
  };

  const RenderDot = (props: any) => {
    const { cx, cy, payload, num } = props;
    //if(minFlag === false){
    if (payload.d006 === minData[num]) {
      return <circle cx={cx} cy={cy} r={5} fill="red" />;
    }
    if (payload.d006 === maxData[num]) {
      return <circle cx={cx} cy={cy} r={5} fill="blue" />;
    }
    // return <circle cx={cx} cy={cy} r={6} fill="#8884d8" />;
    return <circle cx={cx} cy={cy} r={0} fill="#8884d8" />;
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(225,230,230,0.8)",
            //width: "20rem",
            //height: "5rem",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "1rem",
            color: "black",
            borderRadius: "10px",
            padding: "1rem",
            fontWeight: "normal",
          }}
        >
          <div style={{ flex: 1 }}>{`Date : ${TimeFormat(
            payload[0].payload.time
          )}`}</div>
          <div style={{ flex: 1 }}>{`Resist : ${payload[0].value}`} MΩ</div>
        </div>
      );
    }

    return null;
  };

  const handleCellValueChanged = useCallback(
    (e: any) => {
      setChangesList({
        ...changesList,
        [e.data["originTime"]]: e.data,
      });
    },
    [changesList]
  );

  const editHandlers = async () => {
    const param: Dictionary = {};
    param.rawJson = JSON.stringify(Object.values(changesList));
    const result = await api<any>("post", "DiWater/downlist", param);
    if (result.data > 0) {
      alertBox("일괄저장이 완료되었습니다.");
      searchHandler();
      takeActionHandler();
      setChangesList({});
    }
  };
  return (
    <>
      <ListBase
        folder="INFRA Monitoring"
        title="DI Water"
        postfix="Conductivity 현황 관리"
        icon="bold"
        buttons
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                <Input
                  name="startDt"
                  type="datetime-local"
                  className="form-control"
                  size={5}
                  style={{ width: 190 }}
                  placeholder="시작시간"
                  defaultValue={today2}
                  onChange={getStDt}
                />
              </Col>
              <Col size="auto">
                <Input
                  name="endDt"
                  type="datetime-local"
                  className="form-control"
                  size={5}
                  style={{ width: 190 }}
                  placeholder="종료시간"
                  defaultValue={today}
                  onChange={getEdDt}
                />
              </Col>
              <Col size="auto">
                <Button
                  startIcon={<FileDownloadIcon />}
                  sx={{
                    width: "50%",
                    height: "100%",
                    color: "white",
                    border: "1px solid white",
                  }}
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      `/api/diwater/exportexcel?startDt=${stDate}&endDt=${edDate}&isExcel=true`
                    )
                  }
                >
                  Excel File DownLoad
                </Button>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        {/* /그래프 div/ */}
        <div className={myStyle.graphLayout}>
          {filteredData.map((data: any, i) => (
            <div
              className={myStyle.nemo}
              key={i}
              style={{
                backgroundImage: `url(${myBg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }}
            >
              <div className={myStyle.nemoTitle}>
                MODEL: <>{data[0]?.eqcode}</>
              </div>
              <div className={myStyle.imgTab}>
                {/* <div className={myStyle.text1}>
                  AE-107 | {data[data.length - 1]?.returnResistVal} MΩ
                </div> */}
                <div className={myStyle.text2}>
                  {/* AE-108 | {data[data.length - 1]?.toResistVal} MΩ */}
                  AE-106 | {minData[i] == Infinity ? "" : minData[i]} ~{" "}
                  {maxData[i] == -Infinity ? "" : maxData[i]} MΩ
                </div>
                <img src={myImage} alt="My Image" className={myStyle.image} />
              </div>
              <div className={myStyle.chartTab}>
                <ResponsiveContainer width="98%" height={130}>
                  <LineChart
                    width={500}
                    height={150}
                    data={data}
                    syncId="anyId"
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="time" tickFormatter={tickFormatter} />
                    <YAxis
                      //tick={{ fill: "white" }}
                      label={{ value: "Ω", position: "insideLeft" }}
                      domain={([dataMin, dataMax]) => {
                        const min = dataMin < 0 ? 0 : 0;
                        const max = dataMax > 20 ? 20 : 20;
                        return [min, max];
                      }}
                      type="number"
                    />
                    <Tooltip content={CustomTooltip} />
                    <ReferenceLine y={12} stroke="red" />
                    {/* <ReferenceLine y={20} stroke="rgb(200,120,100)" /> 상한선 제거 - 23.05.19 */}
                    {minData[i] < 12 ? (
                      <ReferenceLine y={minData[i]} stroke="rgb(200,120,100)" />
                    ) : (
                      ""
                    )}
                    {/* <ReferenceLine y={min[i]} stroke="rgb(150,250,150)" /> */}
                    <Line
                      type="monotone"
                      dataKey="d006"
                      //stroke="rgb(100,150,240)"
                      //fill="rgb(100,150,240)"
                      //dot={<RenderDot num={i} />} //최저점
                      dot={false} //최저점
                    />
                    {/* <Brush height={8} /> */}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
        {/* /그리드 div/ */}
        <div className={myStyle.gridLayout}>
          <div style={{ flex: 1 }}>
            <div className={myStyle.lastNemo}>
              <div className={myStyle.modelText}>
                <div>NG 목록 조회</div>
                <div className="d-flex gap-2 justify-content-end">
                  <Button type="button" color="primary" onClick={editHandlers}>
                    <i className="uil uil-pen me-2"></i> 저장
                  </Button>
                </div>
              </div>
              <div style={{ flex: 2, width: "100%", height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={waterColumnDefs}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                  suppressRowClickSelection={true}
                  singleClickEdit={true}
                  stopEditingWhenCellsLoseFocus={true}
                  onCellValueChanged={handleCellValueChanged}
                />
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className={myStyle.lastNemo}>
              <div className={myStyle.modelText}>
                <div>조치 사항 리스트</div>
              </div>
              <div style={{ flex: 2, width: "100%", height: "100%" }}>
                <GridBase
                  ref={nglistRef}
                  columnDefs={takeactionDefs}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                  suppressRowClickSelection={true}
                  singleClickEdit={true}
                  stopEditingWhenCellsLoseFocus={true}
                  onCellValueChanged={handleCellValueChanged}
                />
              </div>
            </div>
          </div>
        </div>
      </ListBase>
    </>
  );
};

export default WaterList;
const testData = [
  [
    {
      time: "2023-05-19 13:00:01.000",
      eqcode: "DiWater#99",
      d006: 12.1,
    },
    {
      time: "2023-05-19 13:01:01.000",
      eqcode: "DiWater#99",
      d006: 11.1,
    },
    {
      time: "2023-05-19 13:02:01.000",
      eqcode: "DiWater#99",
      d006: 11.5,
    },
    {
      time: "2023-05-19 13:03:01.000",
      eqcode: "DiWater#99",
      d006: 12.1,
    },
    {
      time: "2023-05-19 13:04:01.000",
      eqcode: "DiWater#99",
      d006: 12.1,
    },
    {
      time: "2023-05-19 13:05:01.000",
      eqcode: "DiWater#99",
      d006: 10.1,
    },
    {
      time: "2023-05-19 13:06:01.000",
      eqcode: "DiWater#99",
      d006: 11.1,
    },
    {
      time: "2023-05-19 13:07:01.000",
      eqcode: "DiWater#99",
      d006: 12.1,
    },
  ],
];
