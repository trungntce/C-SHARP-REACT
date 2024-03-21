import moment from "moment";
import { ChangeEvent, ChangeEventHandler, forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Table, UncontrolledTooltip, Spinner } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import api from "../../../../common/api";
import ReactApexChart from "react-apexcharts";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showLoading } from "../../../../common/utility";
import { useTranslation } from "react-i18next";

const ChartRange = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const spinnerRef = useRef<any>();

  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      id: `paramChart-${props.id}`,
      height: 320,
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
      }
    ]
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
      type: 'category'
    },
    yaxis: {
      labels: {
        formatter: function (val: any) {
          if(!val || val == 0)
            return "";

          return val?.toFixed(1);
        }
      },
    },
    noData: {
      text: "Select Panel",
    }
  });

  const resetChart = () => {
    options.annotations.yaxis[0].y = 0;
    options.annotations.yaxis[1].y = 0;
    options.annotations.yaxis[2].y = 0;
    options.annotations.yaxis[3].y = 0;

    ApexCharts.exec(`paramChart-${props.id}`, "updateOptions", { ...options });
    ApexCharts.exec(`paramChart-${props.id}`, "updateSeries", 
      [
        { type: "rangeArea", data: [{ x: 0, y: 0 }], name: `${t("@COL_MIN")}~${t("@COL_MAX")}` }, //최소~최대
        { type: "line", data: [{ x: 0, y: 0 }], name: `${t("@COL_AVG")}` } //평균
      ]);
  }

  const setChart = async (row: Dictionary, list: Dictionary[]) => {
    if (list?.length) {
      const serie = list.map(x => { return { y: [x.eqpAvgVal], x: x.paramName } });
      const serieMinMax = list.map(x => { return { y: [x.eqpMinVal, x.eqpMaxVal], x: x.paramName } });
      options.annotations.yaxis[0].y = row.lcl;
      options.annotations.yaxis[1].y = row.ucl;
      options.annotations.yaxis[2].y = row.lsl;
      options.annotations.yaxis[3].y = row.usl;

      const minList = list.map(x => x.eqpMinVal);
      const maxList = list.map(x => x.eqpMaxVal);

      // const min = Math.min(...[...minList, ...[row.lcl]]);
      // const max = Math.max(...[...maxList, ...[row.ucl]]);
      const min = Math.min(...[...minList, ...[row.lsl]]);
      const max = Math.max(...[...maxList, ...[row.usl]]);

      let diff = max - min;
      
      if(!diff)
        diff = max;

      options.yaxis.min = min - (diff * 0.1);
      options.yaxis.max = max + (diff * 0.1);

      ApexCharts.exec(`paramChart-${props.id}`, "updateOptions", { ...options });
      ApexCharts.exec(`paramChart-${props.id}`, "updateSeries", 
        [
          { type: "rangeArea", data: serieMinMax, name: `${t("@COL_MIN")}~${t("@COL_MAX")}` }, //최소~최대
          { type: "line", data: serie, name: `${t("@COL_AVG")}` }  //평균
        ]);
    } else {
      alertBox("조회된 데이터가 없습니다.");
    }

    spinnerRef.current.style.display = "none";
  };

  useImperativeHandle(ref, () => ({
    resetChart,
    setChart,
    showLoading: (isShow: boolean) => {
      spinnerRef.current.style.display = isShow ? "block" : "none";
    }
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
        height={320}
        className="apex-charts"
      />
    </>
  );
});

export default ChartRange;
