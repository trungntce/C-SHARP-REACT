import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const DefectPanelCancelEdit = forwardRef((props: any, ref: any) => {
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
      header="Rework"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offRemark">
              {t("@COL_REASON")}
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
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="offUpdateUser">
             {t("@RELEASE_OFFICER")}
            </Label>
            <Input
              name="offUpdateUser"
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

export default DefectPanelCancelEdit;
