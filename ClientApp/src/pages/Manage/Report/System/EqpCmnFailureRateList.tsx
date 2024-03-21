import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { columnDefs } from "./EqpCmnFailureRateDefs";

const EqpCmnFailureRateList = () => {

  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("", getSearch);

  useEffect(() => {
    searchHandler();
  });

  const searchHandler = async (_?: Dictionary) => {
    setList([]);
  }

  return (
    <>
      <ListBase 
        folder="Report Management"
        title="Eqp Communication Failure Rate"
        icon="wifi-off"
        buttons={ <></> }
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder="설비코드" mapCode="eqp" />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={columnDefs}
        />
      </ListBase>
    </>
  )
}

export default EqpCmnFailureRateList;