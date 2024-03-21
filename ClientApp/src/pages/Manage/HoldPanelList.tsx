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
import { HoldPanelDefs } from "./HoldPanelDefs";
import HoldPanelEdit from "./HoldPanelEdit";
import HoldPanelCancelEdit from "./HoldPanelCancelEdit";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const HoldPanelList = (props:any) => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const [editCancelRef, setCancelForm, closeCancelModal] = useEditRef();

  const { refetch, post, put, del } = useApi("holdpanel", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox("삭제할 행을 선택해 주세요.");
      return;
    }

    confirmBox(
      "삭제하시겠습니까?",
      async () => {
          const result = await del(rows[0]);
          if (result.data > 0) {
            searchHandler();
            alertBox("삭제되었습니다.");
          }
      },
      async () => {}
    );
  };

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(initRow.panelId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      api<any>("put", "holdpanel/set", newRow).then((result) => {
        if(result.data > 0){
          searchHandler();
          closeModal();
          alertBox("작성이 완료되었습니다.");
        }else if(result.data == -1){
          alertBox(`동일한 항목이 존재합니다.<br />Worker Id: ${newRow.panelId}`);
        }else if(result.data == 0){
          alertBox(`등록된 판넬 아이디를 입력해 주세요.`);
        }
      })
    }
  }
  const editCancelHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(initRow.panelId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeCancelModal();
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      api<any>("put", "holdpanel/off", newRow).then((result) => {
        if(result.data > 0){
          searchHandler();
          closeCancelModal();
          alertBox("수락이 완료되었습니다.");
        }else if(result.data == -1){
          alertBox(`동일한 항목이 존재합니다.<br />Panel Id: ${newRow.panelId}`);
        }
      })
    }
  }

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
        leftButtons={
          <div className="d-flex gap-2 justify-content-start">
            {props.preButtons }
            <Button type="button" color="primary" onClick={() => {
              setForm({})
            }}>
              <i className="uil uil-pen me-2"></i> 보류 등록
            </Button>
            <Button type="button" color="light" onClick={()=>{
              setCancelForm({})
            }}>
              <i className="uil uil-trash me-2"></i> 보류 해제
            </Button>
            {props.postButtons }
          </div>
        }
        deleteHandler={deleteHandler}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto"></Col>
              <Col size="auto">
                <Input
                  name="panelId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder="판넬 ID"
                />
              </Col>
              <Col size="auto">
                <Input
                  name="holdCode"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder="보류 Code"
                />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={HoldPanelDefs}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <HoldPanelEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
      <HoldPanelCancelEdit 
        ref={editCancelRef}
        onComplete={editCancelHandler}
      />
    </>
  );
};

export default HoldPanelList;
