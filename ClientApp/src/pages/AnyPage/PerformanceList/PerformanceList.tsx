import { Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import { useEffect } from "react";
import GridBase from "../../../components/Common/Base/GridBase";
import { columnDefs } from "./PerformanceDef";

const PerformanceList = () => {
  const [gridRef, setList] = useGridRef();
  const [searchRef, getSearch] = useSearchRef();
  const { refetch, post } = useApi(
    "monitoringdetail/performancelist",
    getSearch,
    gridRef
  );

  const searchHandler = async (_?: Dictionary) => {
    const { data } = await refetch();
    if (data) {
      setList(data);
    }
  };

  useEffect(() => {
    searchHandler();
  }, []);
  return (
    <>
      <ListBase
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col>
                <Input
                  name="eqpcode"
                  placeholder="설비코드"
                  style={{ minWidth: "250px" }}
                />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={columnDefs}
          alwaysShowHorizontalScroll={true}
        />
      </ListBase>
    </>
  );
};

export default PerformanceList;
