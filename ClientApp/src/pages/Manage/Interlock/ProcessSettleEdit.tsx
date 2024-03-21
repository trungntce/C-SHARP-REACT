import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import EditBase from "../../../components/Common/Base/EditBase";
import Uploader from "../../../components/Common/Uploader";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { detectStep } from "./PanelInterlockList";
import { useTranslation } from "react-i18next";

const ProcessSettleEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const uploaderRef = useRef<any>();
  const saveRef = useRef<any>();

  const innerRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);

  const initHandler = (formRef: any, init: Dictionary) => {    
    initRow.current = init;
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    if(!listRef.current.length){ // 수정
      const param = {...row};
      param.json = JSON.stringify([{ groupKey: initRow.current?.groupKey }]);
      param.step = initRow.current?.step;
      param.settleYn = 'N'; // 수정시에는 합의 후속 처리 안함

      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE3"), async () => { //합의내용을 저장 하시겠습니까?
          const result = await api<any>("post", "panelinterlock/processsettle", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE6")); //합의내용 저장 중 오류가 발생했습니다.
            return;
          }

          alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };

      if(!param.settleAttach || param.settleAttach == "[]"){
        confirmBox(t("@MSG_ASK_TYPE2"), async () => { //첨부 파일이 없습니다. 이대로 저장 하시겠습니까?
          doSave();
        }, async () => {
        });
      }else{
        doSave();
      }
    }else{
      const param = {...row};
      param.json = JSON.stringify(listRef.current);

      const step = detectStep(listRef.current[0]);
      param.step = step[0];
      param.settleYn = 'Y';

      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE4"), async () => { //합의 하시겠습니까?
          const result = await api<any>("post", "panelinterlock/processsettle", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE7")); //합의 중 오류가 발생했습니다.
            return;
          }

          alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };

      if(!param.settleAttach || param.settleAttach == "[]"){
        confirmBox(t("@MSG_ASK_TYPE2"), async () => { //첨부 파일이 없습니다. 이대로 저장 하시겠습니까?
          doSave();
        }, async () => {
        });
      }else{
        doSave();
      }
    }
  }

  useImperativeHandle(ref, () => ({ 
    setList: (rows: Dictionary[]) => {
      listRef.current = rows;
      if(!rows.length)
        return true;

      const row = rows[0];
      const step = detectStep(rows[0]);

      if(rows.some(x => JSON.stringify(detectStep(x)) != JSON.stringify(step))){
        alertBox(t("@MSG_SAME_PROGRESS_PANEL_POSSIBLE"));  //같은 진행상태의 판넬들만 일괄처리가 가능합니다.
        return false;
      }

      if(step[1] == "COMPLETE"){
        alertBox(t("@COMPLETED_PNL_AGREE_OR_REFUSAL"));  //합의 또는 반려(처리)가 완료된 판넬입니다.
        return false;
      }

      if(step[1] == "SETTLE"){
        alertBox(t("@NOT_PNL_SECOND_JUDGE"));  //2차 판정이 안된 판넬입니다.
        return false;
      }

      if(step[0] == 0){
        alertBox(t("@NOT_JUDGE_PNL"));  //판정이 안된 판넬입니다.
        return false;
      }

      if(step[0] == 1 && rows.some(x => x.judgeCodeFirst != row.judgeCodeFirst)){
        alertBox(t("@CAN_PROCESS_SAME_FIRST_JUDGE"));  //1차 판정이 같은 판넬만 일괄처리가 가능합니다.
        return false;
      }

      if(step[0] == 2 && rows.some(x => x.judgeCodeSecond != row.judgeCodeSecond)){
        alertBox(t("@CAN_PROCESS_SAME_SECOND_JUDGE"));  //2차 판정이 같은 판넬만 일괄처리가 가능합니다.
        return false;
      }

      return true;
    },
    setForm: innerRef.current.setForm,
    setShowModal: innerRef.current.setShowModal
  }));

  useEffect(() => {        
  }, [])

  return (
    <EditBase 
      ref={innerRef}
      header="Panel 합의"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"lg"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button innerRef={saveRef} type="submit" color="primary">
                <i className="uil uil-edit me-2"></i> {`${t("@AGREEMENT")} ${t("@SAVE")}`} {/* 합의 저장 */}
              </Button>
              <Button type="button" color="light" onClick={() => { ref.current.setShowModal(false); }}>
                <i className="uil uil-times me-2"></i> {t("@CLOSE")} {/* 닫기 */}
              </Button>
            </div>
          </Col>
        </Row>
      }
      >
      <Row>
        <Col md={8}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="judgeCode">
              {`${t("@COL_JUDGMENT")}${t("@COL_DIVISION")}`} {/* 판정 구분 */}
            </Label>
            <AutoCombo name="settleCode" placeholder={`${t("@COL_JUDGMENT")}${t("@COL_DIVISION")}`} isLang={true} mapCode="code" category="INTERLOCK_TO_TYPE" disabled={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="settleUser">
              {`${t("@AGREEMENT")} ${t("@PERSONINCHARGE_NAME")}`} {/* 합의 담당자명 */}
            </Label>
            <AutoCombo name="settleUser" placeholder={`${t("@PERSONINCHARGE_NAME")}`} mapCode="user" required={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@ITEM_AGREEMENT_REASON")} {/* 합의사유 */}
            </Label>
            <Input name="settleRemark" type="text" placeholder={t("@ITEM_AGREEMENT_REASON")} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-2">
            <Label className="form-label" htmlFor="files">
              {t("@LABEL_NAME_TYPE1")} {/* 첨부파일 */}
            </Label>
            <Uploader ref={uploaderRef} folder="PanelInterlock" name="settleAttach" tableStyle={{ maxHeight: "140px", overflowY: "auto" }} />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ProcessSettleEdit;
