import {
  CellClickedEvent,
  RowClassParams,
  RowDataUpdatedEvent,
  RowSelectedEvent,
} from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import {
  columnCategoryDefs,
  columnOperEqpDefs,
  columnModelListDefs,
  columnParamDefs,
  columnRecipeDefs,
} from "./ModelMapDefs";
import AutoCombo from "../../../../components/Common/AutoCombo";
import api from "../../../../common/api";
import { useEffect, useRef, useState } from "react";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { isNullOrWhitespace } from "../../../../common/utility";
import Select from "../../../../components/Common/Select";

const ModelMapList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [modelRef, setModelList] = useGridRef();
  const [eqpRef, setEqpList] = useGridRef();
  const [groupRef, setGroupList] = useGridRef();
  const [categoryRef, setCategoryList] = useGridRef();
  const [paramRef, setParamList] = useGridRef();
  const { refetch, post } = useApi("modelrecipeparammap", getSearch);

  useEffect(() => {
    searchHandler();
  }, []);

  const getSelectedModel = () => {
    const rows = modelRef.current!.api.getSelectedRows();
    return rows[0];
  };

  const getSelectedOperEqp = () => {
    const rows = eqpRef.current!.api.getSelectedRows();
    return rows[0];
  };

  const getSelectedGroup = () => {
    const rows = groupRef.current!.api.getSelectedRows();
    return rows[0];
  };

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) setModelList(result.data);
    setEqpList([]);
    setGroupList([]);
    setCategoryList([]);
    setParamList([]);
  };

  const modelSelectedHandler = (e: RowSelectedEvent) => {
    if (!e.node.isSelected()) return;

    operEqpSearchHandler(e.data.modelCode);
  };

  const operEqpSearchHandler = async (modelCode: string) => {
    api<any>("get", "modelrecipeparammap/opereqp", { modelCode }).then(
      (result) => {
        if (result.data) setEqpList(result.data);
        setGroupList([]);
        setCategoryList([]);
        setParamList([]);
      }
    );
  };

  const operEqpSelectedHandler = (e: RowSelectedEvent) => {
    if (!e.node.isSelected()) return;

    api<any>("get", "recipe/recipemap", e.data).then((result) => {
      if (result.data) setGroupList(result.data);
      setCategoryList([]);
      setParamList([]);
      result.data.map((row: any, index: string) => {
        if (row.exist == e.data.bomItemCode)
          groupRef.current?.api.getRowNode(index)?.setSelected(true);
      });
    });
  };

  const recipeRowSelectedHandler = (e: RowSelectedEvent) => {
    if (!e.node.isSelected()) return;

    api<any>("get", "recipe", {
      eqpCode: getSelectedOperEqp().equipmentCode,
      groupCode: e.data.groupCode,
    }).then((result) => {
      if (result.data) setCategoryList(result.data.filter((f:any) => f.judgeYn === "Y"));
    });

    api<any>("get", "param", {
      eqpCode: getSelectedOperEqp().equipmentCode,
      groupCode: e.data.groupCode,
    }).then((result) => {
      if (result.data) setParamList(result.data.filter((f:any) => f.judgeYn === "Y"));
    });
  };

  const addHandler = async () => {
    const model = getSelectedModel();
    if (!model) {
      alertBox(t("@MSG_NO_MODEL_SELECTED"));
      return;
    }

    const operEqp = getSelectedOperEqp();
    if (!operEqp) {
      alertBox(t("@MSG_NO_EQUIPMENT_SELECTED"));
      return;
    }

    const groupCode = getSelectedGroup();
    // if (!groupCode) {
    //   alertBox(t("@MSG_NO_GROUP_CODE_SELECTED"));
    //   return;
    // }

    const recipe = getSelectedGroup();
    const params = getSelectedGroup();

    // if(isNullOrWhitespace(groupCode.groupCode))
    //   groupCode.groupCode = null;

    const data: Dictionary = {
      modelCode: model.modelCode,
      operationSeqNo: operEqp.operationSeqNo,
      operationCode: operEqp.operationCode,
      eqpCode: operEqp.equipmentCode,
      interlockYn: operEqp.interlockYn,
      groupCode: !groupCode ? null : groupCode.groupCode,
    };

    data.recipe = recipe;
    data.params = params;

    const result = await post(data);
    if (result.data > 0) {
      alertBox(t("@MSG_REGISTRATION_IS_COMPLETE"));
      operEqpSearchHandler(data.modelCode);
    }
  };

  return (
    <>
      <ListBase
        folder="Reference Management"
        title="Recipe Model Mapping"
        icon="box"
        buttons={
          <div className="d-flex justify-content-end">
            <Button type="button" color="primary" onClick={addHandler}>
              <i className="uil uil-pen me-2"></i> {t("@REGIST")}
            </Button>
          </div>
        }
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col>
                <Select
                  name="itemCategoryCode"
                  style={{ maxWidth: "140px" }}
                  placeholder={`${t("@PRODUCT")}/${t("@SEMI_FINISHED_PRODUCT")}`}
                  mapCode="code"
                  category="MODEL_TYPE"
                  className="form-select"
                  defaultValue={"FG"}
                  required={true}
                />
              </Col>
              <Col>
                <AutoCombo
                  name="modelCode"
                  sx={{ minWidth: "270px" }}
                  placeholder={t("@COL_MODEL_CODE")}
                  mapCode="model"
                />
              </Col>
              <Col>
                <Input
                  name="modelDescription"
                  placeholder={t("@COL_MODEL_NAME")}
                  style={{ minWidth: "250px" }}
                />
              </Col>
              <Col>
                <select
                  name="approveYn"
                  className="form-select"
                  style={{ minWidth: 130 }}
                >
                  <option value="">{t("@APPROVAL_STATUS")}</option>
                  <option value="N">{t("@APPROVAL_REQUEST")}</option>
                  <option value="Y">{t("@APPROVAL_COMPLETED")}</option>
                  <option value="R">{t("@COMPANION")}</option>
                  <option value="D">{t("@RE_APPROVAL_REQUEST")}</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={4}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={modelRef}
                columnDefs={columnModelListDefs()}
                onRowSelected={modelSelectedHandler}
                rowMultiSelectWithClick={false}
              />
            </div>
          </Col>
          <Col md={8}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={eqpRef}
                columnDefs={columnOperEqpDefs()}
                onRowSelected={operEqpSelectedHandler}
                suppressRowClickSelection={true}
                onCellClicked={(event: CellClickedEvent) => {
                  if (
                    event.colDef.field == "interlockYn" ||
                    event.colDef.field == "rowspan"
                  ) {
                    return;
                  }

                  if (event.data.eqpYn != "Y") return;

                  event.node.setSelected(true);
                }}
                rowClassRules={{
                  "row-disable-container": (param: RowClassParams) => {
                    return param.data.eqpYn == "N" || !param.data.eqpYn;
                  },
                }}
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={groupRef}
                columnDefs={columnRecipeDefs()}
                onRowSelected={recipeRowSelectedHandler}
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase ref={categoryRef} columnDefs={columnCategoryDefs()} />
            </div>
          </Col>
          <Col md={5}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase ref={paramRef} columnDefs={columnParamDefs()} />
            </div>
          </Col>
        </Row>
      </ListBase>
    </>
  );
};

export default ModelMapList;
