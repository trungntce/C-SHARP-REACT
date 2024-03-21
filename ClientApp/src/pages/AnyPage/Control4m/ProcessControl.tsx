import { CellDoubleClickedEvent, FirstDataRenderedEvent, IRowNode, RowClassParams, RowDataUpdatedEvent, RowHeightParams, RowSelectedEvent } from "ag-grid-community";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import style from "./ProcessControl.module.scss";
import api from "../../../common/api";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useParams } from "react-router";
import { executeIdle, showLoading } from "../../../common/utility";
import { useTranslation } from "react-i18next";
import ControlBase from "./ControlBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import moment from "moment";

const ProcessControl = () => {
  const { t } = useTranslation();

  const [blind, setBlind] = useState<boolean>(true);
  const [cheat, setCheat] = useState<string>("");
  useEffect(() => {
    const a = 'GOD OF 4M'
    if(cheat === a ){
      setBlind(false)
    }
  }, [cheat]);
  const cheatHandler = (e : any) => {
    const a = e.target.value.toUpperCase();
    setCheat(a)
  }



  //진행중인 4m 종료
  const [end4mRef, getEnd4mRef] = useSearchRef();
  const end4mBatchRef = useRef<any>();
  const end4mOperSeqNoRef = useRef<any>();
  const end4mEqpRef = useRef<any>();
  const end4mHandler = async () => {
    const workorder = end4mBatchRef.current.value;
    const operSeqNo = end4mOperSeqNoRef.current.value;
    const eqpCode = end4mEqpRef.current.value;
    confirmBox(`4M 강제 END 확인 [ ${workorder} | ${operSeqNo} | ${eqpCode} ]` , async () => {  //판넬에 대한 인터락을 설정하시겠습니까? : 판넬에 대한 인터락을 해제하시겠습니까?
      const result = await api<any>("get", "/api/datacontrol/end4m", {workorder, operSeqNo, eqpCode});
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE2")); //설정 중 오류가 발생했습니다.
        return;
      }else{
        alertBox(t("@MSG_COMPLETED"));
      }
    }, async () => {
    })

  }
  

  const [endCancel4mRef, getEndCancel4mRef] = useSearchRef();
  const endCancel4mBatchRef = useRef<any>();
  const endCancel4mOperSeqNoRef = useRef<any>();
  const endCancel4mEqpCodeRef = useRef<any>();
  const endCancel4mHandler = () => {
    console.log(end4mBatchRef.current.value)
    const workorder = endCancel4mBatchRef.current.value;
    const operSeqNo = endCancel4mOperSeqNoRef.current.value;
    const eqpCode = endCancel4mEqpCodeRef.current.value;
    confirmBox(`4M 강제 END 취소 확인 [ ${workorder} | ${operSeqNo} | ${eqpCode} ]` , async () => {  //판넬에 대한 인터락을 설정하시겠습니까? : 판넬에 대한 인터락을 해제하시겠습니까?
      const result = await api<any>("get", "/api/datacontrol/endcancel4m", {workorder, operSeqNo, eqpCode});
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE2")); //설정 중 오류가 발생했습니다.
        return;
      }else{
        alertBox(t("@MSG_COMPLETED"));
      }
    }, async () => {
    })
  }

  //4m 삭제
  const [delete4mRef, getDelete4mRef] = useSearchRef();
  const delete4mBatchRef = useRef<any>();
  const delete4mOperSeqNoRef = useRef<any>();
  const delete4mEqpCodeRef = useRef<any>();
  const delete4mHandler = () => {
    console.log(end4mBatchRef.current.value)
    const workorder = delete4mBatchRef.current.value;
    const operSeqNo = delete4mOperSeqNoRef.current.value;
    const eqpCode = delete4mEqpCodeRef.current.value;
    confirmBox(`4M 삭제 확인 [ ${workorder} | ${operSeqNo} | ${eqpCode} ]` , async () => {  //판넬에 대한 인터락을 설정하시겠습니까? : 판넬에 대한 인터락을 해제하시겠습니까?
      const result = await api<any>("get", "/api/datacontrol/delete4m", {workorder, operSeqNo, eqpCode});
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE2")); //설정 중 오류가 발생했습니다.
        return;
      }else{
        alertBox(t("@MSG_COMPLETED"));
      }
    }, async () => {
    })
  }



  const [changeMaterialExpiredRef, getChangeMaterialExpiredRef] = useSearchRef();
  const materialRef = useRef<any>();
  const expiredDtRef = useRef<any>();
  const changeMaterialExpiredHandler = () => {

    const search = getChangeMaterialExpiredRef();
    const material = materialRef.current.value;
    const expiredDt = moment(search["fromDt"]).format("YYYY-MM-DD 00:00:00");
    
    confirmBox(`자재 유수명 강제 변경 확인 [ ${material} | ${expiredDt} ]` , async () => {  //판넬에 대한 인터락을 설정하시겠습니까? : 판넬에 대한 인터락을 해제하시겠습니까?
      const result = await api<any>("get", "/api/datacontrol/changematerialexpired", {material, expiredDt});
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE2")); //설정 중 오류가 발생했습니다.
        return;
      }else{
        alertBox(t("@MSG_COMPLETED"));
      }
    }, async () => {
    })
    
  }

  useEffect(() => {

  }, []);


  return (
    <>
      <>
      {blind ?
        <ListBase
          className={style.traceWrap}
          buttons={[]}
          editHandler={() => {
          }}
        >
        <Row>
          <Col>
            <Input onChange={cheatHandler} name="eqpCode" type="text" className="form-control" placeholder="Need Password" required={false} style={{ minWidth: 200 }}  />
          </Col>
        </Row>
      </ListBase>
      :
      <ListBase
      className={style.traceWrap}
      buttons={[]}
      editHandler={() => {
      }}
     
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
          <Col>
            <Row style={{ height: "50px", width:"100%",  border:"1px solid #bbbbbb", alignItems:"center" , marginBottom:"5px"}}>
              <Col md={7} >
                <ControlBase
                  ref = {end4mRef}
                  searchHandler={() => {end4mHandler()}}
                  title={"진행중 4M 종료"}
                >
                  <Row>
                    <Col>
                      <Input innerRef={end4mBatchRef} name="workorder" type="text" className="form-control" placeholder="BATCH(Workorder)" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                    <Col>
                      <Input innerRef={end4mOperSeqNoRef} name="operSeqNo" type="text" className="form-control" placeholder="공순" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                    <Col>
                      <Input innerRef={end4mEqpRef} name="eqpCode" type="text" className="form-control" placeholder="설비" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                  </Row>
                </ControlBase>
              </Col>
              <Col md={8} >
                
              </Col>
            </Row>


            {/* 종료된 4m 취소 */}
            <Row style={{ height: "50px", width:"100%",  border:"1px solid #bbbbbb", alignItems:"center" , marginBottom:"5px"}}>
              <Col md={7} >
                <ControlBase
                  ref = {endCancel4mRef}
                  searchHandler={() => {endCancel4mHandler()}}
                  title={"4M END 취소"}
                >
                  <Row>
                    <Col>
                      <Input innerRef={endCancel4mBatchRef} name="cancleWorkorder" type="text" className="form-control" placeholder="BATCH(Workorder)" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                    <Col>
                      <Input innerRef={endCancel4mOperSeqNoRef} name="cancleOper" type="text" className="form-control" placeholder="공순" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                    <Col>
                      <Input innerRef={endCancel4mEqpCodeRef} name="cancleEqp" type="text" className="form-control" placeholder="설비코드" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                  </Row>
                </ControlBase>
              </Col>
              <Col md={8} >
                
              </Col>
            </Row>

            <Row style={{ height: "50px", width:"100%",  border:"1px solid #bbbbbb", alignItems:"center" , marginBottom:"5px"}}>
              <Col md={7} >
                <ControlBase
                  ref = {delete4mRef}
                  searchHandler={() => {delete4mHandler()}}
                  title={"4M 삭제"}
                >
                  <Row>
                    <Col>
                      <Input innerRef={delete4mBatchRef} name="cancleWorkorder" type="text" className="form-control" placeholder="BATCH(Workorder)" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                    <Col>
                      <Input innerRef={delete4mOperSeqNoRef} name="cancleOper" type="text" className="form-control" placeholder="공순" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                    <Col>
                      <Input innerRef={delete4mEqpCodeRef} name="cancleEqp" type="text" className="form-control" placeholder="설비코드" required={true} style={{ minWidth: 200 }}  />
                    </Col>
                  </Row>
                </ControlBase>
              </Col>
              <Col md={8} >
                
              </Col>
            </Row>



            <Row style={{ height: "50px", width:"100%",  border:"1px solid #bbbbbb", alignItems:"center" , marginBottom:"5px"}}>
              <Col md={7} >
                <ControlBase
                  ref = {changeMaterialExpiredRef}
                  searchHandler={() => {changeMaterialExpiredHandler()}}
                  title={"유수명 변경"}
                >
                  <Row>
                    <Col>
                      <Input innerRef={materialRef} name="material" type="text" className="form-control" placeholder="Material" required={true} style={{ minWidth: 250 }}  />
                    </Col>
                    <Col>
                    <DateTimePicker ref={expiredDtRef}  name="expiredDt"  placeholderText="조회시작"  dateFormat="yyyy-MM-dd" required={true} />
                    </Col>
                  </Row>
                </ControlBase>
              </Col>
              <Col md={8} >
                
              </Col>
            </Row>
          </Col>
        </Row>
      </ListBase>
      }
      
      </>


    </>
  );
};

export default ProcessControl;
