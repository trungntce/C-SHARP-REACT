import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import EditBase from "../../../components/Common/Base/EditBase";
import Uploader from "../../../components/Common/Uploader";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { detectStep } from "./FdcInterlockList";
import { useTranslation } from "react-i18next";
import AutoCombo from "../../../components/Common/AutoCombo";

const FdcSettleEdit = forwardRef((props: any, ref: any) => {
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
    if(!listRef.current.length){ // 개별 수정모드
      const param = {...row};
      param.json = JSON.stringify([{ tableRowNo: initRow.current?.tableRowNo }]);
      param.updateYn = 'Y';

      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE3"), async () => {  //합의내용을 저장 하시겠습니까?
          const result = await api<any>("post", "fdcinterlock/processsettle", param);
          if(result.data && result.data <= 0){
            alertBox(t("@SAVE_ERROR_AGREEMENT"));  //합의내용 저장 중 오류가 발생했습니다.
            return;
          }

          alertBox(t("@MSG_COMPLETED"));  //완료되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };
      
      doSave();
    }else{ // 최초 합의
      const param = {...row};
      param.json = JSON.stringify(listRef.current);

      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE4"), async () => {  //합의 하시겠습니까?
          const result = await api<any>("post", "fdcinterlock/processsettle", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE7"));  //합의 중 오류가 발생했습니다.
            return;
          }

          alertBox(t("@MSG_COMPLETED"));  //@MSG_COMPLETED
      
          props.onComplete();
        }, async () => {
        });
      };

      doSave();
    }
  }

  useImperativeHandle(ref, () => ({ 
    setList: (rows: Dictionary[]) => {
      listRef.current = rows;
      const row = rows[0];
      const step = detectStep(rows[0]);

      if(rows.some(x => detectStep(x) != step)){
        alertBox(t("@MSG_SAME_PROGRESS_BATCH_POSSIBLE"));  //같은 진행상태의 Batch들만 일괄처리가 가능합니다.
        return false;
      }

      if(step == "COMPLETE"){
        alertBox(t("@AGREEMENT_COMPLITE_BATCH"));  //합의가 완료된 Batch입니다.
        return false;
      }

      if(step == ""){
        alertBox(t("@NO_ACTION_REGISTERED_BATCH"));  //조치가 등록되지 않은 Batch입니다.
        return false;
      }

      if(rows.some(x => x.handleCode != row.handleCode)){
        alertBox("처리구분이 같은 판넬만 일괄처리가 가능합니다.");  //1차 판정이 같은 판넬만 일괄처리가 가능합니다.
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
      header="Batch 합의"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"lg"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button innerRef={saveRef} type="submit" color="primary">
                <i className="uil uil-edit me-2"></i> {t("@AGREEMENT_SAVE")}  {/* 합의 저장 */}
              </Button>
              <Button type="button" color="light" onClick={() => { ref.current.setShowModal(false); }}>
                <i className="uil uil-times me-2"></i> {t("@CLOSE")}          {/* 닫기 */}
              </Button>
            </div>
          </Col>
        </Row>
      }
      >
      <Row>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="handleCode">
            처리구분
            </Label>
            <AutoCombo name="handleCode" placeholder="처리구분" mapCode="code" category="FDC_TO_TYPE" disabled={true} isLang={true} required={true}  />
          </div>
        </Col>        
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@ITEM_AGREEMENT_REASON")} {/* 합의사유 */}
            </Label>
            <Input name="settleRemark" type="text" placeholder={t("@ITEM_AGREEMENT_REASON")} autoComplete="off" />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="createUserId">
              {`${t("@AGREEMENT")}${t("@PERSONINCHARGE_NAME")}`}  {/* 합의 담당자명 */}
            </Label>
            <Input name="settleUserName" type="text" className="form-control" placeholder={`${t("@AGREEMENT")}${t("@PERSONINCHARGE_NAME")}`} required={true}
              defaultValue={localStorage.getItem("user-name")?.toString()} readOnly={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-2">
            <Label className="form-label" htmlFor="files">
              첨부파일
            </Label>
            <Uploader ref={uploaderRef} folder="FdcInterlock" name="settleAttach" tableStyle={{ maxHeight: "140px", overflowY: "auto" }} />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default FdcSettleEdit;
