import { forwardRef, useImperativeHandle, useRef } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../common/api";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const PanelDefectEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const defectYn = useRef<string>('Y');
  const innerRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);

  const initHandler = (formRef: any, init: Dictionary) => {
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    const param = {...row};
    param.defectYn = defectYn.current;
    param.json = JSON.stringify(listRef.current);

    if(param.defectYn == 'Y' && !param["defectCode"]){
      alertBox(t("@SELECT_DEFECT_REASON_CODE"));                              //불량 사유코드를 선택해 주세요.
      return;
    }

    confirmBox(t("@ASK_DO_DEFECT_SET_OR_RELEAS"), async () => {               //불량 설정/해제 하시겠습니까?  
      const result = await api<any>("put", "defectpanel/onoff", param);
      if(result.data && result.data <= 0){
        alertBox(t("@ERROR_SET_OR_RELEASE"));                                 //설정/해제 중 오류가 발생했습니다
        return;
      }

      alertBox(t("@MSG_COMPLETED"));                                          //완료되었습니다.         
  
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
      header="Panel Defect"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"md"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button type="submit" color="primary" onClick={() => { defectYn.current = 'Y' }}>
                <i className="uil uil-edit me-2"></i> {t("@COL_DEFECT_REGISTRATION")}                   {/*불량등록*/}
              </Button>
              <Button type="submit" color="success" onClick={() => { defectYn.current = 'N' }}>
                <i className="uil uil-edit me-2"></i> {t("@DEFECT_RELEASE")}                            {/*불량해제*/}
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
              {t("@COL_DEFECT_CODE")}                                                             {/*불량코드*/}                                                      
            </Label>
            <AutoCombo name="defectCode" placeholder={t("@COL_DEFECT_CODE")} mapCode="code" category="DEFECTREASON" />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {`${t("@SET_OR_RELEASE")}/${t("@EMPLOYEE_NAME")}`}                      {/*등록/해제 직원명*/}
            </Label>
            <Input name="createUserId" type="text" className="form-control" placeholder={`${t("@SET_OR_RELEASE")}/${t("@EMPLOYEE_NAME")}`} required={true}
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

export default PanelDefectEdit;
