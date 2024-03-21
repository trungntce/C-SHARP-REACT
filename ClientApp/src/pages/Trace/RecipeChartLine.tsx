import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../common/types";
import api from "../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../components/MessageBox/Alert";

const RecipeChartLine = forwardRef((props: any, ref: any) => {
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: "recipeChart",
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
          borderColor: "#f34e4e",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#f34e4e",
          },
          text: "base val",
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
      text: "Select Recipe",
    }
  });

  const resetChart = () => {
    options.annotations.yaxis[0].y = 0;
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

      const serie = list.map(x => { return { y: [x.startVal], x: moment.utc(x.inserttime) } });
      options.annotations.yaxis[0].y = row.baseVal;

      const minList = list.map(x => x.startVal);
      const maxList = list.map(x => x.startVal);

      const min = Math.min(...[...minList, ...[row.baseVal]]);
      const max = Math.max(...[...maxList, ...[row.baseVal]]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec("recipeChart", "updateOptions", { ...options });
      ApexCharts.exec("recipeChart", "updateSeries", 
        [
          { type: "line", data: serie, name: `[${row.columnName}] ${row.recipeName}` }
        ]);
    } else {
      alertBox("조회된 데이터가 없습니다.");
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

export default RecipeChartLine;
