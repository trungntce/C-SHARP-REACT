import { forwardRef, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const ModelApproveEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.modelCode) {
      formRef.elements["modelCode"].disabled = true;
      formRef.elements["requestId"].disabled = true;
      formRef.elements["updateType"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="반려/ 합의/ 승인"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="content">
             내용기
            </Label>
            <Input name="content" type="text" className="form-control" />
          </div>
        </Col>
        <Input name="modelCode" type="text" className="form-control" hidden/>
        <Input name="requestId" type="text" className="form-control" hidden/>
        <Input name="updateType" type="text" className="form-control" hidden/>
      </Row>
    </EditBase>
  );
});

export default ModelApproveEdit;