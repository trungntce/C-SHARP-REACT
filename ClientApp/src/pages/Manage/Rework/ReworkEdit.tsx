import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import EditBase from "../../../components/Common/Base/EditBase";
import Uploader from "../../../components/Common/Uploader";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const ReworkEdit = forwardRef((props: any, ref: any) => {
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

      const doSave = () => {
        confirmBox(t("@MSG_ASK_ISSUE"), async () => { //비고 및 시스템 이상 내역을 등록하시겠습니까?
          const result = await api<any>("post", "panelinterlock/issue", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE5")); //저장 중 오류가 발생했습니다.
            return;
          }

          alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };

      if(!param.issueAttach || param.issueAttach == "[]"){
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

      const doSave = () => {
        confirmBox(t("@MSG_ASK_TYPE1"), async () => { //저장하시하시겠습니까?
          const result = await api<any>("put", "panelinterlock/issue", param);
          if(result.data && result.data <= 0){
            alertBox(t("@MSG_ERROR_TYPE5")); //합의 중 오류가 발생했습니다.
            return;
          }

          alertBox(t("@MSG_SAVED")); //완료되었습니다.
      
          props.onComplete();
        }, async () => {
        });
      };

      if(!param.issueAttach || param.issueAttach == "[]"){
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
      header="재처리 승인"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"lg"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button innerRef={saveRef} type="submit" color="primary">
                <i className="uil uil-edit me-2"></i> {`${t("@SAVE")}`} {/* 저장 */}
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
      <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              비고
            </Label>
            <Input name="issueRemark" type="text" placeholder={t("@REMARKS")} autoComplete="off" />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="issueUser">
              {`${t("@PERSONINCHARGE_NAME")}`} {/* 담당자명 */}
            </Label>
            <AutoCombo name="issueUser" placeholder={`${t("@PERSONINCHARGE_NAME")}`} mapCode="user" required={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-2">
            <Label className="form-label" htmlFor="files">
              {t("@LABEL_NAME_TYPE1")}  {/* 첨부파일 */}
            </Label>
            <Uploader ref={uploaderRef} folder="PanelInterlock" name="issueAttach" tableStyle={{ maxHeight: "140px", overflowY: "auto" }} />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ReworkEdit;
