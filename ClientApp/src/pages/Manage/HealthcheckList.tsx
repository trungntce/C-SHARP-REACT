import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import HealthcheckEdit from "./HealthcheckEdit";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import {
  useApi,
  useEditRef,
  useGridRef,
  useSearchRef,
} from "../../common/hooks";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { columnDefs } from "./HealthcheckDefs";
import { useEffect, useTransition } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { getMap } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import api from "../../common/api";
import { useTranslation } from "react-i18next";

const HealthcheckList = (props: any) => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("healthcheck", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };

    if (initRow.hcCode) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));  //수정이 완료되었습니다.
      }
    } else {
      const result = await put(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      } else if (result.data == -1) {
        //`동일한 항목이 존재합니다.<br />상태관리코드: ${newRow.hcCode}`
        alertBox(
          `${t("@MSG_ALRAM_TYPE11")}.<br />상태관리코드: ${newRow.hcCode}`
        );
      }
    }
  };

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7"));   //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(
      "@DELETE_CONFIRM",
      async () => {
        const result = await del(rows[0]);
        if (result.data > 0) {
          searchHandler();
          alertBox("@DELETE_COMPLETE");
        }
      },
      async () => {}
    );
  };

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
        deleteHandler={deleteHandler}
        folder="System Management"
        title="Healthcheck"
        postfix="Management"
        icon="bold"
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col>
              {/* 상태관리코드 */}
                <Input
                  name="hcCode"
                  type="text"
                  size={5}
                  style={{ minWidth: 150 }}
                  placeholder={t("@STATUS_MANAGE_CODE")}
                  className="form-control"
                />
              </Col>
              <Col>
                {/* 수집장비유형 */}
                <AutoCombo
                  name="hcType"
                  sx={{ minWidth: 100 }}
                  placeholder={t("@COLLECTION_EQUIPMENT_TYPE")}
                  mapCode="code"
                  category="HC_TYPE"
                />
              </Col>
              <Col>
                {/* 코드명 */}
                <Input
                  name="hcName"
                  type="text"
                  size={5}
                  style={{ minWidth: 150 }}
                  placeholder={t("@CODE_NAME")}
                  className="form-control"
                />
              </Col>
              <Col>
                {/* 관리태그 */}
                <AutoCombo
                  name="tags"
                  sx={{ minWidth: 200 }}
                  placeholder={t("@MANAGE_TAG")}
                  mapCode="code"
                  category="HC_TAGS"
                  isLang={true}
                />
              </Col>
              <Col>
                <Input
                  name="remark"
                  type="text"
                  size={5}
                  style={{ minWidth: 200 }}
                  placeholder={t("@REMARK")}
                  className="form-control"
                />
              </Col>
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={columnDefs()}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <HealthcheckEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
};

export default HealthcheckList;
