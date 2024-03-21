import { forwardRef, SyntheticEvent, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import EditBase from "../../../../components/Common/Base/EditBase";

const EqpOffsetEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();
  const areaGroupRef = useRef<any>();
  const areaRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    areaGroupRef.current.setCategory(initRow.current.eqpCode);

    if (initRow.current.eqpCode) {
      // formRef.elements["eqpCode"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  

  const areaChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    areaRef.current.setCategory(value?.value);
  };

  return (
    <EditBase
      ref={ref}
      header="EqpOffset Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              설비코드
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "auto" }} placeholder="설비코드" mapCode="eqp" required={true} disabled={true} />
          </div>
        </Col>
        <Col md={6}>
          {/* <div className="mb-3">
            <Label className="form-label" htmlFor="paramName">
              Parameter
            </Label>
            <Input name="paramName" type="text" className="form-control"  />
          </div> */}
        </Col>
      </Row>
      <Row>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareagroupSeq">
              대 순번
            </Label>
            <Input name="eqpareagroupSeq" type="number" autoComplete="off" />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareagroupCode">
              대분류
            </Label>
            <AutoCombo ref={areaGroupRef} name="eqpareagroupCode" onChange={areaChangeHandler} placeholder="대분류" mapCode="eqpareagroup" required={true} />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareaSeq">
              중 순번
            </Label>
            <Input name="eqpareaSeq" type="number" autoComplete="off" />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpareaCode">
              중분류
            </Label>
            <AutoCombo ref={areaRef} name="eqpareaCode" placeholder="중분류" mapCode="eqparea" required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="extMm">
              구간거리
            </Label>
            <Input name="extMm" type="number" step={0.1} defaultValue={0} min={0} required={true} />
          </div>
        </Col>
      </Row>
    </EditBase>
  );

});

export default EqpOffsetEdit;