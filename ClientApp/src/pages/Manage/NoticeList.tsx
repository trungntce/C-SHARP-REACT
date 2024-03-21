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
import { columnDefs } from "./NoticeDefs";
import { useEffect } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import NoticeEdit from "./NoticeEdit";
import { useTranslation } from "react-i18next";

const NoticeList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("notice", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };

    if (initRow.noticeNo) {
      const result = await post(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));   //수정이 완료되었습니다.
      }
    } else {
      const result = await put(newRow);
      if (result.data > 0) {
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));  //작성이 완료되었습니다.
      } else if (result.data == -1) {
        alertBox(
          `${t("@MSG_ALRAM_TYPE11")}<br />Notice No: ${newRow.noticeNo}, Title: ${newRow.title}`
        ); // `동일한 항목이 존재합니다.<br />Notice No: ${newRow.noticeNo}, Title: ${newRow.title}`
      }
    }
  };

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7"));   //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(  //삭제하시겠습니까?
      t("@DELETE_CONFIRM"),
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

  const testHandler = () => {};

  return (
    <>
      <ListBase
        columnDefs={columnDefs}
        editHandler={() => {
          setForm({});
        }}
        deleteHandler={deleteHandler}
        folder="System Management"
        title="Notice"
        postfix="Management"
        icon="menu"
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto">
                <Input
                  name="noticeNo"
                  type="text"
                  size={5}
                  style={{ width: 120 }}
                  placeholder="NO"
                  className="form-control"
                />
              </Col>
              <Col size="auto">
                <Input
                  name="title"
                  type="text"
                  size={5}
                  style={{ width: 200 }}
                  placeholder={t("@TITLE")}
                  className="form-control"
                />
              </Col>
              <Col size="auto">
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option>  {/*사용여부*/}
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
      <NoticeEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
};

export default NoticeList;
