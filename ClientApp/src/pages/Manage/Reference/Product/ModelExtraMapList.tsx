import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, useGridRef, useSearchRef } from '../../../../common/hooks';
import { Dictionary } from '../../../../common/types';
import { CellClickedEvent, RowClassParams, RowSelectedEvent } from 'ag-grid-community';
import api from '../../../../common/api';
import { alertBox } from '../../../../components/MessageBox/Alert';
import ListBase from '../../../../components/Common/Base/ListBase';
import { Button, Col, Input, Row } from 'reactstrap';
import SearchBase from '../../../../components/Common/Base/SearchBase';
import Select from '../../../../components/Common/Select';
import UiPlaceholders from './../../../UiComponents/UiPlaceholders';
import AutoCombo from '../../../../components/Common/AutoCombo';
import GridBase from '../../../../components/Common/Base/GridBase';
import { columnModelListDefs, columnOperEqpDefs, columnParamDefs, columnRecipeDefs } from './ModelExtraMapDefs';

const ModelExtraMapList = () => {
	const { t } = useTranslation();

	const [searchRef, getSearch] = useSearchRef();
	const [modelRef, setModelList] = useGridRef();
	const [eqpRef, setEqpList] = useGridRef();
	const [groupRef, setGroupList] = useGridRef();
	const [paramRef, setParamList] = useGridRef();
	const { refetch, post } = useApi("modelextraparammap", getSearch);

	useEffect(() => {
		searchHandler();
	}, []);

	const searchHandler = async (_?: Dictionary) => {
		const result = await refetch();
		if (result.data) setModelList(result.data);
		setEqpList([]);
		setGroupList([]);
		setParamList([]);
	}

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

	const modelSelectedHandler = (e : RowSelectedEvent) => {
		if (!e.node.isSelected()) return;

		operEqpSearchHandler(e.data.modelCode);
	};

	const operEqpSearchHandler = async (modelCode : string) => {
		api<any>('get', 'modelextraparammap/opereqp', { modelCode }).then(
			(result) => {
				if (result.data) setEqpList(result.data);
				setGroupList([]);
				setParamList([]);
			}
		);
	};

	const recipeRowSelectedHandler = (e: RowSelectedEvent) => {
		if (!e.node.isSelected()) return;

		api<any>("get", "paramextra", {
			eqpCode : getSelectedOperEqp().equipmentCode,
			groupCode : e.data.groupCode,
		}).then((result) => {
			if (result.data) setParamList(result.data);
		});
	}

	const operEqpSelectedHandler = (e : RowSelectedEvent) => {
		if (!e.node.isSelected()) return;

		api<any>("get", "modelextraparammap/parammap", e.data).then((result) => {
      if (result.data) setGroupList(result.data);
      setParamList([]);
      result.data.map((row: any, index: string) => {
        if (row.exist == e.data.bomItemCode)
          groupRef.current?.api.getRowNode(index)?.setSelected(true);
      });
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
			alertBox(t("MSG_NO_EQUIPMENT_SELECTED"));
			return;
		}

		const groupCode = getSelectedGroup();
		const params = getSelectedGroup();

		const data : Dictionary= {
			modelCode : model.modelCode,
      place : model.place,
			operationSeqNo : operEqp.operationSeqNo,
			operationCode : operEqp.operationCode,
			eqpCode : operEqp.equipmentCode,
			interlockYn : operEqp.interlockYn,
			groupCode : !groupCode ? null : groupCode.groupCode,
			params : params
		}

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
        title="Cu plating Recipe Model Mapping"
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
          <Col md={8}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase ref={paramRef} columnDefs={columnParamDefs()} />
            </div>
          </Col>
        </Row>
      </ListBase>
    </>
	);
};

export default ModelExtraMapList;