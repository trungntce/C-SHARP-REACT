import { ChangeEvent, forwardRef, SyntheticEvent, useRef, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";

import { useTranslation } from "react-i18next";
import { isNullOrWhitespace } from "../../common/utility";
import { Dictionary } from "../../common/types";
import { alertBox } from "../../components/MessageBox/Alert";
import EditBase from "../../components/Common/Base/EditBase";
import AutoCombo from "../../components/Common/AutoCombo";
import Select from "../../components/Common/Select";

const OperInspMatter4MEdit = forwardRef((props: any, ref: any) => {
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
    console.log(row)
    if(isNullOrWhitespace(row["chemYn"])){
      alertBox(`${t("@CHEM")} is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["materialYn"])){
      alertBox(`${t('@MATERIAL')} is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["operCode"])){
      alertBox(`${t("@COL_OPERATION_NAME")} is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["panelYn"])){
      alertBox(`PANEL is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["paramYn"])){
      alertBox(`PV is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["qtimeYn"])){
      alertBox(`QTIME is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["recipeYn"])){
      alertBox(`SV is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["samplingYn"])){
      alertBox(`${t("@SAMPLING_INSPECTION")} is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["spcYn"])){
      alertBox(`SPC is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["toolYn"])){
      alertBox(`Tool is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["totalInspYn"])){
      alertBox(`${t("@TOTAL_INSPECTION")} is Empty`)
      return;
    }
    if(isNullOrWhitespace(row["workerYn"])){
      alertBox(`${t("@WORKER")} is Empty`)
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
      header= "BATCH TRACE EDIT"
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
            <AutoCombo name="operCode" sx={{ minWidth: "150px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" required={true}/> {/* 공정코드 */}
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
              { t('@MATERIAL') } {/* 자재 */}
            </Label>
            <Select name="materialYn" label="  " placeholder={t("@MATERIAL")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              TOOL
            </Label>
            <Select name="toolYn" label="  " placeholder={"TOOL"} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              { t("@WORKER") } {/* 작업자 */}
            </Label>
            <Select name="workerYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              { t("@SAMPLING_INSPECTION") }  {/* 샘플링 검사 */}
            </Label>
            <Select name="samplingYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              { t("@TOTAL_INSPECTION") } {/* 전수 검사 */}
            </Label>
            <Select name="totalInspYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              SPC
            </Label>
            <Select name="spcYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              Q-TIME
            </Label>
            <Select name="qtimeYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              { t("@CHEM") }  {/* 약품 */}
            </Label>
            <Select name="chemYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              SV
            </Label>
            <Select name="recipeYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              PV
            </Label>
            <Select name="paramYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              PANEL
            </Label>
            <Select name="panelYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
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

export default OperInspMatter4MEdit;