import myStyle from "./ProductionStatus.module.scss";
import { toComma } from "../../utills/toComma";
import CustomLine from "../Components/CustomLine";
import CustomPie from "../Components/CustomPie";
import { useRecoilValue } from "recoil";
import { LayoutOptionState } from "../../StateStore/LayoutOption";
import LinkBox from "../Components/LinkBox/LinkBox";
import { useParams } from "react-router-dom";
import CustomSTLine from "../Components/CustomSTLine";
import api from "../../../../common/api";
import { useEffect, useState } from "react";
import CstBarChart from "../Components/CstBarChart/CstBarChart";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { dateFormat } from "../../../../common/utility";
import { TimeStatus } from "../../StateStore/EquipMentList";

interface Props {
  data: any;
}

const ProductionStatus = ({ data }: Props) => {
  const { roomname, eqp } = useParams();

  const [lotNo, setLotNo] = useState<any>({});
  const TimeStautusList = useRecoilValue(TimeStatus)

  useEffect(() => {
    const tttt = async () => {
      const { data: form } = await api<any>(
        "get",
        "MonitoringDetail/eqp4mmodel",
        {}
      );
      if (form) {
        const filter = [...form].filter((f: any) => f.eqpCode === eqp);
        setLotNo(filter[0]);
      }
    };
    tttt();
  }, [data]);

  const [showModal, setShowModal] = useState(false);

  return (
    <div className={myStyle.layout}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          color: "thistle",
          fontSize: "1.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          BATCH_No :{" "}
          </div>
          <div
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {lotNo?.workorder}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            순번 :{" "}
          </div>
          <div
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {lotNo?.operSeqNo}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            작업공정명 :{" "}
          </div>
          <div
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {lotNo?.operationDescription}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            모델명 :{" "}
          </div>
          <div
            style={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {lotNo?.modelName}
          </div>
        </div>
      </div>
      <div className={myStyle.chart}>
        {"y" === "y" ? (
          <div className={myStyle.pieChart}>
            <div className={myStyle.tip}>
              {pieTip("70% 미만", "#e63404")}
              {pieTip("70% 이상", "#e6a304")}
              {pieTip("85% 이상", "#B5F10E")}
            </div>
            <div className={myStyle.pie}>
              <CustomPie oeeValue={data?.real?.timeRate || 0} />
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LinkBox
              title={"Day-Week-Month 기간별 현황 그래프 조회"}
              equipName={data?.real?.eqpCode}
            />
          </div>
        )}

        <div className={myStyle.chart}>
          {"y" === "y" ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomLine
                dataArr={[
                  ...data?.tar,
                  {
                    eqp_code: 0,
                    mes_date: new Date(),
                    perfor_rate_later: data?.real?.perforRate,
                    st: 0,
                    time_rate: data?.real?.timeRate,
                  },
                ]}
              />
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LinkBox
                title={"Day-Week-Month 기간별 현황 그래프 조회"}
                equipName={data?.real?.eqpCode}
              />
            </div>
          )}
          <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <CstBarChart dataArr={[]} /> */}
              {/* <CustomSTLine
                defaultSt={data?.real?.defaultSt}
                dataArr={data?.tar}
              /> */}
              <CustomSTLine
                defaultSt={data?.real?.defaultSt}
                dataArr={[]}
              />
            </div>
        </div>
      </div>
        <div className={myStyle.timelayout}>
          <div className={myStyle.st}>
            {TimeCard("제조 S/T", "-", "#F73D93cc", "")}
            {TimeCard("모델 S/T", data?.real?.st ? (data?.real?.st).toFixed(1) : "0", "#8EA7E9cc", "s")}
            {TimeCard(
              "실시간 S/T",
              data?.real?.realSt ? (data?.real?.realSt).toFixed(1) : "0",
              "#93ffd899",
              "s"
            )}
          </div>
          <div className={myStyle.time}>
            {TimeCard("경과시간",`${Math.floor(data?.real?.totalTime / 60)}분`)}
            {TimeCard("가동시간",`${Math.floor((data?.real?.totalTime-data?.real?.offTime) / 60)}분`)}
            <div onClick={()=>setShowModal(true)}>
              {
                TimeCard("비가동시간",`${Math.floor(data?.real?.offTime / 60)}분`)
              }
            </div>
          </div>
      </div>
      <Modal 
        style={{ minWidth: 500 }}
        centered={true}
        isOpen={showModal}>
        <ModalHeader toggle={() => { setShowModal(!showModal) }}>
          비가동시간 List
        </ModalHeader>
        <ModalBody style={{ maxHeight: 400, minHeight:400, overflowY: 'auto' }}>
          <Table  className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{width:'20px'}}>No.</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {[...TimeStautusList]?.map((x:any, i:number)=>{
                return(
                  <tr>
                    <td>{i+1}</td>
                    <td>
                      {dateFormat(x["startDt"])}
                    </td>
                    <td>
                      {dateFormat(x["endDt"])}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductionStatus;



const TimeCard = (
  title: string,
  value: any,
  color: string = "#42464e",
  unit?: string
) => {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #838383",
        color: "#FAF0E4",
        fontSize: "1.6rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color,
          borderRight: "1px solid #838383",
        }}
      >
        {title}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>{value}</div>
        {unit && <div>{unit}</div>}
      </div>
    </div>
  );
};

const pieTip = (text: string, color: string) => {
  return (
    <div
      style={{
        display: "flex",
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        margin: "0px 0.3rem",
      }}
    >
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: `${color}`,
        }}
      />
      <div style={{ color: "white", marginLeft: "0.5rem", fontSize: "17px" }}>
        {text}
      </div>
    </div>
  );
};

const CountCard = (
  title: string,
  value: any,
  bgcolor: string,
  fontColor?: string
) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "#f2f2f2",
        border: "1px solid #838383",
        margin: "0px 5px",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2.2rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `${bgcolor}`,
          color: `${fontColor ? fontColor : null}`,
          fontSize: "1.4rem",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
    </div>
  );
};
