import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { columnDefs } from "./UsergroupDefs";
import { useEffect, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import UsergroupEdit from "./UsergroupEdit";

const UsergroupList = (props: any) => {
  const { t } = useTranslation();

  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("usergroup", () => {
    const params = getSearch()
    params["pageNo"] = pageNo.current;
    params["pageSize"] = 100;

    return params;
  }, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;
      setList(list);

      listRef.current.setPaging(pageNo.current, 100, list[0].totalCount);
    }
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.userId){
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
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />User Id: ${newRow.userId}`); //동일한 ID가 존재합니다.
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();
        alertBox("@DELETE_COMPLETE");
      }
    }, async () => {

    });    
  }

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  }

  const testHandler = async () => {
    
  }

  return (
    <>      
      <ListBase
        editHandler={() => { setForm({}); }}
        deleteHandler={deleteHandler}
        folder="System Management"
        title="User"
        postfix="Management"
        icon="user-plus"
        ref={listRef}
        showPagination={true}
        onPaging={pagingHandler}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <Input name="userId" type="text" size={5} style={{ width: 120 }} placeholder={t("@GROUP_ID")} className="form-control" />
              </Col>
              <Col>
                <Input name="userName" type="text" size={5} style={{ width: 150 }} placeholder={t("@COL_GROUP_NAME")} className="form-control" />
              </Col>
              <Col>
                <Input name="remark" type="text" size={5} style={{ width: 200 }} placeholder={t("@REMARK")} className="form-control" />
              </Col>
              <Col>
                <select name="useYn" className="form-select" style={{ width: 80 }}>
                  <option value="">{t("@USEYN")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
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
      <UsergroupEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default UsergroupList;
