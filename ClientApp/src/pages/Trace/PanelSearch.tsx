import moment from "moment";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { panelSearchDefs } from "./PanelSearchDefs";
import { panelItemDefs } from "./PanelSearchItemDefs";
import { CellDoubleClickedEvent, RowSelectedEvent } from "ag-grid-community";
import api from "../../common/api";
import style from "./Trace.module.scss";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";

const PanelSearch = forwardRef((props: any, ref: any) => {  
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [itemGridRef, itemSetList] = useGridRef();

  const { refetch } = useApi("trace/job", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    itemGridRef.current!.api.showLoadingOverlay();

    api<any>("get", "trace/panel", { workorder: e.data.workorder }).then((result) => {
      if(result.data)
        itemSetList(result.data);
      else
        itemSetList([]);
    });
  }

  useImperativeHandle(ref, () => ({ 
    setShowModal
  }));

  useEffect(() => {
  }, []);

  return (
    <Draggable
      handle=".modal-header"
      >
      <Modal
        centered={true}
        isOpen={showModal}
        backdrop="static"
        wrapClassName={style.panelSearchWrap}
        toggle={() => { setShowModal(!showModal); }}>
        <ModalHeader toggle={() => { setShowModal(!showModal)}}>
          Panel Barcode Search
        </ModalHeader>
        <ModalBody>
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
          >
            <Row>
              <Col style={{ maxWidth: "120px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-5, 'days').toDate()} placeholderText="조회시작" required={true} />
              </Col>
              <Col style={{ maxWidth: "120px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col>
                {/* 고객사 */}
                <AutoCombo name="vendorCode" placeholder={t("@COL_VENDOR_NAME")} mapCode="vendor" category="customer" />
              </Col>
              <Col>
                {/* 제폼코드 */}
                <AutoCombo name="itemCode" parentname="inventoryItemId" placeholder={t("@COL_ITEM_CODE")} mapCode="item" />
              </Col>
              {/* <Col>
                <Input name="itemName" placeholder="제품명" style={{ minWidth: "150px" }} />
              </Col> */}
              <Col>
                {/* 모델코드 */}
                <AutoCombo name="modelCode" placeholder={t('@COL_MODEL_CODE')} mapCode="model" />
              </Col>
              <Col>
                <Input name="workorder" placeholder="BATCH No" />
              </Col>
              <Col>
                <select name="panelCnt" className="form-select" style={{ width: 220 }}>
                  {/* 판넬바코드 포함BATCH만 조회
                  전체검색 */}
                  <option value="0">{t("@BARCODE_BATCH_SEARCH")}</option>
                  <option value="">{t("@TOTAL_SEARCH")}</option>
                </select>
              </Col>            
            </Row>
          </SearchBase>
          <Row style={{ height: "650px" }}>
            <Col md={8}>
              <GridBase
                ref={gridRef}
                columnDefs={panelSearchDefs()}
                onRowSelected={rowSelectedHandler}
                rowMultiSelectWithClick={false}
                onGridReady={() => {
                  setList([]);
                }}
              />
            </Col>
            <Col md={4}>
              <GridBase
                ref={itemGridRef}
                columnDefs={panelItemDefs()}
                onGridReady={() => {
                  itemSetList([]);
                }}
                onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
                  props.onPanelSelected(e.data);
                  setShowModal(false);
                }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Draggable>
  );
});

export default PanelSearch;
