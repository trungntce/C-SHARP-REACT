import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import LangTextBox from "../../components/Common/LangTextBox";

const DefectGroupEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.defectgroupCode) {
      formRef.elements["defectgroupCode"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="DefectGroup Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="defectgroupCode">
              {/*불량유형코드*/}
              {t("@COL_DEFECT_TYPE_CODE")}
            </Label>
            <Input name="defectgroupCode" type="text" pattern="[a-zA-Z0-9_-]+" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="defectgroupName">
              {/*불량유형명*/}
              {t("@COL_DEFECT_TYPE_NAME")}
            </Label>
            <LangTextBox name="defectgroupName"  mode="single" type="text" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {t("@USEYN")}
            </Label>
            <select name="useYn" className="form-select" defaultValue={"Y"} required={true}>
              <option value="">{t("@USEYN")}</option>
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
              {t("@REMARK")}
            </Label>
            <Input name="remark" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default DefectGroupEdit;
