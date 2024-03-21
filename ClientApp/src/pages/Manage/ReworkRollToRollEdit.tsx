import { forwardRef, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import AutoCombo from "../../components/Common/AutoCombo";
import api from "../../common/api";
import { AgGridReact } from "ag-grid-react";
import { useTranslation } from "react-i18next";

const ReworkRollToRollEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [rollId, setRollId] = useState("");
  const [opers, setOpers] = useState([]);
  const [operSeq, setOperSeq] = useState("");
  const [operCode, setOperCode] = useState("");
  const [operName, setOperName] = useState("");
  const [columnDefs] = useState<any[]>([
    { field: "operSeq", flex: 1 },
    { field: "operCode", flex: 1 },
    { field: "operName", flex: 1 },
  ]);
  const initRow = useRef<Dictionary>();
  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
    if (initRow.current.panelId) {
      //formRef.elements["panelId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  const goModal = async () => {
    setModal(true);
    await api<any>("get", "rework/getmotherrollopers", { rollId: rollId }).then(
      (result) => {
        setOpers(result.data);
      }
    );
  };

  const onCellClicked = (params: any) => {
    const selectedData = params.data;
    setOperSeq(selectedData.operSeq);
    setOperCode(selectedData.operCode);
    setOperName(selectedData.operName);
    setModal(false);
  };

  const reset = () => {
    setRollId("");
    setOperSeq("");
    setOperCode("");
    setOperName("");
  };

  return (
    <EditBase
      ref={ref}
      header="Rework"
      initHandler={initHandler}
      submitHandler={submitHandler}
      preButtons={
        <Button
          type="submit"
          color="secondary"
          onClick={() => {
            reset();
          }}
        >
          <i className="uil"></i>{t("@INITIALIZATION")}   {/*초기화*/}
        </Button>
      }
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="parentRollId">
              {`${t("@COL_PARENT_ROLL_ID")}(${t("@MSG_ID_INPUT_AFTER_OPERATION_SELECT")})`}   {/*부모 롤 ID (ID 입력 후 공정 선택) */}
            </Label>
            <Input
              name="parentRollId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
              value={rollId}
              onChange={(e) => setRollId(e.target.value)}
            />
          </div>
        </Col>
        <Col md={2}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operCode">
              {t("@OPERATION_LOOKUP")}                    {/*공정 조회*/}
            </Label>
            <Button
              type="button"
              outline
              color="info"
              style={{ width: "100%" }}
              onClick={() => goModal()}
            >
              {t("@OPERATION_SELECT")}                      {/*공정 선택*/}
            </Button>
            <Modal
              isOpen={modal}
              toggle={() => {
                setModal(!modal);
              }}
              centered={true}
            >
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  {t("@OPERATION_SELECT")}                      {/*공정 선택*/}
                  <div
                    className="ag-theme-alpine"
                    style={{ height: 1000, width: 480 }}
                  >
                    <AgGridReact
                      rowData={opers}
                      columnDefs={columnDefs}
                      onCellClicked={onCellClicked}
                    ></AgGridReact>
                  </div>
                </h5>
              </div>
            </Modal>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operSeq">
              {t("@COL_OPERATION_SEQ_NO")}                                {/*공정순서*/}
            </Label>
            <Input
              name="operSeq"
              type="text"
              required={true}
              className="form-control"
              value={operSeq}
              onChange={(e) => setOperSeq(e.target.value)}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operCode">
              {t("@COL_OPERATION_CODE")}                       {/*공정코드*/}
            </Label>
            <Input
              name="operCode"
              type="text"
              required={true}
              className="form-control"
              value={operCode}
              onChange={(e) => setOperCode(e.target.value)}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operName">
              {t("@COL_OPERATION_NAME")}                              {/*공정명*/}
            </Label>
            <Input
              name="operName"
              type="text"
              required={true}
              className="form-control"
              value={operName}
              onChange={(e) => setOperName(e.target.value)}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="reworkCode">
              {t("@REWORK_CODE")}        {/*재처리코드*/}
            </Label>
            <AutoCombo
              name="reworkCode"
              sx={{ minWidth: 170 }}
              placeholder={t("@REWORK_CODE")} 
              mapCode="rework"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="putUpdateUser">
              {t("@REWORK_REQUEST_MANAGER")}                {/* 재처리 요청 담당자*/}
            </Label>
            <Input
              name="putUpdateUser"
              type="text"
              required={true}
              className="form-control"
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="putRemark">
              {t("@REMARKS")}                                {/*비고*/}
            </Label>
            <Input
              name="putRemark"
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

export default ReworkRollToRollEdit;
