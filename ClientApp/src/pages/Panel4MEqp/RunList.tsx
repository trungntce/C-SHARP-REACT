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
import style from "./Run.module.scss";
import { columnDefs } from "./RunDefs";

const RunList = () => {
  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("panel4m", getSearch, gridRef);

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }
  
  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){

      console.log(result.data);
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
        className={style.runContainer}
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col style={{ minWidth: "250px" }}> 
                <AutoCombo name="eqpCode" placeholder="설비코드" mapCode="eqp" />
              </Col>
              <Col>
                <select name="totalStatus" className="form-select">
                  <option value="">전체</option>
                  <option value="YY">설비가동O + 4M진행O</option>
                  <option value="YN">설비가동O + 4M진행X</option>
                  <option value="NY">설비가동X + 4M진행O</option>
                  <option value="NN">설비가동X + 4M진행X</option>
                </select>
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
            rowClassRules={{
              'eqp-4m-yy': (param: RowClassParams) => {  return param.data.totalStatus == 'YY'; },
              'eqp-4m-yn': (param: RowClassParams) => {  return param.data.totalStatus == 'YN'; },
              'eqp-4m-ny': (param: RowClassParams) => {  return param.data.totalStatus == 'NY'; },
              'eqp-4m-nn': (param: RowClassParams) => {  return param.data.totalStatus == 'NN'; },

              'eqp-container-y': (param: RowClassParams) => {  return param.data.runEqpYn == 'Y'; },
              'eqp-container-n': (param: RowClassParams) => {  return param.data.runEqpYn == 'N'; },

              'panel4m-container-y': (param: RowClassParams) => {  return param.data.start4MYn == 'Y'; },
              'panel4m-container-n': (param: RowClassParams) => {  return param.data.start4MYn == 'N'; },
            }}
          />
      </ListBase>

      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />
    </>
  );
  
};

export default RunList;