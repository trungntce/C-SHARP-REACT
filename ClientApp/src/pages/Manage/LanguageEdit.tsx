import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";

const LanguageEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.langCode) {
      formRef.elements["langCode"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="Laguage Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="langCode">
              다국어코드
            </Label>
            <Input
              name="langCode"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="nationCode">
              국가코드
            </Label>
            <AutoCombo
              name="nationCode"
              sx={{ width: "auto" }}
              placeholder="국가코드"
              mapCode="code"
              category="LANG_CODE"
              required={true}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="langText">
              다국어Text
            </Label>
            <Input name="langText" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default LanguageEdit;
