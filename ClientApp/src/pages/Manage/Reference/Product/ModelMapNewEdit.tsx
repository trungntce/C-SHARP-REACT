import { forwardRef, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import { showProgress } from "../../../../components/MessageBox/Progress";

const ModelMapNewEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;

    if (initRow.current.modelCode) {
      formRef.elements["modelCode"].disabled = true;
      formRef.elements["modelName"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  const getInfoFile = () => { 
    const file: any = document.getElementById('fileUpload');
    if (file && file.files.length > 0) {
      const lbl = document.getElementById('lblContent');
      if (lbl && lbl !== undefined) { 
        lbl.innerText = file.files[0].name;
      }
    }
  }

  return (
    <EditBase
      ref={ref}
      header="Recipe 승인요청"
      initHandler={initHandler}
      submitHandler={submitHandler}
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="modelCode">
              {t("@COL_MODEL_CODE")}
            </Label>
            <Input name="modelCode" type="text" className="form-control" />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="modelName">
              {t("@COL_MODEL_NAME")}
            </Label>
            <Input name="modelName" type="text" className="form-control" />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="type">
            구분
            </Label>
            <select name="type" className="form-select" defaultValue={"1"} required={true}>
              <option value="1">최초</option>
              <option value="2">양산</option>
              <option value="3">변경(샘플)</option>
              <option value="4">변경(양산)</option>
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="revNote">
              {t("@REMARK")}
            </Label>
            <Input name="revNote" type="text" className="form-control" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="files">
              Recipe 대분류코드
            </Label>
            <Col md={12}>
              <div 
                style={{ height : '100%', border: '1px solid #ccc'}} 
                onClick={() => {
                document.getElementById('fileUpload')?.click();
              }}>
                <Input name="files" type="file" id="fileUpload" onChange={getInfoFile} hidden/>
                <a type="submit" className="btn btn-primary" onClick={() => { 
                  }}>
                  <i className="uil uil-file me-2"></i>파일 선택
                </a>
                &nbsp;&nbsp;
                <span id="lblContent"></span>
              </div>
            </Col>
          </div>
        </Col>
      </Row>
    </EditBase>
  );
});

export default ModelMapNewEdit;