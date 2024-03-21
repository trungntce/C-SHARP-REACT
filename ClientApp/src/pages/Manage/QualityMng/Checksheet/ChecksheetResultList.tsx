import { Dictionary } from "../../../../common/types";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import { columnResultDefs } from "../../../Manage/QualityMng/Checksheet/ChecksheetResultDefs";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import moment from "moment";

const ChecksheetResultList = (props: any) => {
    const { t } = useTranslation();

    const listRef = useRef<any>();
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const pageNo = useRef<number>(1);
    const { refetch} = useApi("checksheetresult/listresult", getSearch, gridRef);


    const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
    }

    const searchHandler = async (_?: Dictionary) => {
        // setList([]);
        const result = await refetch();
        if (result.data) { 
            const data: Dictionary[] = result.data;
            setList(data);
            const headerRow: Dictionary = {
                no: '',
                checksheetGroupCode: 'Total',
                checkStatusName: data.length
            }
            gridRef.current!.api.setPinnedTopRowData([headerRow]);
        }
    };


    useEffect(() => {
        searchHandler();
    }, []);


    return (
        <>
            <ListBase
                folder="System Management"
                title="Check Sheet Result"
                postfix="Management"
                icon="user-plus"
                ref={listRef}
                showPagination={true}
                onPaging={pagingHandler}
                onGridReady={() => {
                    setList([]);
                }}
                buttons={
                    <>
                       
                    </>
                }
                search={
                    <SearchBase
                        ref={searchRef}
                        searchHandler={searchHandler}
                    >
                        <Row style={{ width: '100%' }}>
                            <Col md={2}>
                                <AutoCombo name="workcenterCode"  mapCode="workcenter" placeholder="작업장코드" className="form-control" />
                            </Col>
                            <Col md={1}>
                                <Input name="checksheetGroupCode" placeholder="관리항목코드"  />
                            </Col>
                            <Col md={1}>
                                <Input name="checksheetCode" placeholder="관리타입"  />
                            </Col>
                            <Col md={2}>
                                <AutoCombo name="eqpCode"  mapCode="eqp" placeholder="설비코드" className="form-control" />
                            </Col>
                            <Col md={1} >
                                <select name="checkStatus" defaultValue={1} className="form-select">
                                    <option >상태 확인</option>
                                    <option value="1">OK</option>
                                    <option value="0">NG</option>
                                </select>
                            </Col>
                            <Col md={1}>
                                <DateTimePicker name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />
                            </Col>
                            <Col md={1}>
                                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
                            </Col>
                            <Col md={1}>
                                <AutoCombo name="groupType" placeholder="선택하다" sx={{ width: "100%" }} mapCode="code" category="CHECK_SHEET_TYPE" />
                            </Col>
                        </Row>
                    </SearchBase>

                }>
                <Row style={{ height: "100%" }}>
                    <Col md={12}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={gridRef}
                                columnDefs={columnResultDefs()}
                            />
                        </div>
                    </Col>
                </Row>
            </ListBase>
        </>
    );
}

export default ChecksheetResultList;
