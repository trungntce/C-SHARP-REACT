import { CellDoubleClickedEvent } from "ag-grid-community";
import { SyntheticEvent, useEffect, useRef } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import api from "../../common/api";
import AutoCombo from "../../components/Common/AutoCombo";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { ColumnDefs } from "./OperInspMatter4MDefs";
import ListBase from "../../components/Common/Base/ListBase";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import OperInspMatter4MEdit from "./OperInspMatter4MEdit";

const OperInspMatter4M = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const eqpSetRef = useRef<any>();

  const workcenterRef = useRef<any>();
  const operRef = useRef<any>();


  const { refetch, post, put, del } = useApi("operinspmatter4m", getSearch, gridRef);
  

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

    console.log(newRow)

    if(initRow.rowNo){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox(t("@MSG_ALRAM_TYPE13")); //수정이 완료되었습니다.
      }else if(result.data == -1){
        alertBox(`${t("@MSG_ALRAM_TYPE11")}`); //동일한 항목이 존재합니다.
      }
    }else{
      const result = await put(newRow);
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
    console.log(rows)
    confirmBox(t("@DELETE_CONFIRM"), async () => { 
      const result  = await del(rows[0]);
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

  const setWorkcenter = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    operRef.current.setCategory(value?.value);
  };

  return (
    <>
      <ListBase
        editHandler={() => { setForm({}); }}
        deleteHandler={deleteHandler}
        folder="Reference Management"
        title="Param 기준정보"
        icon="circle"
        search={
          <>
            <SearchBase
              ref={searchRef} 
              searchHandler={searchHandler} 
            >
              <Row>
                {/* <Col>
                <AutoCombo name="operClass" sx={{ minWidth: "120px", width:"130px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="operclass" required={true} />
                </Col> */}
                <Col>
                  <AutoCombo name="workcenter" onChange={setWorkcenter} ref={workcenterRef} sx={{ minWidth: "120px", width:"130px" }} placeholder={"작업장"} mapCode="workcenter" /> {/* 작업장 */}
                </Col>
                <Col>
                  <AutoCombo name="operCode" ref={operRef} sx={{ minWidth: "120px", width:"130px" }} category={workcenterRef} placeholder={t("@COL_OPERATION_CODE")} mapCode="operbyworkcenter" required={true}/> {/* 공정코드 */}
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
      <OperInspMatter4MEdit ref={editRef} onComplete={editCompleteHandler} />
      {/* <EqpSelect ref={eqpSetRef} onComplete={eqpSetHandler} /> */}
    </>
  )
}

export default OperInspMatter4M;
