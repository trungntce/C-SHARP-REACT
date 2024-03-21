import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import api from "../../../common/api";
import { useFormRef, useGridRef, useSubmitHandler } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import EditBase from "../../../components/Common/Base/EditBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { aoiMainDefs } from "./YieldDefs";

const YieldDetail = forwardRef((props: any, ref: any) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, initFormCallback] = useFormRef((formRef: any) => {
    props.initHandler(formRef, formData.current);
  });
  const [gridRef, setList] = useGridRef();

  useEffect(() => {
    if(showModal) {
      search();
    }
  }, [showModal]);

  const search =  () => {
    api<any>("get", "monitoringdetail/aoiyielddetail", {bomItemDescription: formData.current.bomItemDescription}).then((result) => {
      gridRef.current?.api.setRowData(result.data);
    });
  }

  useImperativeHandle(ref, () => ({ 
    setShowModal,  
    setForm: (row: Dictionary) => {
      formData.current = row;
    }
  }));

  return (
      <Modal
        size={ props.size || "xl" }
        centered={true}
        isOpen={showModal}
        backdrop="static"
        wrapClassName="edit-wrap"
        toggle={() => { setShowModal(!showModal); }}>
        <ModalHeader toggle={() => { setShowModal(!showModal)}}>
          {"AOI 중요 모델 수율 상세"}
        </ModalHeader>
        <ModalBody>
          <Row style={{ height: "300px" }} className="mb-2">
            <GridBase
              ref={gridRef}
              columnDefs={aoiMainDefs}
            />
          </Row>

        </ModalBody>
    </Modal>
  );
});

export default YieldDetail;
