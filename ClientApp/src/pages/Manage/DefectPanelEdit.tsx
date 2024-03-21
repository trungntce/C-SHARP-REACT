import React, { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";

const DefectPanelEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    console.log(init);
    
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
      header="Defect"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="panelId">
              PNL ID
            </Label>
            <Input
              name="panelId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="defectCode">
              {t("@COL_DEFECT_CODE")}
            </Label>
            {/* 230621 변경 */}
            <AutoCombo name="defectCode" sx={{ minWidth: 170 }} placeholder={t("@COL_DEFECT_CODE")} mapCode="code" category="DEFECTREASON" />
            {/* <Input
              name="defectCode"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            /> */}
          </div>
        </Col>
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="onRemark">
              {t("@COL_REASON")}
            </Label>
            <Input
              name="onRemark"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="onUpdateUser">
              {t("@REGISTRATION_OFFICER")}
            </Label>
            <Input
              name="onUpdateUser"
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

export default DefectPanelEdit;
