import { Dictionary } from "../../../../common/types";
import { CellDoubleClickedEvent, RowSelectedEvent } from "ag-grid-community";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import { columnChecksheetItemDefs, columnTypeProdDefs } from "./ChecksheetTypeCleanDefs";
import { columnGroupTypeProdDefs } from "./ChecksheetGroupTypeCleanDefs";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import ChecksheetTypeCleanEdit from "./ChecksheetTypeCleanEdit";
import ChecksheetGroupTypeCleanEdit from "./ChecksheetGroupTypeCleanEdit";
import api from "../../../../common/api";
import ChecksheetItemCleanEdit from "./ChecksheetItemCleanEdit";



const ChecksheetTypeCleanList = (props: any) => {
    const { t } = useTranslation();

    const listRef = useRef<any>();
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const [itemGridRef, setItemList] = useGridRef();
    const pageNo = useRef<number>(1);
    const [editGroupRef, setForm, closeModal] = useEditRef();
    const [editItemRef, setFormItem, closeItemModal] = useEditRef();
    const { refetch, post, put, del } = useApi("checksheettypeclean", getSearch, gridRef);
    const { post: postItem } = useApi("checksheettypeclean/iteminsert", getSearch, itemGridRef);
    const checksheetCode = useRef<any>();


    const deleteGroupHandler = async () => {
        const rows = gridRef.current!.api.getSelectedRows();
        if (!rows.length) {
            alertBox("삭제할 행을 선택해 주세요.");
            return;
        }

        confirmBox("@DELETE_CONFIRM", async () => {
            const result = await del(rows[0]);
            if (result.data > 0) {
                searchHandler();
                alertBox("@DELETE_COMPLETE");
            }
        }, async () => {

        });
    }

    const { refetch: itemRefetch } = useApi("checksheettypeclean/item", () => {
        const rows = gridRef.current!.api.getSelectedRows();
        console.log(rows[0]);
        return {
            checksheetCode: rows[0].checksheetCode,
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

        if (!e.node.isSelected()) {
            return;
        }
        const rows = gridRef.current!.api.getSelectedRows();
        checksheetCode.current = rows[0].checksheetCode;

        itemSearchHandler();
    }

    const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
    }

    const searchHandler = async (_?: Dictionary) => {
        // setList([]);
        const result = await refetch();
        if (result.data) setList(result.data);
    };

    useEffect(() => {
        searchHandler();
    }, []);

    const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = { ...initRow, ...row };

        if (initRow.checksheetCode) {
            const result = await post(newRow);
            if (result.data > 0) {
                searchHandler();
                closeModal();
                alertBox("수정이 완료되었습니다.");
            }
        } else {
            const result = await put(newRow);
            if (result.data > 0) {
                searchHandler();
                closeModal();
                alertBox("작성이 완료되었습니다.");
            } else if (result.data == -1) {
                alertBox(`동일한 ID가 존재합니다.<br />Checksheet_Group_Code: ${newRow.checksheetGroupCode}`);
            }
        }
    }

    const editItemCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = {...initRow, ...row};
        if (newRow.checksheetCode === '') { 
            alertBox("Please select a check sheet!");
            return false;
        }
        if(newRow.itemCode){
            const result = await postItem(newRow);
            if(result.data > 0){
                itemSearchHandler();
                searchHandler();
                closeModal();
                alertBox("수정이 완료되었습니다.");
            } else {
                alertBox("수정 실패");
            }
        }
      }

    const deleteItem = (item: any) => { 
        confirmBox("@DELETE_CONFIRM", async () => {
          const param = {
            checksheetCode: item.data.checksheetCode,
            itemCode: item.data.itemCode
          };
          const result = await api<any>("delete", "checksheettypeclean/itemdel", param);
          if (result) {
              alertBox("수정이 완료되었습니다.");
              itemSearchHandler();
          } else { 
            alertBox("수정 실패");
          }
        }, async () => {
        
        });
    }
    
    const onAddItemClick = () => { 
        setFormItem({
            checksheetCode: checksheetCode.current
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
                            <i className="uil uil-pen me-2"></i> Add checksheet
                        </Button>
                        <Button id="btnAddItem" onClick={onAddItemClick} type="button" color="primary">
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
                        <Row style={{ width: '100%' }}>
                            <Col md={3}>
                                <AutoCombo name="workcenterCode" mapCode="workcenter" placeholder="작업장코드" className="form-control" />
                            </Col>
                            <Col md={3}>
                                <Input name="checksheetGroupCode" placeholder="관리코드" />
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
                                columnDefs={columnTypeProdDefs()}
                                onRowSelected={rowSelectedHandler}
                                onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={itemGridRef}
                                columnDefs={columnChecksheetItemDefs(deleteItem, setFormItem)}
                            />
                        </div>
                    </Col>
                </Row>
            </ListBase>
            <ChecksheetTypeCleanEdit ref={editGroupRef} onComplete={editCompleteHandler} />
            <ChecksheetItemCleanEdit ref={editItemRef} onComplete={editItemCompleteHandler} />
        </>
    );
}

export default ChecksheetTypeCleanList;
