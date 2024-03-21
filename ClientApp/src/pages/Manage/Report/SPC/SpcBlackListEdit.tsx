import { ChangeEvent, forwardRef, SyntheticEvent, useRef, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import { executeIdle, isNullOrWhitespace } from "../../../../common/utility";
import AutoCombo from "../../../../components/Common/AutoCombo";
import EditBase from "../../../../components/Common/Base/EditBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import Select from "../../../../components/Common/Select";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import LangTextBox from "../../../../components/Common/LangTextBox";
import { useTranslation } from "react-i18next";

const SpcBlackListEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<any>();
  const form = useRef<any>();

  const tableRef = useRef<any>();
  const colRef = useRef<any>();

  const initHandler = (formRef: any, init: any) => {
    form.current = formRef;
    initRow.current = init;

    // if(initRow.current.eqpCode) {
    //   form.current.elements['eqpCode'].disabled = true;

    //   executeIdle(() => {
    //     if(initRow.current!.rawType == 'P'){ // PC
    //       tableRef.current.setMapCode("infotablepc");
    //       colRef.current.setMapCode("infocolbytablepc");
    //     }else{ // PLC
    //       tableRef.current.setMapCode("infotable");
    //       colRef.current.setMapCode("infocolbytablenojson");
    //     }
        
    //     colRef.current.setCategory(initRow.current!.tableName);
    //   });
    // }else{

    // }
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    // if(initRow.current['rowNo']){
    //   console.log('update')
    // }else{
    //   console.log('insert')
    // }

    if(isNullOrWhitespace(row["judgeRule1X"])){
      alertBox('Rule_1_X is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule1R"])){
      alertBox('Rule_1_R is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule2"])){
      alertBox('Rule_2 is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule3"])){
      alertBox('Rule_3 is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule4"])){
      alertBox('Rule_4 is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule5"])){
      alertBox('Rule_5 is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule6"])){
      alertBox('Rule_6 is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule7"])){
      alertBox('Rule_7 is Empty'); 
      return;
    }

    if(isNullOrWhitespace(row["judgeRule8"])){
      alertBox('Rule_8 is Empty'); 
      return;
    }

    props.onComplete(row, initRow.current);

	 	// if(isNullOrWhitespace(row["startTime"]))
	  //     row["startTime"] = null;
	  //   else
	  //     row["startTime"] = parseInt(row["startTime"], 10);

	  //   if(isNullOrWhitespace(row["endTime"]))
	  //     row["endTime"] = null;
	  //   else
	  //     row["endTime"] = parseInt(row["endTime"], 10);
      
    //   if(row["startTime"] == 0 && row["endTime"] == 0) {
    //    alertBox(t("@MSG_START_END_NO_ZORO")); //시작, 종료 모두 0을 입력할 수 없습니다.
    //     return;
    //   }

    //   if(row["startTime"] > row["endTime"]) {
    //     alertBox(t("@MSG_END_THEN_START_NO")); //종료가 시작보다 작게 입력할 수 없습니다.
    //     return;
    //   }
        
    //   if(row["endTime"] == 0) {
    //     alertBox(t("@MSG_END_NO_ZERO")); //종료에는 0을 입력할 수 없습니다.
    //     return;
    //   }

	  //   if(!row["startTime"] && !row["endTime"]) {
	  //     props.onComplete(row, initRow.current);
	  //   }else if(row["startTime"] && row["endTime"]) {
	  //     props.onComplete(row, initRow.current);
	  //   }else{
	  //     alertBox(t("MSG_START_END_TOTAL_WIRTE")); //시작, 종료 모두 입력해 주세요.
	  //   }  
	}

  const rawTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>, value: string) => {
    console.log('what?')
    // if(value == 'P'){ // PC
    //   tableRef.current.setMapCode("infotablepc");
    //   colRef.current.setMapCode("infocolbytablepc");
    // }else{ // PLC
    //   tableRef.current.setMapCode("infotable");
    //   colRef.current.setMapCode("infocolbytablenojson");
    // }
  }

  const roomChangeHandler = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    colRef.current.setCategory(value?.value);
  };

  const changeCode = (event : any ) => {
    colRef.current.setCategory(event.target.value);
  }

  return (
    <EditBase
      ref={ref}
      header= "SPC JUDGE EDIT"
      size="xl"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
    > 
      <Row>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              {t("@COL_OPERATION_CODE")}
            </Label>
            <AutoCombo name="operCode" sx={{ minWidth: "150px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" /> {/* 공정코드 */}
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              {t("@INSPECTION_NAME")}
            </Label>
            <AutoCombo name="inspectionDesc" sx={{ minWidth: "150px" }} placeholder={t("@INSPECTION_NAME")} mapCode="spcblack" category = '' /> {/* 검사명 */}
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="paramName">
              {t("@COL_EQP_CODE")}
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "150px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" /> { /* 설비코드 */ }
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="cateName">
              {t("@COL_ITEM_CODE")}
            </Label>
            <AutoCombo name="itemCode" sx={{ minWidth: "150px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item"/> {/* 제품코드 */}
          </div>
        </Col>
      </Row>
      {/* <Row>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="tableName">
              {t("@COLLECTION_EQUIPMENT_TYPE")}
            </Label>
            <Select name="rawType" placeholder={t("@COLLECTION_EQUIPMENT_TYPE")} onChange={rawTypeChangeHandler} defaultValue="L" mapCode="code" category="HC_TYPE" className="form-select" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="tableName">
              {`RawTable${t("@COL_NAME")}`}
            </Label>
            <AutoCombo ref={tableRef} name="tableName" placeholder={`RawTable${t("@COL_NAME")}`} onChange={roomChangeHandler} mapCode="infotable" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="columnName">
              {`RawColumn${t("@COL_NAME")}`}
            </Label>
            <AutoCombo ref={colRef} name="columnName" placeholder={`RawColumn${t("@COL_NAME")}`} mapCode="infocolbytablenojson" required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="columnName">
              {t("@COL_START")}
            </Label>
            <Input name="startTime" type="number" step={1}/>
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="columnName">
              {t("@COL_END")}
            </Label>
            <Input name="endTime" type="number" step={1}/>
          </div>
        </Col>
      </Row> */}
      <Row>
      <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_1_X
            </Label>
            <Select name="judgeRule1X" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_1_R
            </Label>
            <Select name="judgeRule1R" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_2
            </Label>
            <Select name="judgeRule2" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_3
            </Label>
            <Select name="judgeRule3" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_4
            </Label>
            <Select name="judgeRule4" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_5
            </Label>
            <Select name="judgeRule5" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_6
            </Label>
            <Select name="judgeRule6" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_7
            </Label>
            <Select name="judgeRule7" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              RULE_8
            </Label>
            <Select name="judgeRule8" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
      </Row>
      <Row>
      <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@REMARKS")}
            </Label>
            <Input name="remark" type="text" />
          </div>
        </Col>
      </Row>
    </EditBase>
  )

});

export default SpcBlackListEdit;