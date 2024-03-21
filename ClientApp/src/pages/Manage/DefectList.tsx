import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import DefectEdit from "./DefectEdit";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent, GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { columnDefs } from "./DefectDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import { defectGroupDefs } from "./DefectGroupDefs";
import { executeIdle } from "../../common/utility";
import DefectGroupEdit from "./DefectGroupEdit";

const DefectList = (props: any) => {
  const { t } = useTranslation();

  //#region Group

  const [groupSearchRef, getGroupSearch] = useSearchRef();  

  const [groupGridRef, setGroupList] = useGridRef();
  const [groupEditRef, groupSetForm, groupCloseModal] = useEditRef();
  const { refetch: groupRefetch, post: groupPost, put: groupPut, del: groupDel } = useApi("defectgroup", getGroupSearch, groupGridRef); 

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
      return params.data.defectgroupCode;
    };
  }, []);

  const getSelectedDefectgroup = () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const groupEditCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.defectgroupCode){
      const result = await groupPost(newRow);
      if(result.data > 0){
        groupSearchHandler();
        groupCloseModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); {/*수정이 완료되었습니다.*/}
      }
    }else{
      const result = await groupPut(newRow);
      if(result.data > 0){
        groupSearchHandler();
        groupCloseModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));{/*작성이 완료되었습니다.*/}
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}.<br />Group Code: ${newRow.defectgroupCode}`);{/*동일한 항목이 존재합니다*/}
      }
    }
  };

  const groupDeleteHandler = async () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); {/*삭제할 행을 선택해 주세요.*/}
      return;
    }

    {/*삭제되었습니다.*/}
      confirmBox(t("@DELETE_CONFIRM"), async () => {  
      const result = await groupDel(rows[0]);
      if(result.data > 0){
        groupSearchHandler();
        alertBox(t("@DELETE_COMPLETE")); {/*삭제되었습니다.*/}
      }
    }, async () => {

    });    
  }

  //#endregion

  //#region Defect

  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const addRef = useRef<any>();
  const delRef = useRef<any>();
    const { refetch, post, put, del } = useApi("defect", () => {
    return { defectgroupCode: getSelectedDefectgroup().defectgroupCode };
  }, gridRef); 
  
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  const editHandler = () => {
    const defectgroup = getSelectedDefectgroup();
    setForm({ defectgroupCode: defectgroup.defectgroupCode, sort: defectgroup.maxSort + 1 });
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.defectCode){
      const result = await post(newRow);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.defectgroupCode)!;
            rowNode.setSelected(true);
          });
        });

        searchHandler();
        closeModal();
        //수정이 완료되었습니다.
        alertBox(t("@MSG_ALRAM_TYPE13"));
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.defectgroupCode)!;
            rowNode.setSelected(true);
          });
        });

        closeModal();
        //작성이 완료되었습니다.
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));
      }else if(result.data == -1){
        //동일한 항목이 존재합니다
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Group Id: ${newRow.defectgroupCode}, Defect Code: ${newRow.defectCode}`);
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      //삭제할 행을 선택해 주세요.
      alertBox(t("@MSG_ALRAM_TYPE7"));
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(rows[0].defectgroupCode)!;
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
              {/*불량유형작성*/}
              <i className="uil uil-pen me-2"></i> {`${t("@DEFECT_TYPE")}${t("@WRITE")}`}
            </Button>
            <Button type="button" color="light" onClick={groupDeleteHandler}>
              {/*불량유형삭제*/}
              <i className="uil uil-trash me-2"></i> {`${t("@DEFECT_TYPE")}${t("@DELETE")}`}
            </Button>
            {props.postButtons }
          </div>
        }
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            {props.preButtons }
            <Button innerRef={addRef} type="button" color="primary" onClick={editHandler}>
              {/*불량코드작성*/}
              <i className="uil uil-pen me-2"></i> {`${t("@COL_DEFECT_CODE")}${t("@WRITE")}`}
            </Button>
            <Button innerRef={delRef} type="button" color="light" onClick={deleteHandler}>
              <i className="uil uil-trash me-2"></i> {`${t("@COL_DEFECT_CODE")}${t("@DELETE")}`}
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
                {/*불량유형코드*/}
                <Input name="defectgroupCode" type="text" className="form-control" size={5} style={{ width: 150 }} 
                  placeholder={t("@COL_DEFECT_TYPE_CODE")} />
              </Col>
              <Col>
                {/*불량유형명*/}
                <Input name="defectgroupName" type="text" className="form-control" size={5} style={{ width: 200 }} 
                  placeholder={t("@COL_DEFECT_TYPE_NAME")} />
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
                  columnDefs={defectGroupDefs().filter(x => x.field != "createUser" && x.field != "createDt")}
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
      <DefectGroupEdit 
        ref={groupEditRef} 
        onComplete={groupEditCompleteHandler} />
      <DefectEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default DefectList;
