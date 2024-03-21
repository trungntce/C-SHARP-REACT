import { CellClickedEvent, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { columnDefs } from "./ModelMapApproveDefs";
import { columnCategoryDefs, columnOperEqpDefs, columnParamDefs, columnRecipeDefs } from "./ModelMapDefs";

const ModelMapApproveList = ()  => {

  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [modelRef, setModelList] = useGridRef();
  const [groupRef, setGroupList] = useGridRef();
  const [categoryRef, setCategoryList] = useGridRef();
  const [paramRef, setParamList] = useGridRef();
  const { refetch } = useApi("modelrecipeparammap/approve", getSearch);

  useEffect(()=> {
    searchHandler();
  }, []);

  const getSelectedOperEqp = () => {
    const rows = modelRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch(); 

    if(result.data)
      setList(result.data);
      setModelList([]);
      setGroupList([]);
      setCategoryList([]);
      setParamList([]);
  }

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get", "modelrecipeparammap/opereqp", e.data).then((result) => {
      if(result.data)
        setModelList(result.data);
        setGroupList([]);
        setCategoryList([]);
        setParamList([]);
    });
  }

  const approveHandler = () => {
    const selectedData = gridRef.current?.api.getSelectedRows()[0];
 
    if(selectedData.approveYn === "Y") {
      alertBox("승인완료된 건입니다.");
      return;
    }else if(selectedData.approveYn === "R") {
      alertBox("반려된 건입니다.");
      return;
    }else {
      api<any>("post", "modelrecipeparammap/approveupdate", {...selectedData, gubun: "approve"}).then((result) => {
        if(result.data > 0) {
          searchHandler();
          alertBox("승인되었습니다.");
        }
      });
    }
  }

  const refusalHandler = () => {
    const selectedData = gridRef.current?.api.getSelectedRows()[0];
    if(selectedData.approveYn === "Y") {
      api<any>("post", "modelrecipeparammap/approveupdate", {...selectedData, gubun: "refusal"}).then((result) => {
        if(result.data > 0) {
          searchHandler();
          alertBox("반려되었습니다.");
        }
      });
    }else if(selectedData.approveYn === "R") {
      alertBox("반려된 건입니다.");
      return;
    }else {
      alertBox("승인 전입니다.");
      return;
    }
  }

  const operEqpSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get", "recipe/recipemap", e.data).then((result) => {
      if(result.data)
        setGroupList(result.data);
        setCategoryList([]);
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

    api<any>("get", "recipe", {eqpCode: getSelectedOperEqp().equipmentCode, groupCode: e.data.groupCode}).then(
      (result) => {
        if(result.data)
          setCategoryList(result.data.filter((f:any)=> f.judgeYn === "Y"));
    });

    api<any>("get", "param", {eqpCode: getSelectedOperEqp().equipmentCode, groupCode: e.data.groupCode}).then((result) => {
      if(result.data)
        setParamList(result.data.filter((f:any)=> f.judgeYn === "Y"));
    });
  }

  return (
    <>
      <ListBase
        folder=""
        title="Model Recipe Approve"
        icon="linkedin"
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            {/* <Button type="button" color="primary" onClick={approveHandler}>
              <i className="uil uil-pen me-2"></i> {t("@APPROVE")}
            </Button> */}
            {/* <Button type="button" color="light" onClick={refusalHandler}>
              <i className="uil uil-pen me-2"></i> {t("@REFUSAL")}
            </Button> */}
          </div>
        }
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </Col>
            </Row>
          </SearchBase>
        }>  
          <Row style={{height: "100%"}}>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={columnDefs()}
                  onRowSelected={rowSelectedHandler}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={modelRef}
                  columnDefs={columnOperEqpDefs()}
                  onRowSelected={operEqpSelectedHandler}
                  suppressRowClickSelection={true}
                  onCellClicked={(event: CellClickedEvent) => {
                    if(event.colDef.field == "interlockYn" || event.colDef.field == "rowspan"){
                      return;
                    }

                    if(event.data.eqpYn != 'Y')
                      return;

                    event.node.setSelected(true);
                  }}
                  rowClassRules={{
                    'row-disable-container': (param: RowClassParams) => { return param.data.eqpYn == 'N' || !param.data.eqpYn; },
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
                <GridBase
                  ref={categoryRef}
                  columnDefs={columnCategoryDefs()}
                />
              </div>
            </Col>
            <Col md={5}>
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

export default ModelMapApproveList;