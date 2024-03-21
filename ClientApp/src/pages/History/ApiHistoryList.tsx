import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label, Card, CardHeader, CardBody } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { RowSelectedEvent } from "ag-grid-community";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { apiHistoryDefs } from "./ApiHistoryDefs";
import DateTimePicker from "../../components/Common/DateTimePicker";
import moment from "moment";
import style from "./History.module.scss";
import ApiHistoryView from "./ApiHistoryView";

const ApiHistoryList = (props: any) => {
  const { t } = useTranslation();

  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const [searchRef, getSearch] = useSearchRef();  
  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("apihistory", () => {
    const params = getSearch()
    params["pageNo"] = pageNo.current;
    params["pageSize"] = 100;

    return params;
  }, gridRef); 

  const viewRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;
      setList(list);

      listRef.current.setPaging(pageNo.current, 100, list[0].totalCount);
    }
  };

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  };

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    viewRef.current.setRow(e.data);
  }

  useEffect(() => {
    // searchHandler();
  }, []);

  return (
    <>
      <ListBase
        className={style.historyWrap}
        buttons={[]}
        ref={listRef}
        showPagination={true}
        onPaging={pagingHandler}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col style={{ "maxWidth": "125px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ "maxWidth": "125px" }}> 
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>              
              <Col>
              <select name="method" className="form-select">
                  <option value="">ALL</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="POST">POST</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </Col>
              <Col style={{ "minWidth": "160px" }}>
                <Input name="path" type="text" className="form-control" placeholder="Path" />
              </Col>
              <Col style={{ "minWidth": "160px" }}>
                <Input name="query" type="text" className="form-control" placeholder="Query" />
              </Col>
              <Col style={{ "minWidth": "160px" }}>
                <Input name="request" type="text" className="form-control" placeholder="Request" />
              </Col>
              <Col style={{ "minWidth": "160px" }}>
                <Input name="response" type="text" className="form-control" placeholder="Response" />
              </Col>
              <Col style={{ "minWidth": "140px" }}>
                <Input name="host" type="text" className="form-control" placeholder="Host" />
              </Col>
              <Col style={{ "minWidth": "140px" }}>
                <Input name="client" type="text" className="form-control" placeholder="Client" />
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={apiHistoryDefs()}
                  onRowSelected={rowSelectedHandler}
                  rowMultiSelectWithClick={false}
                />
              </div>
            </Col>
            <Col md={4} style={{ height: "100%" }}>
              <div className="pb-2" style={{ height: "calc(100% - 0px)", overflowY: "auto" }}>
                <ApiHistoryView 
                  ref={viewRef}
                />
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );
};

export default ApiHistoryList;
