import React from "react";
import { Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import myStyle from "./Matrix4.module.scss";
import overview from "../../assets/images/overview.png";

const Overview = (props: any) => {
  const { eqpTypes } = useParams();

  const oeeSeries = [95];
  const oeeOptions = {
    chart: {
      offsetY: -50,
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
    labels: ["AVERAGE OEE"],
  };

  const stSeries = [87];
  const stOptions = {
    chart: {
      offsetY: -50,
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
              return 15;
            },
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
    labels: ["STANDARD TIME"],
  };

  const stRangeSeries = [
    {
      data: [98, 95, 89, 83, 95, 99, 97],
    },
    {
      data: [14, 11, 16, 12, 17, 13, 12],
    },
  ];
  const stRangeOptions = {
    chart: {
      zoom: {
        enabled: !1,
      },
      toolbar: {
        show: !1,
      },
      color: "#fff",
      offsetY: 0,
    },
    colors: ["#2589f6", "#f02d9a"],
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      show: false,
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: ["01", "01", "02", "03", "04", "05", "06"],
    },
    yaxis: [
      {
        min: 0,
        max: 100,
        tickAmount: 5,
      },
      {
        opposite: true,
        min: 5,
        max: 40,
        tickAmount: 5,
      },
    ],
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: !1,
            },
          },
          legend: {
            show: !1,
          },
        },
      },
    ],
  };

  const defectSeries = [
    {
      name: "Marine Sprite",
      data: [44, 55, 41, 37, 22],
    },
    {
      name: "Striking Calf",
      data: [53, 32, 33, 52, 13],
    },
    {
      name: "Tank Picture",
      data: [12, 17, 11, 9, 15],
    },
    {
      name: "Bucket Slope",
      data: [9, 7, 5, 8, 6],
    },
    {
      name: "Reborn Kid",
      data: [25, 12, 19, 32, 25],
    },
  ];

  const defectOptions = {
    legend: {
      show: false,
    },
    chart: {
      offsetY: -30,
      stacked: !0,
      stackType: "100%",
      toolbar: {
        show: !1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: !0,
      },
    },
    stroke: {
      width: 1,
      colors: ["#000"],
    },
    xaxis: {
      categories: ["06/01", "06/02", "06/03", "06/04", "06/05"],
    },
    grid: {
      show: !1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#038edc", "#51d28c", "#f7cc53", "#f34e4e", "#564ab1"],
  };

  const statusSeries = [
    {
      name: "Income",
      type: "column",
      data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
    },
    {
      name: "Cashflow",
      type: "column",
      data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
    },
    {
      name: "Revenue",
      type: "line",
      data: [20, 29, 37, 36, 44, 45, 50, 58],
    },
  ];

  var statusOptions = {
    legend: {
      show: false,
    },
    chart: {
      offsetY: -15,
      stacked: !1,
      toolbar: {
        show: !1,
      },
    },
    dataLabels: {
      enabled: !1,
    },
    stroke: {
      width: [1, 1, 4],
    },
    xaxis: {
      categories: ["16W", "17W", "18W", "19W", "20W", "21W", "22W", "23W"],
    },
    yaxis: [
      {
        axisTicks: {
          show: !0,
        },
        axisBorder: {
          show: !0,
          color: "#038edc",
        },
        labels: {
          style: {
            colors: "#038edc",
          },
        },
        title: {
          text: "시간가동률",
          style: {
            color: "#038edc",
            fontWeight: 600,
          },
        },
        tooltip: {
          enabled: !0,
        },
      },
      {
        seriesName: "Income",
        opposite: !0,
        axisTicks: {
          show: !0,
        },
        axisBorder: {
          show: !0,
          color: "#038edc",
        },
        labels: {
          style: {
            colors: "#038edc",
          },
        },
      },
      {
        seriesName: "Revenue",
        opposite: !0,
        axisTicks: {
          show: !0,
        },
        axisBorder: {
          show: !0,
          color: "#51d28c",
        },
        labels: {
          style: {
            colors: "#51d28c",
          },
        },
      },
    ],
    grid: {
      show: !1,
    },
    tooltip: {
      fixed: {
        enabled: !0,
        position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
    },
    colors: ["#038edc", "#76d6f4", "#51d28c"],
  };

  return (
    <>
      <div className={`${myStyle.matrix4Container} min-vh-100 p-3`}>
        <Row style={{ height: "76%" }} className="mb-2">
          <Col md={10} style={{ height: "100%" }}>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-header">Overview</div>
              <div className="dark-body center-body">
                <div className="overview-map">
                  <div
                    className="room-layer"
                    style={{
                      top: "43px",
                      left: "510px",
                      width: "61px",
                      height: "265px",
                    }}
                  >
                    LASER
                    <div className="eqp-container">
                      {[...Array(30)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 14 == 0 ? "layer-eqp-fail" : ""
                          } ${i % 17 == 1 ? "layer-eqp-wait" : ""}`}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="room-layer"
                    style={{
                      top: "112px",
                      left: "570px",
                      width: "71px",
                      height: "196px",
                    }}
                  >
                    ROUTER
                    <div className="eqp-container">
                      {[...Array(5)].map((x, i) => (
                        <div
                          className="layer-eqp-item"
                          style={{
                            width: "30px",
                            height: "30px",
                            lineHeight: "23px",
                            fontSize: "15px",
                          }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "43px",
                      left: "671px",
                      width: "67px",
                      height: "265px",
                    }}
                  >
                    IR
                    <div className="eqp-container">
                      {[...Array(3)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 2 == 0 ? "layer-eqp-fail" : ""
                          }`}
                          style={{
                            width: "70px",
                            height: "30px",
                            lineHeight: "23px",
                            fontSize: "15px",
                          }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "43px",
                      left: "737px",
                      width: "197px",
                      height: "265px",
                    }}
                  >
                    표면처리
                    <div className="eqp-container">
                      {[...Array(3)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 3 == 1 ? "layer-eqp-wait" : ""
                          }`}
                          style={{
                            width: "93px",
                            height: "46px",
                            lineHeight: "38px",
                            fontSize: "15px",
                          }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "187px",
                      left: "1169px",
                      width: "83px",
                      height: "121px",
                    }}
                  >
                    HP
                    <div className="eqp-container">
                      {[...Array(5)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 5 == 1 ? "layer-eqp-fail" : ""
                          }`}
                          style={{ width: "36px" }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "153px",
                      left: "1392px",
                      width: "47px",
                      height: "155px",
                    }}
                  >
                    AOI
                    <div className="eqp-container">
                      {[...Array(8)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 3 == 1 ? "layer-eqp-wait" : ""
                          }`}
                          style={{}}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "325px",
                      left: "565px",
                      width: "73px",
                      height: "265px",
                    }}
                  >
                    CNC
                    <div className="eqp-container">
                      {[...Array(7)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i == 6 ? "layer-eqp-fail" : ""
                          }`}
                          style={{ width: "64px", height: "25px" }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "325px",
                      left: "777px",
                      width: "335px",
                      height: "265px",
                    }}
                  >
                    동도금
                    <div className="eqp-container">
                      {[...Array(8)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i == 3 ? "layer-eqp-fail" : ""
                          }`}
                          style={{
                            width: "107px",
                            height: "46px",
                            lineHeight: "38px",
                            fontSize: "15px",
                          }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "325px",
                      left: "1111px",
                      width: "50px",
                      height: "265px",
                    }}
                  >
                    전처리
                    <div className="eqp-container">
                      {[...Array(8)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i == 3 ? "layer-eqp-wait" : ""
                          }`}
                          style={{ width: "40px" }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "325px",
                      left: "1160px",
                      width: "153px",
                      height: "265px",
                    }}
                  >
                    노광
                    <div className="eqp-container">
                      {[...Array(8)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 3 == 1 ? "layer-eqp-wait" : ""
                          }`}
                          style={{
                            width: "71px",
                            height: "40px",
                            fontSize: "15px",
                            lineHeight: "32px",
                          }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="room-layer"
                    style={{
                      top: "325px",
                      left: "1334px",
                      width: "150px",
                      height: "265px",
                    }}
                  >
                    애칭
                    <div className="eqp-container">
                      {[...Array(14)].map((x, i) => (
                        <div
                          className={`layer-eqp-item ${
                            i % 7 == 1 ? "layer-eqp-fail" : ""
                          }`}
                          style={{
                            width: "46px",
                            height: "40px",
                            fontSize: "15px",
                            lineHeight: "32px",
                          }}
                        >
                          {("0" + (i + 1)).slice(-2)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={2} style={{ height: "100%" }}>
            <div
              className="dark-card"
              style={{ height: "100%", overflowY: "auto" }}
            >
              <div className="dark-header number-header">알람 리스트</div>
              <div className="dark-body">
                <div className="alarm-item alarm-eqp">
                  <div className="alarm-header">M-078-01-V018</div>
                  <div className="alarm-body">설비이상 [17:35]</div>
                </div>
                <div className="alarm-item alarm-param">
                  <div className="alarm-header">M-078-01-V018</div>
                  <div className="alarm-body">파라미터이상 [17:35]</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ height: "24%" }} className="mb-2">
          <Col md={3} style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
              <Col md={6} style={{ height: "100%" }}>
                <div className="dark-card" style={{ height: "100%" }}>
                  <div className="dark-header">OEE</div>
                  <div className="dark-body">
                    <ReactApexChart
                      className="chart-box"
                      options={oeeOptions}
                      series={oeeSeries}
                      type="radialBar"
                      height={260}
                    />
                  </div>
                </div>
              </Col>
              <Col md={6} style={{ height: "100%" }}>
                <div className="dark-card" style={{ height: "100%" }}>
                  <div className="dark-header">ST</div>
                  <div className="dark-body">
                    <ReactApexChart
                      className="chart-box"
                      options={stOptions}
                      series={stSeries}
                      type="radialBar"
                      height={260}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={3} style={{ height: "100%" }}>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-header">OEE / ST Trend</div>
              <div className="dark-body">
                <ReactApexChart
                  className="chart-box"
                  options={stRangeOptions}
                  series={stRangeSeries}
                  type="line"
                  height={170}
                />
              </div>
            </div>
          </Col>
          <Col md={3} style={{ height: "100%" }}>
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
          </Col>
          <Col md={3} style={{ height: "100%" }}>
            <div className="dark-card" style={{ height: "100%" }}>
              <div className="dark-header">종합가동률 추이</div>
              <div className="dark-body">
                <ReactApexChart
                  options={statusOptions}
                  series={statusSeries}
                  type="line"
                  height={195}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Overview;
