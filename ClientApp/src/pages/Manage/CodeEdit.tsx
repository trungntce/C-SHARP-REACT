import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import LangTextBox from "../../components/Common/LangTextBox";
import { useTranslation } from "react-i18next";

const CodeEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.codeId){      
      form.current.elements["codeId"].disabled = true;
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
      header="Code Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >
      <Row>
        <Col md={7}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codegroupId">
              {/* 코드그룹 * */}
              {t("@CODE_GROUP")} *
            </Label>
            <AutoCombo name="codegroupId" sx={{ width: "auto" }} placeholder={t("@CODE_GROUP")} mapCode="codegroup" disabled={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {/* 사용여부 * */}
              {t("@USEYN")} *
            </Label>
            <select name="useYn" defaultValue={"Y"} required={true} className="form-select">
              <option value="">{t("@USEYN")}</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="sort">
              {/* 순서 * */}
              {t("@SORT")} *
            </Label>
            <Input name="sort" type="number" defaultValue={0} required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codeId">
              {/* 코드ID * */}
              {`${t("@CODE")}ID *`}
            </Label>
            <Input name="codeId" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={7}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codeName">
              {/* 코드명 * */}
              {t("@CODE_NAME")} *
            </Label>
            <LangTextBox mode="single" name="codeName" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {/* 설명 */}
              {t("@REMARK")}
            </Label>
            <Input name="remark" type="text" autoComplete="off" />
          </div>
        </Col>
        <Col md={7}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="ruleVal">
              {/* 내부GROUP */}
              {t("@COL_INTERNAL")} GROUP
            </Label>
            <Input name="ruleVal" type="text" autoComplete="off" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default CodeEdit;
