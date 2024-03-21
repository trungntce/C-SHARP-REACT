import { forwardRef, useEffect, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import AutoCombo from "../../components/Common/AutoCombo";
import api from "../../common/api";
import { AgGridReact } from "ag-grid-react";
import { useTranslation } from "react-i18next";

const ReworkPanelEdit = forwardRef((props: any, ref: any) => {
  const [modal, setModal] = useState(false);
  const [panelId, setPanelId] = useState('');
  const [opers, setOpers] = useState<any>([]);
  const [operSeq, setOperSeq] = useState('');
  const [operCode, setOperCode] = useState('');
  const [operName, setOperName] = useState('');
  const [columnDefs] = useState([
    { field: 'operSeq', flex:1 },
    { field: 'operCode', flex:1},
    { field: 'operName', flex:1 }
]);

    const pan = useRef<any>();
    const { t } = useTranslation();


  const initRow = useRef<Dictionary>();
  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
    if (initRow.current.panelId) {
      console.log(initRow.current.panelId);
      //formRef.elements["panelId"].disabled = true;
    } else {
    }
  };

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  };

  const goModal = async () => {
    setModal(true);
    await api<any>("get", "rework/getpanelopers", { panelId :panelId }).then((result) => {
      setOpers(result.data);
    })
  }

  const onCellClicked = (params:any) => {
    const selectedData = params.data;
    setOperSeq(selectedData.operSeq);
    setOperCode(selectedData.operCode);
    setOperName(selectedData.operName);
    setModal(false);
  };
  
  const reset = () => {
    setPanelId('');
    setOperSeq('');
    setOperCode('');
    setOperName('');
  }

  return (
    <EditBase
      ref={ref}
      header="Rework"
      initHandler={initHandler}
      submitHandler={submitHandler}
      preButtons={
        <Button type="submit" color="secondary" onClick={reset} >
              <i className="uil"></i>{t("@INITIALIZATION")}
        </Button>
      }
    >
      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="panelId">
                          {t("@COMPONENT_NAME_TYPE1")}
            </Label>
            <Input
              name="panelId"
              type="text"
              className="form-control"
              required={true}
              autoComplete="off"
              value={panelId}
              onChange={e=> setPanelId(e.target.value)}
            />
          </div>
        </Col>
        <Col md={3}>
          <div className="mb-3">
          <Label className="form-label" htmlFor="operCode">
                          {t("@OPERATION_LOOKUP")}
          </Label>
            <Button type="button" outline color="info" style={{width:"100%"}} onClick={()=>goModal()}>
                          {t("@OPERATION_SELECT")}
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
                                  {t("@OPERATION_SELECT")}
                  <div className="ag-theme-alpine" style={{height: 1000, width: 480}}>
                    <AgGridReact
                      rowData={opers}
                      columnDefs={columnDefs}
                      onCellClicked={onCellClicked}>
                    </AgGridReact>
                </div>
                </h5>
              </div>
            </Modal>
          </div>
        </Col>
        {/* <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operSeq">
              공정순서
            </Label>
            <Input
              name="operSeq"
              type="text"
              required={true}
              className="form-control"
              value={operSeq}
              onChange={e=>setOperSeq(e.target.value)}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operCode">
              공정코드
            </Label>
            <Input
              name="operCode"
              type="text"
              required={true}
              className="form-control"
              value={operCode}
              onChange={e=>setOperCode(e.target.value)}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="operName">
              공정명
            </Label>
            <Input
              name="operName"
              type="text"
              required={true}
              className="form-control"
              value={operName}
              onChange={e=>setOperName(e.target.value)}
            />
          </div>
        </Col> */}
        <Col md={5}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="reworkCode">
                          {t("@REWORK_CODE")}
            </Label>
            <AutoCombo name="reworkCode" sx={{ minWidth: 170 }} placeholder="재처리 CODE" mapCode="rework" />
          </div>
        </Col>
        <Col md={9}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="putRemark">
                          {t("@REMARKS")}
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
        <Col md={3}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="putUpdateUser">
              {t("@@REWORK_REQUEST_MANAGER")}
            </Label>
            <Input
              name="putUpdateUser"
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

export default ReworkPanelEdit;
