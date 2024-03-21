import { CellDoubleClickedEvent, RowClassParams } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import api from "../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import LotSearch from "../Trace/LotSearch";
import { columnDefs } from "./EqpSpcJudgeDefs";
import style from "./NgReport.module.scss";

const EqpSpcJudgeList = () => {
  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("ngreport/eqpspc", getSearch, gridRef);

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }
  
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;

      setList(list);
    }
  };

  useEffect(() => {    
    searchHandler();    
  }, []);

  return (
    <>
      <ListBase 
        className={style.ngContainer}
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-5, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col>
                <AutoCombo name="spcType" sx={{ minWidth: "120px" }} placeholder="불량유형" mapCode="code" category="SPC_TYPE" />
              </Col>
              <Col>
                <AutoCombo name="eqpCode" sx={{ minWidth: "180px" }} placeholder="설비코드" mapCode="eqp" />
              </Col>
              {/* <Col>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "220px" }} placeholder="제품코드" mapCode="item" />
              </Col> */}
              <Col style={{ minWidth: "200px" }}>
                <AutoCombo name="modelCode" placeholder="모델코드" mapCode="model" />
              </Col>
              <Col style={{ minWidth: "200px" }}>
                <Input name="modelName" placeholder="모델명" />
              </Col>
              <Col>
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 200 }} className="form-control" placeholder="LOT(WORKORDER)" />
              </Col>
              <Col style={{ maxWidth: 220 }}>
                <Button type="button" color="info" style={{ width: 210 }} onClick={() => {
                  lotSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  BATCH(WORKORDER) 검색
                </Button>
              </Col>

            </Row>
          </SearchBase>
        }>
          <GridBase 
            ref={gridRef}
            columnDefs={columnDefs()}
            alwaysShowHorizontalScroll={true}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
          />
      </ListBase>

      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />
    </>
  );
  
};

export default EqpSpcJudgeList;