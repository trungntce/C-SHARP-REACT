import React, { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import StManager from "./StManagerList";
import { useTranslation } from "react-i18next";

const ReworkEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
    if (initRow.current.interlockId) {
      formRef.elements["reworkId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="rework"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codeId">
              {/* 재처리 Code */}
              {`${t("@COL_REWORK")} CODE`}
            </Label>
            <Input
              name="codeId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="codeName">
            {/* 재처리 Name */}
            {`${t("@COL_REWORK")} Name`}
            </Label>
            <Input
              name="codeName"
              type="text"
              required={true}
              className="form-control"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="remark">
              {/* 설명 */}
              {t("@REMARK")}
            </Label>
            <Input name="remark" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {/* 사용여부 (Y/N) */}
              {t("@USEYN")}
            </Label>
            <Input name="useYn" type="text" required={true} className="form-control" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="createUser">
              {/* 생성자 */}
              {t("@COL_CREATE_USER")}
            </Label>
            <Input
              name="createUser"
              type="text"
              className="form-control"
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ReworkEdit;
