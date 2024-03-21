import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import WorkerEdit from "./WorkerEdit";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { columnDefs } from "./WorkerDefs";
import { useEffect } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import Select from "../../components/Common/Select";
import { useTranslation } from "react-i18next";

const WorkerList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("worker", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.workerId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Worker Id: ${newRow.workerId}, Worker Name: ${newRow.workerName}`); //동일한 항목이 존재합니다
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7"));//삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(t("@DELETE_CONFIRM"), async () => { //삭제하시겠습니까?
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();
        alertBox(t("@DELETE_COMPLETE")); //삭제되었습니다.
      }
    }, async () => {

    });    
  }

  return (
    <>
      <ListBase
        columnDefs={columnDefs}
        editHandler={() => { setForm({}); }}
        deleteHandler={deleteHandler}
        folder="System Management"
        title="Worker"
        postfix="Management"
        icon="bold"
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col size="auto">
                <Input name="workerId" type="text" size={5} style={{ width: 120 }} placeholder={`${t("@WORKER")} ID`} className="form-control" />
              </Col>
              <Col size="auto">
                <Input name="workerName" type="text" size={5} style={{ width: 120 }} placeholder={t("@WORKER_NAME")} className="form-control" />
              </Col>
              <Col size="auto">
                <Input name="rowKey" type="text" size={5} style={{ width: 150 }} placeholder={`${t("@COL_BARCDOE")} ID`} className="form-control" />
              </Col>
            </Row>              
          </SearchBase>
        }>
          <GridBase
            ref={gridRef}
            columnDefs={columnDefs()}
            onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
          />
      </ListBase>
      <WorkerEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default WorkerList;
