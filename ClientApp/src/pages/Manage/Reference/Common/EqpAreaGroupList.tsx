import { CellDoubleClickedEvent } from "ag-grid-community";
import { useEffect } from "react";
import { Col, Input, Row } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { eqpAreaGroupDefs } from "./EqpAreaGroupDefs";
import EqpAreaGroupEdit from "./EqpAreaGroupEdit";
import { useTranslation } from "react-i18next";

const EqpAreaGroupList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("eqpareagroup", getSearch, gridRef); 

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

    if(initRow.eqpareagroupCode){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13"));    //수정이 완료되었습니다.
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));   //작성이 완료되었습니다.
      }else if(result.data == -1){
        //`동일한 항목이 존재합니다.<br />EqpAreaGroup Code: ${newRow.eqpareagroupCode}`
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />EqpAreaGroup Code: ${newRow.eqpareagroupCode}`);
      }
    }
  };

  const deleteHandler = () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(t("@DELETE_CONFIRM"), async () => {   //삭제하시겠습니까?
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();
        alertBox(t("@DELETE_COMPLETE"));   //삭제되었습니다.
      }
    }, () => {

    });    
  }

  return (
    <>
      <ListBase
        editHandler={() => {
          setForm({});
        }}
        folder="System Management"
        title="EqpAreaGroup"
        postfix="Management"
        icon="align-right"
        deleteHandler={deleteHandler}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
              {/* 설비코드 */}
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
              </Col>
              {/* <Col>
                <Input name="eqpareagroupCode" type="text" className="form-control" size={5} style={{ width: 150 }} placeholder="대분류코드" />
              </Col> */}
              <Col>
              {/* 대분류명 */}
                <Input name="eqpareagroupName" type="text" className="form-control" size={5} style={{ width: 200 }} placeholder={`${t("@LARGE_CATEGORY")} ${t("@COL_NAME")}`} />
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
          columnDefs={eqpAreaGroupDefs()}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
            setForm(e.data);
          }}
        />
      </ListBase>
      <EqpAreaGroupEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
}

export default EqpAreaGroupList;