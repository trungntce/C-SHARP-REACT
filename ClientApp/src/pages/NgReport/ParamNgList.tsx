import moment from "moment";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import LotSearch from "../Trace/LotSearch";
import { paramErrorDefs } from "./ParamNgDefs";

const ParamNgList = () => {
  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("ngreport/paramng", getSearch, gridRef);

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const searchHandler = async (_?:Dictionary) => {
    const result = await refetch();

    if(result.data)
      setList(result.data);
  }

  useEffect(() => {
    searchHandler();
  }, []);


  return(
    <>
      <ListBase
        columnDefs={paramErrorDefs}
        folder="Report Manage"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
           <Row>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-2, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col>
                <AutoCombo name="eqpCode" sx={{ minWidth: "180px" }} placeholder="설비코드" mapCode="eqp" />
              </Col>
              {/* <Col>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "220px" }} placeholder="제품코드" mapCode="item" />
              </Col> */}
              <Col>
                <AutoCombo name="modelCode" placeholder="모델코드" mapCode="model" />
              </Col>
              <Col>
                <Input name="modelName" placeholder="모델명" style={{ minWidth: "200px" }} />
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
            columnDefs={paramErrorDefs}
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
  )
}

export default ParamNgList;