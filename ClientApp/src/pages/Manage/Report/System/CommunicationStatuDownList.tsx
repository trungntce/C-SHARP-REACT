import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary, contentType } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import { DownListDefs } from "./CommunicationStatusDefs";

const CommunicationStatuDownList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi(
    "DownList/communicationdownlist",
    getSearch,
    gridRef
  );

  const category = useRef<any>();
  const editBtn = useRef<any>();

  useEffect(() => {
    //searchHandler();
  }, []);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if (result.data) {
      setList(result.data);
    }
  };

  return (
    <>
      <ListBase
        title="BarcodeReader"
        buttons={<></>}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col>
                <Row>
                  <Col style={{ maxWidth: "120px" }}>
                    <DateTimePicker
                      name="fromDt"
                      defaultValue={moment().add(-1, "days").toDate()}
                      placeholderText={t("@SEARCH_START_DATE")}
                      required={true}
                    /> {/* 조회시작 */}
                  </Col>
                  <Col style={{ maxWidth: "120px" }}>
                    <DateTimePicker
                      name="toDt"
                      defaultValue={moment().add(1, "days").toDate()}
                      placeholderText={t("@SEARCH_END_DATE")}
                      required={true}
                    /> {/* 조회종료 */}
                  </Col>
                  <Col size="auto">
                    <AutoCombo
                      name="eqpCode"
                      sx={{ minWidth: "250px" }}
                      placeholder={t("@COL_EQP_CODE")}
                      mapCode="eqp"
                    /> {/* 설비코드 */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Row style={{ height: "100%" }}>
            <Col>
              <GridBase
                ref={gridRef}
                columnDefs={DownListDefs()}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
                suppressRowClickSelection={true}
                singleClickEdit={true}
                onGridReady={() => setList([])}
              />
            </Col>
          </Row>
        </Row>
      </ListBase>
    </>
  );
};

export default CommunicationStatuDownList;
