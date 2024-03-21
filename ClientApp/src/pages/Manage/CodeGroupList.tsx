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
import { codeGroupDefs } from "./CodeGroupDefs";
import CodeGroupEdit from "./CodeGroupEdit";
import { useTranslation } from "react-i18next";

// 1. App.tsx 라우터 설정
// 2. Menu.tsx에서 사이드메뉴 추가

const CodeGroupList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("codegroup", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  useEffect(() => {
    searchHandler();
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.codegroupId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox("작성이 완료되었습니다.");
      }else if(result.data == -1){
        alertBox(`동일한 항목이 존재합니다.<br />Group Id: ${newRow.codegroupId}`);
      }
    }
  };

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox("삭제할 행을 선택해 주세요.");
      return;
    }

    confirmBox("삭제하시겠습니까?", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();
        alertBox("삭제되었습니다.");
      }
    }, async () => {

    });    
  }

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
        deleteHandler={deleteHandler}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <Input name="codegroupId" type="text" className="form-control" size={5} style={{ width: 150 }} placeholder= {`${t("@CODE_GROUP")}ID`} /> {/* 코드그룹ID */}
              </Col>
              <Col>
                <Input name="codegroupName" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={t("@CODE_GROUP_NAEM")} /> {/* 코드그룹명 */}
              </Col>
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option>  {/* 사용여부 */}
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
          columnDefs={codeGroupDefs()}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <CodeGroupEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
};

export default CodeGroupList;
