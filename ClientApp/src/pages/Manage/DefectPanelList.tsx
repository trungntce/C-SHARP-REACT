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
import { DefectPanelDefs } from "./DefectPanelDefs";
import DefectPanelEdit from "./DefectPanelEdit";
import DefectPanelCancelEdit from "./DefectPanelCancelEdit";
import DefectPanelToRollEdit from "./DefectPanelToRollEdit";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const DefectPanelList = (props: any) => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const [editRollRef, setRollForm, closeRollModal] = useEditRef();
  const [editCancelRef, setCancelForm, closeCancelModal] = useEditRef();
  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const { refetch, post, put, del } = useApi("defectpanel", () => {
    const params = getSearch()
    params["pageNo"] = pageNo.current;
    params["pageSize"] = 100;

    return params;
  }, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) 
      setList(result.data);
    
    listRef.current.setPaging(pageNo.current, 100, result.data[0].totalCount);

    gridRef.current!.api.deselectAll();
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(
      t("@DELETE_CONFIRM"),    //삭제하시겠습니까?
      async () => {
        let cnt = 0;
        for (const row of rows) {
          await del(row);
          cnt++;
          if (cnt == rows.length) {
            alertBox(t("@DELETE_COMPLETE"));   //삭제되었습니다.
            searchHandler();
          }
        }
      },
      async () => {}
    );
  };

  const getPanels = () => {
    const rows = gridRef.current!.api.getSelectedRows();
    const panels = rows.map((e: any) => { return { panelId: e.panelId, panelDefectId: e.panelDefectId} });
    return panels;
  };

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    if (initRow.panelId) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    } else {
      api<any>("put", "defectpanel/set", newRow).then((result) => {
        if (result.data > 0) {
          searchHandler();
          closeModal();
          alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));  //작성이 완료되었습니다.
        } else if (result.data == -2) {
          alertBox(`${t("@MSG_ALRAM_TYPE10")}<br />Panel Id: ${newRow.panelId}`);  //해당 판넬은 이미 결함 등록이 되어있습니다.
        } else if (result.data == -1) {
          alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Panel Id: ${newRow.panelId}`);  //동일한 항목이 존재합니다
        } else if (result.data == 0) {
          alertBox(t("@MSG_ALRAM_TYPE12")); //등록된 판넬 아이디를 입력해 주세요.
        }
      });
    }
  };

  const editRollCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    if (initRow.panelId) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeRollModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    } else {
      api<any>("put", "defectroll/set", newRow).then((result) => {
        if (result.data > 0) {
          searchHandler();
          closeRollModal();
          alertBox("작성이 완료되었습니다.");
        } else if (result.data == -2) {
          alertBox(`해당 모 롤에 이미 결함 등록이 되어 있는 롤이 있습니다.<br />Roll Id: ${newRow.rollId}`);
        } else if (result.data == -1) {
          alertBox(`동일한 항목이 존재합니다.<br />Roll Id: ${newRow.rollId}`);
        } else if (result.data == 0) {
          alertBox(`등록된 롤 아이디를 입력해 주세요.`);
        }
      });
    }
  };

  const editCancelHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    const panels = getPanels();
    if (initRow.panelId) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeCancelModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));  //수정이 완료되었습니다.
      }
    } else {
      let cnt = 0;
      for (const panel of panels) {
        const newParam = { ...newRow, panelId: panel.panelId, panelDefectId: panel.panelDefectId };
        api<any>("put", "defectpanel/off", newParam).then((result) => {
          cnt++;
          if (cnt == panels.length) {
            searchHandler();
            closeCancelModal();
            alertBox(t("@MSG_RELEASE_COMPLETED")); //해제가 완료되었습니다.
          } else if (result.data == -1) {
            alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Panel Id: ${panel}`);  //동일한 항목이 존재합니다
          }
        });
      }
    }
  };

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
            <Button
              type="button"
              color="primary"
              onClick={() => {
                setRollForm({});
              }}
            >
              {/* Roll → Panel 등록 */}
              <i className="uil uil-pen me-2"></i> {`Roll → Panel ${t("@REGIST")}`}
            </Button>
            <Button
              type="button"
              color="primary"
              onClick={() => {
                setForm({});
              }}
            >
              {/* PANEL 등록 */}
              <i className="uil uil-pen me-2"></i> {`PANEL ${t("@REGIST")}`}
            </Button>
            <Button
              type="button"
              color="success"
              onClick={() => {
                setCancelForm({});
              }}
            >
              {/* 해제 */}
              <i className="uil uil-file-edit-alt me-2"></i> {`${t("@COL_RELEASE")}`}
            </Button>
            <Button
              type="button"
              color="light"
              onClick={() => {
                deleteHandler();
              }}
            >
              {/* 삭제 */}
              <i className="uil uil-trash me-2"></i> {`${t("@DELETE")}`}
            </Button>
          </div>
        }
        deleteHandler={deleteHandler}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                <Input name="rollId" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder="Roll ID" />
              </Col>
              <Col size="auto">
                <Input name="panelId" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder="PNL ID" />
              </Col>
              <Col size="auto">
                <AutoCombo name="defectCode" placeholder={t("@DEFECT_REASON_CODE")} mapCode="code" category="DEFECTREASON" />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={DefectPanelDefs()}
          rowSelection={"multiple"}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <DefectPanelToRollEdit ref={editRollRef} onComplete={editRollCompleteHandler} />
      <DefectPanelEdit // 판넬 등록
        ref={editRef}
        onComplete={editCompleteHandler}
      />
      <DefectPanelCancelEdit //해제
        ref={editCancelRef}
        onComplete={editCancelHandler}
      />
    </>
  );
};

export default DefectPanelList;
