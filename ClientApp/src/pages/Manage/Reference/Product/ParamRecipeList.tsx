import { CellDoubleClickedEvent, RowSelectedEvent, TabToNextCellParams } from "ag-grid-community";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { ColumnDefs } from "./ParamRecipeDefs";
import AutoCombo from "../../../../components/Common/AutoCombo";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import { ParamEditColumnDefs, RecipeEditColumnDefs } from "./ParamRecipeEditDefs";
import { isNullOrWhitespace } from "../../../../common/utility";
import LangTextBox from "../../../../components/Common/LangTextBox";

const ParamRecipeList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [paramEditGridRef, setParamEditList] = useGridRef();
  const [recipeEditGridRef, setRecipeEditList] = useGridRef();
  const { refetch, post, put, del } = useApi("paramrecipegroup", getSearch, gridRef);

  const eqpRef = useRef<any>();
  const eqpValRef = useRef<string>("");
  const groupCode = useRef<any>();
  const groupNameRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data) 
      setList(result.data);
  }

  const paramEditHandler = async (row: Dictionary) => {
    paramEditGridRef.current!.api.showLoadingOverlay();

    const result = await api<any>("get", "param", { groupCode: row.groupCode })

    if(result.data) {
      const list = result.data.sort((a: Dictionary, b: Dictionary) => {
        if (a.columnName < b.columnName) {
          return -1;
        }
      });

      setParamEditList(list);
    }
  }

  const recipeEditHandler = async (row: Dictionary) => {
    recipeEditGridRef.current!.api.showLoadingOverlay();

    const result = await api<any>("get", "recipe", { groupCode: row.groupCode })

    if(result.data) 
      setRecipeEditList(result.data);
  }

  const groupRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    groupCode.current = e.data.groupCode;
    groupNameRef.current.setValue(e.data.groupName);

    paramEditHandler(e.data);
    recipeEditHandler(e.data);
  }

  useEffect(() => {
    searchHandler();
  }, [])

  const newHandler = async () => {
    const val = eqpRef.current.getValue();
    if(!val || !val.value)
    {
      alertBox(t("@MSG_PLEASE_ENTER_EQUIPMENT_ADDED"));
      return;
    }

    eqpValRef.current = val.value;

    paramEditGridRef.current!.api.showLoadingOverlay();
    recipeEditGridRef.current!.api.showLoadingOverlay();

    groupCode.current = "";
    groupNameRef.current.setValue("");

    const result = await api<any>("get", "paramrecipegroup/rawnew", { eqpCode: val.value })

    if(result.data) {
      var pvList = result.data.filter((x: Dictionary) => x.pvsv == 'P');
      var svList = result.data.filter((x: Dictionary) => x.pvsv == 'S');

      setParamEditList(pvList);
      setRecipeEditList(svList);
    }
  }

  const getParamAllRows = () => {
    const rowData: Dictionary[] = [];
    paramEditGridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  }

  const getRecipeAllRows = () => {
    const rowData: Dictionary[] = [];
    recipeEditGridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  }

  const editCompleteHandler = async () => {
    if(!groupNameRef.current.getValue()){
      alertBox(t("@MSG_PLEASE_ENTER_GROUP_NAME"));
      return;
    }

    const paramList = getParamAllRows();
    const recipeList = getRecipeAllRows();

    if(paramList.length <= 0 && recipeList.length <= 0){
      alertBox(t("@MSG_PLEASE_ENTER_PARAM_RECIPE"));
    }

    for(var i = 0; i < paramList.length; i++){
      var item = paramList[i];

      if(isNullOrWhitespace(item.paramName)){
        alertBox(t("@MSG_PLEASE_ENTER_PV"));
        return;
      }

      if(!item.lcl && item.lcl != 0){
        alertBox(t("@MSG_PLEASE_ENTER_LCL"));
        return;
      }

      if(!item.ucl && item.ucl != 0){
        alertBox(t("@MSG_PLEASE_ENTER_UCL"));
        return;
      }

      if(item.startTime == 0 && item.endTime == 0) {
        alertBox(t("@MSG_START_END_NO_ZORO"));
        return;
      }

      if(item.startTime > item.endTime) {
        alertBox(t("@MSG_END_THEN_START_NO"));
        return;
      }

      if(item.endTime == 0) {
        alertBox(t("@MSG_END_NO_ZERO"));
        return;
      }

    }

    for(var i = 0; i < recipeList.length; i++){
      var item = recipeList[i];

      if(isNullOrWhitespace(item.recipeName)){
        alertBox(t("@MSG_PLEASE_ENTER_RECIPE_SV"));
        return;
      }

      if(!item.baseVal && item.baseVal != 0){
        alertBox(t("@MSG_PLEASE_ENTER_RECIPE_ST"));
        return;
      }

      if(item.startTime == 0 && item.endTime == 0) {
        alertBox(t("@MSG_START_END_NO_ZORO"));
        return;
      }

      if(item.startTime > item.endTime) {
        alertBox(t("@MSG_END_THEN_START_NO"));
        return;
      }

      if(item.endTime == 0) {
        alertBox(t("@MSG_END_NO_ZERO"));
        return;
      }
    }

    const param: Dictionary = {};
    param.eqpCode = eqpValRef.current;
    param.groupCode = groupCode.current;
    param.groupName = groupNameRef.current.getValue();
    param.paramJson = JSON.stringify(paramList);
    param.recipeJson = JSON.stringify(recipeList);

    if(param.groupCode){
      const result = await post(param);
      if(result.data > 0){
        alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));

        groupCode.current = "";
        groupNameRef.current.setValue("");

        setParamEditList([]);
        setRecipeEditList([]);
  
        searchHandler();
      }
    }else{
      const result = await put(param);
      if(result.data > 0){
        alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));

        groupCode.current = "";
        groupNameRef.current.setValue("");

        setParamEditList([]);
        setRecipeEditList([]);
  
        searchHandler();
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length) {
      alertBox(t("@MSG_PLEASE_DELETE_GROUP"));
      return;
    }

      confirmBox(t("@DELETE_CONFIRM"), async () => {
      const result  = await del(rows[0]);
      if(result.data > 0) {
        alertBox(t("@MSG_BATCH_DELETE_COMPLETED"));
        
        groupCode.current = "";
        groupNameRef.current.setValue("");

        setParamEditList([]);
        setRecipeEditList([]);
  
        searchHandler();
      }
    }, async () => {

    });
  }

  return (
    <>
      <ListBase
        editHandler={() => {
        }}
        deleteHandler={deleteHandler}
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button color="primary" onClick={editCompleteHandler}>
            <i className="uil uil-check me-2"></i>
              {t("@TOTAL_SAVE")}
            </Button>
            <Button type="button" color="light" onClick={deleteHandler} >
              <i className="uil uil-trash me-2"></i>
              {t("@TOTAL_DELETE")}
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
                <Col style={{minWidth: "250px" }}>
                  <AutoCombo ref={eqpRef} name="eqpCode" placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
                </Col>
                <Col>
                  <Button color="success" onClick={newHandler}>{t("@NEW_ADDITION")}</Button>
                </Col>
                <Col>
                  <Input name="groupCode" placeholder={t("@COL_GROUP_CODE")} style={{ minWidth: "150px" }} />
                </Col>
                <Col>
                  <Input name="groupName" placeholder={t("@COL_GROUP_NAME")} style={{ minWidth: "150px" }} />
                </Col>
                <Col>
                  <AutoCombo name="paramId" sx={{ minWidth: "150px" }} placeholder="PARAMETER" mapCode="param" isLang={true} />
                </Col>
                <Col>
                  <AutoCombo name="recipeCode" sx={{ minWidth: "150px" }} placeholder="RECIPE" mapCode="recipe" isLang={true} />
                </Col>
              </Row>
            </SearchBase>
          </>
        }>
        <Row style={{ height: "100%" }}>
          <Col md={3}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={gridRef}
                columnDefs={ColumnDefs()}
                onRowSelected={groupRowSelectedHandler}
                rowMultiSelectWithClick={false}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
              />
            </div>
          </Col>
          <Col md={9} style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "6%" }}>
              <Row>
                <Col>
                  <Row className="edit-wrap">
                    <Col style={{ maxWidth: "100px", lineHeight: "34px", textAlign: "right" }}>
                      <Label htmlFor="groupby" className="form-label">{`${t("@COL_GROUP_NAME")}:`}</Label>
                    </Col>
                    <Col style={{ maxWidth: "700px" }}>
                      <LangTextBox ref={groupNameRef} name="groupNameNew" placeholder={t("@COL_GROUP_NAME")} required={true} />
                    </Col>
                  </Row>
                  
                </Col>
              </Row>
            </div>
            <div className="pb-2" style={{ height: "47%" }}>
              <GridBase
                ref={paramEditGridRef}
                rowSelection={'multiple'}
                columnDefs={ParamEditColumnDefs()}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
                enterNavigatesVertically={true}
                enterNavigatesVerticallyAfterEdit={true}
                suppressRowClickSelection={true}
                singleClickEdit={true}
                stopEditingWhenCellsLoseFocus={true}
                tabToNextCell={(params: TabToNextCellParams) => {
                  return params.previousCellPosition;
                }}
                onGridReady={() => {
                  setParamEditList([]);
                }}       
              />
            </div>
            <div className="pb-2" style={{ height: "47%" }}>
              <GridBase
                ref={recipeEditGridRef}
                rowSelection={'multiple'}
                columnDefs={RecipeEditColumnDefs()}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
                enterNavigatesVertically={true}
                enterNavigatesVerticallyAfterEdit={true}
                suppressRowClickSelection={true}
                singleClickEdit={true}
                stopEditingWhenCellsLoseFocus={true}
                tabToNextCell={(params: TabToNextCellParams) => {
                  return params.previousCellPosition;
                }}
                onGridReady={() => {
                  setRecipeEditList([]);
                }}
              />
            </div>
          </Col>
        </Row>
      </ListBase>
    </>
  )
}

export default ParamRecipeList;