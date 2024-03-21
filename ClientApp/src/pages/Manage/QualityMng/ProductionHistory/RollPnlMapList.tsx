import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import { columnDefs } from "./RollPnlMapDefs";

const RollPnlMapList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("rollpanelmap", getSearch, gridRef);

  useEffect(() => {
    searchHandler();
  }, []);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data)
      setList(result.data);
  };

  return (
    <>
      <ListBase
        title="SPC Error"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row style={{ flex: "0 0 100%" }}>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="fromDt"
                  defaultValue={moment().add(-2, "days").toDate()}
                  placeholderText="조회시작"
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "125px" }}>
                <DateTimePicker
                  name="toDt"
                  placeholderText="조회종료"
                  required={true}
                />
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <Input name="rollId" type="text" placeholder="ROLL ID" />
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <Input name="panelId" type="text" placeholder="PANEL ID" />
                </Col>
              </div>
              <div style={{ maxWidth: "230px" }}>
                <Col size="auto">
                  <Input name="workorder" type="text" placeholder="BATCH No" />
                </Col>
              </div>
            </Row>
          </SearchBase>
        }
        >
          <GridBase
            ref={gridRef}
            columnDefs={columnDefs()}
          />
        </ListBase>
    </>
  )

}
export default RollPnlMapList;