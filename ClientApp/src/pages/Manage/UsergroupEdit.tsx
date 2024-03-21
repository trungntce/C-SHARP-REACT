import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const UsergroupEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();
  const passwordLabelRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;

    if(initRow.current.usergroupId){
      form.current.elements["usergroupId"].disabled = true;
    }else{
    }

  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  return (
    <>
      <EditBase 
        ref={ref}
        header="User Group Edit"
        initHandler={initHandler}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        >
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="userId">
                {/* 그룹ID */}
                {`${t("@GROUP_ID")} *`}
              </Label>
              <Input name="usergroupId" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="userName">
                {/* 그룹명 */}
                {`${t("@COL_GROUP_NAME")} *`}
              </Label>
              <Input name="usergroupName" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-3">
              <Label className="form-label" htmlFor="remark">
                {/* 설명 */}
                {t("@REMARK")}
              </Label>
              <Input name="remark" type="text" className="form-control" autoComplete="off" />
            </div>
          </Col>
        </Row>
      </EditBase>
    </>    
  );
});

export default UsergroupEdit;
