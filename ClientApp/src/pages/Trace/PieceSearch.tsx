import moment from "moment";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import { CellDoubleClickedEvent, RowSelectedEvent } from "ag-grid-community";
import style from "./Trace.module.scss";
import { pieceSearchDefs } from "./PieceSearchDefs";
import Draggable from "react-draggable";

const PieceSearch = forwardRef((props: any, ref: any) => {  
  const [showModal, setShowModal] = useState(false);
  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();

  const { refetch } = useApi("trace/piece", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

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
        wrapClassName={style.pieceSearchWrap}
        toggle={() => { setShowModal(!showModal); }}>
        <ModalHeader toggle={() => { setShowModal(!showModal)}}>
          PCS/SHEET/TRAY/BOX Barcode Search
        </ModalHeader>
        <ModalBody>
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
          >
            <Row>
            <Col>
                <Input name="workorder" placeholder="BATCH No" />
              </Col>
              <Col>
                <Input name="panelId" placeholder="판넬바코드" />
              </Col>
              <Col>
                <Input name="pieceId" placeholder="PCS(SHEET) 바코드" />
              </Col>
              <Col>
                <Input name="trayId" placeholder="TRAY 바코드" />
              </Col>
              <Col>
                <Input name="boxId" placeholder="BOX(출하BATCH) 바코드" />
              </Col>
            </Row>
          </SearchBase>
          <Row style={{ height: "450px" }}>
            <Col md={12}>
              <GridBase
                ref={gridRef}
                columnDefs={pieceSearchDefs()}
                rowMultiSelectWithClick={false}
                onGridReady={() => {
                  setList([]);
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

export default PieceSearch;
