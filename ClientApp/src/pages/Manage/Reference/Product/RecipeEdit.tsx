import Select from "../../../../components/Common/Select";
import { ChangeEvent, forwardRef, SyntheticEvent, useRef, useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import AutoCombo from "../../../../components/Common/AutoCombo";
import { executeIdle, isNullOrWhitespace } from "../../../../common/utility";
import { alertBox } from "../../../../components/MessageBox/Alert";
import LangTextBox from "../../../../components/Common/LangTextBox";
import { useTranslation } from "react-i18next";

const RecipeEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const tableRef = useRef<any>();
  const colRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef;
    initRow.current = init;

    if(initRow.current.eqpCode) {
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
      alertBox(t("@MSG_START_END_NO_ZORO"));   //시작, 종료 모두 0을 입력할 수 없습니다.
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
      alertBox(t("@MSG_START_END_TOTAL_WIRTE"));  //시작, 종료 모두 입력해 주세요.
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

  return (
    <EditBase
      ref={ref}
      header= "Recipe Edit"
      size="xl"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="groupCode">
              {t("@COL_GROUP_CODE")}
            </Label>
            <AutoCombo name="groupCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_GROUP_CODE")} mapCode="recipeparamgroup" required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="eqpCode">
              {/* 설비코드 */}
              {t("@COL_EQP_CODE")}
            </Label>
            <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="recipeName">
              {/* Recipe명 */}
              {t("@COL_RECIPE_NAME")}
            </Label>
            <LangTextBox name="recipeName" type="text" required={true} mode="single" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="tableName">
              {/* 수집장비유형 */}
              {t("@COLLECTION_EQUIPMENT_TYPE")}
            </Label>
            <Select name="rawType" placeholder={t("@COLLECTION_EQUIPMENT_TYPE")} onChange={rawTypeChangeHandler} defaultValue="L" mapCode="code" category="HC_TYPE" className="form-select" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="tableName">
              {/* Rawtable명 */}
              {`Rawtable${t("@COL_NAME")}`}
            </Label>
            <AutoCombo ref={tableRef} name="tableName" placeholder={`Rawtable${t("@COL_NAME")}`} onChange={roomChangeHandler} mapCode="infotable" required={true} />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="columnName">
              {/* RawColumn명 */}
              {`RawColumn${t("@COL_NAME")}`}
            </Label>
            <AutoCombo ref={colRef} name="columnName" placeholder={`RawColumn${t("@COL_NAME")}`} mapCode="infocolbytablenojson" required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="columnName">
              {/* 시작 */}
              {t("@COL_START")}
            </Label>
            <Input name="startTime" type="number"  step={1} min={0}/>
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="columnName">
              {/* 종료 */}
              {t("@COL_END")}
            </Label>
            <Input name="endTime" type="number" step={1} min={0}/>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="baseVal">
              {/* 기준값 */}
              {t("@COL_REFERENCE_VALUE")}
            </Label>
            <Input name="baseVal" type="number" step={0.001} min={0} required={true} />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="interlockYn">
              {/* 인터락 여부 */}
              {t("@INTERLOCK_YN")}
            </Label>
            <Select name="interlockYn" label="  " placeholder={t("@INTERLOCK_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              {/* 알람 여부 */}
              {t("@ALARM_YN")}
            </Label>
            <Select name="alarmYn" label="  " placeholder={t("@ALARM_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="alarmYn">
              {/* 판정여부 */}
              {t("@JUDGE_YN")}
            </Label>
            <Select name="judgeYn" label="  " placeholder={t("@JUDGE_YN")} defaultValue="Y" mapCode="code" category="YN_CODE" required={true} className="form-select" />
          </div>
        </Col>
      </Row>
      <Row>
      <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="val1">
              {/* 등급 */}
              {t("@COL_GRADE")}
            </Label>
            <Input name="val1" type="text" />
          </div>
        </Col>
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {/* 설명(비고) */}
              {t("@REMARK")}
            </Label>
            <Input name="remark" type="text" />
          </div>
        </Col>
      </Row>
      <Row>
    </Row>


    </EditBase>
  )



});

export default RecipeEdit;