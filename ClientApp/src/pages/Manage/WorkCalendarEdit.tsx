import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../components/Common/DateTimePicker";
import moment from "moment";
import AutoCombo from "../../components/Common/AutoCombo";

const WorkCalendarEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();

  const { t } = useTranslation();
  
  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.workDate) {
      formRef.elements["workDate"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="WorkCalendar Edit"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="workDate">
              작업일
            </Label>
            <DateTimePicker name="workDate" defaultValue={moment().add(0, 'days').toDate()} required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offDate">
              휴게일
            </Label>
            <DateTimePicker name="offDate" defaultValue={moment().add(0, 'days').toDate()} required={true} />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="workerId">
              작업자ID
            </Label>
            <AutoCombo name="workerId" sx={{ minWidth: "200px" }} placeholder="작업자" mapCode="worker" required={true} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <div className="mb-2">
            <Label className="form-label" htmlFor="workYn">
              작업유무
            </Label>
            <select name="workYn" className="form-select">
              <option value="">{t("@USEYN")}</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              비고
            </Label>
            <Input name="remark" type="text" className="form-control" />
          </div>  
        </Col>
        {/* <Col md={4}>
          <div className="mb-2">
            <Label className="form-label" htmlFor="shiftType">
              주/야간
            </Label>
            <select name="shiftType" className="form-select">
              <option value=""> </option>
              <option value="D">D</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col> */}
      </Row>
    </EditBase>
  );
});

export default WorkCalendarEdit;
