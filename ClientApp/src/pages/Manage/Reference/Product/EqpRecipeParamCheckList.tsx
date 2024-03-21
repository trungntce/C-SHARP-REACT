import { ChangeEvent, useEffect, useRef } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import { showLoading } from "../../../../common/utility";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import Select from "../../../../components/Common/Select";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { columnDefs } from "./EqpRecipeParamCheckDefs";
import { useTranslation } from "react-i18next";

const EqpRecipeParamCheckList = () => {
  const { t }  = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch, post } = useApi("eqprecipeparamcheck", getSearch, gridRef);
  const eqpRef = useRef<any>();
  const editBtn = useRef<any>();

  useEffect(() => {
    editBtn.current.disabled = true;
  }, [])

  const getEditAllRows = () => {
    const rowData: Dictionary[] = [];
    gridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  }

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data)
      setList(result.data);
      editBtn.current.disabled = false;
  }

  const editHandlers = async () => {
    const rawList = getEditAllRows();

    const param: Dictionary = {};
    param.rawJson = JSON.stringify(rawList);

    const result = await post(param);
    if(result.data > 0) {
      alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));
      searchHandler();
    }
  }

  const rawTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>, value: string) => {
    if(value == 'P'){ // PC
      eqpRef.current.setMapCode("infoeqppc");
    }else{ // PLC
      eqpRef.current.setMapCode("infoeqp");
    }
  }

  return(
    <>
      <ListBase
        folder="EqpRecipeParam Check"
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button innerRef={editBtn} type="button" color="primary" onClick={editHandlers}>
              <i className="uil uil-pen me-2"></i> {t("@TOTAL_EIDT")}
            </Button>
          </div>
        }
        search={
          <>
            <SearchBase 
              ref={searchRef} 
              searchHandler={searchHandler}
            >
              <Row>
                <Col>
                  <Select 
                      name="rawType" 
                      placeholder={t("@COLLECTION_EQUIPMENT_TYPE")}
                      defaultValue="L" 
                      mapCode="code" 
                      category="HC_TYPE" 
                      className="form-select" 
                      onChange={rawTypeChangeHandler}
                      required={true}
                  />
                </Col>
                <Col>
                  <AutoCombo
                    ref={eqpRef}
                    name="eqpCode"
                    labelname="eqpName"
                    placeholder={`${t("@COL_EQP_CODE")}`}
                    mapCode="infoeqp"
                    required={true}
                  />
                </Col>
              </Row>
            </SearchBase>
          </>
        }>
          <GridBase
            ref={gridRef}
            columnDefs={columnDefs()}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
            enterNavigatesVertically={true}
            enterNavigatesVerticallyAfterEdit={true}
            suppressRowClickSelection={true}
            singleClickEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            onGridReady={() => {
              setList([]);
            }}
            />
        </ListBase>
    </>
  )

}

export default EqpRecipeParamCheckList;