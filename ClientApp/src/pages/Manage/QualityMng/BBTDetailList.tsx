import { CellDoubleClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import Select from "../../../components/Common/Select";
import { columnDefs } from "./BBTDetailDefs";


const BBTDetailList = () => {
  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("bbt/detail", () => {
    const params = getSearch()
    params["pageNo"] = pageNo.current;
    params["pageSize"] = 100;
    return params;
  }, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;

      setList(list);

      listRef.current.setPaging(pageNo.current, 100, list[0].totalCount);
    }
  };

  // useEffect(() => {    
  //   searchHandler();
  // }, []);

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  }

  return (
    <>
      <ListBase 
        folder="Quality Management"
        title="BBT"
        postfix="검사DATA 상세조회"
        icon="menu"
        showPagination={true}
        ref={listRef}
        onPaging={pagingHandler}
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={() => { 
            pageNo.current = 1;
            searchHandler(); 
            }}>
            <Row>
              <Col style={{ "minWidth": "120px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-3, 'months').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ "minWidth": "120px" }}> 
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col>
                <AutoCombo name="vendorCode" parentname="vendorId" sx={{ width: "230px" }} placeholder="고객사" mapCode="vendor" category="customer" />
              </Col>
              <Col>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "260px" }} placeholder="제품코드" mapCode="item" />
              </Col>
              <Col>
                <Input name="itemName" placeholder="제품명" style={{ width: "150px"}} />
              </Col>
              <Col>
                <Input name="workorder" placeholder="BATCH No" style={{ width: "200px"}} />
              </Col>
              <Col className="text-end">
                <Label htmlFor="type" className="form-label">산출기준:</Label>
              </Col>
              <Col style={{ "minWidth": "140px" }}>
                <Select name="type" label="산출기준" placeholder="산출기준" defaultValue="D" mapCode="code" category="BBT_DETAIL" required={true} className="form-select" />
              </Col>
            </Row>
          </SearchBase>
        }>
        <GridBase 
          ref={gridRef}
          columnDefs={columnDefs}
          className="ag-grid-bbt"
          alwaysShowHorizontalScroll={true}
        />

      </ListBase>
    </>
  );
  
};

export default BBTDetailList;