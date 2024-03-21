import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import Select from "../../components/Common/Select";
import { useTranslation } from "react-i18next";

const CodeEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.workerId){
      form.current.elements["workerId"].disabled = true;
    }else{
    }
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  return (
    <EditBase 
      ref={ref}
      header="Worker Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="workerId">
            {`${t("@WORKER")} ID *`}
            </Label>
            <Input name="workerId" type="text" required={true} autoComplete="off" className="form-control" />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="workerName">
            {t("@WORKER_NAME")}
            </Label>
            <Input name="workerName" type="text" autoComplete="off" className="form-control" />
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="rowKey">
            {`${t("@COL_BARCDOE")} ID`}
            </Label>
            <Input name="rowKey" type="text" autoComplete="off" className="form-control" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default CodeEdit;
