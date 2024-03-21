import { Button, Col, Form, InputGroup, Row } from "reactstrap";
import { useSubmitHandler, useSubmitRef } from "../../../common/hooks";
import IOCMenu from "../../IOC/IOCMenu";
import style from "./ENIGNi.module.scss";
import AutoCombo from "../../../components/Common/AutoCombo";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Dictionary, contentType } from "../../../common/types";
import { useTranslation } from "react-i18next";
import DiNgTable from "./ENIGNgTable/ENIGNiNgTable";
import DiRealChart from "./ENIGNiRealChart/ENIGNiChart";
import { alertBox } from "../../../components/MessageBox/Alert";
import ENIGGrid from "./ENIGNiGrid/ENIGNiChartGrid";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import api from "../../../common/api";
import { downloadFile, yyyymmddhhmmss } from "../../../common/utility";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import moment from "moment";
import DatePicker from "react-datepicker";

const ENIGNi = () => {
  const { t } = useTranslation();

  const [formRef, setForm] = useSubmitRef();

  const [selected, setSelected] = useState(1);

  const [excelInfo,setExcelInfo] = useState<any>({
    eqpCode: "",
    fromDt: moment().add(-3, 'days').toDate(),
    toDt: moment().toDate()
  })

  const colRef = useRef<any>();
  const chartListRef = useRef<any>();
  const ngTableRef = useRef<any>();
  const ngGridRef = useRef<any>();

  const submitHandler = useSubmitHandler(
    (formData: FormData, data: Dictionary) => {
      const newData: Dictionary = {
        ...data,
        fromDt: selected,
      };

      if (newData.eqpCode === "") {
        alertBox("항목을 선택해 주세요.");
        return;
      }

      const items = [...chartListRef.current.getItems()];

      newData.index = items.length;
      newData.lastDt = new Date();
      items.push(newData);

      chartListRef.current.setItems([...items].sort((s: any) => s.index));
      ngTableRef.current.setItems([...items].sort((s: any) => s.index));
      ngGridRef.current.setItems([...items].sort((s: any) => s.index));
    }
  );

  // const excelHandler = async (i:any) => {
  //  const items = [...chartListRef.current.getItems()];
   
  //  const jsonData = JSON.stringify(items);

  //  if([...items].length <= 0) {
  //   alertBox("항목을 추가해 주세요.");
  //   return;
  //  }
  //  const result =  await api<any>("downpost", "enig/exportexcel", {
  //   datalist : jsonData
  //  });

  //  downloadFile(`RawData_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
  // };

  const excelHandler = async (i:any) => {
    if(excelInfo["eqpCode"] === "") {
      alertBox("Please Select a Equipment.");
      return;
    }
    const result =  await api<any>("download", "enig/exportexcel", excelInfo);
 
    downloadFile(`RawData_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
   };

  const updateHandler = (index:number) => {
   const beforeData = chartListRef.current.getItems();

   const afterData = [...beforeData].map((m:any) => {
    if(m["index"] === index){
     return {
      ...m,
      lastDt : new Date()
     }
    }
    return m;
   });

   chartListRef.current.setItems(afterData);
  };

  const deleteHandler = (index: number) => {
    const newChartItem = [...chartListRef.current.getItems()].filter(
      (i: any) => i.index !== index
    );
    const newTableItem = [...ngTableRef.current.getItems()].filter(
      (i: any) => i.index !== index
    );
    const newGrieItem = [...ngGridRef.current.getItems()].filter(
      (i: any) => i.index !== index
    );

    // newChartItem.splice(index, 1);
    // newTableItem.splice(index, 1);
    // newGrieItem.splice(index, 1);

    chartListRef.current.setItems(newChartItem);
    ngTableRef.current.setItems(newTableItem);
    ngGridRef.current.setItems(newGrieItem);
  };

  return (
    <div className={`${style.layout} p-3`}>
      <div className={style.header}>
        <IOCMenu title="Ni석출 정류기" />
      </div>
      <div className={style.body}>
        <div className={style.searchLayout}>
          <Form
            style={{ width: "100%" }}
            innerRef={formRef}
            onSubmit={submitHandler}
          >
            <Row>
              <Col md={9}>
                <Row>
                  <Col style={{ maxWidth: "110px" }}>
                    <Button
                      style={{ width: "100%" }}
                      outline={selected === 31 ? false : true}
                      onClick={() => setSelected(31)}
                    >
                      Month
                    </Button>
                  </Col>
                  <Col style={{ maxWidth: "110px" }}>
                    <Button
                      style={{ width: "100%" }}
                      outline={selected === 7 ? false : true}
                      onClick={() => setSelected(7)}
                    >
                      Week
                    </Button>
                  </Col>
                  <Col style={{ maxWidth: "110px" }}>
                    <Button
                      style={{ width: "100%" }}
                      outline={selected === 1 ? false : true}
                      onClick={() => setSelected(1)}
                    >
                      Day
                    </Button>
                  </Col>
                  <Col style={{ maxWidth: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: "1.2rem",
                      }}
                    >
                      ~
                    </div>
                  </Col>
                  <Col style={{ maxWidth: "120px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        fontSize: "1.2rem",
                        border: "1px solid #888888",
                        color: "#888888",
                        borderRadius: "1.6px",
                      }}
                    >
                      현재 시간
                    </div>
                  </Col>
                  <AutoCombo
                    ref={colRef}
                    name="eqpCode"
                    sx={{ width: "300px" }}
                    placeholder="설비명"
                    mapCode="enigList"
                    value={excelInfo.eqpCode}
                    onChange = {(e:any,value:any)=>setExcelInfo({
                      ...excelInfo,
                      eqpCode:value.value
                    })}
                  />
                  <Col>
                    <Button style={{marginRight:"0.5rem"}} type="submit" color="primary">
                      <i className="uil uil-plus me-2"/> 추가
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col md={3}>
                <Row>
                  <Col className="text-end">
                    <div style={{ width:"100%"}}>
                    <DateTimePicker selected={excelInfo.fromDt} onChange={(e:any)=>setExcelInfo({
                        ...excelInfo,
                        fromDt: e
                      })} name="fromDt" defaultValue={excelInfo.fromDt} placeholderText="조회시작" required={true} />
                    </div>
                  </Col>
                  <Col className="text-end">
                    <div style={{ width:"100%" }}>
                      <DateTimePicker selected={excelInfo.toDt} onChange={(e:any)=>setExcelInfo({
                        ...excelInfo,
                        toDt: e
                      })} name="toDt" defaultValue={excelInfo.toDt} placeholderText="조회종료" required={true} />
                    </div>
                  </Col>
                  <Col  className="text-end">
                    <Button style={{minWidth:"100%"}} color="outline-primary" onClick={(i:any)=> excelHandler(i)}>
                      <i className="mdi mdi-file-excel me-1"/> RawData
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={style.main}>
          <div className={style.totalTable}>
            <div
              style={{
                height: "40px",
                fontSize: "1rem",
                fontWeight: "400",
                letterSpacing: "5px",
                display: "flex",
                alignItems: "center",
                backgroundColor:"#f1efef33",
                paddingLeft:"0.5rem",
                borderRadius:"5px 5px 0px 0px"
              }}
            >
              <FilterNoneIcon sx={{ fontSize: "20px", marginRight: "1rem" }} />
              검색 조건별 NG 발생 현황
            </div>
            <DiNgTable ref={ngTableRef} />
          </div>
          <div style={{ display: "flex", flex: 1.8, gap: "5px" }}>
            <div className={style.realChart}>
              <div
                style={{
                  height: "40px",
                  fontSize: "1rem",
                  fontWeight: "400",
                  letterSpacing: "5px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:"#f1efef33",
                  paddingLeft:"0.5rem",
                  borderRadius:"5px 5px 0px 0px"
                }}
              >
                <FilterNoneIcon
                  sx={{ fontSize: "20px", marginRight: "1rem" }}
                />
                검색 조건별 데이터 트랜드
              </div>
              <div
                style={{
                  border: "1px solid #68686e",
                  width: "100%",
                  height: "100%",
                }}
              >
                <DiRealChart ref={chartListRef} deleteHandler={deleteHandler} updateHandle={updateHandler} />
              </div>
            </div>
            <div className={style.writeAction}>
              <div
                style={{
                  height: "40px",
                  fontSize: "1rem",
                  fontWeight: "400",
                  letterSpacing: "5px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:"#f1efef33",
                  paddingLeft:"0.5rem",
                  borderRadius:"5px 5px 0px 0px"
                }}
              >
                <FilterNoneIcon
                  sx={{ fontSize: "20px", marginRight: "1rem" }}
                />
                NG 발생 리스트
              </div>
              <ENIGGrid ref={ngGridRef} />
              <div style={{flex:1,display:"flex",justifyContent:"flex-end",paddingTop:"5px"}}>
                <Button style={{width:"100px"}} onClick={async()=>{
                  if(ngGridRef.current.getChangeList().length > 0){
                    const {data} = await api<any>("post","enig/ttt",{
                      rawJson : JSON.stringify(ngGridRef.current.getChangeList())
                    });
                    if(data > 0){
                      ngGridRef.current.setList();
                    }
                  }
                }
                 }>
                    저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ENIGNi;
