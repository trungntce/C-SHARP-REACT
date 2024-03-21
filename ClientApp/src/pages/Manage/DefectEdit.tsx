import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import LangTextBox from "../../components/Common/LangTextBox";

const DefectEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.defectCode){      
      form.current.elements["defectCode"].disabled = true;
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
      header="Defect Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >
      <Row>
        <Col md={7}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="defectgroupCode">
              {/*불량유형*/}
              {`${t("@DEFECT_TYPE")} *`}
            </Label>
            <AutoCombo name="defectgroupCode" sx={{ width: "auto" }} placeholder={`${t("@DEFECT_TYPE")}`} mapCode="defectgroup" required={true} disabled={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {`${t("@USEYN")} *`}
            </Label>
            <select name="useYn" defaultValue={"Y"} required={true} className="form-select">
              <option value=""> {`${t("@USEYN")}`}</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="sort">
            {`${t("@SORT")} *`}
            </Label>
            <Input name="sort" type="number" defaultValue={0} required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="defectCode">
              {/*불량코드*/}
              {`${t("@COL_DEFECT_CODE")} *`}
            </Label>
            <Input name="defectCode" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={7}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="defectName">
              {/*불량명*/}
              {`${t("@COL_DEFECT_NAME")} *`}
            </Label>
            <LangTextBox mode="single" name="defectName" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {/*설명*/}
              {`${t("@REMARK")}`}
            </Label>
            <Input name="remark" type="text" autoComplete="off" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default DefectEdit;
