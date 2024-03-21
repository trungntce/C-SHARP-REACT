import { RowSelectedEvent } from "ag-grid-community";
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
import { InterlockHistoryDefs } from "./InterlockHistoryDefs";
import { InterlockHistoryRollPanelDefs } from "./InterlockHistoryRollPanelDefs";
import InterlockHistoryEdit from "./InterlockHistoryEdit";
import InterlockHistoryCancelEdit from "./InterlockHistoryCancelEdit";
import axios from "axios";
import InterlockHistoryTogetherEdit from "./InterlockHistoryTogetherEdit";
import InterlockHistoryAllCancelEdit from "./InterlockHistoryAllCancelEdit";
import InterlockHistoryRollEdit from "./InterlockHistoryRollEdit";
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../components/Common/DateTimePicker";
import moment from "moment";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const InterlockHistoryList = (props: any) => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  //const [rollPanelRef, setRollPanelList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const [editRollRef, setRollForm, closeRollModal] = useEditRef();
  //const [editTogetherRef, setTogetherForm, closeTogetherModal] = useEditRef();
  const [editCancelRef, setCancelForm, closeCancelModal] = useEditRef();
  const [editAllCancelRef, setAllCancelForm, closeAllCancelModal] = useEditRef();
  const [rollCancelRef, setRollCancelForm, closeRollCancelModal] = useEditRef();
  const { refetch, post, put, del } = useApi("interlockhistory", getSearch, gridRef);

  const { t } = useTranslation();

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const getSelectedRow = () => {
    const rows = gridRef.current!.api.getSelectedRows();
    return rows;
  };

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();

    if (!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7"));   //삭제할 행을 선택해 주세요.
      return;
    }
    confirmBox(
      t("@DELETE_CONFIRM"),    //"삭제하시겠습니까?"
      async () => {
        await api<any>("post", "interlockhistory/deletelist", rows).then((result) => {
          if (result.data > 0) {
            searchHandler();
            alertBox(t("@DELETE_COMPLETE"));   //삭제되었습니다.
          }
        });
      },
      async () => {}
    );
  };

  const getAllRows = () => {
    const rowData: Dictionary[] = [];
    //gridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    const rows = gridRef.current!.api.getSelectedRows();
    rowData.push(rows);
    return rowData;
  };

  const editAllCancelHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    const allRow = getAllRows();
    const cancelRows = allRow[0].map((e: any) => ({ ...e, ...row }));
    console.log(cancelRows);
    if (initRow.panelInterlockId) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeAllCancelModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));   //수정이 완료되었습니다.
      }
    } else {
      await api<any>("put", "interlockhistory/offchecker", cancelRows).then(async (result) => {
        if (result.data > 0) {
          searchHandler();
          closeAllCancelModal();
          alertBox(t(("@MSG_RELEASE_COMPLETED")));    //해제가 완료되었습니다.
          console.log("1");
        } else if (result.data === 0) {
          alertBox(t("@MSG_ALRAM_TYPE12"));  //등록된 판넬 아이디를 입력해 주세요.
        } else if (result.data === -100) {
          // 중복되는 itemkey 없어서 해제될경우
          searchHandler();
          closeAllCancelModal();
          alertBox(t("@MSG_RELEASE_COMPLETED"));       //해제가 완료되었습니다.
        } else if (result.data === -3) {
          const result = confirm("동시에 인터락됐던 판넬들이 있습니다. 모두 해제할까요?");
          if (result === true) {
            await api<any>("put", "interlockhistory/off", cancelRows).then((result) => {
              if (result.data > 0) {
                searchHandler();
                closeAllCancelModal();
                alertBox(t("@MSG_RELEASE_COMPLETED"));    //해제가 완료되었습니다.
              } else if (result.data === 0) {
                alertBox(t("@MSG_ALRAM_TYPE12"));    //등록된 판넬 아이디를 입력해 주세요.
              }
            });
          } else {
            alertBox(t("@MSG_DO_CANCEL"));    //취소되었습니다.
          }
        }
      });
    }
  };

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    //const newParam = { ...newRow };
    if (initRow.panelInterlockId) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));    //수정이 완료되었습니다.
      }
    } else {
      api<any>("put", "interlockhistory/set", newRow).then((result) => {
        if (result.data > 0) {
          searchHandler();
          closeModal();
          alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));    //작성이 완료되었습니다.
        } else if (result.data == -2) {
          alertBox(`해당 판넬은 이미 인터락 등록이 되어있습니다. <br />Panel Id: ${newRow.panelId}`);
        } else if (result.data == -1) {
          alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Panel Id: ${newRow.panelId}`);     //동일한 항목이 존재합니다
        } else if (result.data == 0) {
          alertBox(t("@MSG_ALRAM_TYPE12"));    //등록된 판넬 아이디를 입력해 주세요.
        }
      });
    }
  };

  const editRollCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    //const newParam = { ...newRow };
    if (initRow.panelInterlockId) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeRollModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));   //수정이 완료되었습니다.
      }
    } else {
      api<any>("put", "interlockroll/set", newRow).then((result) => {
        if (result.data > 0) {
          searchHandler();
          closeRollModal();
          alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));   //작성이 완료되었습니다.
        } else if (result.data == -2) {
          alertBox(`${t("@MSG_ALREADY_ROLL_PNL_INTERLOCK")} <br />Roll Id: ${newRow.rollId}`);  //해당 롤에 이미 인터락 등록이 되어 있는 판넬이 있습니다.
        } else if (result.data == -1) {
          alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Roll Id: ${newRow.rollId}`);   //동일한 항목이 존재합니다
        } else if (result.data == 0) {
          alertBox(t("@MSG_ALRAM_TYPE12"));  //등록된 판넬 아이디를 입력해 주세요.
        }
      });
    }
  };

  const rowSelectedHandler = async (e: RowSelectedEvent) => {
    if (!e.node.isSelected()) return;
  };

  const selectedFilterRow = () => {
    const seletedRows = gridRef.current!.api.getSelectedRows();

    const filterRows = seletedRows.filter((currentItem, index, target) => {
      const filterIndex = target.findIndex(
        (item) => item.rollId === currentItem.rollId && item.onDt === currentItem.onDt
      );
      return index === filterIndex;
    });

    return filterRows;
  };

  const rollCancleHandler = () => {
    if (gridRef.current!.api.getSelectedRows().length == 0) {
      alertBox(t("@MSG_SELECT_RELEASE_ROLL_ID"));   //해제할 롤 ID를 선택해 주세요.
      return;
    }
    const checkRow = selectedFilterRow();
    let cnt: number = 0;
    checkRow.forEach((row) => {
      if (!row["rollId"]) {
        cnt += 1;
        return alertBox(t("@EXIST_ROW_SELECTED_NOT_ROLL_ID"));   //선택된 행 중 롤 ID가 없는 행이 있습니다.
      } else if (!row["panelId"]) {
        cnt += 1;
        return alertBox(t("@EXIST_ROW_SELECTED_NOT_PNL_ID"));   //선택된 행 중 판넬 ID가 없는 행이 있습니다.
      }
    });
    if (cnt == 0) {
      setRollCancelForm({});
    } else {
      cnt = 0;
    }
  };

  const editRollCancelHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    const cancleRows = selectedFilterRow();

    cancleRows.forEach((row) => {
      row.offRemark = newRow.offRemark;
      row.offUpdateUser = newRow.offUpdateUser;
    });

    api<any>("put", "interlockhistory/rollset", cancleRows).then((result) => {
      if (result.data > 0) {
        searchHandler();
        closeRollCancelModal();
        alertBox(t("@MSG_RELEASE_COMPLETED"));   //해제가 완료되었습니다.
      }
    });
  };

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
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
            <Button type="button" color="success" onClick={rollCancleHandler}>
            {/* 롤 기준 해제 */}
              <i className="uil uil-file-edit-alt me-2"></i> {`${t("@ROLL")} ${t("@STANDARD")} ${t("@COL_RELEASE")}`}
            </Button>
            <Button
              type="button"
              color="success"
              onClick={() => {
                setAllCancelForm({});
              }}
            >
                {/* 해제 */}
              <i className="uil uil-file-edit-alt me-2"></i> {t("@COL_RELEASE")}
            </Button>
            <Button
              type="button"
              color="light"
              onClick={() => {
                deleteHandler();
              }}
            >
              {/* 삭제 */}
              <i className="uil uil-trash me-2"></i> {t("@DELETE")}
            </Button>
          </div>
        }
        //deleteHandler={deleteHandler}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-3, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col size="auto">
                <Input
                  name="rollId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder="Roll ID"
                />
              </Col>
              <Col size="auto">
                <Input
                  name="panelId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder="PNL ID"
                />
              </Col>
              <Col size="auto">
                <select name="autoYn" className="form-select" style={{ minWidth: 130 }}>
                  {/* 자동여부 */}
                  <option value="">{`${t("@COL_AUTO")}${t("@WHETHER")}`}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
              <Col size="auto">
                <select name="offYn" className="form-select" style={{ minWidth: 130 }}>
                {/* 해제여부 */}
                  <option value="">{`${t("@COL_RELEASE")}${t("@WHETHER")}`}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <div className="pb-2" style={{ height: "100%" }}>
            <GridBase
              ref={gridRef}
              columnDefs={InterlockHistoryDefs()}
              onRowSelected={rowSelectedHandler}
              tooltipShowDelay={0}
              tooltipHideDelay={1000}
              rowSelection={"multiple"}
              onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
                setForm(e.data);
              }}
            />
          </div>
          {/* </Col> */}
        </Row>
      </ListBase>
      <InterlockHistoryAllCancelEdit // 일괄 해제
        ref={editAllCancelRef}
        onComplete={editAllCancelHandler}
      />
      <InterlockHistoryAllCancelEdit // 롤 기준 해제
        ref={rollCancelRef}
        onComplete={editRollCancelHandler}
      />
      <InterlockHistoryRollEdit // 롤 등록
        ref={editRollRef}
        onComplete={editRollCompleteHandler}
      />
      <InterlockHistoryEdit // 판넬 등록
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default InterlockHistoryList;
