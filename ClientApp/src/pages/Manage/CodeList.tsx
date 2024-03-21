import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import CodeEdit from "./CodeEdit";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent, GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { columnDefs } from "./CodeDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import { codeGroupDefs } from "./CodeGroupDefs";
import { executeIdle } from "../../common/utility";
import CodeGroupEdit from "./CodeGroupEdit";

const CodeList = (props: any) => {
  const { t } = useTranslation();

  //#region Group

  const [groupSearchRef, getGroupSearch] = useSearchRef();  

  const [groupGridRef, setGroupList] = useGridRef();
  const [groupEditRef, groupSetForm, groupCloseModal] = useEditRef();
  const { refetch: groupRefetch, post: groupPost, put: groupPut, del: groupDel } = useApi("codegroup", getGroupSearch, groupGridRef); 

  const groupSearchHandler = async (_?: Dictionary) => {
    const result = await groupRefetch();
    if(result.data){
      setGroupList(result.data);
      setList([]);

      addRef.current.disabled = true;
      delRef.current.disabled = true;

      groupGridRef.current!.api.deselectAll();
    }
  }

  const groupRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    addRef.current.disabled = false;
    delRef.current.disabled = false;

    searchHandler();
  }

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.codegroupId;
    };
  }, []);

  const getSelectedCodegroup = () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const groupEditCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.codegroupId){
      const result = await groupPost(newRow);
      if(result.data > 0){
        groupSearchHandler();
        groupCloseModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    }else{
      const result = await groupPut(newRow);
      if(result.data > 0){
        groupSearchHandler();
        groupCloseModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${"@MSG_ALRAM_TYPE11"}<br />Group Id: ${newRow.codegroupId}`); //@MSG_ALRAM_TYPE11
      }
    }
  };

  const groupDeleteHandler = async () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); //"삭제할 행을 선택해 주세요."
      return;
    }

    confirmBox(t("@DELETE_CONFIRM"), async () => { //삭제하시겠습니까?
      const result = await groupDel(rows[0]);
      if(result.data > 0){
        groupSearchHandler();
        alertBox(t("@DELETE_COMPLETE")); //삭제되었습니다.
      }
    }, async () => {

    });    
  }

  //#endregion

  //#region Code

  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const addRef = useRef<any>();
  const delRef = useRef<any>();
    const { refetch, post, put, del } = useApi("code", () => {
    return { codegroupId: getSelectedCodegroup().codegroupId };
  }, gridRef); 
  
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  const editHandler = () => {
    const codegroup = getSelectedCodegroup();
    setForm({ codegroupId: codegroup.codegroupId, sort: codegroup.maxSort + 1 });
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.codeId){
      const result = await post(newRow);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.codegroupId)!;
            rowNode.setSelected(true);
          });
        });

        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.codegroupId)!;
            rowNode.setSelected(true);
          });
        });

        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Group Id: ${newRow.codegroupId}, Code Id: ${newRow.codeId}`); //동일한 항목이 존재합니다
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7"));  //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(rows[0].codegroupId)!;
            rowNode.setSelected(true);
          });
        });

        alertBox("@DELETE_COMPLETE");
      }
    }, async () => {

    });    
  }

  //#endregion

  useEffect(() => {
    groupSearchHandler();
  }, []);


  return (
    <>
      <ListBase
        leftButtons={
          <div className="d-flex gap-2 justify-content-start">
            {props.preButtons }
            <Button type="button" color="primary" onClick={() => {
              groupSetForm({});
            }}>
              <i className="uil uil-pen me-2"></i> {t("@CREATE_CODE_GROUP")}
            </Button>
            <Button type="button" color="light" onClick={groupDeleteHandler}>
              <i className="uil uil-trash me-2"></i> {t("@DELETE_CODE_GROUP")}
            </Button>
            {props.postButtons }
          </div>
        }
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            {props.preButtons }
            <Button innerRef={addRef} type="button" color="primary" onClick={editHandler}>
              <i className="uil uil-pen me-2"></i> {t("@CREATE_CODE")}
            </Button>
            <Button innerRef={delRef} type="button" color="light" onClick={deleteHandler}>
              <i className="uil uil-trash me-2"></i> {t("@DELETE_CODE")}
            </Button>
            {props.postButtons }
          </div>
        }
        search={
          <SearchBase
            ref={groupSearchRef}
            searchHandler={groupSearchHandler}
          >
            <Row>
              <Col>
                <Input name="codegroupId" type="text" className="form-control" size={5} style={{ width: 150 }} placeholder={`${t("@CODE_GROUP")}ID`}/>
              </Col>
              <Col>
                <Input name="codegroupName" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={t("@CODE_GROUP_NAEM")} />
              </Col>
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={5}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={groupGridRef}
                  getRowId={getRowId}
                  columnDefs={codeGroupDefs().filter(x => x.field != "remark" && x.field != "createUser" && x.field != "createDt")}
                  onRowSelected={groupRowSelectedHandler}
                  rowMultiSelectWithClick={false}
                  onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
                    groupSetForm(e.data);
                  }}
                />
              </div>
            </Col>
            <Col md={7}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={columnDefs()}
                  onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
                />
              </div>
            </Col>
          </Row>
      </ListBase>
      <CodeGroupEdit 
        ref={groupEditRef} 
        onComplete={groupEditCompleteHandler} />
      <CodeEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default CodeList;
