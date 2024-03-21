import React from "react";
import { Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

const Matrix4Unit = (props: any) => {
  const { eqpTypes } = useParams();

  const oeeSeries = [props.oeeVal];
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

  const stSeries = [props.stVal];
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
              return props.stPer;
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

  return (
    <>
      <Row style={{ height: "10%" }}>
        <Col>
          <div className="dark-title">{props.title}</div>
        </Col>
      </Row>
      <Row style={{ height: "94%" }}>
        <Col md={10} style={{ height: "100%" }}>
          <Row style={{ height: "50%" }}>
            <Col md={7} style={{ height: "100%" }}>
              <div className="dark-card" style={{ height: "95%" }}>
                <div className="dark-body">
                  <div className="eqp-item eqp-up">#01</div>
                  <div className="eqp-item eqp-up">#02</div>
                  <div className="eqp-item eqp-up">#03</div>
                  <div className="eqp-item eqp-down">#04</div>
                </div>
              </div>
            </Col>
            <Col md={5} style={{ height: "100%" }}>
              <Row style={{ height: "49%" }}>
                <Col md={6} style={{ height: "100%" }}>
                  <div className="dark-card" style={{ height: "90%" }}>
                    <div className="dark-header number-header">생산수량</div>
                    <div
                      className="dark-body number-card"
                      style={{ color: "#2589f6" }}
                    >
                      {props.prodCnt}
                    </div>
                  </div>
                </Col>
                <Col md={6} style={{ height: "100%" }}>
                  <div className="dark-card" style={{ height: "90%" }}>
                    <div className="dark-header number-header">목표수량</div>
                    <div className="dark-body number-card">
                      {props.targetCnt}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ height: "2%" }}></Row>
              <Row style={{ height: "49%" }}>
                <Col md={6} style={{ height: "100%" }}>
                  <div className="dark-card" style={{ height: "90%" }}>
                    <div className="dark-header number-header">가동시간</div>
                    <div
                      className="dark-body number-card"
                      style={{ color: "#f02d9a" }}
                    >
                      {props.runtime}
                    </div>
                  </div>
                </Col>
                <Col md={6} style={{ height: "100%" }}>
                  <div className="dark-card" style={{ height: "90%" }}>
                    <div className="dark-header number-header">계획수량</div>
                    <div className="dark-body number-card">{props.planCnt}</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ height: "45%" }}>
            <Col md={7} style={{ height: "100%" }}>
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
            <Col md={5} style={{ height: "100%" }}>
              <Row style={{ height: "100%" }}>
                <Col md={12} style={{ height: "100%" }}>
                  <div className="dark-card" style={{ height: "100%" }}>
                    <div className="dark-header">ST / OEE Trand</div>
                    <div className="dark-body">
                      <ReactApexChart
                        className="chart-box"
                        options={stRangeOptions}
                        series={stRangeSeries}
                        type="line"
                        height={150}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={2} style={{ height: "100%" }}>
          <div
            className="dark-card"
            style={{
              height: "95%",
              overflowY: "auto",
            }}
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
    </>
  );
};

export default Matrix4Unit;
