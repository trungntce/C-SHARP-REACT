import { forwardRef, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import EditBase from "../../../../components/Common/Base/EditBase";

const EqpErrorMapEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.eqpErrorCode) {
      formRef.elements["eqpErrorCode"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="EqpErrorMap Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpErrorCode">
              매칭코드
            </Label>
            <Input name="eqpErrorCode" type="text" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              설비코드
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder="설비코드" mapCode="eqp" required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorCode">
              에러코드
            </Label>
            <AutoCombo name="errorCode" sx={{ minWidth: "200px" }} placeholder="에러코드" mapCode="error" required={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              비고
            </Label>
            <Input name="remark" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default EqpErrorMapEdit;