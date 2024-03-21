import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";

const HealthcheckEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  const tagsInputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const tags = e.currentTarget.value.split(",").map((tag: string) => tag.trim().toUpperCase().replace(/\W/g, ''));
    
    e.currentTarget.value = tags.join(",");
  }

  return (
    <EditBase 
      ref={ref}
      header="Healthcheck Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >     
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="hcCode">
              상태관리코드 *
            </Label>
            <Input name="hcCode" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="hcCode">
              수집구분 *
            </Label>
            <AutoCombo name="hcType" sx={{ minWidth: 100 }} placeholder="수집구분" required={true} mapCode="code" category="HC_TYPE" />
          </div>
        </Col>        
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="hcName">
              코드명 *
            </Label>
            <Input name="hcName" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="tags">
              관리태그(공백없이 쉼표(,)로 구분해 입력 SERVICE,EQP,ETC 중 1개 필수 입력)
            </Label>
            <Input name="tags" type="text" autoComplete="off" onInput={tagsInputHandler} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              사용여부 *
            </Label>
            <select name="useYn" defaultValue={"Y"} required={true} className="form-select">
              <option value="">사용여부</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="sort">
              순서 *
            </Label>
            <Input name="sort" type="number" defaultValue={0} required={true} autoComplete="off" />
          </div>
        </Col>
      </Row>      
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              설명
            </Label>
            <Input name="remark" type="text" autoComplete="off" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default HealthcheckEdit;
