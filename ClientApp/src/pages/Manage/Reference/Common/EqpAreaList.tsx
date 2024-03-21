import { CellDoubleClickedEvent, GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import { executeIdle } from "../../../../common/utility";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { columnDefs } from "./EqpAreaDefs";
import EqpAreaEdit from "./EqpAreaEdit";
import { eqpAreaGroupDefs } from "./EqpAreaGroupDefs";
import EqpAreaGroupEdit from "./EqpAreaGroupEdit";

const EqpAreaList = (props: any) => {
  const { t } = useTranslation();

  //#region Group

  const [groupSearchRef, getGroupSearch] = useSearchRef();  

  const [groupGridRef, setGroupList] = useGridRef();
  const [groupEditRef, groupSetForm, groupCloseModal] = useEditRef();
  const { refetch: groupRefetch, post: groupPost, put: groupPut, del: groupDel } = useApi("eqpareagroup", getGroupSearch, groupGridRef); 

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


  const getSelectedCodegroup = () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const groupEditCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.eqpareagroupCode){
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
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Group Id: ${newRow.eqpareagroupCode}`); //`동일한 항목이 존재합니다.<br />Group Id: ${newRow.eqpareagroupCode}`
      }
    }
  };

  const groupDeleteHandler = async () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
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

  //#region Area

  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const addRef = useRef<any>();
  const delRef = useRef<any>();
    const { refetch, post, put, del } = useApi("eqparea", () => {
    return { eqpareagroupCode: getSelectedCodegroup().eqpareagroupCode };
  }, gridRef); 
  
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  const editHandler = () => {
    const codegroup = getSelectedCodegroup();
    setForm({ eqpCode: codegroup.eqpCode, eqpareagroupCode: codegroup.eqpareagroupCode, eqpareagroupName: codegroup.eqpareagroupName , sort: codegroup.maxSort + 1 });
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.eqpareaCode){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.eqpareagroupCode)!;
            rowNode.setSelected(true);
          });
        });

        // searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.eqpareagroupCode)!;
            rowNode.setSelected(true);
          });
        });

        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Group Code: ${newRow.eqpareagroupCode}, EqpArea Code: ${newRow.eqpareaCode}`); //동일한 항목이 존재합니다.<br />Group Code: ${newRow.eqpareagroupCode}, EqpArea Code: ${newRow.eqpareaCode}
      }
    }
  }

  const deleteHandler = () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(rows[0].eqpareagroupCode)!;
            rowNode.setSelected(true);
          });
        });

        alertBox("@DELETE_COMPLETE");
      }
    }, () => {

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
              <i className="uil uil-pen me-2"></i>{`${t("@LARGE_CATEGORY")}${t("@WRITE")}`}{/*대분류작성*/}
            </Button>
            <Button type="button" color="light" onClick={groupDeleteHandler}>
              <i className="uil uil-trash me-2"></i> {`${t("@LARGE_CATEGORY")}${t("@DELETE")}`}{/*대분류삭제*/}
            </Button>
            {props.postButtons }
          </div>
        }
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            {props.preButtons }
            <Button innerRef={addRef} type="button" color="primary" onClick={editHandler}>
              <i className="uil uil-pen me-2"></i> {`${t("@MIDDLE_CATEGORY")}${t("@WRITE")}`}{/*중분류작성*/}
            </Button>
            <Button innerRef={delRef} type="button" color="light" onClick={deleteHandler}>
              <i className="uil uil-trash me-2"></i> {`${t("@MIDDLE_CATEGORY")}${t("@DELETE")}`}{/*중분류삭제*/}
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
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" /> {/* 설비코드 */}
              </Col>
              {/* <Col>
                <Input name="eqpareagroupCode" type="text" className="form-control" size={5} style={{ width: 150 }} placeholder="대분류코드" />
              </Col> */}
              <Col>
                <Input name="eqpareagroupName" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={t("@LARGE_CATEGORY_NAME")} /> {/* 대분류명 */}
              </Col>
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option> {/* 사용여부 */}
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
                  columnDefs={eqpAreaGroupDefs().filter(x => x.field != "remark" && x.field != "createUser" && x.field != "createDt")}
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
      <EqpAreaGroupEdit ref={groupEditRef} onComplete={groupEditCompleteHandler} />
      <EqpAreaEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
}

export default EqpAreaList;