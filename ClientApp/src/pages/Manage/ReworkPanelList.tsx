import { CellDoubleClickedEvent } from "ag-grid-community";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Col, Input, Label, Row, Button } from "reactstrap";
import api from "../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { ReworkPanelDefs } from "./ReworkPanelDefs";
import ReworkPanelEdit from "./ReworkPanelEdit";
import ReworkApproveEdit from "./ReworkPanelApproveEdit";
import ReworkDenyEdit from "./ReworkPanelRefuseEdit";
import ReworkPanelToRollEdit from "./ReworkPanelToRollEdit";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const ReworkPanelList = (props:any) => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const [editRollRef, setRollForm, closeRollModal] = useEditRef();
  const [editApproveRef, setApproveForm, closeApproveModal] = useEditRef();
  const [editRefuseRef, setRefuseForm, closeRefuseModal] = useEditRef();
  const listRef = useRef<any>();
    const pageNo = useRef<number>(1);
    const { t } = useTranslation();
  
  const { refetch, post, put, del } = useApi("reworkpanel", () => {
    const params = getSearch()
    params["pageNo"] = pageNo.current;
    params["pageSize"] = 100;

    return params;
  }, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) 
      setList(result.data);

    console.log(result.data);

    listRef.current.setPaging(pageNo.current, 100, result.data[0].totalCount);

    gridRef.current!.api.deselectAll();
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      //alertBox("삭제할 행을 선택해 주세요.");
        alertBox(t("@MSG_ALRAM_TYPE7"));
      return;
    }
    confirmBox(
      //"삭제하시겠습니까?",
        t("@DELETE_CONFIRM"),
      async () => {
        let cnt = 0;
        for (const row of rows) {
          await del(row);
          cnt++;
          if(cnt == rows.length)
          {
            //alertBox("삭제되었습니다.");
              alertBox(t("@DELETE_COMPLETE"));
            searchHandler();
          }
        }
      },
      async () => {}
    );
  };

  const getPanels = () => {
    return gridRef.current!.api.getSelectedRows();
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(initRow.panelId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
          //alertBox("수정이 완료되었습니다.");
          alertBox(t("@MSG_ALRAM_TYPE13"));
      }
    }else{
      api<any>("put", "reworkpanel/put", newRow).then((result) => {
        if(result.data > 0){
          searchHandler();
          closeModal();
          //alertBox("작성이 완료되었습니다.");
            alertBox(t("@MSG_ALRAM_TYPE9"));
        }else if(result.data == -2){
          //alertBox(`해당 롤에 이미 재처리 등록이 되어 있는 판넬이 있습니다. <br />Panel Id: ${newRow.panelId}`);
            alertBox(`${t("@MSG_ALRAM_TYPE10")} <br />Panel Id: ${newRow.panelId}`);
        }else if(result.data == -1){
          //alertBox(`동일한 항목이 존재합니다.<br />Panel Id: ${newRow.panelId}`);
            alertBox(`${t("@MSG_ALRAM_TYPE11")} <br />Panel Id: ${newRow.panelId}`);
        }else if(result.data == 0){
          //alertBox(`등록된 판넬 아이디를 입력해 주세요.`);
            alertBox(t("@MSG_ALRAM_TYPE12"));
        }
      })
    }
  }

  const editRollCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(initRow.panelId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeRollModal();
        //alertBox("수정이 완료되었습니다.");
          alertBox(t("@MSG_ALRAM_TYPE9"));
      }
    }else{
      api<any>("put", "reworkpanel/putroll", newRow).then((result) => {
        if(result.data > 0){
          searchHandler();
          closeRollModal();
          //alertBox("작성이 완료되었습니다.");
            alertBox(t("@MSG_ALRAM_TYPE9"));
        } else if (result.data == -2) {
        }else if(result.data == -2){
          //alertBox(`해당 롤에 이미 재처리 등록이 되어 있는 판넬이 있습니다. <br />Roll Id: ${newRow.rollId}`);
            alertBox(`${t("@MSG_ALRAM_TYPE10")} <br />Panel Id: ${newRow.rollId}`);
        }else if(result.data == -1){
          //alertBox(`동일한 항목이 존재합니다.<br />Panel Id: ${newRow.rollId}`);
            alertBox(`${t("@MSG_ALRAM_TYPE11")} <br />Panel Id: ${newRow.rollId}`);
        }else if(result.data == 0){
          //alertBox(`등록된 롤 아이디를 입력해 주세요.`);
            alertBox(t("@MSG_ALRAM_TYPE16"));
        }
      })
    }
  }

  const editApproveHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    const panels = getPanels();
    if(initRow.panelId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeApproveModal();
        //alertBox("수정이 완료되었습니다.");
          alertBox(t("@MSG_ALRAM_TYPE13"));
      }
    }else{
      let cnt = 0;

      if(panels.some(x => x.approveDt || x.refuseDt)){
        //alertBox("선택항목 중 승인 또는 반려된 판넬이 있습니다.");
          alertBox(t("@MSG_ALRAM_TYPE14"));
        return;
      }

      for(const panel of panels){
        const newParam = {...newRow, panelId: panel.panelId, panelReworkId: panel.panelReworkId }
        api<any>("put", "reworkpanel/approve", newParam).then((result) => {
          cnt++;
          if(cnt == panels.length){
            searchHandler();
            closeApproveModal();
            //alertBox("승인이 완료되었습니다.");
              alertBox(t("@MSG_ALRAM_TYPE15"));
          }else if(result.data == -1){
            //alertBox(`동일한 항목이 존재합니다.`);
              alertBox(t("@MSG_ALRAM_TYPE11"));
          }
        })
      }
    }
  }

  const editRefuseHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    const panels = getPanels();
    if(initRow.panelId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeApproveModal();
        //alertBox("수정이 완료되었습니다.");
          alertBox(t("@MSG_ALRAM_TYPE13"));
      }
    }else{
      let cnt = 0;

      if(panels.some(x => x.approveDt || x.refuseDt)){
        //alertBox("선택항목 중 승인 또는 반려된 판넬이 있습니다.");
          alertBox(t("@MSG_ALRAM_TYPE14"));
        return;
      }

      for(const panel of panels){
        const newParam = {...newRow, panelId: panel.panelId, panelReworkId: panel.panelReworkId }
        api<any>("put", "reworkpanel/refuse", newParam).then((result) => {
          cnt++;
          if(cnt == panels.length){
            searchHandler();
            closeRefuseModal();
            //alertBox("반려가 완료되었습니다.");
              alertBox(t("@MSG_ALRAM_TYPE18"));
          }else if(result.data == -1){
            //alertBox(`동일한 항목이 존재합니다.<br />Panel Id: ${panel}`);
              alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Panel Id: ${panel}`);
          }
        })
      }
    }
  }

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  }

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
        ref={listRef}
        showPagination={true}
        onPaging={pagingHandler}
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button type="button" color="primary" onClick={()=>{
              setRollForm({})
            }}>
                    <i className="uil uil-pen me-2"></i> Roll → Panel {t("@REGIST")}
            </Button>
            <Button type="button" color="primary" onClick={()=>{
              setForm({})
            }}>
                    <i className="uil uil-pen me-2"></i> Panel {t("@REGIST")}
            </Button>
            <Button type="button" color="primary" onClick={()=>{
              setApproveForm({})
            }}>
                    <i className="uil uil-pen me-2"></i> {t("@APPROVE")}
            </Button>
            <Button type="button" color="success" onClick={()=>{
              setRefuseForm({})
            }}>
                    <i className="uil uil-file-edit-alt me-2"></i> {t("@REFUSAL")}
            </Button>
            <Button type="button" color="light" onClick={()=>{
              deleteHandler()
            }}>
                    <i className="uil uil-trash me-2"></i> {t("@DELETE")}
            </Button>
          </div>
        }
        //deleteHandler={deleteHandler}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                        <Input name="rollId" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={`${t("@ROLL")} ID`} />
              </Col>
              <Col size="auto">
                        <Input name="panelId" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={`${t("@PANEL")} ID`} />
              </Col>
              <Col size="auto">
                <select name="approveYn" className="form-select" style={{ minWidth: 130 }}>
                            <option value="">{t("@REWORK_STATE")}</option>
                            <option value="C">{t("@REQUEST")}</option>
                            <option value="A">{t("@APPROVE")}</option>
                            <option value="R">{t("@REFUSAL")}</option>
                </select>
              </Col>
              <Col>
                        <AutoCombo name="defectCode" placeholder={t("@REWORK_CODE")} mapCode="code" category="REWORKREASON" />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={ReworkPanelDefs()}
          rowSelection={'multiple'}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <ReworkPanelToRollEdit //롤->판넬 등록
        ref={editRollRef}
        onComplete={editRollCompleteHandler}
      />
      <ReworkPanelEdit //판넬 등록
        ref={editRef}
        onComplete={editCompleteHandler}
      />
      <ReworkApproveEdit //일괄 승인
        ref={editApproveRef}
        onComplete={editApproveHandler} 
      />
      <ReworkDenyEdit //일괄 반려
        ref={editRefuseRef}
        onComplete={editRefuseHandler}
      />
    </>
  );
};

export default ReworkPanelList;
