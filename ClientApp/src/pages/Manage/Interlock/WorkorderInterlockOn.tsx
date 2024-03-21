import { forwardRef, SyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormGroup, ButtonGroup } from "reactstrap";
import api from "../../../common/api";
import { useGridRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import { isNullOrWhitespace } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import EditBase from "../../../components/Common/Base/EditBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { showProgress } from "../../../components/MessageBox/Progress";
import { panelDefs } from "../../Trace/PanelDefs";
import { useTranslation } from "react-i18next";

const WorkorderInterlockOn = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();

  const innerRef = useRef<any>();
  const listRef = useRef<Dictionary[]>([]);
  const workorderRef = useRef<any>();
  const operRef = useRef<any>();

  const [panelGridRef, setPanelList] = useGridRef();

  const initHandler = (formRef: any, init: Dictionary) => {
    initRow.current = init;
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
  }

  const submitHandler = async (formData: FormData, row: Dictionary) => {
    const param = { ...row };
    param.panelGroupKey = operRef.current.getValue().parent;

    confirmBox(t("@MSG_ASK_SET_INTERLOCK"), async () => { //인터락 설정 하시겠습니까?

      const { hideProgress, startFakeProgress } = showProgress("Transaction progress", "progress");
      startFakeProgress();
      const result = await api<any>("put", "panelinterlock/workorder", param);
      hideProgress();

      if (result.data == -1) {
        alertBox(`Batch: ${param.workorder} ${t("@MSG_ALREADY_SETUP_INTERLOCK")}`);  //Batch: ${param.workorder} 는 이미 인터락이 설정되어 있습니다.
        return;
      }else if(result.data < 0){
        alertBox(t("@MSG_ERROR_TYPE2"));  //설정 중 오류가 발생했습니다.
        return;
      }

      alertBox(t("@MSG_COMPLETED")); //완료되었습니다.

      props.onComplete();
    }, async () => {
    });
  }

  const operChangeHandler = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => {
    if(!value){
      setPanelList([]);
      return;
    }

    const groupKey = value?.parent;
    panelGridRef.current!.api.showLoadingOverlay();
    api("get", "trace/panelbygroup", { "groupKey": groupKey }).then((result: Dictionary) => {
      if(result.data)
        setPanelList(result.data);
    });
  };

  useImperativeHandle(ref, () => ({
    setList: (rows: Dictionary[]) => {
      listRef.current = rows;

      const find = rows.find(x => !!x.workorderInterlockCode);
      if (find) {
        alertBox(`Batch: ${find.workorder} ${t("@MSG_ALREADY_INTERLOCK_SET")}`);
        return false;
      }

      return true;
    },
    setForm: innerRef.current.setForm,
    setShowModal: innerRef.current.setShowModal
  }));

  const getPanelRef = () => {
    const panel = panelDefs().filter(x => x.headerClass != "multi4m");

    return panel;
  }

  useEffect(() => {
  }, [])

  return (
    <EditBase
      ref={innerRef}
      header="Batch 인터락 설정"
      initHandler={initHandler}
      changeHandler={changeHandler}
      submitHandler={submitHandler}
      size={"xl"}
      buttons={
        <Row>
          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button type="submit" color="primary">
                <i className="uil uil-edit me-2"></i> {t("@SAVE")}
              </Button>
              <Button type="button" color="light" onClick={() => { ref.current.setShowModal(false); }}>
                <i className="uil uil-times me-2"></i> {t("@CLOSE")}
              </Button>
            </div>
          </Col>
        </Row>
      }
    >
      <Row>
        <Col md={7}>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <Label className="form-label" htmlFor="judgeCode">
                  Batch
                </Label>
                <ButtonGroup>
                  <Input innerRef={workorderRef} name="workorder" type="text" className="form-control" placeholder="Batch" required={true} />
                  <Button type="button" color="primary" onClick={() => {
                    const workorder = workorderRef.current.value;
                    if (isNullOrWhitespace(workorder)) {
                      alertBox(`Batct${t("@MSG_PLEASE_ENTER_NUMBER")}`); //Batch번호를 입력해 주세요.
                      return;
                    }

                    api("get", "trace/panel4m", { workorder }).then((result: Dictionary) => {
                      if (result.data?.length) {
                        const maps = result.data.map((x: Dictionary) => {
                          return { value: x.operSeqNo.toString(), label: `${x.operName} Panel: ${x.panelCnt}`, parent: x.groupKey };
                        });

                        operRef.current.setMaps([{ value: "", label: "" }, ...maps]);
                        operRef.current.setOpen(true);
                      } else {
                        alertBox(t("@NG_NO_SEARCH_PROCESS")); //검색된 공정이 없습니다.
                        return;
                      }
                    });
                  }} style={{ width: "180px" }}>
                    <i className="uil uil-search me-2"></i>{t("@SEARCH_PROCESS")}  {/* 공정검색 */}
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <Label className="form-label" htmlFor="judgeCode">
                  {t("@OPERATION")}  {/* 공정검색 */}
                </Label>
                <AutoCombo ref={operRef} name="operSeqNo" placeholder={t("@OPERATION")} required={true} onlyCompareValue={true}
                  onChange={operChangeHandler} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <div className="mb-3">
                <Label className="form-label" htmlFor="judgeCode">
                  {t("@INTERLOCK_CODE")}  {/* 인터락 코드 */}
                </Label>
                <AutoCombo name="interlockCode" placeholder={t("@INTERLOCK_CODE")} mapCode="code" category="HOLDINGREASON" required={true} />
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <Label className="form-label" htmlFor="judgeCode">
                  {`PNL ${t("@INTERLOCK_YN")}`}  {/*PNL 인터락 여부 */}
                </Label>
                <select name="panelInterlockYn" className="form-select" defaultValue={"Y"} required={true}>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <Label className="form-label" htmlFor="createUserId">
                 {t("@PERSONINCHARGE_NAME")}  {/*담당자명*/}
                </Label>
                <Input name="settleUserName" type="text" className="form-control" placeholder={t("@PERSONINCHARGE_NAME")} required={true}
                  defaultValue={localStorage.getItem("user-name")?.toString()} readOnly={true} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="mb-3">
                <Label className="form-label" htmlFor="remark">
                  {t("@INTERLOCK_REASON")}  {/*인터락 사유*/}
                </Label>
                <Input name="remark" type="text" placeholder={t("@INTERLOCK_REASON")} autoComplete="off" />
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={5}>
          <div className="pb-3" style={{ height: "100%" }}>
            <GridBase
              ref={panelGridRef}
              rowSelection={'multiple'}
              columnDefs={getPanelRef()}
              rowMultiSelectWithClick={false}
              tooltipShowDelay={0}
              tooltipHideDelay={1000}
              onGridReady={() => {
                setPanelList([]);
              }}
            />
          </div>
        </Col>
      </Row>


    </EditBase>
  );
});

export default WorkorderInterlockOn;
