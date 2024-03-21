import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const NoticeEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef;
    initRow.current = init;

    if (initRow.current.title) {
      form.current.elements["title"].disabled = true;
      console.log(new Date().toISOString());
    } else {
    }
  };

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {};

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  return (
    <EditBase
      ref={ref}
      header="Notice Edit"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="useYn">
              {`${t("@USEYN")} *`}      {/*사용여부*/}
            </Label>
            <select
              name="useYn"
              defaultValue={"Y"}
              required={true}
              className="form-select"
            >
              <option value="">{t("@USEYN")}</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="title">
              {`${t("@TITLE")} *`}    {/* 타이틀 */}
            </Label>
            <Input
              name="title"
              type="text"
              required={true}
              autoComplete="off"
              className="form-control"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="startDt">
              {t("@START_DATE")}            {/* 시작 날짜 */}
            </Label>
            <Input
              name="startDt"
              className="form-control"
              type="datetime-local"
              defaultValue="2023-01-01T12:00:00"
            />
          </div>
        </Col>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="endDt">
              {t("@LAST_DATE")}           {/* 마지막 날짜 */}
            </Label>
            <Input
              name="endDt"
              className="form-control"
              type="datetime-local"
              defaultValue="2023-01-01T12:00:00"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label" htmlFor="body">
              {t("@CONTENT")}                  {/* 내용 */}
            </Label>
            <Input
              name="body"
              type="text"
              className="form-control"
              autoComplete="off"
            />
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default NoticeEdit;
