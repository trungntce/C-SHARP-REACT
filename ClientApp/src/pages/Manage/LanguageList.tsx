import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
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
import { columnDefs } from "./LanguageDefs";
import { useEffect, useRef } from "react";
import LanguageEdit from "./LanguageEdit";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import AutoCombo from "../../components/Common/AutoCombo";
import LanguageEditSet from "./LanguageEditSet";
import api from "../../common/api";
import { useTranslation } from "react-i18next";

const LanguageList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const editSetRef = useRef<any>();
  const { refetch, post, put, del } = useApi("language", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };

    if (initRow.langCode) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }
    } else {
      const result = await put(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      } else if (result.data == -1) {
        alert(`${t("@MSG_ALRAM_TYPE11")} Language Code: ${newRow.langCode}`); //동일한 항목이 존재합니다
      }
    }
  };

  const editSetHandler = (row: Dictionary) => {
    if(!editSetRef.current)
      return;

    editSetRef.current.setForm({});
    editSetRef.current.setShowModal(true);
  }

  const editSetCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };
    
    api<any>("put", "language/set", newRow).then((result) => {
      if (result.data > 0) {
        searchHandler();
        editSetRef.current.setShowModal(false);
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      } else if (result.data == -1) {
        alert(`${t("@MSG_ALRAM_TYPE11")} Language Code: ${newRow.langCode}`); //동일한 항목이 존재합니다
      }
    });
  };

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(
      t("@DELETE_CONFIRM"), //삭제하시겠습니까?
      async () => {
        const result = await del(rows[0]);
        if (result.data > 0) {
          searchHandler();
          alertBox(t("@DELETE_COMPLETE"));  //삭제되었습니다.
        }
      },
      async () => {}
    );
  };

  return (
    <>
      <ListBase
        columnDefs={columnDefs}
        editHandler={() => {
          setForm({});
        }}
        deleteHandler={deleteHandler}
        folder="System Management"
        title="Language"
        postfix="Management"
        icon="menu"
        preButtons={
          <Button type="button" color="success" onClick={editSetHandler}>
            {/* 일괄작성 */}
            <i className="uil uil-file-edit-alt me-2"></i> {t("@TOTAL_WRITE")}
          </Button>
        }
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                {/* 다국어코드 */}
                <Input name="langCode" type="text" className="form-control" size={5} style={{ width: 150 }} placeholder={t("@LANG_CODE")} />
              </Col>
              <Col size="auto">
                {/* 국가코드 */}
                <AutoCombo name="nationCode" sx={{ width: 200 }} placeholder={t("@COUNTRY_CODE")} mapCode="code" category="LANG_CODE" />
              </Col>
              <Col size="auto">
                <Input name="langText" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={`${t("@LANG")}Text`} />
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
      <LanguageEdit ref={editRef} onComplete={editCompleteHandler} />
      <LanguageEditSet ref={editSetRef} onComplete={editSetCompleteHandler} />
    </>
  );
};

export default LanguageList;
