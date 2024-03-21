import { forwardRef, useImperativeHandle, useRef } from "react";
import { Row, Col, Button, Input, Label, FormGroup } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";
import EditBase from "../../../components/Common/Base/EditBase";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";

const InterlockOffEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const innerRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);

  const initHandler = (formRef: any, init: Dictionary) => {
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    const param = {...row};
    param.json = JSON.stringify(listRef.current);

    confirmBox(t("@ASK_DO_GOOD_QUALITY"), async () => { //양품화(인터락 해제) 하시겠습니까?
      const result = await api<any>("post", "panelinterlock", param);
      if(result.data && result.data <= 0){
        alertBox(t("@ERROR_SET_GOOD_QUALITY"));  //양품화(인터락 해제) 중 오류가 발생했습니다.
        return;
      }

      alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
  
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
      size={"lg"}
      >
      <Row>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {`${t("@REGISTER_SET")}${t("@EMPLOYEE_NAME")}`}  {/* 등록(설정) 직원명 */}
            </Label>
            <Input name="createUserId" type="text" className="form-control" placeholder={`${t("@REGISTER_SET")}${t("@EMPLOYEE_NAME")}`} required={true}
              defaultValue={localStorage.getItem("user-name")?.toString()} readOnly={true} />
          </div>
        </Col>
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@RELEASE_REASON")}  {/* 해제 사유 */}
            </Label>
            <Input name="remark" type="text" autoComplete="off" required={true} />
          </div>
        </Col>
      </Row>      
    </EditBase>
  );
});

export default InterlockOffEdit;
