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
import { ReworkRollDefs } from "./ReworkRollDefs";
import ReworkRollEdit from "./ReworkRollEdit";
import ReworkRollApproveEdit from "./ReworkRollApproveEdit";
import ReworkRollRefuseEdit from "./ReworkRollRefuseEdit";
import ReworkRollToRollEdit from "./ReworkRollToRollEdit";
import { useTranslation } from "react-i18next";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const ReworkRollList = (props:any) => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRollRef, setRollForm, closeRollModal] = useEditRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const [editApproveRef, setApproveForm, closeApproveModal] = useEditRef();
  const [editRefuseRef, setRefuseForm, closeRefuseModal] = useEditRef();

  const { refetch, post, put, del } = useApi("reworkroll", getSearch, gridRef);

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
      alertBox(t("@MSG_ALRAM_TYPE7"));  //삭제할 행을 선택해 주세요.
      return;
    }
    confirmBox(
      t("@DELETE_CONFIRM"),              //삭제하시겠습니까?
      async () => {
        let cnt = 0;
        for (const row of rows) {
          await del(row);
          cnt++;
          if(cnt == rows.length)
          {
            alertBox(t("@DELETE_COMPLETE"));   //삭제되었습니다.
            searchHandler();
          }
        }
      },
      async () => {}
    );
  };

  const getRolls = () => {
    const rows = gridRef.current!.api.getSelectedRows();
    const rolls = rows.map((e:any)=> e.rollId)
    return rolls;
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(initRow.rollId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));    //수정이 완료되었습니다.
      }
    }else{
      api<any>("put", "reworkroll/put", newRow).then((result) => {
        if(result.data > 0){
          searchHandler();
          closeModal();
          alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));   //작성이 완료되었습니다.
        }else if(result.data == -2){
          alertBox(`기존의 인터락 등록이 해제되지 않은 롤입니다. <br />Roll Id: ${newRow.rollId}`);
        }else if(result.data == -1){
          alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Roll Id: ${newRow.rollId}`);    //`동일한 항목이 존재합니다.<br />Roll Id: ${newRow.parentRollId}`
        }else if(result.data == 0){
          alertBox(t("@MSG_ALRAM_TYPE16"));   //등록된 롤 아이디를 입력해 주세요.
        }
      })
    }
  }

  const editRollCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(initRow.rollId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeRollModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));            //수정이 완료되었습니다.
      }
    }else{
      api<any>("put", "reworkroll/putparentroll", newRow).then((result) => {
        if(result.data > 0){
          searchHandler();
          closeRollModal();
          alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));         //작성이 완료되었습니다.
        }else if(result.data == -2){
          alertBox(`해당 모 롤에 이미 재처리 등록이 되어 있는 롤이 있습니다. <br />Mother Roll Id: ${newRow.parentRollId}`);
        }else if(result.data == -1){
          alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Roll Id: ${newRow.parentRollId}`);  //`동일한 항목이 존재합니다.<br />Roll Id: ${newRow.parentRollId}`
        }else if(result.data == 0){
          alertBox(t("@MSG_ALRAM_TYPE16"));   //등록된 롤 아이디를 입력해 주세요.
        }
      })
    }
  }

  const editApproveHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    const rolls = getRolls();
    if(initRow.rollId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeApproveModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));    //수정이 완료되었습니다.
      }
    }else{
      let cnt = 0;
      for(const roll of rolls){
        const newParam = {...newRow, rollId:roll}
        api<any>("put", "reworkroll/approve", newParam).then((result) => {
          cnt++;
          if(cnt == rolls.length){
            searchHandler();
            closeApproveModal();
            alertBox(t("@MSG_ALRAM_TYPE15"));    //승인이 완료되었습니다.
          }else if(result.data == -1){
            alertBox(t("@MSG_ALRAM_TYPE11"));    //동일한 항목이 존재합니다
          }
        })
      }
    }
  }

  const editRefuseHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    const rolls = getRolls();
    if(initRow.rollId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeApproveModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));    //수정이 완료되었습니다.
      }
    }else{
      let cnt = 0;
      for(const roll of rolls){
        const newParam = {...newRow, rollId:roll}
        api<any>("put", "reworkroll/refuse", newParam).then((result) => {
          cnt++;
          if(cnt == rolls.length){
            searchHandler();
            closeRefuseModal();
            alertBox(t("@MSG_ALRAM_TYPE18"));   //반려가 완료되었습니다.
          }else if(result.data == -1){
            alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Roll Id: ${roll}`);   //`동일한 항목이 존재합니다.<br />Roll Id: ${roll}`
          }
        })
      }
    }
  }

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button type="button" color="primary" onClick={()=>{
              setRollForm({})
            }}>
              <i className="uil uil-pen me-2"></i> {`${t("@PARENT")} Roll -> Roll ${t("@COL_REGISTRATION")}`}   {/*모 Roll → Roll 등록*/}
            </Button>
            <Button type="button" color="primary" onClick={()=>{
              setForm({})
            }}>
              <i className="uil uil-pen me-2"></i> {`Roll ${t("@COL_REGISTRATION")}`}             {/*Roll 등록*/}
            </Button>
            <Button type="button" color="primary" onClick={()=>{
              setApproveForm({})
            }}>
              <i className="uil uil-pen me-2"></i> {t("@APPROVE")}                  {/*승인*/}
            </Button>
            <Button type="button" color="success" onClick={()=>{
              setRefuseForm({})
            }}>
              <i className="uil uil-file-edit-alt me-2"></i> {t("@REFUSAL")}        {/*반려*/}
            </Button>
            <Button type="button" color="light" onClick={()=>{
              deleteHandler()
            }}>
              <i className="uil uil-trash me-2"></i> {t("@DELETE")}                 {/*삭제*/}
            </Button>
          </div>
        }
        //deleteHandler={deleteHandler}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
            <Col size="auto">
              <Input
                  name="parentRollId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder={t("@COL_PARENT_ROLL_ID")}  
                /> {/* 부모 롤 ID */}
              </Col>
              <Col size="auto">
                <Input
                  name="rollId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder={t("@COL_CHILD_LOL_ID")}   
                /> {/* 자식 롤 ID */}
              </Col>
              <Col size="auto">
                <select name="approveYn" className="form-select" style={{ minWidth: 130 }}>
                  <option value="">{t("@APPROVAL_STATUS")}</option> {/*승인여부*/}
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={ReworkRollDefs()}
          className="ag-grid-bbt"
          rowSelection={'multiple'}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <ReworkRollToRollEdit // parent 롤을 통한 일괄 등록
        ref={editRollRef}
        onComplete={editRollCompleteHandler}
      />
      <ReworkRollEdit // 롤 일괄 등록
        ref={editRef}
        onComplete={editCompleteHandler}
      />
      <ReworkRollApproveEdit //일괄 승인
        ref={editApproveRef}
        onComplete={editApproveHandler}
      />
      <ReworkRollRefuseEdit 
        ref={editRefuseRef} // 일괄 반려
        onComplete={editRefuseHandler}
      />
    </>
  );
};

export default ReworkRollList;
