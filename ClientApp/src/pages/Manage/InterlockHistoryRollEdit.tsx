import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import StManager from "./StManagerList";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";

const InterlockHistoryRollEdit = forwardRef((props: any, ref: any) => {
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
      header="InterlockHistory"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="rollId">
              Roll ID
            </Label>
            <Input
              name="rollId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="onUpdateUser">
              {/* 인터락 ON 직원 */}
              {`${t("@COL_INTERLOCK")} ON ${t("@COL_EMPLOYEE")}`}
            </Label>
            <Input
              name="onUpdateUser"
              type="text"
              required={true}
              className="form-control"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="interlockCode">
              {/* 인터락 CODE & 사유 */}
              {`${t("@COL_INTERLOCK")} CODE & ${t("@COL_REASON")}`}
            </Label>
            <AutoCombo name="interlockCode" sx={{ minWidth: 170 }} placeholder={t("@INTERLOCK_CODE")} mapCode="interlock" />
            {/* <Input
              name="interlockCode"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            /> */}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="onRemark">
              {/* 비고 */}
              {t("@REMARKS")}
            </Label>
            <Input
              name="onRemark"
              type="text"
              className="form-control"
              //required={true}
              autoComplete="off"
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default InterlockHistoryRollEdit;
