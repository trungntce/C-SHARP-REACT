import { forwardRef, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const EqpAreaEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.eqpareaCode){      
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
      header="EqpArea Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              {`${t("@EQP_CODE")} *`} {/*설비코드 * */}
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@EQP_CODE")} mapCode="eqp" required={true} disabled={true} />  
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareagroupCode">
              {`${t("@LARGE_CATEGORY")}ID *`}{/*대분류ID * */}
            </Label>
            <Input name="eqpareagroupCode" type="text" placeholder={t("@LARGE_CATEGORY")} required={true} disabled={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareagroupName">
              {t("@LARGE_CATEGORY_NAME")}{/*대분류명 */}
            </Label>
            <Input name="eqpareagroupName" type="text" placeholder={t("@LARGE_CATEGORY_NAME")} required={true} disabled={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {`${t("@USEYN")} *`}{/*사용여부 * */}
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
              {`${t("@SORT")} *`}{/*순서 * */}
            </Label>
            <Input name="sort" type="number" defaultValue={0} required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={7}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareaName">
              {`${t("@MIDDLE_CATEGORY_NAME")} *`}{/*중분류명 * */}
            </Label>
            <Input name="eqpareaName" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@REMARK")}{/*설명 */}
            </Label>
            <Input name="remark" type="text" autoComplete="off" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default EqpAreaEdit;