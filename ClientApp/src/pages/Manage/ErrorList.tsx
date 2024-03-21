import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ErrorEdit from "./ErrorEdit";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent, GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { columnDefs } from "./ErrorDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import { errorGroupDefs } from "./ErrorGroupDefs";
import { executeIdle } from "../../common/utility";
import ErrorGroupEdit from "./ErrorGroupEdit";

const ErrorList = (props: any) => {
  const { t } = useTranslation();

  //#region Group

  const [groupSearchRef, getGroupSearch] = useSearchRef();  

  const [groupGridRef, setGroupList] = useGridRef();
  const [groupEditRef, groupSetForm, groupCloseModal] = useEditRef();
  const { refetch: groupRefetch, post: groupPost, put: groupPut, del: groupDel } = useApi("errorgroup", getGroupSearch, groupGridRef); 

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
      return params.data.errorgroupCode;
    };
  }, []);

  const getSelectedErrorgroup = () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const groupEditCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.errorgroupCode){
      const result = await groupPost(newRow);
      if(result.data > 0){
        groupSearchHandler();
        groupCloseModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));              //수정이 완료되었습니다.
      }
    }else{
      const result = await groupPut(newRow);
      if(result.data > 0){
        groupSearchHandler();
        groupCloseModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));         //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Group Code: ${newRow.errorgroupCode}`);     //// `동일한 항목이 존재합니다.<br />Group Code: ${newRow.errorgroupCode}`
      }
    }
  };

  const groupDeleteHandler = async () => {
    const rows = groupGridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7"));                //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(t("@DELETE_CONFIRM"), async () => {    //삭제하시겠습니까?
      const result = await groupDel(rows[0]);
      if(result.data > 0){
        groupSearchHandler();
        alertBox(t("@DELETE_COMPLETE"));               //삭제되었습니다
      }
    }, async () => {

    });    
  }

  //#endregion

  //#region Error

  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const addRef = useRef<any>();
  const delRef = useRef<any>();
    const { refetch, post, put, del } = useApi("error", () => {
    return { errorgroupCode: getSelectedErrorgroup().errorgroupCode };
  }, gridRef); 
  
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  const editHandler = () => {
    const errorgroup = getSelectedErrorgroup();
    setForm({ errorgroupCode: errorgroup.errorgroupCode, sort: errorgroup.maxSort + 1 });
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.errorCode){
      const result = await post(newRow);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.errorgroupCode)!;
            rowNode.setSelected(true);
          });
        });

        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));            //수정이 완료되었습니다.
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(newRow.errorgroupCode)!;
            rowNode.setSelected(true);
          });
        });

        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));        //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />Group Id: ${newRow.errorgroupCode}, Error Code: ${newRow.errorCode}`);     //`동일한 항목이 존재합니다.<br />Group Id: ${newRow.errorgroupCode}, Error Code: ${newRow.errorCode}`
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7"));          //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        groupSearchHandler().then(() => {
          executeIdle(() => {
            const rowNode = groupGridRef.current!.api.getRowNode(rows[0].errorgroupCode)!;
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
              <i className="uil uil-pen me-2"></i> {`${t("@ERROR_TYPE")}${t("@WRITE")}`}      {/*에러유형작성*/}
            </Button>
            <Button type="button" color="light" onClick={groupDeleteHandler}>
              <i className="uil uil-trash me-2"></i> {`${t("@ERROR_TYPE")}${t("@DELETE")}`}     {/*에러유형작성*/}
            </Button>
            {props.postButtons }
          </div>
        }
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            {props.preButtons }
            <Button innerRef={addRef} type="button" color="primary" onClick={editHandler}>
              <i className="uil uil-pen me-2"></i> {`${t("@ERROR_CODE")}${t("@WRITE")}`}        {/*에러코드작성*/}
            </Button>
            <Button innerRef={delRef} type="button" color="light" onClick={deleteHandler}>
              <i className="uil uil-trash me-2"></i> {`${t("@ERROR_CODE")}${t("@DELETE")}`}      {/*에러코드삭제*/}
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
                <Input name="errorgroupCode" type="text" className="form-control" size={5} style={{ width: 150 }} placeholder={t("@ERROR_TYPE_CODE")} /> {/*에러유형코드*/}
              </Col>
              <Col>
                <Input name="errorgroupName" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={t("@ERROR_TYPE_NAME")} /> {/*에러유형명*/}
              </Col>
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option>  {/*사용여부*/}
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
                  columnDefs={errorGroupDefs().filter(x => x.field != "createUser" && x.field != "createDt")}
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
      <ErrorGroupEdit 
        ref={groupEditRef} 
        onComplete={groupEditCompleteHandler} />
      <ErrorEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default ErrorList;
