import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import StManager from "./StManagerList";
import { useTranslation } from "react-i18next";

const InterlockHistoryAllCancelEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
    if (initRow.current.panelId) {
      formRef.elements["panelId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="Interlock OFF"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offRemark">
              {/* 인터락 OFF 사유 */}
              {`${t("@COL_INTERLOCK")}) OFF ${t("@COL_REASON")}`}
            </Label>
            <Input
              name="offRemark"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offUpdateUser">
              {/* 인터락 OFF 직원 */}
              {`${t("@COL_INTERLOCK")} OFF ${t("@COL_EMPLOYEE")}`}
            </Label>
            <Input
              name="offUpdateUser"
              type="text"
              required={true}
              className="form-control"
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default InterlockHistoryAllCancelEdit;
