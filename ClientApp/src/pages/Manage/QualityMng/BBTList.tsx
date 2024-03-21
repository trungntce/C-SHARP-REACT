import { CellDoubleClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import { executeIdle, showLoading } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import Select from "../../../components/Common/Select";
import { columnDefs, ngTypes } from "./BBTDefs";


const BBTList = () => {
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("bbt", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;

      setList(list);

      const footerRow: Dictionary = {
        panelCnt: 0,
        totalCnt: 0,
        ngCnt: 0,

        "4WCnt": 0,
        auxCnt: 0,
        bothCnt: 0,
        cCnt: 0,
        erCnt: 0,
        openCnt: 0,
        spkCnt: 0,
        shortCnt: 0,
      }

      ngTypes.forEach(ng => {
        footerRow[ng.field] = 0;
      });

      if(list.length){
        list.forEach((item) => {
          footerRow.mesDate = "Total";

          footerRow.panelCnt += item.panelCnt;
          footerRow.totalCnt += item.totalCnt;
          footerRow.ngCnt += item.ngCnt

          footerRow["4WCnt"] += item["4WCnt"];
          footerRow.auxCnt += item.auxCnt;
          footerRow.bothCnt += item.bothCnt;
          footerRow.cCnt += item.cCnt;
          footerRow.erCnt += item.erCnt;
          footerRow.openCnt += item.openCnt;
          footerRow.spkCnt += item.spkCnt;
          footerRow.shortCnt += item.shortCnt;

          ngTypes.forEach(ng => {
            footerRow[ng.field] += item[ng.field];
          });
        });        

        gridRef.current!.api.setPinnedTopRowData([footerRow]);
      }
    }
  };

  useEffect(() => {    
    searchHandler();
  }, []);

  return (
    <>
      <ListBase 
        folder="Quality Management"
        title="BBT"
        postfix="검사DATA조회"
        icon="menu"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
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
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "280px" }} placeholder="제품코드" mapCode="item" />
              </Col>
              <Col>
              <Input name="itemName" placeholder="제품명" style={{ width: "150px"}} />
              </Col>
              <Col>
                <Input name="workorder" placeholder="BATCH No" style={{ width: "200px"}} />
              </Col>
              <Col className="text-end">
                <Label htmlFor="groupby" className="form-label">조회기준:</Label>
              </Col>
              <Col style={{ "minWidth": "100px" }}>
                <Select name="groupby" label="조회기준" placeholder="조회기준" defaultValue="LOT" mapCode="code" category="BBT_GROUPBY" required={true} className="form-select" />
              </Col>
            </Row>
          </SearchBase>
        }>
        <GridBase 
          ref={gridRef}
          columnDefs={columnDefs()}
          className="ag-grid-bbt"
          alwaysShowHorizontalScroll={true}
        />

      </ListBase>
    </>
  );
  
};

export default BBTList;