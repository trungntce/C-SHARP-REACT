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

const ParamEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const tableRef = useRef<any>();
  const colRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef;
    initRow.current = init;

    if(initRow.current.eqpCode) {
      form.current.elements['eqpCode'].disabled = true;

      executeIdle(() => {
        if(initRow.current!.rawType == 'P'){ // PC
          tableRef.current.setMapCode("infotablepc");
          colRef.current.setMapCode("infocolbytablepc");
        }else{ // PLC
          tableRef.current.setMapCode("infotable");
          colRef.current.setMapCode("infocolbytablenojson");
        }
        
        colRef.current.setCategory(initRow.current!.tableName);
      });
    }else{

    }
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
	 	if(isNullOrWhitespace(row["startTime"]))
	      row["startTime"] = null;
	    else
	      row["startTime"] = parseInt(row["startTime"], 10);

	    if(isNullOrWhitespace(row["endTime"]))
	      row["endTime"] = null;
	    else
	      row["endTime"] = parseInt(row["endTime"], 10);
      
      if(row["startTime"] == 0 && row["endTime"] == 0) {
       alertBox(t("@MSG_START_END_NO_ZORO")); //시작, 종료 모두 0을 입력할 수 없습니다.
        return;
      }

      if(row["startTime"] > row["endTime"]) {
        alertBox(t("@MSG_END_THEN_START_NO")); //종료가 시작보다 작게 입력할 수 없습니다.
        return;
      }
        
      if(row["endTime"] == 0) {
        alertBox(t("@MSG_END_NO_ZERO")); //종료에는 0을 입력할 수 없습니다.
        return;
      }

	    if(!row["startTime"] && !row["endTime"]) {
	      props.onComplete(row, initRow.current);
	    }else if(row["startTime"] && row["endTime"]) {
	      props.onComplete(row, initRow.current);
	    }else{
	      alertBox(t("MSG_START_END_TOTAL_WIRTE")); //시작, 종료 모두 입력해 주세요.
	    }  
	}

  const rawTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>, value: string) => {
    if(value == 'P'){ // PC
      tableRef.current.setMapCode("infotablepc");
      colRef.current.setMapCode("infocolbytablepc");
    }else{ // PLC
      tableRef.current.setMapCode("infotable");
      colRef.current.setMapCode("infocolbytablenojson");
    }
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
      header= "Param Edit"
      size="xl"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
    > 
      <Row>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="groupCode">
              {t("@COL_GROUP_CODE")}
            </Label>
            <AutoCombo name="groupCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_GROUP_CODE")} mapCode="recipeparamgroup"  required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              {t("@COL_EQP_CODE")}
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="paramName">
              {t("@COL_PARAMETER_NAME")}
            </Label>
            <LangTextBox mode="single" name="paramName" type="text" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="cateName">
              {t("@COL_CATEGORY_NAME")}
            </Label>
            <Input name="cateName" type="text" />
          </div>
        </Col>
      </Row>
      <Row>
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
      </Row>
      <Row>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="std">
              {t("@COL_STANDARD_VALUE")}
            </Label>
            <Input name="std" type="number" step={0.001} min={0} required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="lcl">
              LCL
            </Label>
            <Input name="lcl" type="number" step={0.001} min={0} required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="ucl">
              UCL
            </Label>
            <Input name="ucl" type="number" step={0.001} min={0} required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="lsl">
              LSL
            </Label>
            <Input name="lsl" type="number" step={0.001} min={0} required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="usl">
              USL
            </Label>
            <Input name="usl" type="number" step={0.001} min={0} required={true} />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="interlockYn">
              {t("@INTERLOCK_YN")}
            </Label>
            <Select name="interlockYn" label="  " placeholder={t("@INTERLOCK_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              {t("@ALARM_YN")}
            </Label>
            <Select name="alarmYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>        
      </Row>
      <Row>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="paramShortName">
              {t("@ABBREVIATION")}
            </Label>
            <Input name="paramShortName" type="text" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="unit">
              {t("@COL_UNIT")}
            </Label>
            <Input name="unit" type="text" />
          </div>
        </Col>
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {t("@REMARK")}
            </Label>
            <Input name="remark" type="text" />
          </div>
        </Col>
        <Col md={1}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="unit">
              {t("@JUDGE_YN")}
            </Label>
            <Select name="judgeYn" label="" placeholder={t("@JUDGE_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
      </Row>
    </EditBase>
  )

});

export default ParamEdit;