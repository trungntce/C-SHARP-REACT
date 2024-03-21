import { Dictionary } from "../../../common/types";
import { CellDoubleClickedEvent, RowClassParams,  GetRowIdFunc, GetRowIdParams, RowSelectedEvent, CellClickedEvent } from "ag-grid-community";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import { columnDefs } from "../ChecksheetGroup/ChecksheetGroupDefs";
import { groupMapColumnDefs } from "../ChecksheetGroupMap/ChecksheetGroupMapDefs";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import ChecksheetGroupAdd from "./ChecksheetGroupAdd";



const ChecksheetGroupList = (props:any) => {
    const { t } = useTranslation();

    const listRef = useRef<any>();
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const pageNo = useRef<number>(1);
    const [groupGridRef, setGroupList] = useGridRef();
    const [editRef, setForm, closeModal] = useEditRef();
    const addRef = useRef<any>();
    const delRef = useRef<any>();
    const { refetch, post, put, del } = useApi("checksheetgroup",  getSearch, gridRef);
    const groupComboRef = useRef<any>();
    
    const { refetch: groupRefetch } = useApi("checksheetgroup/mapgroup", () => {
      const rows = gridRef.current!.api.getSelectedRows();
      console.log(rows[0]);
      return { 
        chksOperId: rows[0].chksOperId, 
      };
    }, groupGridRef); 

    

    const deleteGroupHandler = async () => {
        const rows = gridRef.current!.api.getSelectedRows();
        if(!rows.length){
          alertBox("삭제할 행을 선택해 주세요.");
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

      const groupAddHandler = async () =>{
        setForm({});
      }

      const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
      }

      const searchHandler = async (_?: Dictionary) => {
        setList([]);
        const result = await refetch();
        if (result.data) setList(result.data);
      };
    
      const groupSearchHandler = async (_?: Dictionary) => {
        const result = await groupRefetch();
        if(result.data){
          const list: Dictionary[] = result.data;
          setGroupList(list);
        }
      };

      const rowSelectedHandler = (e: RowSelectedEvent) => {

        if(!e.node.isSelected()) {
          return;
        }
        groupSearchHandler();
      }


      useEffect(() => {
        searchHandler();
      }, []);

      const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = {...initRow, ...row};
    
        if(initRow.chksOperId){
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
            alertBox(`동일한 ID가 존재합니다.<br />Chks_Oper_Id: ${newRow.chksOperId}`);
          }
        }
      }

     


    return (
        <>      
          <ListBase
            folder="System Management"
            title="Check Sheet Group"
            postfix="Management"
            icon="user-plus"
            ref={listRef}
            showPagination={true}
            onPaging={pagingHandler}
            preButtons={<></>}
            buttons={<></>}
            search={
              <SearchBase
                ref={searchRef}
                searchHandler={searchHandler}
              >
                <Row>
                  <Col>
                    <Input name="operationCode" type="text" size={5} style={{ width: 140 }} placeholder="Mã công đoạn" className="form-control" />
                  </Col>
                  <Col>
                    <Input name="operationDescription" type="text" size={5} style={{ width: 140 }} placeholder="Tên công đoạn" className="form-control" />
                  </Col>
                  <Col>
                    <Input name="chksOperCode" type="text" size={5} style={{ width: 140 }} placeholder="Mã quản lý" className="form-control" />
                  </Col>
                  <Col>
                    <Input name="chksOperName" type="text" size={5} style={{ width: 140 }} placeholder="Tên quản lý" className="form-control" />
                  </Col>
                  <Col>
                    <select name="useYn" className="form-select">
                      <option value="">{t("@USEYN")}</option>
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </Col>
                  
                  <Col style={{ minWidth: "170px"}}>
                    <Button type="button" color="primary" onClick={groupAddHandler} >
                      <i className="fa fa-fw fa-plus"></i>{" "}
                      추가
                    </Button>       
                    <Button type="button" color="light" onClick={deleteGroupHandler}>
                      <i className="uil uil-trash me-2"></i>{" "}
                      삭제
                    </Button>       
                  </Col> 
                </Row>
              </SearchBase>
              
            }>
              <Row style={{ height: "100%" }}>
                <Col md={12}>
                  <div className="pb-2" style={{ height: "100%" }}>
                    <GridBase
                      ref={gridRef}
                      columnDefs={columnDefs()}
                      onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
                      onRowSelected={rowSelectedHandler}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="pb-2" style={{ height: "100%" }}>
                    <GridBase
                      ref={groupGridRef}
                      columnDefs={groupMapColumnDefs()}
                    />
                  </div>
                </Col>
              </Row>
          </ListBase>
          <ChecksheetGroupAdd ref={editRef} onComplete={editCompleteHandler} />
        </>
      );
}

export default ChecksheetGroupList;