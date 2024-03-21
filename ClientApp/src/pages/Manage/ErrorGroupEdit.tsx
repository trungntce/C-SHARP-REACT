import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const ErrorGroupEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.errorgroupCode) {
      formRef.elements["errorgroupCode"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="ErrorGroup Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorgroupCode">
             {t("@ERROR_TYPE_CODE")}{/*에러유형코드*/}
            </Label>
            <Input name="errorgroupCode" type="text" pattern="[a-zA-Z0-9_-]+" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorgroupName">
             {t("@ERROR_TYPE_NAME")}{/*에러유형명*/}
            </Label>
            <Input name="errorgroupName" type="text" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
             {t("@USEYN")} {/*사용여부*/}
            </Label>
            <select name="useYn" className="form-select" defaultValue={"Y"} required={true}>
              <option value="">{t("@USEYN")}</option>{/*사용여부*/}
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
             {t("@REMARK")} {/*설명*/}
            </Label>
            <Input name="remark" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ErrorGroupEdit;
