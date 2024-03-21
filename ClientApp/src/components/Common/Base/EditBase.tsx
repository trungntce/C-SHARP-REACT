import React, { forwardRef, MutableRefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {Row, Col, Button, Modal, ModalBody, ModalHeader, ModalFooter, Form, } from "reactstrap";
import { useFormRef, useSubmitHandler } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import Draggable from 'react-draggable';
import { useTranslation } from "react-i18next";

const EditBase = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [formData, initFormCallback] = useFormRef((formRef: any) => {
    props.initHandler(formRef, formData.current);
  });
  const submitHandler = useSubmitHandler(props.submitHandler);

  useImperativeHandle(ref, () => ({ 
    setShowModal,  
    setForm: (row: Dictionary) => {
      formData.current = row;
    }
  }));

  return (
    <Draggable
      handle=".modal-header"
      >
      <Modal
        size={ props.size || "lg" }
        centered={true}
        isOpen={showModal}
        backdrop="static"
        wrapClassName="edit-wrap"
        toggle={() => { setShowModal(!showModal); }}>
        <ModalHeader toggle={() => { setShowModal(!showModal)}}>
          { props.header }
        </ModalHeader>
        <ModalBody>
          <Form 
            innerRef={initFormCallback}
            onChange={props.changeHandler}
            onSubmit={submitHandler}>
            { props.children }
            { props.buttons || 
            <Row>
              <Col>
                <div className="d-flex justify-content-end gap-2">
                  {props.preButtons }
                  <Button type="submit" color="primary">
                    <i className="uil uil-check me-2"></i> {t("@COMPLETE")}
                  </Button>
                  <Button type="button" color="light" onClick={() => { setShowModal(false); }}>
                    <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                  </Button>
                  {props.postButtons }
                </div>
              </Col>
            </Row> }
          </Form>
        </ModalBody>
      </Modal>
    </Draggable>
  );
});

export default EditBase;
