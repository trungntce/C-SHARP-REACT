import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";

const DefectRollCancelEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    console.log(init);
    
    initRow.current = init;
    if (initRow.current.rollId) {
      formRef.elements["rollId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="HoldRoll"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="rollId">
              롤 ID
            </Label>
            <Input
              name="rollId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offRemark">
              결함 해제 사유
            </Label>
            <Input
              name="offRemark"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offUpdateUser">
              결함 해제 직원
            </Label>
            <Input
              name="offUpdateUser"
              type="text"
              required={true}
              className="form-control"
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default DefectRollCancelEdit;
