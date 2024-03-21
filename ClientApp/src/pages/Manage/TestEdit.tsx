import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label, InputGroup, InputGroupText } from "reactstrap";
import { Dictionary } from "../../common/types";
import { executeIdle } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import IconInput from "../../components/Common/IconInput";
import LangTextBox from "../../components/Common/LangTextBox";
import Uploader from "../../components/Common/Uploader";

const TestEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const iconRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.TestId){
      form.current.elements["testId"].disabled = true;
    }else{
    }

    executeIdle(() => {
      iconRef.current.setIconText(init.icon);
    });
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  return (
    <>
      <EditBase 
        ref={ref}
        header="Code Edit"
        initHandler={initHandler}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        >
        <Row>
          <Col>
            <div className="mb-3">
              <Label className="form-label" htmlFor="testMultiLang">
                다국어입력 *
              </Label>
              <LangTextBox name="testMultiLang" placeholder="다국어입력" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="icon">
                메뉴아이콘
              </Label>
              <IconInput ref={iconRef} name="icon" />
            </div>
          </Col>
          <Col md={3}>
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
          <Col md={3}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="sort">
                순서 *
              </Label>
              <Input name="sort" type="number" defaultValue={0} required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="TestId">
                테스트ID *
              </Label>
              <Input name="testId" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={7}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="TestName">
                테스트명(다국어) *
              </Label>
              <LangTextBox name="testName" mode="single" placeholder="테스트명(다국어)" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-3">
              <Label className="form-label" htmlFor="remark">
                설명
              </Label>
              <Input name="remark" type="text" className="form-control" autoComplete="off" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-3">
              <Uploader />
            </div>
          </Col>
        </Row>
      </EditBase>
    </>    
  );
});

export default TestEdit;
