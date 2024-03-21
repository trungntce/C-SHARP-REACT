import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import LangTextBox from "../../components/Common/LangTextBox";
import { useTranslation } from "react-i18next";

const CodeGroupEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.codegroupId) {
      formRef.elements["codegroupId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="CodeGroup Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codegroupId">
              {/* 코드그룹ID */}
              {`${t("@CODE_GROUP")}ID`}
            </Label>
            <Input name="codegroupId" type="text" pattern="[a-zA-Z0-9_-]+" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codegroupName">
              {/* 코드그룹명 */}
              {t("@CODE_GROUP_NAEM")}
            </Label>
            <Input mode="single" name="codegroupName" type="text" className="form-control" required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {/* 사용여부 */}
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
              {/* 설명 */}
              {t("@REMARK")}
            </Label>
            <Input name="remark" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default CodeGroupEdit;
