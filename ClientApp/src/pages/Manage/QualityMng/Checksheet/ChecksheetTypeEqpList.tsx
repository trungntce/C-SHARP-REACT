import { contentType, Dictionary } from "../../../../common/types";
import { CellDoubleClickedEvent, RowSelectedEvent } from "ag-grid-community";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import { columnTypeEqpDefs } from "../../../Manage/QualityMng/Checksheet/ChecksheetTypeEqpDefs";
import { columnEqpDefs } from "../../../Manage/QualityMng/Checksheet/ChecksheetEqpDefs";
import { columnItemEqpDefs } from "../../../Manage/QualityMng/Checksheet/ChecksheetItemEqpDefs";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import ChecksheetTypeEqpEdit from "./ChecksheetTypeEqpEdit";
import ChecksheetItemEqpEdit from "./ChecksheetItemEqpEdit";
import ChecksheetGroupTypeEqpEdit from "./ChecksheetGroupTypeEqpEdit";
import { showProgress } from "../../../../components/MessageBox/Progress";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";
import api from "../../../../common/api";
import ChecksheetModalPreview from "./ChecksheetModalPreview";
import ChecksheetItemUploadModal from "./ChecksheetItemUploadModal";

const ChecksheetTypeEqpList = (props: any) => {
    const { t } = useTranslation();
    const groupType = useRef<any>(props.groupType);
    const listRef = useRef<any>();
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const [itemGridRef, setItemList] = useGridRef();
    const [itemCksGridRef, setItemCksList] = useGridRef();
    const pageNo = useRef<number>(1);
    const [editGroupRef, setForm, closeModal] = useEditRef();
    const [editItemRef, setFormItem, closeItemModal] = useEditRef();
    const { refetch, post, put, del } = useApi("checksheettypeemt", () => { 
        const params = getSearch();
        params.groupType = groupType.current;
        return params;
    }, gridRef);
    const checksheetCode = useRef<any>();
    const eqpCode = useRef<any>();
    const checksheetGroupCode = useRef<any>();
    const previewRef = useRef<any>();
    const checksheetItemUploadRef = useRef<any>();

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

    const { refetch: itemRefetch } = useApi("checksheettypeEmt/item", () => {
        const rows = gridRef.current!.api.getSelectedRows();
        checksheetCode.current = rows[0].checksheetCode;
        checksheetGroupCode.current = rows[0].checksheetGroupCode;
        return {
            checksheetCode: rows[0].checksheetCode,
        };
    }, itemGridRef);

    const { refetch: itemcksRefetch } = useApi("checksheettypeEmt/itemcks", () => {
        const rows = itemGridRef.current!.api.getSelectedRows();
        eqpCode.current = rows[0].eqpCode;
        checksheetGroupCode.current = rows[0].checksheetGroupCode;
        return {
            eqpCode: rows[0].eqpCode,
            checksheetCode : rows[0].checksheetCode,
            checksheetGroupCode: rows[0].checksheetGroupCode,
            groupType: groupType
        };
    }, itemCksGridRef);

    const itemSearchHandler = async (_?: Dictionary) => {
        eqpCode.current = "";
        const result = await itemRefetch();
        if (result.data) {
            const list: Dictionary[] = result.data;
            setItemList(list);
        }
    };

    const itemCksSearchHandler = async (_?: Dictionary) => {

        const result = await itemcksRefetch();
        if (result.data) {
            const list: Dictionary[] = result.data;
            setItemCksList(list);
        }
    };

    const rowSelectedHandler = (e: RowSelectedEvent) => {

        if (!e.node.isSelected()) {
            return;
        }
        itemSearchHandler();
    }

    const rowEqpSelectedHandler = (e: RowSelectedEvent) => {
        if (!e.node.isSelected()) {
            return;
        }
        itemCksSearchHandler();
    }

    const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
    }

    const searchHandler = async (_?: Dictionary) => {
        // setList([]);
        checksheetCode.current = "";
        const result = await refetch();
        if (result.data) setList(result.data);
    };


    useEffect(() => {
        searchHandler();
    }, []);

    const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = { ...initRow, ...row };
        
        if (initRow.checksheetGroupCode) {
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
        setFormItem({
             'eqpCode': eqpCode.current,
            'checksheetCode': checksheetCode.current
        });
        if (newRow.checksheetCode === '') { 
            alertBox("Please select a check sheet!");
            return false;
        }
        if (newRow.eqpCode === '') { 
            alertBox("Please select a Equipment!");
            return false;
        }
        console.log('newrow', newRow);
        if (newRow.checksheetItemCode) {
            const result: any = await api<any>("post", "checksheettypeemt/iteminsert", newRow);
            if(result.data > 0){
                itemCksSearchHandler();
                searchHandler();
              closeModal();
              alertBox("수정이 완료되었습니다.");
            } else {
              alertBox("수정 실패");
            }
        }
      }

      const onAddItemClick = () => {
        if (eqpCode.current === null || eqpCode.current === undefined || eqpCode.current === '') {
          alertBox("설비 선택하세요 ");
          return;
        }
        setFormItem({
          'eqpCode': eqpCode.current,
          'checksheetCode': checksheetCode.current
        });
     }

     const excelHandler = async (e: any) => {
        e.preventDefault();
    
        if (itemCksGridRef.current!.api.getDisplayedRowCount() <= 0) {
          alertBox("데이터가 없습니다.");
          return;
        }
    
        const param = getSearch();
        param.isExcel = true;
        param.EqpCode = eqpCode.current;
        param.ChecksheetCode = checksheetCode.current;
        param.ChecksheetGroupCode = checksheetGroupCode.current;
    
        const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
        startFakeProgress();
    
        const result = await api<any>("download", "checksheettypeEmt/itemcks", param);

        downloadFile(`cheeksheet_item_EMT_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
        
        hideProgress();
      };

      const deleteItem = (item: any) => { 
        confirmBox("@DELETE_CONFIRM", async () => {
          const param = {
            checksheetCode: item.data.checksheetCode,
            checksheetItemCode: item.data.checksheetItemCode,
            eqpCode: item.data.eqpCode
          };
          const result = await api<any>("delete", "checksheettypeEmt/itemdel", param);
          if (result) {
            alertBox("수정이 완료되었습니다.");
            itemCksSearchHandler()
          } else { 
            alertBox("수정 실패");
          }
      }, async () => {
      
      });
    }
    
    const previewImg = (e: any) => {
        previewRef.current.setImgUrl("/api/apichecksheet/download?path=" + e.imgPath + '&name=' + e.imgNm);
        previewRef.current.onToggleModal(e);
    }

    const uploadExcel = (e: any) => { 
        const rows = gridRef.current!.api.getSelectedRows();
        if (!rows.length) { 
            alertBox("Please select a checksheet!");
            return;
        }
        const rowEqps = itemGridRef.current!.api.getSelectedRows();
        if (!rowEqps.length) { 
            alertBox("Please select a Equipment!");
            return;
        }
        const checksheetCode = rows[0].checksheetCode;
        checksheetItemUploadRef.current.setChecksheetCode(checksheetCode);
        checksheetItemUploadRef.current.setEqpCode(rowEqps[0].eqpCode);
        checksheetItemUploadRef.current.onToggleModal(e);
    }

    return (
        <>
            <ListBase
                folder="System Management"
                title="Check Sheet"
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
                        <Button onClick={uploadExcel} type="button" color="primary">
                            <i className="uil uil-upload me-2"></i> Upload Excel
                        </Button>
                        <Button id="btnAddItem" onClick={() => onAddItemClick()} type="button" color="primary">
                            <i className="uil uil-pen me-2"></i> Add Item checksheet
                        </Button>
                        <Button onClick={deleteGroupHandler} type="button" color="light" disabled>
                            <i className="uil uil-trash me-2"></i> {t("@DELETE")}
                        </Button>
                    </div>
                }
                search={
                    <SearchBase
                        ref={searchRef}
                        searchHandler={searchHandler}
                        postButtons={
                            <>
                              <Button type="button" color="outline-primary" onClick={excelHandler}>
                                <i className="mdi mdi-file-excel me-1"></i>{" "}
                                Excel
                              </Button>
                            </>
                          }
                    >
                        <Row style={{ width: '100%' }}>
                                <Col md={3}>
                                    <AutoCombo name="workcenterCode"  mapCode="workcenter" placeholder="작업장코드" className="form-control" />
                                </Col>
                                <Col md={3}>
                                    <AutoCombo name="eqpCode"  mapCode="eqp" placeholder="작업장코드" className="form-control" />
                                </Col>
                                <Col md={3}>
                                    <Input name="checksheetGroupCode" placeholder="관리코드"  />
                                </Col>
                                <Col md={3} >
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
                    <Col md={7}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={gridRef}
                                columnDefs={columnTypeEqpDefs()}
                                onRowSelected={rowSelectedHandler}
                                onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
                            />
                        </div>
                    </Col>
                    <Col md={5}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={itemGridRef}
                                columnDefs={columnEqpDefs()}
                                onRowSelected={rowEqpSelectedHandler}
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={itemCksGridRef}
                                columnDefs={columnItemEqpDefs(deleteItem, setFormItem, previewImg)}
                                onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setFormItem(e.data); }}
                            />
                        </div>
                    </Col>
                </Row>
            </ListBase>
            <ChecksheetTypeEqpEdit groupType={groupType.current} ref={editGroupRef} onComplete={editCompleteHandler} />
            <ChecksheetItemEqpEdit ref={editItemRef} onComplete={editItemCompleteHandler} />
            <ChecksheetModalPreview ref={previewRef} />
            <ChecksheetItemUploadModal ref={checksheetItemUploadRef} />
        </>
    );
}

export default ChecksheetTypeEqpList;
