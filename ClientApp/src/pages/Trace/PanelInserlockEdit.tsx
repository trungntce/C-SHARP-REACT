import { forwardRef, useImperativeHandle, useRef } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../common/api";
import { Dictionary } from "../../common/types";
import { executeIdle } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const PanelInserlockEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const interlockYn = useRef<string>('Y');
  const innerRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);

  const initHandler = (formRef: any, init: Dictionary) => {
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    const param = {...row};
    param.interlockYn = interlockYn.current;
    param.json = JSON.stringify(listRef.current);

    if(param.interlockYn == 'Y' && !param["interlockCode"]){
      alertBox(t("@SELECT_INTERLOCK_REASON_CODE"));                         //인터락 사유코드를 선택해 주세요.
      return;
    }

    confirmBox(t("@ASK_DO_INTERLOCK_SET_OR_RELEASE"), async () => {         //인터락 설정/해제 하시겠습니까?
      const result = await api<any>("put", "interlock/onoff", param);
      if(result.data && result.data <= 0){
        alertBox(t("@ERROR_SET_OR_RELEASE"));                               //설정/해제 중 오류가 발생했습니다.
        return;
      }

      alertBox(t("@MSG_COMPLETED"));                                        //완료되었습니다.
  
      props.onComplete();
    }, async () => {
    });   
  }

  useImperativeHandle(ref, () => ({ 
    setList: (rows: Dictionary[]) => {
      listRef.current = rows;
    },
    setShowModal: innerRef.current.setShowModal
  }));

  return (
    <EditBase 
      ref={innerRef}
      header="Panel Interlock"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"md"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button type="submit" color="primary" onClick={() => { interlockYn.current = 'Y' }}>
                <i className="uil uil-edit me-2"></i> {t("@COL_INTERLOCK_SETTING")}   {/*인터락 설정*/}
              </Button>
              <Button type="submit" color="success" onClick={() => { interlockYn.current = 'N' }}>
                <i className="uil uil-edit me-2"></i> {t("@INTERLOCK_RELEASE")}       {/*인터락 설정*/}
              </Button>              
              <Button type="button" color="light" onClick={() => { ref.current.setShowModal(false); }}>
                <i className="uil uil-times me-2"></i> {t("@CLOSE")}
              </Button>
            </div>
          </Col>
        </Row>
      }
      >
      <Row>
        <Col md={8}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@INTERLOCK_REASON_CODE")}                                           {/*인터락 설정*/}
            </Label>
            <AutoCombo name="interlockCode" placeholder={t("@INTERLOCK_REASON_CODE")} mapCode="code" category="HOLDINGREASON" />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {`${t("@SET_OR_RELEASE")}/${t("@EMPLOYEE_NAME")}`}                      {/*등록/해제 직원명*/}
            </Label>
            <Input name="createUserId" type="text" className="form-control" placeholder={`${t("@SET_OR_RELEASE")}/${t("@EMPLOYEE_NAME")}`}  required={true}
              defaultValue={localStorage.getItem("user-name")?.toString()} readOnly={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              Remark
            </Label>
            <Input name="remark" type="text" autoComplete="off" required={true} />
          </div>
        </Col>
      </Row>      
    </EditBase>
  );
});

export default PanelInserlockEdit;
