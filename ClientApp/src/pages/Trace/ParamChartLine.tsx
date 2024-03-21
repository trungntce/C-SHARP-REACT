import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const ParamChartLine = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "paramChart",
      height: 350,
      type: 'line',
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
          borderColor: "#ff6700",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#ff6700",
          },
          text: "LCL",
        }
      },
      {
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#ff6700",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#ff6700",
          },
          text: "UCL",
        }
      },
      {
        y: 0,
        borderColor: "#f1532f",
        label: {
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "fff",
            background: "#f34e4e",
          },
          text: "LSL",
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
          text: "USL",
        }
      }]
    },
    colors: ['#008cf4'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: [1]
    },
    stroke: {
      curve: 'straight',
      width: [3]
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
    options.annotations.yaxis[2].y = 0;
    options.annotations.yaxis[3].y = 0;
    setOptions({ ...options });
    setSeries([]);
  }

  const oneDataListOption = (list:any[]):Dictionary => {  // 리스트에 1개 데이터일 경우 x축 표현 옵션
    const stdDt = list[0].inserttime;

    return {
      xaxis: {
        min : new Date(moment(stdDt).add(-12,"hour").format()).getTime(),
        max : new Date(moment(stdDt).add(12,"hour").format()).getTime(),
        labels: {
          format: 'HH mm ss'
        }
      }
    }
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

      const serie = list.map(x => { return { y: [x.startVal], x: moment.utc(x.inserttime) } });
      options.annotations.yaxis[0].y = row.lcl;
      options.annotations.yaxis[1].y = row.ucl;
      options.annotations.yaxis[2].y = row.lsl;
      options.annotations.yaxis[3].y = row.usl;

      const minList = list.map(x => x.startVal);
      const maxList = list.map(x => x.startVal);

      const minlcl = Math.min(...[...minList, ...[row.lcl]]);
      const maxucl = Math.max(...[...maxList, ...[row.ucl]]);

      const min = Math.min(...[...minList, ...[row.lsl]]);
      const max = Math.max(...[...maxList, ...[row.usl]]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      //const oneDataOption = list.length === 1 ? oneDataListOption(list) : {};

      ApexCharts.exec("paramChart", "updateOptions", { ...options });
      ApexCharts.exec("paramChart", "updateSeries", 
        [
          { type: "line", data: serie, name: `[${row.columnName}] ${row.paramName}` }
        ]);
    } else {
      alertBox(t("MSG_NO_SEARCH_DATA")); //조회된 데이터가 없습니다._en
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
        type="line"
        height={350}
        className="apex-charts"
      />
    </>
  );
});

export default ParamChartLine;
