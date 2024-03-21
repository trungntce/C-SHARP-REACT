import React, { ChangeEvent, forwardRef, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Label, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { Dictionary } from "../../../common/types";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { executeIdle } from "../../../common/utility";
import api from "../../../common/api";

const ParamChartItemRange = forwardRef((props: any, ref: any) => {  
  const { t } = useTranslation();

  const maxRef = useRef<any>();
  const minRef = useRef<any>();
  const avgRef = useRef<any>();
  const lastRef = useRef<any>();

  const options: any = {
    chart: {
      id: "rawchart-" + props.index,
      type: 'rangeArea',
      animations: {
        speed: 500
      },
      height: 290,
      offsetY: -20,
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: false
        },
      }
    },    
    tooltip: {
      x: {
        formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: any) {
          const rtn = moment(value).format('YYYY-MM-DD HH:mm:ss');
          return rtn;
        }
      }
    },    
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: [0.2, 0.7, 0.2, 0.7, 0.2, 0.7, 0.2, 0.7]
    },
    stroke: {
      curve: 'straight',
      width: [0, 2]
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        formatter: function (val: any) {
          return moment(val).format("HH:mm");
        }
      }      
    },
    yaxis: {
      labels: {
        formatter: function (val: any) {
          if(!val || val == 0)
            return "";

          return val?.toFixed(3);
        }
      },
    },
    legend: {
      show: true,
      position: 'top',
    },
  }

  const rangeOptions: any = { ...options, ...{
    chart: { ...options.chart, ...{type: 'rangeArea'}},
    colors: ['#0099ec', '#0099ec', '#fffa1e', '#fffa1e', '#ff373d', '#ff373d', '#45ff24', '#45ff24'],
  }};

  useImperativeHandle(ref, () => ({ 
    drawChart,
  }));

  const refreshHandler = () => {
    drawChart();
  }

  const deleteHandler = () => {
    props.onDeleteItem && props.onDeleteItem(props.index);
  }

  const series: any[] = [];
  
  const drawChart = () => {
    hideChart();

    executeIdle(async () => {
      const config = props.config;
      const cols = JSON.parse(config.colList);

      const seriesList = [];

      minRef.current.innerHTML = "";
      maxRef.current.innerHTML = "";
      avgRef.current.innerHTML = "";
      lastRef.current.innerHTML = "";

      for(let i = 0; i < cols.length; i++){
        const param = {
          columnName: cols[i].value,
          eqpCode: config.eqpCode,
          fromDt: config.fromDt,
          rawType: config.rawType,
          tableName: cols[i].parent,
          toDt: moment(config.toDt).add(1, "days").format("YYYY-MM-DD"),
        }

        const result = await api<Dictionary[]>("get", "trace/rawcandle", param);
        const list = result.data;

        if(!list?.length)
          continue;

        const serie = list.map(x => { return { y: [x.avgVal], x: new Date(x.inserttime) } });
        const serieMinMax = list.map(x => { return { y: [x.minVal, x.maxVal], x: new Date(x.inserttime) } });
  
        const minList = list.map(x => x.minVal);
        const maxList = list.map(x => x.maxVal);
  
        const min = Math.min(...minList);
        const max = Math.max(...maxList);
        const avg = list.reduce((a, b) => a + b.avgVal, 0) / list.length;
        const last = list[list.length - 1].avgVal;

        rangeOptions.yaxis.min = Math.min(rangeOptions.yaxis.min ?? min, min);
        rangeOptions.yaxis.max = Math.max(rangeOptions.yaxis.max ?? max, max);

        minRef.current.innerHTML += (i > 0 ? " / " : "") + `<span>${rangeOptions.yaxis.min?.toFixed(3)}</span>`;
        maxRef.current.innerHTML += (i > 0 ? " / " : "") + `<span>${rangeOptions.yaxis.max?.toFixed(3)}</span>`;
        avgRef.current.innerHTML += (i > 0 ? " / " : "") + `<span>${avg?.toFixed(3)}</span>`;
        lastRef.current.innerHTML += (i > 0 ? " / " : "") + `<span>${last?.toFixed(3)}</span>`;
        
        seriesList.push({ name: `${cols[i].label} 최소최대`, type: "rangeArea", data: serieMinMax }, { name: `${cols[i].label} 평균`, type: "line", data: serie });
      }

      if(seriesList.length <= 0)
        return;

      ApexCharts.exec("rawchart-" + props.index, "updateOptions", { ...rangeOptions });
      ApexCharts.exec("rawchart-" + props.index, "updateSeries", seriesList);

      showChart();
    });
  } 

  const showChart = () => {
    document.getElementsByClassName(`chart-${props.index}`)[0].classList.remove("display-none");
    document.getElementsByClassName(`spinner-${props.index}`)[0].classList.add("display-none");
  }
  
  const hideChart = () => {
    document.getElementsByClassName(`spinner-${props.index}`)[0].classList.remove("display-none");
    document.getElementsByClassName(`chart-${props.index}`)[0].classList.add("display-none");
  }  

  return (
    <Row style={{ height: "32%" }} className="mb-2">
      <Col md={9} style={{ height: "100%" }}>
        <div className="dark-card" style={{ height: "100%" }}>
          <div className="dark-body center-body" style={{ height: "100%" }}>
            <div className={`spinner-container spinner-${props.index}`}><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
            <div className={`display-none chart-${props.index}`}>
              <ReactApexChart
                options={rangeOptions}
                series={series}
                type="line"
                height={300}
                className="apex-charts"
              />
            </div>
          </div>
        </div>
      </Col>
      <Col md={3} style={{ height: "100%" }}>
        <div className="dark-card" style={{ height: "100%" }}>
          <div className="dark-body center-body" style={{ height: "100%" }}>
            <Row style={{ height: "10%" }}>
              <Col>
                <div className="ps-3">
                  <span className="text-primary">[{props.config.eqpCode}] {props.config.eqpName}</span>{' '}
                </div>                
              </Col>
            </Row>
            <Row className="count-container" style={{ height: "17.5%" }}>
              <Col md={12}>
                <div className="ps-3">
                  최대: <div ref={maxRef}>0</div>  
                </div>
              </Col>
            </Row>
            <Row className="count-container" style={{ height: "17.5%" }}>
              <Col md={12}>
                <div className="ps-3">
                  최소: <div ref={minRef}>0</div>
                </div>
              </Col>
            </Row>
            <Row className="count-container" style={{ height: "17.5%" }}>
              <Col md={12}>
                <div className="ps-3">
                  평균: <div ref={avgRef}>0</div>  
                </div>
              </Col>
            </Row>
            <Row className="count-container" style={{ height: "17.5%" }}>
              <Col md={12}>
                <div className="ps-3">
                  현재값: <div ref={lastRef}>0</div>  
                </div>
              </Col>              
            </Row>
            <Row style={{ height: "20%" }}>
              <Col className="d-flex justify-content-end align-items-center gap-2 pe-3">
                <Button type="submit" color="info" size="sm" onClick={refreshHandler} style={{ height: "27px" }}>
                  <i className="uil uil-refresh me-2"></i> 새로고침
                </Button>
                <Button type="submit" color="dark" size="sm" onClick={deleteHandler} style={{ height: "27px" }}>
                  <i className="uil uil-trash me-2"></i> 삭제
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    </Row>
  );
});

export default ParamChartItemRange;