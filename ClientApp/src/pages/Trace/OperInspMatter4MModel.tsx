import { useTranslation } from "react-i18next";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { useEffect } from "react";
import { Dictionary } from "../../common/types";
import { CellClickedEvent, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import api from "../../common/api";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import ListBase from "../../components/Common/Base/ListBase";
import { Button, Col, Input, Row } from "reactstrap";
import SearchBase from "../../components/Common/Base/SearchBase";
import Select from "../../components/Common/Select";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import { columnCategoryDefs, columnModelListDefs, columnOperEqpDefs, columnParamDefs, columnRecipeDefs } from "../Manage/Reference/Product/ModelMapDefs";
import { ColumnDefs } from "./OperInspMatter4MModelDefs";
import { modelListColumnDefs } from "./OperInspMatter4MModelListDefs";




const OperInspMatter4MModel = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [modelRef, setModelList] = useGridRef();
  const [operRef, setOperList] = useGridRef();
  const [eqpRef, setEqpList] = useGridRef();
  const [groupRef, setGroupList] = useGridRef();
  const [categoryRef, setCategoryList] = useGridRef();
  const [paramRef, setParamList] = useGridRef();
  const { refetch, post, put, del } = useApi("operinspmatter4mmodel", getSearch);

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

  };

  const modelSelectedHandler = (e: RowSelectedEvent) => {
    if (!e.node.isSelected()) return;

    
    const modelCode = e.data.modelCode;
    api<any>("get", "operinspmatter4mmodel/modeloper", { modelCode }).then((result) => {
        setOperList(result.data)
    });

  };


  // const operEqpSelectedHandler = (e: RowSelectedEvent) => {
  //   if (!e.node.isSelected()) return;

  //   api<any>("get", "reasdasdcipe/recipsasdasemap", e.data).then((result) => {
  //     if (result.data) setGroupList(result.data);
  //     setCategoryList([]);
  //     setParamList([]);
  //     result.data.map((row: any, index: string) => {
  //       if (row.exist == e.data.bomItemCode)
  //         groupRef.current?.api.getRowNode(index)?.setSelected(true);
  //     });
  //   });
  // };

  const addHandler = async () => {
    const model = getSelectedModel();

    const request : any[] = [];

    
    const param: Dictionary = {};


    operRef.current?.api.forEachNode((rowNode, index) => {
      if(index === 0 ){
        param.modelCode = rowNode.data.modelCode
      }
      request.push(rowNode.data);
    });


    param.json = JSON.stringify(request);

    

    
    confirmBox('등록하시겠습니까?', async () => {  //판넬에 대한 인터락을 설정하시겠습니까? : 판넬에 대한 인터락을 해제하시겠습니까?
      const result = await api<any>("post", "operinspmatter4mmodel/totalinsert", param);
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE2")); //설정 중 오류가 발생했습니다.
        return;
      }else{
        alertBox(t("@MSG_COMPLETED"));
      }
    }, async () => {
    })

    // console.log(asdasd)
    // api<any>("post", "operinspmatter4mmodel/totalinsert", { jsonRequest }).then((result) => {
    //   console.log(result.data)
    // });
    
    return;
    // if (!model) {
    //   alertBox(t("@MSG_NO_MODEL_SELECTED"));
    //   return;
    // }

    // const operEqp = getSelectedOperEqp();
    // if (!operEqp) {
    //   alertBox(t("@MSG_NO_EQUIPMENT_SELECTED"));
    //   return;
    // }

    // const groupCode = getSelectedGroup();
    // // if (!groupCode) {
    // //   alertBox(t("@MSG_NO_GROUP_CODE_SELECTED"));
    // //   return;
    // // }

    // const recipe = getSelectedGroup();
    // const params = getSelectedGroup();

    // // if(isNullOrWhitespace(groupCode.groupCode))
    // //   groupCode.groupCode = null;

    // const data: Dictionary = {
    //   modelCode: model.modelCode,
    //   operationSeqNo: operEqp.operationSeqNo,
    //   operationCode: operEqp.operationCode,
    //   eqpCode: operEqp.equipmentCode,
    //   interlockYn: operEqp.interlockYn,
    //   groupCode: !groupCode ? null : groupCode.groupCode,
    // };

    // data.recipe = recipe;
    // data.params = params;

    // const result = await post(data);
    // if (result.data > 0) {
    //   alertBox(t("@MSG_REGISTRATION_IS_COMPLETE"));
    // }
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
                <Input
                  name="workorder"
                  placeholder={'Batch'}
                  style={{ minWidth: "250px" }}
                />
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={3}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={modelRef}
                columnDefs={modelListColumnDefs()}
                onRowSelected={modelSelectedHandler}
                rowMultiSelectWithClick={false}
              />
            </div>
          </Col>
          <Col md={9}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={operRef}
                columnDefs={ColumnDefs()}
                // onRowSelected={operEqpSelectedHandler}
                // ongridReady={setOperList([])}
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
          {/* <Col md={4}>
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
          </Col> */}
        </Row>
      </ListBase>
    </>
  );
};

export default OperInspMatter4MModel;
