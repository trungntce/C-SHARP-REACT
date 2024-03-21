import myStyle from "./InterlockMonitoring.module.scss";
import { Col, Row } from "reactstrap";
import {  useState } from "react";
import CstAggird from "./CstAggird/CstAggird";
import { analysisDefs, IPQCDeffectDefs, parameterDefs, SPCDefs } from "./InterlockMonitoringDefs";
import api from "../../../common/api";
import { useQueries } from "react-query";
import { dateFormat } from "../../../common/utility";
import IOCMenu from "../IOCMenu";
import moment from "moment";

const InterlockMonitoring = () => {

  const [paramData, setparamData] = useState<any[]>([]);
  const [ipqcData, setIpqcData] = useState<any[]>([]);
  const [spcData, setSpcData] = useState<any[]>([]);
  const [analysisData, setAnalysData] = useState<any[]>([]);
  
  var now = new Date();

  var currentDate = dateFormat(new Date());
  var startDt = new Date();

  startDt.setDate(now.getDate() - 1);

  var fromDt = dateFormat(startDt);

  const results = useQueries([
    {
      queryKey: "InterlockMonitering_Param",
      queryFn: async () => {
        const { data } = await api<any>("get", "monitering/param", {
          fromDt: fromDt,
          toDt: currentDate
        });
        setparamData(data);
      },
      refetchInterval: 600000,
    },
    {
      queryKey: "InterlockMonitering_ipqc",
      queryFn: async () => {
        const { data } = await api<any>("get", "monitering/ipqc", {});
        setIpqcData(data);
      },
      refetchInterval: 600000,
    },
    {
      queryKey: "InterlockMonitering_spc",
      queryFn: async () => {
        const { data } = await api<any>("get", "monitering/spc", {});
        setSpcData(data);
      },
      refetchInterval: 600000,
    },
    {
      queryKey: "InterlockMonitering_analysis",
      queryFn: async () => {
        const { data } = await api<any>("get", "monitering/analysis", {});
        setAnalysData(data);
      },
      refetchInterval: 600000,
    },
  ])

  return (
    <>
      <div className={myStyle.mainContainer}>
        <div className={myStyle.leftContainer}>
          <div className={myStyle.monthStackList}>
            <Row style={{ height: "100%" }}>
              <Col style={{height: "calc(100% - 35px)"}}>
                <div className={myStyle.title}>
                  <IOCMenu title="Menu"></IOCMenu>
                  Parameter
                </div>
                <CstAggird
                  rowDataProps={paramData}
                  columnDefs={parameterDefs}
                />
              </Col>
            </Row>
          </div>
          <div className={myStyle.dailyList}>
            <Row style={{ height: "100%" }}>
              <Col style={{height: "calc(100% - 35px)"}}>
                <div className={myStyle.title}>
                    SPC
                </div>
                <CstAggird
                  rowDataProps={spcData}
                  columnDefs={SPCDefs}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className={myStyle.rightContainer}>
          <div className={myStyle.monthStackList}>
            <Row style={{ height: "100%"}}>
              <Col style={{height: "calc(100% - 35px)"}}>
                <div className={myStyle.title}>
                    SPL 검사
                </div>
                <CstAggird
                  rowDataProps={ipqcData}
                  columnDefs={IPQCDeffectDefs}
                />
              </Col>
            </Row>
          </div>
          <div className={myStyle.dailyList}>
          <Row style={{ height: "100%"}}>
              <Col style={{height: "calc(100% - 35px)"}}>
                <div className={myStyle.title}>
                  약품분석
                </div>
                <CstAggird
                  rowDataProps={analysisData}
                  columnDefs={analysisDefs}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )

}

export default InterlockMonitoring;