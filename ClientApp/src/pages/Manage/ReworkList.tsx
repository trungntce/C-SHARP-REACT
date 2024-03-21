import { CellDoubleClickedEvent } from "ag-grid-community";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Col, Input, Label, Row } from "reactstrap";
import api from "../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { ReworkDefs } from "./ReworkDefs";
import ReworkEdit from "./ReworkEdit";
import React from "react";
import { useTranslation } from "react-i18next";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const ReworkList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();

  const { refetch, post, put, del } = useApi("rework", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if (result.data) setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ...initRow, ...row };

    if (initRow.codeId) {
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
        //`동일한 항목이 존재합니다.<br /> Id: ${newRow.codeId}`
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br /> Id: ${newRow.codeId}`);
      }
    }
  };

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();

    if (!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7"));  //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(
      t("@DELETE_CONFIRM"),   //삭제하시겠습니까?
      async () => {
        const result = await del(rows[0]);
        if (result.data > 0) {
          searchHandler();
          alertBox(t("@DELETE_COMPLETE"));   //삭제되었습니다.
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
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col size="auto"></Col>
              <Col size="auto">
                <Input
                  name="codeId"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder={`${t("@COL_REWORK")} CODE`} 
                /> {/* 재처리 Code */}
              </Col>
              <Col size="auto">
                <Input
                  name="codeName"
                  type="text"
                  className="form-control"
                  size={5}
                  style={{ width: 200 }}
                  placeholder={`${t("@COL_REWORK")} Name`}
                /> {/* 재처리 Name */}
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <GridBase
          ref={gridRef}
          columnDefs={ReworkDefs()}
          className="ag-grid-bbt"
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <ReworkEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
};

export default ReworkList;
