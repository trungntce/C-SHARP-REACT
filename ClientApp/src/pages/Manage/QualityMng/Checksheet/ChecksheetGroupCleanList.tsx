import { Dictionary } from "../../../../common/types";
import { CellDoubleClickedEvent,  RowSelectedEvent } from "ag-grid-community";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import { columnGroupProdDefs } from "./ChecksheetGroupCleanDefs";
import { columnGroupTypeProdDefs } from "./ChecksheetGroupTypeCleanDefs";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import ChecksheetGroupCleanEdit from "./ChecksheetGroupCleanEdit";
import ChecksheetGroupTypeCleanEdit from "./ChecksheetGroupTypeCleanEdit";
import api from "../../../../common/api";

const ChecksheetGroupCleanList = (props:any) => {
    const { t } = useTranslation();

    const listRef = useRef<any>();
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const [itemGridRef, setItemList] = useGridRef();
    const pageNo = useRef<number>(1);
    const [editGroupRef, setForm, closeModal] = useEditRef();
    const [editItemRef, setFormItem, closeItemModal] = useEditRef();
    const { refetch, post, put, del } = useApi("checksheetclean",  getSearch, gridRef);
    const { post: postItem } = useApi("checksheetclean/iteminsert",  getSearch, itemGridRef);
    const checksheetGroupCode = useRef<any>();

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

      const { refetch: itemRefetch } = useApi("checksheetclean/item", () => {
        const rows = gridRef.current!.api.getSelectedRows();
        checksheetGroupCode.current = rows[0].checksheetGroupCode;
        return {
          checksheetGroupCode: rows[0].checksheetGroupCode,
        };
      }, itemGridRef);

      const itemSearchHandler = async (_?: Dictionary) => {
        const result = await itemRefetch();
        if (result.data) {
          const list: Dictionary[] = result.data;
          setItemList(list);
        }
      };

      const rowSelectedHandler = (e: RowSelectedEvent) => {

        if(!e.node.isSelected()) {
          return;
        }

        itemSearchHandler();
      }

      const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
      }

      const searchHandler = async (_?: Dictionary) => {
        // setList([]);
        checksheetGroupCode.current = "";
        const result = await refetch();
        if (result.data) setList(result.data);
      };


      useEffect(() => {
        searchHandler();
      }, []);

      const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = {...initRow, ...row};
    
        if(initRow.checksheetGroupCode){
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
            alertBox(`동일한 ID가 존재합니다.`);
          }
        }
      }

      const editItemCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = {...initRow, ...row};
        if(newRow.itemCode){
          
          const result = await postItem(newRow);
          if(result.data > 0){
            itemSearchHandler();
            closeModal();
            alertBox("수정이 완료되었습니다.");
          } else {
            alertBox(" 수정 실패");
          }
        }
      }

      const onAddItemClick = () => {
        if (checksheetGroupCode.current === null || checksheetGroupCode.current === undefined || checksheetGroupCode.current === '') {
          alertBox("Group code 선택하세요 .");
          return;
        }
        setFormItem({
          'checksheetGroupCode': checksheetGroupCode.current
        });
  }
  
  const deleteItem = (item: any) => { 
    confirmBox("@DELETE_CONFIRM", async () => {
      const param = {
        checksheetGroupCode: item.data.checksheetGroupCode,
        itemCode: item.data.itemCode
      };
      const result = await api<any>("delete", "checksheetclean/itemdel", param);
      if (result) {
        alertBox("수정이 완료되었습니다.");
        itemSearchHandler();
      } else { 
        alertBox("수정 실패");
      }
    }, async () => {
    
    });
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
            onGridReady={() => {
                setList([]);
            }}
            buttons={
              <div className="d-flex gap-2 justify-content-end">
                <Button onClick={() => setForm({})} type="button" color="primary">
                  <i className="uil uil-pen me-2"></i> Add Group
                </Button>
                <Button id="btnAddItem" onClick={() => onAddItemClick()} type="button" color="primary">
                  <i className="uil uil-pen me-2"></i> Add Item
                </Button>
                <Button onClick={deleteGroupHandler} type="button" color="light">
                  <i className="uil uil-trash me-2"></i> {t("@DELETE")}
                </Button>
              </div>
            }
            search={
              <SearchBase
                ref={searchRef}
                searchHandler={searchHandler}
              >
                <Row style={{width: '100%'}}>
                <Col md={3}>
                    <AutoCombo name="workcenterCode"  mapCode="workcenter" placeholder="작업장코드" className="form-control" />
                  </Col>
                  <Col md={3}>
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
                <Col md={12}>
                  <div className="pb-2" style={{ height: "100%" }}>
                    <GridBase
                      ref={gridRef}
                      columnDefs={columnGroupProdDefs()}
                      onRowSelected={rowSelectedHandler}
                      onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="pb-2" style={{ height: "100%" }}>
                    <GridBase
                      ref={itemGridRef}
                      columnDefs={columnGroupTypeProdDefs(deleteItem, setFormItem)}
                      onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setFormItem(e.data); }}
                    />
                  </div>
                </Col>
              </Row>
          </ListBase>
          <ChecksheetGroupCleanEdit ref={editGroupRef} onComplete={editCompleteHandler} />
          <ChecksheetGroupTypeCleanEdit ref={editItemRef} onComplete={editItemCompleteHandler} />
        </>
      );
}

export default ChecksheetGroupCleanList;
