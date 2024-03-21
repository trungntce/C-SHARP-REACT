import { CellDoubleClickedEvent } from "ag-grid-community";
import { useEffect, useRef } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import EqpSelect from "./EqpSelect";
import { ColumnDefs } from "./ParamExtraDefs";
import ParamEdit from "./ParamEdit";
import { useTranslation } from "react-i18next";

const ParamExtraList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const eqpSetRef = useRef<any>();
  const { refetch, post, put, del } = useApi("paramextra", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data) 
      setList(result.data);
  }

  useEffect(() => {
    searchHandler();
  }, [])

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
       

    if(
      newRow.groupCode === undefined || newRow.groupCode === 'undefined' ||
      newRow.eqpCode === undefined || newRow.eqpCode === 'undefined' ||
      newRow.rawType === undefined || newRow.rawType === 'undefined' ||
      newRow.tableName === undefined || newRow.tableName === 'undefined' ||
      newRow.columnName === undefined || newRow.columnName === 'undefined' ||
      newRow.std === undefined || newRow.std === 'undefined' ||
      newRow.lcl === undefined || newRow.lcl === 'undefined' ||
      newRow.ucl === undefined || newRow.ucl === 'undefined' ||
      newRow.lsl === undefined || newRow.lsl === 'undefined' ||
      newRow.usl === undefined || newRow.usl === 'undefined' ||
      newRow.interlockYn === undefined || newRow.interlockYn === 'undefined' ||
      newRow.alarmYn === undefined || newRow.alarmYn === 'undefined' ||
      newRow.judgeYn === undefined || newRow.judgeYn === 'undefined'
      )
    {
      alertBox(t("@CHECK_REQUIRE_INPUT_VALUE")); // 필수 입력값을 확인하세요
      return;
    }

    if(initRow.paramId){
        const result = await post(newRow);
        if(result.data > 0){
          searchHandler();
          closeModal();
          alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
        }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_WRITE_CMPLT")}<br />EqpCode: ${newRow.eqpCode}, Param ID: ${newRow.paramId}`); //동일한 항목이 존재합니다.
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

      confirmBox(t("@DELETE_CONFIRM"), async () => { 
      const result  = await del(rows[0]);
      if(result.data > 0) {
        searchHandler();
        alertBox(t("@DELETE_COMPLETE"));
      }
    }, async () => {

    });
  }

  const copyHandler = () => {
    if(!eqpSetRef.current)
      return;

      const row = gridRef.current!.api.getSelectedRows()[0];

    if(!row) {
      alertBox(t("@MSG_COPY_ROW")); //복사할 행을 선택해 주세요.
      return;
    }

    eqpSetRef.current.setForm({row});
    eqpSetRef.current.setShowModal(true);
  }

  const eqpSetHandler = (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ... initRow, ...row };

    api<any>("put", "param/set", newRow).then((result) => {
      if (result.data > 0) {
        searchHandler();
        eqpSetRef.current.setShowModal(false);
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      } else if (result.data == -1) {
        alert(t("@MSG_ALRAM_TYPE11")); //동일한 항목이 존재합니다.
      }
    });

  }

  return (
    <>
      <ListBase
        editHandler={() => { setForm({}); }}
        deleteHandler={deleteHandler}
        folder="Reference Management"
        title="Param 기준정보"
        icon="circle"
        preButtons={
          <Button type="button" color="success" onClick={copyHandler}>
            {/* 복사 */}
            <i className="uil uil-file-edit-alt me-2"></i> {t("@COPY")}
          </Button>
        }
        search={
          <>
            <SearchBase 
              ref={searchRef} 
              searchHandler={searchHandler}
            >
              <Row>
                <Col>
                  <AutoCombo name="groupCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_GROUP_CODE")} mapCode="recipeparamgroup"/>
                </Col>
                <Col>
                  <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
                </Col>
                <Col>
                  <Input name="paramId" type="text" placeholder={t("@PARAMETER_ID")} className="form-control" />
                </Col>
              </Row>
            </SearchBase>
          </>
        }>
        <GridBase
          ref={gridRef}
          columnDefs={ColumnDefs()}
          onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
        />
      </ListBase>
      <ParamEdit ref={editRef} onComplete={editCompleteHandler} />
      <EqpSelect ref={eqpSetRef} onComplete={eqpSetHandler} />
    </>
  )
}

export default ParamExtraList;