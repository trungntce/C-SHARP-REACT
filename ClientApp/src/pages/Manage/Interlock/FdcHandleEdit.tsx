import { SyntheticEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import EditBase from "../../../components/Common/Base/EditBase";
import Uploader from "../../../components/Common/Uploader";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { detectStep } from "./FdcInterlockList";
import { useTranslation } from "react-i18next";
import AutoCombo from "../../../components/Common/AutoCombo";

const FdcHandleEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const uploaderRef = useRef<any>();
  const saveRef = useRef<any>();

  const innerRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);
  const [handleCode, setHandleCode] = useState("");
  const referenceCodeRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {    
    initRow.current = init;
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
  }

  const handleChangeHandler = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => {
    if(value?.value){
      if(value?.value != "D"){
        referenceCodeRef.current.setValue({ value: "", label: "" });
        referenceCodeRef.current.setEmpty();
      }

      setHandleCode(value?.value);
    }
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    if(!listRef.current.length){ // 수정
      const param = {...row};
      param.json = JSON.stringify([{ tableRowNo: initRow.current?.tableRowNo }]);
  
      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE1"), async () => {  //저장하시겠습니까?
          
          const result = await api<any>("post", "fdcinterlock/processhandle", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE5"));  //저장 중 오류가 발생했습니다.
            return;
          }
    
          alertBox(t("@MSG_SAVED"));  //저장되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };

      if(!param.handleAttach || param.handleAttach == "[]"){
        confirmBox(t("@MSG_ASK_TYPE2"), async () => {  //첨부 파일이 없습니다. 이대로 저장 하시겠습니까?
          doSave();
        }, async () => {
        });
      }else{
        doSave();
      }
    }else{
      const param = {...row};
      param.json = JSON.stringify(listRef.current);
  
      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE1"), async () => {  //저장하시겠습니까?
        
          const result = await api<any>("put", "fdcinterlock/process", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE5"));  //저장 중 오류가 발생했습니다.
            return;
          }
    
          alertBox(t("@MSG_SAVED"));  //저장되었습니다.
      
          props.onComplete();
        }, async () => {
        });   
      };

      if(!param.handleAttach || param.handleAttach == "[]"){
        confirmBox(t("@MSG_ASK_TYPE2"), async () => {   //첨부 파일이 없습니다. 이대로 저장 하시겠습니까?
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
      setHandleCode('');

      listRef.current = rows;

      const step = detectStep(rows[0]);

      if(rows.some(x => detectStep(x) != step)){
        alertBox(t("@MSG_SAME_PROGRESS_BATCH_POSSIBLE"));  //같은 진행상태의 Batch만 일괄처리가 가능합니다.
        return false;
      }

      if(step == "COMPLETE"){
        alertBox(t("@MSG_COMPLETED_TYPE1"));  //합의(처리)가 완료된 Batch입니다.
        return false;
      }

      if(step == "HANDLE"){
        alertBox(t("@MSG_ALRAM_TYPE1"));  //이미 조치가 등록된 Batch입니다.
        return false;
      }

      return true;
    },
    setForm: (row: Dictionary) => {
      innerRef.current.setForm(row);

      setHandleCode(row.handleCode);
    },
    setShowModal: innerRef.current.setShowModal
  }));

  useEffect(() => {
  }, [])

  return (
    <EditBase 
      ref={innerRef}
      header="Batch 조치"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"lg"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button innerRef={saveRef} type="submit" color="primary">
                <i className="uil uil-edit me-2"></i> {t("@SAVE")}  {/* 저장 */}
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
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="handleCode">
              처리구분
            </Label>
            <AutoCombo name="handleCode" onChange={handleChangeHandler} placeholder="처리구분" mapCode="code" category="FDC_TO_TYPE" isLang={true} required={true} />
          </div>
        </Col>
        <Col md={5} style={{ display: handleCode == "D" ? "" : "none" }}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="referenceCode">
              {/* "폐기 구분" : "재처리 구분" */}
              {`${t("@COL_DISPOSAL")} ${t("COL_DIVISION")}`}
            </Label>
            <AutoCombo ref={referenceCodeRef} name="referenceCode" placeholder={t("@COL_DISPOSAL")} mapCode="code" category="DEFECTREASON" required={handleCode != 'U'} onlyCompareValue={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="createUserId">
              {`${t("@COL_PROCESSING")}${t("@PERSONINCHARGE_NAME")}`}  {/* 처리 담당자명 */}
            </Label>
            <Input name="handleUserName" type="text" className="form-control" placeholder={`${t("@COL_PROCESSING")}${t("@PERSONINCHARGE_NAME")}`} required={true}
              defaultValue={localStorage.getItem("user-name")?.toString()} readOnly={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="handleRemark">
             {t("@COL_PROCESSING_METHOD")}  {/* 처리방법 */}
            </Label>
            <Input name="handleRemark" type="text" placeholder={t("@COL_PROCESSING_METHOD")}  autoComplete="off" />
          </div>
        </Col>
    </Row>
      <Row>
        <Col>
          <div className="mb-2">
            <Label className="form-label" htmlFor="files">
              {t("@LABEL_NAME_TYPE1")}  {/* 첨부파일 */}
            </Label>
            <Uploader ref={uploaderRef} folder="FdcInterlock" name="handleAttach" tableStyle={{ maxHeight: "140px", overflowY: "auto" }} />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default FdcHandleEdit;
