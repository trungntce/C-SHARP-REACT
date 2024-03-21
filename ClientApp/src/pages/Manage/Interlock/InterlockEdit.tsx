import { forwardRef, useImperativeHandle, useRef } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import EditBase from "../../../components/Common/Base/EditBase";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const InterlockEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const innerRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    const doInsert = async () => {
      const result = await api<any>("put", "panelinterlock", row);
      if(result.data && result.data <= 0){
        alertBox(t("@ERROR_SET_OR_REGISTER"));  //등록(설정) 중 오류가 발생했습니다.
        return;
      }

      alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
  
      props.onComplete();
    }

    const result =  await api<any>("get", "panelinterlock/realtime", { panelId: row.panelId });
    if(result.data == 'Y'){ 
      confirmBox(t("@ALREADY_EXIST_PNL_LIST_DUPLICA"), async () => {  //이미 해당 판넬은 인터락 리스트에 존재합니다. 중복 등록 하시겠습니까?
        doInsert();
      }, async () => {
      });   
    }else{
      confirmBox(t("@MSG_ASK_SET_INTERLOCK"), async () => {  //인터락 설정 하시겠습니까?
        doInsert();
      }, async () => {
      });   
    }    
  }

  useImperativeHandle(ref, () => ({ 
    setShowModal: innerRef.current.setShowModal
  }));

  return (
    <EditBase 
      ref={innerRef}
      header="Panel Interlock"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"lg"}
      >
      <Row>
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@COL_PANEL_BARCODE")}  {/* 판넬바코드 */}
            </Label>
            <Input name="panelId" type="text" autoComplete="off" required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@INTERLOCK_REASON_CODE")}  {/* 인터락 사유코드 */}
            </Label>
            <AutoCombo name="interlockCode" placeholder={t("@INTERLOCK_REASON_CODE")} mapCode="code" category="HOLDINGREASON" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {`${t("@REGISTER_SET")}${t("@EMPLOYEE_NAME")}`}  {/* 등록(설정) 직원명 */}
            </Label>
            <Input name="createUserId" type="text" className="form-control" placeholder={`${t("@REGISTER_SET")}${t("@EMPLOYEE_NAME")}`} required={true}
              defaultValue={localStorage.getItem("user-name")?.toString()} readOnly={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {`${t("@REGISTER_SET")}${t("@COL_REASON")}`}   {/* 등록(설정) 사유 */}
            </Label>
            <Input name="remark" type="text" autoComplete="off" required={true} />
          </div>
        </Col>
      </Row>      
    </EditBase>
  );
});

export default InterlockEdit;
