import { forwardRef, SyntheticEvent, useImperativeHandle, useRef, useState } from "react";
import AutoCombo from "./AutoCombo";
import { useTranslation } from "react-i18next";
import { Col } from "reactstrap";
import { Dictionary } from "../../common/types";

{/* 
  <WorkCenterEqp name="eqpCode" style={{ width: 200 }} workcenterRef="workcenter" /> 
  작업장 코드도 가져올시 workcenterRef props 사용
*/}
const WorkCenterEqp = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const [workcenterCode, setWorkCenterCode] = useState<any>();

  const workcenterRef = useRef<any>();
  const eqpCodeRef = useRef<any>();

  useImperativeHandle(ref, () => ({ 

    getWorkCenterCode: () => workcenterCode,

    setValue: (val:Dictionary) => {
      props.workcenterRef !== null ? workcenterRef.current.value = val?.value : null;
      eqpCodeRef.current.value = val.value;
    },

  }));

  const workCenterChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    setWorkCenterCode(value?.value)

    eqpCodeRef.current.setValue("");
    eqpCodeRef.current.setCategory(value?.value);
  };

  return (
    <>
      <Col>
        <AutoCombo 
          ref={workcenterRef} 
          name={props.workcenterRef} 
          sx={props.sx} 
          placeholder={t("@COL_WORKCENTER_NAME")} //작업장명
          mapCode="workcenter" 
          onChange={workCenterChangeHandler} />
      </Col>
      <Col>
        <AutoCombo 
          ref={eqpCodeRef} 
          name={props.name} 
          sx={props.sx} 
          placeholder={t("@COL_EQP_CODE")} //설비코드
          mapCode="workcnetereqp" />
      </Col>
    </>
  )
});

export default WorkCenterEqp;
