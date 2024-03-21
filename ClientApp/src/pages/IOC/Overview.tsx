import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import myStyle from "./OvewviewTile.module.scss";
import api from "../../common/api";
import { executeIdle, isNumber } from "../../common/utility";
import { Dictionary } from "../../common/types";
import OverviewMapTile from "./OverviewMapTile";
import NgList from "./NgList";
import IOCMenu from "./IOCMenu";
import moment from "moment";

// 가동
export const isRun = (x: Dictionary) =>
  x.step == "1" && x.eqpStatus == "O" && x.status != "X";
// 비가동
export const isWait = (x: Dictionary) =>
  x.step == "1" && x.eqpStatus == "O" && x.status == "X";
// 고장
export const isFail = (x: Dictionary) => x.step == "1" && x.eqpStatus == "F";
// 이상
export const isNg = (x: Dictionary) => false;
// 2차
export const isNext = (x: Dictionary) => x.step != "1";

const Overview = (props: any) => {
  const { eqpTypes } = useParams();

  const [time, setTime] = useState<string>("");

  const totalCntRef = useRef<any>(0);
  const runCntRef = useRef<any>(0);
  const waitCntRef = useRef<any>(0);
  const failCntRef = useRef<any>(0);
  const ngCntRef = useRef<any>(0);
  const nextCntRef = useRef<any>(0);

  const overviewMapRef = useRef<any>();
  const ngListRef = useRef<any>();

  const runSeries = [95];
  const runOptions = {
    chart: {
      id: "runChart",
      offsetY: -40,
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "55%",
        },
        offsetY: 0,
        track: {
          background: "#000",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: !0,
            top: 2,
            left: 0,
            color: "#000",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: !0,
            color: "#777",
            fontSize: "11px",
            fontWeight: 200,
            offsetY: 27,
          },
          value: {
            offsetY: -10,
            fontSize: "28px",
            color: "#fff",
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        inverseColors: !0,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    labels: ["RUNNING RATE"],
  };

  const runCntSeries = [95];
  const runCntLabel = useRef<string>("95");
  const runCntOptions = {
    chart: {
      id: "runCntChart",
      offsetY: -40,
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        track: {
          background: "#000",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: !0,
            top: 2,
            left: 0,
            color: "#000",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: !0,
            color: "#777",
            fontSize: "11px",
            fontWeight: 200,
            offsetY: 27,
          },
          value: {
            formatter: function (val: any) {
              return runCntLabel.current;
            },
            offsetY: -10,
            fontSize: "25px",
            color: "#fff",
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#f02d9a", "#2589f6"],
        inverseColors: !0,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      dashArray: 4,
    },
    labels: ["RUNNING COUNT"],
  };

  const room = {
    series: [
      {
        name: "RUN",
        data: [] as any[],
      },
      {
        name: "WARNING",
        data: [] as any[],
      },
      {
        name: "DOWN",
        data: [] as any[],
      },
    ],
    options: {
      colors: ["#00E396", "#F9CE1D", "#555"],
      chart: {
        id: "roomChart",
        type: "bar",
        offsetY: -28,
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "#999",
        row: {
          colors: ["#555", "transparent"],
          opacity: 0.2,
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [] as any[],
        labels: {
          show: true,
          style: {
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Equipment Count",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.2,
          gradientFromColors: ["#fff"],
          inverseColors: !0,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
    },
  };

  const searchHandler = async () => {
    const { data: filterList } = await api<Dictionary[]>(
      "get",
      "MonitoringDetail/filter",
      { ftType: "roomname" }
    );

    const { data: list } = await api<Dictionary[]>(
      "get",
      "MonitoringDetail/eqprealstatus",
      {}
    );

    const { data: eqp4mModelList } = await api<Dictionary[]>(
      "get",
      "MonitoringDetail/eqp4mmodel",
      {}
    );

    if (list) {
      list.forEach((x : any) => {
        const any = eqp4mModelList.find((y : any) => y.eqpCode == x.eqpCode);
        if (any) {
          x.workorder = any.workorder;
          x.modelName = any.modelName;
        }
      });

      // 가동 설비 중 가동
      const runList = list.filter((x: Dictionary) => isRun(x));
      // 가동 설비 중 비가동
      const waitList = list.filter((x: Dictionary) => isWait(x));
      // 미사용 리스트
      const failList = list.filter((x: Dictionary) => isFail(x));
      // 고장리스트
      const ngList = list.filter((x: Dictionary) => isNg(x));
      // 2차이후 리스트
      const nextList = list.filter((x: Dictionary) => isNext(x));

      const totalCnt =
        runList.length + waitList.length + failList.length + ngList.length;

      let run = [(runList.length * 100) / totalCnt];
      if (run) run = [Math.round(run[0])];

      let runCnt = [runList.length];
      runCntLabel.current = `${runCnt[0]}/${totalCnt}`;

      const roomSeries = [...room.series];
      let roomOptions = { ...room.options };

      roomSeries[0].data = [];
      roomSeries[1].data = [];
      roomSeries[2].data = [];

      roomOptions.xaxis.categories = [];

      filterList.forEach((x: Dictionary) => {
        const runs = runList.filter((y : any) => y.roomName == x.ftKey);
        const wait = waitList.filter((y : any) => y.roomName == x.ftKey);
        const ngs = ngList.filter((y : any) => y.roomName == x.ftKey);
        const nexts = nextList.filter((y : any) => y.roomName == x.ftKey);

        if (runs.length <= 0 && wait.length <= 0 && ngs.length <= 0) return;

        roomSeries[0].data.push(runs.length);
        roomSeries[1].data.push(wait.length);
        roomSeries[2].data.push(ngs.length);

        roomOptions.xaxis.categories.push(x.ftDescriptioon);
      });

      setTime(`Last Updated: ${moment().format("YYYY-MM-DD HH:mm:ss")}`);

      ngListRef?.current?.setFailItems(failList);

      overviewMapRef.current.setItems(list);

      executeIdle(() => {
        ApexCharts.exec("roomChart", "updateOptions", roomOptions);
        ApexCharts.exec("roomChart", "updateSeries", roomSeries);

        ApexCharts.exec("runChart", "updateSeries", run);
        ApexCharts.exec("runCntChart", "updateSeries", run);

        totalCntRef.current.innerText = totalCnt + nextList.length;
        runCntRef.current.innerText = runList.length;
        waitCntRef.current.innerText = waitList.length;
        failCntRef.current.innerText = failList.length;
        ngCntRef.current.innerText = ngList.length;
        nextCntRef.current.innerText = nextList.length;
      });
    }
  };

  useEffect(() => {
    searchHandler();

    const hadlerInterval = window.setInterval(() => {
      searchHandler();
    }, 30 * 1000);

    window.setTimeout(() => {
      window.location.reload();
    }, 1000 * 60 * 60 * 24);

    return ()=> clearInterval(hadlerInterval);
  }, []);

  return (
    <>
      <div className={`${myStyle.matrix4Container} min-vh-100 p-3`}>
        <Row style={{ height: "76%" }} className="mb-2">
          <Col md={10} style={{ height: "100%" }}>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-header overview-title">
                <IOCMenu title="Overview"></IOCMenu>

                <div className="top-timer">{time}</div>

                <div className="menu-container">
                  {/* <Link to="/overview" className="menu-item">
                    <i className="fa fa-home"></i>{' '}
                    Home
                  </Link>
                  <Link to="/overview" className="menu-item">
                    <i className="fa fa-inbox"></i>{' '}
                    Matrix1
                  </Link> */}
                </div>
                <div className="badge-container">
                  <span className="badge layer-eqp-total">전체</span>
                  <label className="form-label" ref={totalCntRef}>
                    0
                  </label>
                  <span className="badge layer-eqp-run">가동</span>
                  <label className="form-label" ref={runCntRef}>
                    0
                  </label>
                  <span className="badge layer-eqp-wait">비가동</span>
                  <label className="form-label" ref={waitCntRef}>
                    0
                  </label>
                  <span className="badge layer-eqp-fail">고장</span>
                  <label className="form-label" ref={failCntRef}>
                    0
                  </label>
                  <span className="badge layer-eqp-ng">이상</span>
                  <label className="form-label" ref={ngCntRef}>
                    0
                  </label>
                  <span className="badge layer-eqp-nextstep">2차 대기</span>
                  <label className="form-label" ref={nextCntRef}>
                    0
                  </label>
                </div>
              </div>
              <div className="dark-body center-body" style={{ clear: "both" }}>
                <div className="overview-map">
                  <OverviewMapTile ref={overviewMapRef}></OverviewMapTile>
                </div>
              </div>
            </div>
          </Col>
          <Col md={2} style={{ height: "100%" }}>
            <NgList ref={ngListRef}></NgList>
          </Col>
        </Row>
        <Row style={{ height: "24%" }} className="mb-2">
          <Col md={3} style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
              <Col md={6} style={{ height: "100%" }}>
                <div className="dark-card" style={{ height: "100%" }}>
                  <div className="dark-header">전체가동률</div>
                  <div className="dark-body">
                    <ReactApexChart
                      className="chart-box"
                      options={runOptions}
                      series={runSeries}
                      type="radialBar"
                      height={260}
                    />
                  </div>
                </div>
              </Col>
              <Col md={6} style={{ height: "100%" }}>
                <div className="dark-card" style={{ height: "100%" }}>
                  <div className="dark-header">가동대수</div>
                  <div className="dark-body">
                    <ReactApexChart
                      className="chart-box"
                      options={runCntOptions}
                      series={runCntSeries}
                      type="radialBar"
                      height={260}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={9} style={{ height: "100%" }}>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-header">유형별 가동률</div>
              <div className="dark-body">
                <ReactApexChart
                  options={room.options}
                  series={room.series}
                  type="bar"
                  height={215}
                />
              </div>
            </div>
          </Col>
          {/* <Col md={3} style={{ height: "100%" }}>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-header">불량 유형</div>
              <div className="dark-body">
                <ReactApexChart
                  options={defectOptions}
                  series={defectSeries}
                  type="bar"
                  height={215}
                />
              </div>
            </div>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default Overview;
