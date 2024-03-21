import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import StManager from "./StManagerList";

const InterlockHistoryTogetherEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
    if (initRow.current.panelId) {
      formRef.elements["panelId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="InterlockHistory"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="interlockCode">
              인터락 CODE
            </Label>
            <Input
              name="interlockCode"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="onRemark">
              인터락 ON 사유
            </Label>
            <Input
              name="onRemark"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="onUpdateUser">
              인터락 ON 직원
            </Label>
            <Input
              name="onUpdateUser"
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

export default InterlockHistoryTogetherEdit;
