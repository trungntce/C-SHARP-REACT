import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const ErrorEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.errorCode){      
      form.current.elements["errorCode"].disabled = true;
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
      header="Error Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorgroupCode">
             {`${t("@ERROR_TYPE")} *`}{/*에러유형*/}
            </Label>
            <AutoCombo name="errorgroupCode" sx={{ width: "auto" }} placeholder={t("@ERROR_GRUOP")} mapCode="errorgroup" required={true} disabled={true} /> {/*에러그룹*/}
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorCode">
             {`${t("@ERROR_CODE")} *`}{/*에러코드*/}
            </Label>
            <Input name="errorCode" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorMessage">
             {`${t("@ERROR_MSG")} *`}{/*에러메세지*/}
            </Label>
            <Input name="errorMessage" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
             {`${t("@COL_EQP_CODE")} *`}{/*설비코드*/}
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />{/*설비코드*/}
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="errorMessage">
             {`${t("COL_EQP_CODE")}${t("MAPPING")}`}{/*설비코드매핑*/}
            </Label>
            <Input name="eqpErrorCode" type="text" autoComplete="off" />
          </div>
        </Col>                
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
             {`${t("@USEYN")} *`}{/*사용여부*/}
            </Label>
            <select name="useYn" defaultValue={"Y"} required={true} className="form-select">
              <option value="">{t("@USEYN")}</option>{/*사용여부*/}
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="sort">
             {`${t("@SORT")} *`}{/*순서*/}
            </Label>
            <Input name="sort" type="number" defaultValue={0} required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
             {t("@REMARK")}{/*설명*/}
            </Label>
            <Input name="remark" type="text" autoComplete="off" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ErrorEdit;
