import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import { executeIdle } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import EditBase from "../../../components/Common/Base/EditBase";
import Uploader from "../../../components/Common/Uploader";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { detectStep } from "./PanelInterlockList";
import { useTranslation } from "react-i18next";

const ProcessJudgeEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const uploaderRef = useRef<any>();
  const saveRef = useRef<any>();

  const innerRef = useRef<any>();
  const referenceCodeRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);
  const [judgeCode, setJudgeCode] = useState("");

  const initHandler = (formRef: any, init: Dictionary) => {    
    initRow.current = init;
    setJudgeCode(init.judgeCode);
    
    executeIdle(() => {
      if(init.judgeCode == 'D'){
        referenceCodeRef.current.setMapCode("code");
        referenceCodeRef.current.setCategory("DEFECTREASON");
      }
  
      if(init.judgeCode == 'R'){
        referenceCodeRef.current.setMapCode("code");
        referenceCodeRef.current.setCategory("REWORKREASON");
      }
    });
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    if(!listRef.current.length){
      const param = {...row};
      param.json = JSON.stringify([{ groupKey: initRow.current?.groupKey }]);
      param.step = initRow.current?.step;
  
      const doSave = () => {
        confirmBox(t("@SAVE_JUDGE"), async () => {  //판정을 저장 하시겠습니까?
          const result = await api<any>("post", "panelinterlock/processjudge", param);
          if(result.data && result.data <= 0){
            alertBox(t("@SAVE_ERROR_JUDGE"));  //판정 저장 중 오류가 발생했습니다.
            return;
          }
    
          alertBox(t("@MSG_SAVED")); //저장되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };

      // if(listRef.current[0].gubun == "C-NG"){
      // }  
      if(!param.judgeAttach || param.judgeAttach == "[]"){
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
      param.step = (step[0] as number) + 1;

      const doSave = () => {
        confirmBox(t("@SAVE_JUDGE"), async () => {  //판정을 저장 하시겠습니까?
        
          const result = await api<any>("put", "panelinterlock/process", param);
          if(result.data && result.data <= 0){
            alertBox(t("@SAVE_ERROR_JUDGE"));  //판정 저장 중 오류가 발생했습니다.
            return;
          }
    
          alertBox(t("@MSG_SAVED"));  //저장되었습니다.
      
          props.onComplete();
        }, async () => {
        });   
      };

      // if(listRef.current[0].gubun == "C-NG"){
      // }  
      if(!param.judgeAttach || param.judgeAttach == "[]"){
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
    setList: (rows: Dictionary[], judgeCode: string) => {
      listRef.current = rows;
      if(!rows.length)
        return true;

      const step = detectStep(rows[0]);

      if(rows.some(x => JSON.stringify(detectStep(x)) != JSON.stringify(step))){
        alertBox(t("@MSG_SAME_PROGRESS_PANEL_POSSIBLE")); //같은 진행상태의 판넬들만 일괄처리가 가능합니다.
        return false;
      }

      if(step[1] == "COMPLETE"){
        alertBox(t("@AGREEMENT_COMPLITE_PNL"));  //합의(처리)가 완료된 판넬입니다.
        return false;
      }

      if(step[1] == "JUDGE"){
        alertBox(t("@JUDGE_COMPLITE_PNL"));  //판정이 완료된 판넬입니다.
        return false;
      }

      setJudgeCode(judgeCode);

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
      header="Panel 판정"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"lg"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button innerRef={saveRef} type="submit" color="primary">
                <i className="uil uil-edit me-2"></i> {`${t("@COL_JUDGMENT")}${t("@SAVE")}`}
              </Button>
              <Button type="button" color="light" onClick={() => { ref.current.setShowModal(false); }}>
                <i className="uil uil-times me-2"></i>{t("@CLOSE")} 
              </Button>
            </div>
          </Col>
        </Row>
      }
      >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="judgeCode">
              {`${t("@COL_JUDGMENT")} ${t("@COL_DIVISION")}`}  {/* 판정 구분 */}
            </Label>
            <AutoCombo name="judgeCode" placeholder={`${t("@COL_JUDGMENT")} ${t("@COL_DIVISION")}`} isLang={true} mapCode="code" category="INTERLOCK_TO_TYPE" disabled={true} />
          </div>
        </Col>
        <Col md={5} style={{ display: judgeCode == "U" ? "none" : "" }}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="referenceCode">
              {/* "폐기 구분" : "재처리 구분" */}
              {judgeCode == 'D' ? `${t("@COL_DISPOSAL")} ${t("@COL_DIVISION")}` : `${t("@COL_REWORK")} ${t("@COL_DIVISION")}`}
            </Label>
            <AutoCombo ref={referenceCodeRef} name="referenceCode" isLang={true} placeholder={judgeCode == 'D' ? `${t("@COL_DISPOSAL")} ${t("COL_DIVISION")}` : `${t("@COL_REWORK")} ${t("@COL_DIVISION")}`} required={judgeCode != 'U'} />        
          </div>
        </Col>  
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="judgeUser">
              {`${t("@COL_JUDGMENT")} ${t("@PERSONINCHARGE_NAME")}`}  {/* 판정 담당자명 */}
            </Label>
            <AutoCombo name="judgeUser" placeholder={`${t("@PERSONINCHARGE_NAME")}`} mapCode="user" required={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={judgeCode == 'R' ? 8 : 12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="judgeMethod">
              {t("@COL_PROCESSING_METHOD")}  {/* 처리방법 */}
            </Label>
            <Input name="judgeMethod" type="text" placeholder={t("@COL_PROCESSING_METHOD")} autoComplete="off" />
          </div>
        </Col>
        {judgeCode == 'R' ? 
        <>
          <Col md={4}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="remark">
                지정설비
              </Label>
              <AutoCombo name="eqpCode" sx={{ minWidth: "110px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />  {/* 설비코드 */}
            </div>
          </Col>          
        </> : null}
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="judgeRemark">
              {`${t("@COL_JUDGMENT")}${t("@COL_REASON")}`}  {/* 판정사유 */}
            </Label>
            <Input name="judgeRemark" type="text" placeholder={`${t("@COL_JUDGMENT")}${t("@COL_REASON")}`} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-2">
            <Label className="form-label" htmlFor="files">
              {t("@LABEL_NAME_TYPE1")}  {/* 첨부파일 */}
            </Label>
            <Uploader ref={uploaderRef} folder="PanelInterlock" name="judgeAttach" tableStyle={{ maxHeight: "140px", overflowY: "auto" }} />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ProcessJudgeEdit;
