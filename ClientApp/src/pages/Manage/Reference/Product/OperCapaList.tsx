import { CellDoubleClickedEvent } from "ag-grid-community";
import { useEffect } from "react";
import { Col, Input, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { columnDefs } from "./OperCapaDefs";
import OperCapaEdit from "./OperCapaEdit";
import { useTranslation } from "react-i18next";

const OperCapaList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("opercapa", getSearch, gridRef); 

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
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox("작성이 완료되었습니다.");
      }else if(result.data == -1){
        alertBox(`동일한 항목이 존재합니다.<br />Worker Id: ${newRow.workerId}, Worker Name: ${newRow.workerName}`);
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox("삭제할 행을 선택해 주세요.");
      return;
    }

    confirmBox("삭제하시겠습니까?", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();
        alertBox("삭제되었습니다.");
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
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col size="auto">
                <Input name="operGroupName" type="text" placeholder={t("@COL_PROCESS_GROUP_NAME")} className="form-control" />
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
      <OperCapaEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
};

export default OperCapaList;
