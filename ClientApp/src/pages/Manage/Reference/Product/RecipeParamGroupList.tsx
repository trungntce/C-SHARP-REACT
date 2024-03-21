import { RowSelectedEvent } from "ag-grid-community";
import { useEffect } from "react";
import { Col, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { columnCategoryDefs, columnParamDefs, columnRecipeDefs } from "./ModelMapDefs";
import { columnEqpDefs } from "./RecipeParamGroupDefs";
import { useTranslation } from "react-i18next";

const RecipeParamGroupList = () => {
  const { t } = useTranslation(); 
  const [searchRef, getSearch] = useSearchRef();
  const [eqpRef, setEqpList] = useGridRef();
  const [groupRef, setGroupList] = useGridRef();
  const [recipeRef, setRecipeList] = useGridRef();
  const [paramRef, setParamList] = useGridRef();
  const {refetch} = useApi("recipeparamgroup", getSearch);

  useEffect((() => {
    searchHandler();
  }),[]);

  const getSelectedEqp = () => {
    const rows = eqpRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data) 
      setEqpList(result.data);
      setGroupList([]);
      setRecipeList([]);
      setParamList([]);
  }

  const eqpSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get", "recipe/recipemap", e.data).then((result) => {
      if(result.data)
        setGroupList(result.data);
        setRecipeList([]);
        setParamList([]);
        result.data.map((row: any, index: string) => {
            if(row.exist) 
              groupRef.current?.api.getRowNode(index)?.setSelected(true);
          })
    });
  }

  const recipeRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get", "recipe", {eqpCode: getSelectedEqp().equipmentCode, groupCode: e.data.groupCode}).then(
      (result) => {
        if(result.data)
          setRecipeList(result.data);
    });

    api<any>("get", "param", {eqpCode: getSelectedEqp().equipmentCode, groupCode: e.data.groupCode}).then(
      (result) => {
        if(result.data)
          setParamList(result.data);
    });
  }

  return (
    <>
      <ListBase
        icon="box"
        buttons={[]}
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
            </Row>
          </SearchBase>
        }>
        <Row style={{height: "100%"}}>
          <Col md={2}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={eqpRef}
                columnDefs={columnEqpDefs()}
                onRowSelected={eqpSelectedHandler}
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={groupRef}
                columnDefs={columnRecipeDefs().filter(x => x.field != "checkbox")}
                onRowSelected={recipeRowSelectedHandler}
              />
            </div>
          </Col>
          <Col md={2}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={recipeRef}
                  columnDefs={columnCategoryDefs()}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={paramRef}
                  columnDefs={columnParamDefs()}
                />
              </div>
            </Col>
        </Row>

        </ListBase>
    
    </>
  )

}

export default RecipeParamGroupList;