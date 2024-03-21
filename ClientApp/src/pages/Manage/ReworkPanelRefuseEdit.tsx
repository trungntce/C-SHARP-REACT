import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const ReworkRefuseEdit = forwardRef((props: any, ref: any) => {
  const initRow = useRef<Dictionary>();
  const { t } = useTranslation();
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
      header="Rework"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        {/* <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="panelId">
              판넬 ID
            </Label>
            <Input
              name="panelId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col> */}
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="refuseRemark">
              {t("@REWORK_REFUSAL_REASON")}
            </Label>
            <Input
              name="refuseRemark"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="refuseUpdateUser">
              {t("@REWORK_REFUSAL_MANAGER")}
            </Label>
            <Input
              name="refuseUpdateUser"
              type="text"
              required={true}
              className="form-control"
              readOnly={true}
              defaultValue={localStorage.getItem("user-name")?.toString()}
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ReworkRefuseEdit;
