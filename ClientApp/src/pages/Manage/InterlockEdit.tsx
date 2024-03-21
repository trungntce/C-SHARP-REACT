import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import StManager from "./StManagerList";
import { useTranslation } from "react-i18next";

const InterlockEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
    if (initRow.current.interlockId) {
      formRef.elements["interlockId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="Interlock"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="interlockCode">
              {/* 인터락 Code */}
              {`${t("@COL_INTERLOCK")} CODE`}
            </Label>
            <Input
              name="interlockCode"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="interlockName">
              {/* 인터락 Name */}
              {`${t("@COL_INTERLOCK")} NAME`}
            </Label>
            <Input
              name="interlockName"
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
            <Label className="form-label" htmlFor="interlockType">
              {/* 인터락 Type */}
              {`${t("@COL_INTERLOCK")} TYPE`}
            </Label>
            <Input
              name="interlockType"
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
            <Input name="remark" type="text" required={true} className="form-control" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {/* 사용여부 */}
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
              required={true}
              className="form-control"
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default InterlockEdit;
