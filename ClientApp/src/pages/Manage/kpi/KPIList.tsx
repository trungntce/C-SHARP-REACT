import { Dictionary } from "../../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { CellDoubleClickedEvent, GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { columnDefs } from "./../UserDefs";
import { columnDefs as groupColumnDefs } from "./../UsergroupDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import AutoCombo from "../../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import UserEdit from "./../UserEdit";
import api from "../../../common/api";

const KPIList = (props: any) => {
    const { t } = useTranslation();

    const listRef = useRef<any>();
    const pageNo = useRef<number>(1);
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const [groupGridRef, setGroupList] = useGridRef();
    const [editRef, setForm, closeModal] = useEditRef();
    const groupComboRef = useRef<any>();
    const groupAddRef = useRef<any>();
    const groupDelRef = useRef<any>();
    const { refetch, post, put, del } = useApi("user", () => {
        const params = getSearch()
        params["pageNo"] = pageNo.current;
        params["pageSize"] = 100;

        return params;
    }, gridRef);

    const searchHandler = async (_?: Dictionary) => {
        const result = await refetch();
        if (result.data) {
            const list: Dictionary[] = result.data;
            setList(list);
            setGroupList([]);

            groupAddRef.current.disabled = true;
            groupDelRef.current.disabled = true;

            listRef.current.setPaging(pageNo.current, 100, list[0]?.totalCount);

            gridRef.current!.api.deselectAll();
        }
    };

    const { refetch: groupRefetch } = useApi("usergroup", () => {
        const rows = gridRef.current!.api.getSelectedRows();
        return { usergroupJson: rows[0].usergroupJson };
    }, groupGridRef);

    const groupSearchHandler = async (_?: Dictionary) => {
        const result = await groupRefetch();
        if (result.data) {
            const list: Dictionary[] = result.data;
            setGroupList(list);
        }
    };

    useEffect(() => {
        searchHandler();
    }, []);

    const rowSelectedHandler = (e: RowSelectedEvent) => {
        if (!e.node.isSelected())
            return;

        groupAddRef.current.disabled = false;
        groupDelRef.current.disabled = false;

        if (!e.data.usergroupJson || e.data.usergroupJson.length <= 0) {
            setGroupList([]);
            return;
        }

        groupSearchHandler();
    }

    const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
        const newRow = { ...initRow, ...row };

        if (initRow.userId) {
            const result = await post(newRow);
            if (result.data > 0) {
                searchHandler();
                closeModal();
                alertBox(t("@MSG_ALRAM_TYPE13"));                                   //수정이 완료되었습니다.
            }
        } else {
            const result = await put(newRow);
            if (result.data > 0) {
                searchHandler();
                closeModal();
                alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));                              //작성이 완료되었습니다.   
            } else if (result.data == -1) {
                alertBox(`${t("@EXIST_SAME_ID")}<br />User Id: ${newRow.userId}`);  //`동일한 ID가 존재합니다.<br />User Id: ${newRow.userId}`
            }
        }
    }

    const deleteHandler = async () => {
        const rows = gridRef.current!.api.getSelectedRows();
        if (!rows.length) {
            alertBox(t("@MSG_ALRAM_TYPE7")); {/*삭제할 행을 선택해 주세요.*/ }
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

    const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
    }

    const groupAddHandler = async () => {
        const item = groupComboRef.current.getValue();
        if (!item?.value) {
            alertBox(t("@SELECT_GROUP"));                                  //그룹을 선택해 주세요.
            return;
        }

        const row = gridRef.current!.api.getSelectedRows()[0];
        const usergroupList = row.usergroupList;

        if (usergroupList.length > 0) {
            if (usergroupList.indexOf(item.value) >= 0) {
                alertBox(t("@ALREADY_ADDED_GROUP"));                        //이미 추가된 그룹입니다.
                groupComboRef.current.setValue({ value: "", label: "" });
                return;
            }
        }

        usergroupList.push(item.value);
        row.usergroupJson = JSON.stringify(usergroupList);

        const result = await api<any>("post", "/user/group", row);
        if (result.data > 0) {
            alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));                         //작성이 완료되었습니다.

            groupComboRef.current.setValue({ value: "", label: "" });
            groupSearchHandler();
        }
    }

    const groupDelHandler = async () => {
        const userRows = gridRef.current!.api.getSelectedRows();
        if (!userRows.length) {
            alertBox(t("@SELECT_USER_DELETE"));                     //삭제할 사용자를 선택해 주세요.
            return;
        }
        const groupRows = groupGridRef.current!.api.getSelectedRows();
        if (!groupRows.length) {
            alertBox(t("@SELECT_GROUP_DELETE"));                   //삭제할 그룹을 선택해 주세요..         
            return;
        }

        const row = userRows[0];

        const usergroupList = userRows[0].usergroupList;
        const index = usergroupList.indexOf(groupRows[0].usergroupId);
        if (index < 0) {
            alertBox(t("@MSG_ALRAM_TYPE7"));                      //삭제할 행을 선택해 주세요.
            return;
        }

        usergroupList.splice(index, 1);
        row.usergroupJson = JSON.stringify(usergroupList);

        const result = await api<any>("post", "/user/group", row);
        if (result.data > 0) {
            alertBox(t("@DELETE_COMPLETE"));                              //삭제되었습니다.

            groupSearchHandler();
        }
    }

    const getRowId = useMemo<GetRowIdFunc>(() => {
        return (params: GetRowIdParams) => {
            return params.data.userId;
        };
    }, []);

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
                                <Input name="userId" type="text" size={5} style={{ width: 110 }} placeholder={`${t("@USER")}ID`} className="form-control" /> {/* 사용자ID */}
                            </Col>
                            <Col>
                                <Input name="userName" type="text" size={5} style={{ width: 140 }} placeholder={t("@USER_NAME")} className="form-control" /> {/* 사용자명 */}
                            </Col>
                            <Col>
                                <AutoCombo name="nationCode" sx={{ width: 100 }} placeholder={t("@COUNTRY_CODE")} mapCode="code" category="LANG_CODE" /> {/* 국가코드 */}
                            </Col>
                            <Col>
                                <Input name="email" type="text" size={5} style={{ width: 140 }} placeholder="Email" className="form-control" />
                            </Col>
                            <Col>
                                <Input name="remark" type="text" size={5} style={{ width: 180 }} placeholder={t("@REMARK")} className="form-control" />
                            </Col>
                            <Col>
                                <select name="useYn" className="form-select">
                                    <option value="">{t("@USEYN")}</option>
                                    <option value="Y">Y</option>
                                    <option value="N">N</option>
                                </select>
                            </Col>
                            <Col style={{ maxWidth: "100px" }} className="text-end">
                                <Label htmlFor="groupby" className="form-label">{`${t("@ADD_GROUP")}:`}</Label> {/* 그룹추가 */}
                            </Col>
                            <Col>
                                <AutoCombo ref={groupComboRef} name="usergroupId" placeholder={t("@USER_GROUP")} mapCode="usergroup" /> {/* 사용자그룹 */}
                            </Col>
                            <Col style={{ minWidth: "170px" }}>
                                <Button innerRef={groupAddRef} type="button" color="primary" onClick={groupAddHandler}>
                                    <i className="fa fa-fw fa-plus"></i>{" "}
                                    {t("@ADD")} {/* 추가 */}
                                </Button>
                                <Button innerRef={groupDelRef} type="button" color="light" onClick={groupDelHandler}>
                                    <i className="fa fa-fw fa-times"></i>{" "}
                                    {t("@DELETE")} {/* 삭제 */}
                                </Button>
                            </Col>
                        </Row>
                    </SearchBase>
                }>
                <Row style={{ height: "100%" }}>
                    <Col md={7}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={gridRef}
                                columnDefs={columnDefs()}
                                onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
                                onRowSelected={rowSelectedHandler}
                                rowMultiSelectWithClick={false}
                                getRowId={getRowId}
                            />
                        </div>
                    </Col>
                    <Col md={5}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={groupGridRef}
                                columnDefs={groupColumnDefs()}
                            />
                        </div>
                    </Col>
                </Row>
            </ListBase>
            <UserEdit
                ref={editRef}
                onComplete={editCompleteHandler}
            />
        </>
    );
};

export default KPIList;
