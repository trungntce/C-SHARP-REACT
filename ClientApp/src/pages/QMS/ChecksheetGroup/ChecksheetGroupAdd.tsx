import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../../common/types";
import EditBase from "../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import moment from "moment";


const ChecksheetGroupAdd = forwardRef((props: any, ref: any) => {
    const initRow = useRef<Dictionary>();
    const form = useRef<any>();
    const { t } = useTranslation();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;

    if(initRow.current.chksOperId){
      // form.current.elements["chksOperId"].disabled = true;
    }else{
    }

  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }


  const submitHandler =(formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  return (
    <>
      <EditBase 
        ref={ref}
        header="Check Sheet Group Add"
        initHandler={initHandler}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        >
        <Row>
              <Input name="chksOperId" type="hidden" required={true} autoComplete="off" className="form-control" />
          <Col md={4}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="chksOperCode">
              Chks_Oper_Code *
              </Label>
              <Input name="chksOperCode" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={4}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="chksOperName">
              Chks_Oper_Name *
              </Label>
              <Input name="chksOperName" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={4}>
          <Label className="form-label" htmlFor="validStrtDt">
            Valid_Strt_Dt *
            </Label>
            <DateTimePicker name="validStrtDt" defaultValue={moment().add(0, 'days').toDate()} required={true} />
          </Col>
        </Row>
        <Row>
         <Col md={3}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="operationCode">
                Oper Code *
              </Label>
              <Input name="operationCode" type="text" className="form-control" autoComplete="off"  required={true}/>
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="remark">
                설명(Ghi chú)
              </Label>
              <Input name="remark" type="text" className="form-control" autoComplete="off" />
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
                <Label className="form-label" htmlFor="useYn">
                사용여부
                </Label>
                <select name="useYn" className="form-select" defaultValue={"Y"} required={true}>
                <option value="">{t("@USEYN")}</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
                </select>
            </div>
          </Col>
          <Col md={3}>
          <Label className="form-label" htmlFor="validEndDt">
            Valid_End_Dt
            </Label>
            <DateTimePicker name="validEndDt" defaultValue={moment().add(0, 'days').toDate()} required={false} />
          </Col>
        </Row>
      </EditBase>
    </>    
  );
});

export default ChecksheetGroupAdd;
