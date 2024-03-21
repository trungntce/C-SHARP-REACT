import {
  CellClickedEvent,
  RowClassParams,
  RowDataUpdatedEvent,
  RowSelectedEvent,
} from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef, useEditRef } from "../../../../common/hooks";
import { Dictionary, contentType } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import {
  columnModelListDefs,
  columnModelDetailDefs,
} from "./ModelApproveDefs";
import AutoCombo from "../../../../components/Common/AutoCombo";
import api from "../../../../common/api";
import { useEffect, useRef, useState } from "react";
import { alertBox } from "../../../../components/MessageBox/Alert";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import moment from "moment";
import ModelApproveEdit from "./ModelApproveEdit";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../../../common/utility";
import { showProgress } from "../../../../components/MessageBox/Progress";

const ModelApproveList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [searchItemRef, getSearchItem] = useSearchRef();
  const [modelRef, setModelList] = useGridRef();
  const [modelDetailRef, setModelDetailList] = useGridRef();
  const { refetch } = useApi("modelapprove", getSearch);
  const [editRef, setForm, closeModal] = useEditRef();

  useEffect(() => {
    searchHandler();
  }, []);

  const getSelectedModel = () => {
    const rows = modelRef.current!.api.getSelectedRows();
    return rows[0];
  };

  const editHandler = async (type: string) => {
    const model = getSelectedModel();
    if (!model) {
      alertBox(t("@MSG_NO_MODEL_SELECTED"));
      return;
    }

    const status = await api<any>("get", "modelapprove/statuscheck", {modelCode: model.modelCode, requestId: model.requestId});
    if(status.data <= 0){
       alertBox(t("작업을 수행 할 수 없습니다"));
       return;
    }

    if (type == 'approve' && ( !model.val1 || !model.val2 || !model.val3 ))
    {
      alertBox(t("작업을 수행 할 수 없습니다"));
      return;
    }

    const result = await api<any>("get", "modelapprove/groupcheck", {updateType: type});
    
    if(result.data > 0){
      setForm({ modelCode: model.modelCode, requestId: model.requestId, updateType: type });
    }
    else {
      alertBox("작업을 수행 할 수 없습니다");
      return;
    }
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.modelCode){
      const result = await api<any>("put", "modelapprove/approveupdate", newRow);

      if(result.data > 0){
        searchHandler();
        closeModal();

        modelRef.current!.api.deselectAll();
      }
    }
    else
    {
      closeModal();
      alertBox(t("@MSG_NO_MODEL_SELECTED"));
    }
  };

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setModelList(result.data);
    setModelDetailList([]);
  };

  const searchItemHandler = async (_?: Dictionary) => {
    const model = getSelectedModel();
    if (!model) {
      alertBox(t("@MSG_NO_MODEL_SELECTED"));
      return;
    }

    const params = getSearchItem();
    const result = await api<any>("get", "modelapprove/detaillist" , {
      modelCode: model.modelCode,
      revCode: model.revCode,
      approveYn: model.approveCode,
      requestId: model.requestId,
      operCode: params.operCode
    });

    if(result.data) setModelDetailList(result.data);
  };

  const modelSelectedHandler = async (e: CellClickedEvent<Dictionary>) => {
    if (!e.node.isSelected()) return;

    // if(e.column.getColId() == "modelCode"){
    //   const result = await api<any>("get", "modelapprove/modellist" , {
    //     modelCode: e.data!.modelCode,
    //     approveYn: e.data!.approveCode,
    //     requestId: e.data!.requestId
    //   });
  
    //   if(result.data) setModelDetailList(result.data);
    // }
    // else if(e.column.getColId() == "revCode" && e.data!.revCode){
    //   const result = await api<any>("get", "modelapprove/detaillist" , {
    //     revCode: e.data!.revCode,
    //     approveYn: e.data!.approveCode,
    //     requestId: e.data!.requestId
    //   });
  
    //   if(result.data) setModelDetailList(result.data);
    // }

    if (e.column.getColId() == "file") {

      if(!e.data!.filelocation || e.data!.filelocation == '') return;

      const param = getSearch();
      param.filelocation = e.data!.filelocation;

      let filename = e.data!.modelCode + '-' + e.data!.createUser + '-' + e.data!.createDt + '.' + e.data!.filelocation.split('.')[1];
      const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
      startFakeProgress();
  
      const result = await api<any>("download","modelapprove/getfile", param);

      downloadFile(filename, contentType.stream, [result.data]);
  
      hideProgress();
    }
    else {
      const result = await api<any>("get", "modelapprove/detaillist" , {
        modelCode: e.data!.modelCode,
        revCode: e.data!.revCode,
        approveYn: e.data!.approveCode,
        requestId: e.data!.requestId
      });
  
      if(result.data) setModelDetailList(result.data);
    }
  };

  const excelHandler = async(e:any) => {
    e.preventDefault();

    if(modelRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox("데이터가 없습니다.");
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","modelapprove", param);
    downloadFile(`MODEL_APPROVE_DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  const excelDetailHandler = async(e:any) => {
    e.preventDefault();

    if(modelDetailRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox("데이터가 없습니다.");
      return;
    }

    const model = getSelectedModel();

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","modelapprove/detaillist", {
      modelCode: model.modelCode,
      approveYn: model.approveCode,
      requestId: model.requestId,
      revCode: model.revCode,
      isExcel: true
    });
    downloadFile(`MODEL_APPROVE_DETAIL_DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  return (
    <>
      <ListBase
        folder="Reference Management"
        title="Recipe Model Mapping"
        icon="box"
        buttons={[]}
      >
      <SearchBase ref={searchRef} searchHandler={searchHandler}
            preButtons={
              <>
                <Button type="button" color="success" onClick={() => editHandler('reject')}>
                <i className="uil uil-pen me-2"></i> 요청 취소
                </Button>
                <Button type="button" color="success" onClick={() => editHandler('comment')}>
                <i className="uil uil-pen me-2"></i> 합의
                </Button>   
                <Button type="button" color="success" onClick={() => editHandler('approve')}>
                <i className="uil uil-pen me-2"></i> 승인
                </Button>
              </>
            }
            style={{ maxWidth: '400px !important' }}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <Row>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-3, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <Col>
                <AutoCombo
                  name="modelCode"
                  sx={{ minWidth: "270px" }}
                  placeholder={t("@COL_MODEL_CODE")}
                  mapCode="model"
                />
              </Col>
              <Col>
                <select
                  name="approveYn"
                  className="form-select"
                  style={{ minWidth: 130 }}
                >
                  <option value="">{t("@APPROVAL_STATUS")}</option>
                  <option value="N">{t("@APPROVAL_REQUEST")}</option>
                  <option value="P">{t("@APPROVAL_PENDING")}</option>
                  <option value="Y">{t("@APPROVAL_COMPLETED")}</option>
                  <option value="R">{t("@REJECT")}</option>
                  <option value="O">{t("@APPROVAL_COMPLETED_OLD")}</option>
                </select>
              </Col>
            </Row>
        </SearchBase>
        <Row style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={modelRef}
                columnDefs={columnModelListDefs()}
                onCellClicked={modelSelectedHandler}
                rowMultiSelectWithClick={false}
              />
            </div>
        </Row>
        <SearchBase ref={searchItemRef} searchHandler={searchItemHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelDetailHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <Row>
              <Col>
                <AutoCombo
                  name="operCode"
                  sx={{ minWidth: "270px" }}
                  placeholder={'전체/ 공정별'}
                  mapCode="oper"
                />
              </Col>
            </Row>
        </SearchBase>
        <Row style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={modelDetailRef}
                columnDefs={columnModelDetailDefs()}
                rowMultiSelectWithClick={false}
                alwaysShowHorizontalScroll={false}
                onGridReady={() => {
                  setModelDetailList([]);
                }}
              />
            </div>
        </Row>
      </ListBase>
      <ModelApproveEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
};

export default ModelApproveList;