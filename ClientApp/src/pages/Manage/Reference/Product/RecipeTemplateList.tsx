import {
  CellClickedEvent,
  RowClassParams,
  RowDataUpdatedEvent,
  RowSelectedEvent,
} from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, List, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef, useEditRef } from "../../../../common/hooks";
import { Dictionary, contentType } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import Select from "../../../../components/Common/Select";
import {
  columnParamListDefs,
  columnRecipeListDefs,
  columnModelDetailDefs,
} from "./RecipeTemplateDefs";
import AutoCombo from "../../../../components/Common/AutoCombo";
import api from "../../../../common/api";
import { ChangeEvent, useEffect, useRef } from "react";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../../../common/utility";
import { showProgress } from "../../../../components/MessageBox/Progress";
import RecipeTemplateImportModal from "./RecipeTemplateImportModal";

const RecipeTemplate = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [searchItemRef, getSearchItem] = useSearchRef();
  const [paramRef, setParamList] = useGridRef();
  const [recipeRef, setRecipeList] = useGridRef();
  const [modelDetailRef, setModelDetailList] = useGridRef();
  const { refetch } = useApi("recipetemplate", getSearch);
  const recipeImportRef = useRef<any>();
  const eqpRef = useRef<any>();
  const typeRef = useRef<any>();
  const uploadEqpRef = useRef<any>();
  const uploadModelRef = useRef<any>();

  // useEffect(() => {
  //   searchHandler();
  // }, []);

  const uploadEqpHandler = () => {
    if(paramRef.current!.api.getDisplayedRowCount() <= 0 && recipeRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t('@MSG_NO_DATA'));
      return;
    }

    confirmBox(t('@MSG_ASK_TYPE1'), async () => {
      let jsonData: any[] = [];
      paramRef.current?.api.forEachNode( function(rowNode) {
        jsonData.push(rowNode.data);
      });
  
      recipeRef.current?.api.forEachNode( function(rowNode) {
        jsonData.push(rowNode.data);
      });
  
      const result = await api<any>("post","recipetemplate/eqpimport", jsonData);

      if(result.data < 0) {
        alertBox(t('@MSG_NO_DATA'));
        return;
      }
      else {
        alertBox(t('@MSG_REGISTRATION_SUCCESS'));
        return;
      }
    }, async () => {
      //
    });
    uploadEqpRef.current.disabled = true;
  };

  const uploadModelHandler = async (e: any) => {
    if(modelDetailRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox('@MSG_NO_DATA');
      return;
    }

    confirmBox(t('@MSG_ASK_TYPE1'), async () => {
      let jsonData: any[] = [];
      modelDetailRef.current?.api.forEachNode( function(rowNode) {
        jsonData.push(rowNode.data);
      });
  
      const result = await api<any>("post","recipetemplate/modelimport", jsonData);
  
      if(result.data < 0) {
        if (result.data == -1) {
          alertBox(t('@NG_NO_WORKORDER'));
          return;
        }
        else if(result.data  < -1) 
        {
          alertBox(t('@NG_APPROVAL_ERR'));
          return;
        }
      }
      else {
        alertBox(t('@MSG_REGISTRATION_SUCCESS'));
        return;
      }
    }, async () => {
      //
    });
    uploadModelRef.current.disabled = true;
  };

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data) {
      setParamList(result.data[0]);
      setRecipeList(result.data[1]);

      uploadEqpRef.current.disabled = true;
    }
  };

  const searchItemHandler = async (_?: Dictionary) => {
    const result = await api<any>("get","recipetemplate/modellist", getSearchItem());

    if(result.data)
      setModelDetailList(result.data);

      uploadModelRef.current.disabled = true;
  };

  const rawTypeChangeHandler = (event: ChangeEvent<HTMLSelectElement>, value: string) => {
    if(value == 'P'){ // PC
      eqpRef.current.setMapCode("infoeqppc");
    }else{ // PLC
      eqpRef.current.setMapCode("infoeqp");
    }
  }

  const excelHandler = async(e:any) => {
    e.preventDefault();

    if(paramRef.current!.api.getDisplayedRowCount() <= 0 && recipeRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t('@MSG_NO_DATA'));
      return;
    }

    uploadEqpRef.current.disabled = true;

    const param = getSearch();
    // param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","recipetemplate/downloadimporttemplate", param);
    downloadFile(`EQP_RECIPE_PARAM_TEMPLATE_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  const excelModelHandler = async(e:any) => {
    e.preventDefault();

    if(modelDetailRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox('@MSG_NO_DATA');
      return;
    }

    uploadModelRef.current.disabled = true;

    const param = getSearchItem();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","recipetemplate/modellist", param);
    downloadFile(`MODEL_RECIPE_TEMPLATE_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  const importExcelHandler = (e:any) => { 
    typeRef.current = 'EQP';
    recipeImportRef.current.onToggleModal(e);
  }

  const importExcelModelHandler = (e:any) => { 
    typeRef.current = 'MODEL';
    recipeImportRef.current.onToggleModal(e);
  }

  const completeHandler = async (files : any) => {
    if (files && files.files.length > 0) {
      if (typeRef.current == 'EQP') {
        const formData = new FormData();
        formData.append('files', files.files[0]);
        const result = await api<any>("post", "recipetemplate/uploadexcel", formData);
        if (result.data) {
          setParamList(result.data[0]);
          setRecipeList(result.data[1]);

          uploadEqpRef.current.disabled = false;
        }
      }
      if (typeRef.current == 'MODEL') {
        const formData = new FormData();
        formData.append('files', files.files[0]);
        const result = await api<any>("post", "recipetemplate/uploadmodelexcel", formData);
        if (result.data) {
          setModelDetailList(result.data);

          uploadModelRef.current.disabled = false;
        }
      }   
    } else {
      alert('Please select file to upload!');
    }
  };

  return (
    <>
      <ListBase
        folder="Recipe Template"
        title="Recipe Template"
        icon="box"
        buttons={[]}
      >
      <SearchBase ref={searchRef} searchHandler={searchHandler}
            style={{ maxWidth: '400px !important' }}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Download Excel
                </Button>
                <Button type="button" color="outline-primary" onClick={importExcelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Import Excel
                </Button>
                <Button innerRef={uploadEqpRef} type="button" color="warning" onClick={uploadEqpHandler}>
                  Upload Recipe
                </Button> 
              </>
            }
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
        <Row style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={paramRef}
                columnDefs={columnParamListDefs()}
                rowMultiSelectWithClick={false}
                onGridReady={() => {
                  setParamList([]);
                }}
              />
            </div>
        </Row>
        <Row style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={recipeRef}
                columnDefs={columnRecipeListDefs()}
                rowMultiSelectWithClick={false}
                alwaysShowHorizontalScroll={false}
                onGridReady={() => {
                  setRecipeList([]);
                }}
              />
            </div>
        </Row>
        <SearchBase ref={searchItemRef} searchHandler={searchItemHandler}
            style={{ maxWidth: '400px !important' }}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelModelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Download Excel
                </Button>
                <Button type="button" color="outline-primary" onClick={importExcelModelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Import Excel
                </Button>
                <Button innerRef={uploadModelRef} type="button" color="warning" onClick={uploadModelHandler}>
                  Upload Recipe
                </Button> 
              </>
            }
          >
            <Row>
              <Col>
                <AutoCombo name="modelCode" sx={{ minWidth: "200px" }} placeholder="모델코드" mapCode="model" />
              </Col>
              <Col>
                <AutoCombo name="operCode" sx={{ minWidth: "200px" }} placeholder='공정명' mapCode="oper"
                />
              </Col>
            </Row>
        </SearchBase>
        <Row style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={modelDetailRef}
                columnDefs={columnModelDetailDefs()}
                rowMultiSelectWithClick={false}
                alwaysShowHorizontalScroll={false}
                onGridReady={() => {
                  setModelDetailList([]);
                }}
              />
            </div>
        </Row>
      </ListBase>
      <RecipeTemplateImportModal ref={recipeImportRef} onComplete={completeHandler}/>
    </>
  );
};

export default RecipeTemplate;
