import { forwardRef, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const EqpAreaGroupEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.eqpareagroupCode) {
      formRef.elements["eqpCode"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="Eqpareagroup Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              {/* 설비코드 */}
              {t("@COL_EQP_CODE")}
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" required={true} />
            {/* <Input name="eqpareagroupCode" type="text" pattern="[a-zA-Z0-9_-]+" className="form-control" required={true} /> */}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareagroupName">
              {/* 대분류명 */}
              {`${t("@LARGE_CATEGORY")} ${t("@COL_NAME")}`}
            </Label>
            <Input name="eqpareagroupName" type="text" className="form-control" />
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
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              Recipe 대분류코드
            </Label>
            <AutoCombo name="usergroupId" sx={{ minWidth: "200px" }} placeholder="Recipe 대분류코드" mapCode="usergroup" required={true} />
            {/* <Input name="eqpareagroupCode" type="text" pattern="[a-zA-Z0-9_-]+" className="form-control" required={true} /> */}
          </div>
        </Col>
        <Col md={8}>
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

export default EqpAreaGroupEdit;