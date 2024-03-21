import { forwardRef, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import EditBase from "../../../../components/Common/Base/EditBase";


const OperCapaEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    // if(initRow.current.operGroupCode){      
      // form.current.elements["operGroupCode"].disabled = true;
    // }else{
    // }
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  return (
    <EditBase 
      ref={ref}
      header="OperCapa Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      >
      <Row>
        {/* <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operSeqNo">
              순서
            </Label>
            <Input name="operSeqNo" type="number" defaultValue={0} required={true} autoComplete="off" />
          </div>
        </Col> */}
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operGroupName">
              공정그룹명
            </Label>
            <Input name="operGroupName" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="inCapaVal">
              사내 CAPA
            </Label>
            <Input name="inCapaVal" type="number" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="unit">
              단위
            </Label>
            <Input name="unit" type="text" required={true} autoComplete="off" />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="gubun">
              구분
            </Label>
            <Input name="gubun" type="text" autoComplete="off" />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default OperCapaEdit;
