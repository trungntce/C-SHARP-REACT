import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const ParamChartRange = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "paramChart",
      height: 350,
      type: 'rangeArea',
      animations: {
        speed: 500
      },
      toolbar: {
        show: true,
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
    annotations: {
      yaxis: [{
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#f34e4e",
          },
          text: "LCL",
        }
      },
      {
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#f34e4e",
          },
          text: "UCL",
        }
      }]
    },
    colors: ['#33b2df', '#008cf4'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: [0.3, 1]
    },
    stroke: {
      curve: 'straight',
      width: [0, 3]
    },
    legend: {
      show: true,
      position: "top",
      offsetY: 30,
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
    },
    noData: {
      text: "Select Parameter",
    }
  });

  const resetChart = () => {
    options.annotations.yaxis[0].y = 0;
    options.annotations.yaxis[1].y = 0;
    setOptions({ ...options });
    setSeries([]);
  }

  const setChart = async (row: Dictionary) => {
    spinnerRef.current.style.display = "block";

    const param: Dictionary = {};
    param.fromDt = row.fromDt;
    param.toDt = row.toDt || moment().format("YYYY-MM-DDTHH:mm:ss");
    param.rawType = row.rawType;
    param.tableName = row.tableName;
    param.columnName = row.columnName;
    param.eqpCode = row.eqpCode;

    const result = await api<Dictionary[]>("get", "trace/rawcandle", param);

    if (result.data?.length) {
      const list = result.data;

      const serie = list.map(x => { return { y: [x.avgVal], x: moment.utc(x.inserttime) } });
      const serieMinMax = list.map(x => { return { y: [x.minVal, x.maxVal], x: moment.utc(x.inserttime) } });
      options.annotations.yaxis[0].y = row.lcl;
      options.annotations.yaxis[1].y = row.ucl;

      const minList = list.map(x => x.minVal);
      const maxList = list.map(x => x.maxVal);

      const min = Math.min(...[...minList, ...[row.lcl]]);
      const max = Math.max(...[...maxList, ...[row.ucl]]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec("paramChart", "updateOptions", { ...options });
      ApexCharts.exec("paramChart", "updateSeries", 
        [
          { type: "rangeArea", data: serieMinMax, name: `[${row.columnName}] ${row.paramName} 최소~최대` }, 
          { type: "line", data: serie, name: `[${row.columnName}] ${row.paramName} 평균` }
        ]);
    } else {
      alertBox(t("@MSG_NO_SEARCH_DATA")); //조회된 데이터가 없습니다.
    }

    spinnerRef.current.style.display = "none";
  };

  useImperativeHandle(ref, () => ({
    resetChart,
    setChart
  }));

  useEffect(() => {
  }, []);

  return (
    <>
      <div ref={spinnerRef} className="chart-spinner">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="rangeArea"
        height={350}
        className="apex-charts"
      />
    </>
  );
});

export default ParamChartRange;
