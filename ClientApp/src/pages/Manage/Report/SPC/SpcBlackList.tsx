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
import { useTranslation } from "react-i18next";
import SpcBlackListEdit from "./SpcBlackListEdit";
import EqpSelect from "../../Reference/Product/EqpSelect";
import { ColumnDefs } from "./SpcBlackListDefs";

const SpcBlackList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const eqpSetRef = useRef<any>();
  const { refetch, post, put, del } = useApi("spcreport/blacklist", getSearch, gridRef);
  

  const searchHandler = async (_?: Dictionary) => {
    // const result = await refetch();
    const operCode = getSearch().operCode;
    const inspectionDesc = getSearch().inspectionDesc;
    const eqpCode = getSearch().eqpCode;
    const itemCode = getSearch().itemCode;
    // console.log(operCode, inspectionDesc, eqpCode, itemCode)
    const a = {
      operCode : operCode ? operCode : null,
      inspectionDesc : inspectionDesc ? inspectionDesc : null,
      eqpCode : eqpCode ? eqpCode : null,
      itemCode : itemCode? itemCode : null,
    }
    // console.log(typeof operCode )
    // console.log(JSON.stringify(a))

    // const asdf = await api<any>("post", "spcreport/blacklistget", a);
    
    // console.log(asdf.data)

    api<any>("get", "spcreport/blacklistget", a).then((result) => {
      setList(result.data)
    });
    
    // if(result.data) 
    //   setList(result.data);
  }

  useEffect(() => {
    searchHandler();
  }, [])

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};


    if(initRow.rowNo){
      const result : any = await api<any>("post", "spcreport/blacklistupdate", { dic : JSON.stringify(newRow).replaceAll('undefined', '')});

      console.log(result)

      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}`); //동일한 항목이 존재합니다.
      }
    }else{
      const result : any = await api<any>("put", "spcreport/blacklistput", newRow);
      
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}`); //동일한 항목이 존재합니다.
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
      // const result  = await del(rows[0]);
        const result  = await api<any>("delete", "spcreport/blacklistdelete", { "rowNo" : rows[0].rowNo});
        if(result.data > 0) {
          searchHandler();
          alertBox(t("@DELETE_COMPLETE"));
        }
    }, async () => {

    });
  }

  // const copyHandler = () => {
  //   if(!eqpSetRef.current)
  //     return;

  //     const row = gridRef.current!.api.getSelectedRows()[0];

  //   if(!row) {
  //     alertBox(t("@MSG_COPY_ROW")); //복사할 행을 선택해 주세요.
  //     return;
  //   }

  //   eqpSetRef.current.setForm({row});
  //   eqpSetRef.current.setShowModal(true);
  // }

  const eqpSetHandler = (row: Dictionary, initRow: Dictionary) => {
    const newRow = { ... initRow, ...row };

    // api<any>("put", "param/set", newRow).then((result) => {
    //   if (result.data > 0) {
    //     searchHandler();
    //     eqpSetRef.current.setShowModal(false);
    //     alertBox(t("@MSG_ALRAM_WRITE_CMPLT")); //작성이 완료되었습니다.
    //   } else if (result.data == -1) {
    //     alert(t("@MSG_ALRAM_TYPE11")); //동일한 항목이 존재합니다.
    //   }
    // });

  }

  return (
    <>
      <ListBase
        editHandler={() => { setForm({}); }}
        deleteHandler={deleteHandler}
        folder="Reference Management"
        title="Param 기준정보"
        icon="circle"
        // preButtons={
        //   <Button type="button" color="success" onClick={copyHandler}>
        //     {/* 복사 */}
        //     <i className="uil uil-file-edit-alt me-2"></i> {t("@COPY")}
        //   </Button>
        // }
        search={
          <>
            <SearchBase 
              ref={searchRef} 
              searchHandler={searchHandler}
            >
              <Row>
                <Col>
                  <AutoCombo name="operCode" sx={{ minWidth: "120px", width:"130px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" /> {/* 공정코드 */}
                </Col>
                <Col>
                  <AutoCombo name="inspectionDesc" sx={{ minWidth: "130px", width:"140px" }} placeholder={t("@INSPECTION_NAME")} mapCode="spcblack" category = '' /> {/* 검사명 */}
                </Col>
                <Col>
                  <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" /> { /* 설비코드 */ }
                </Col>
                <Col>
                  <AutoCombo name="itemCode" sx={{ minWidth: "150px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item"/> {/* 제품코드 */}
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
      <SpcBlackListEdit ref={editRef} onComplete={editCompleteHandler} />
      {/* <EqpSelect ref={eqpSetRef} onComplete={eqpSetHandler} /> */}
    </>
  )
}

export default SpcBlackList;

