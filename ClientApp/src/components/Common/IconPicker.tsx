import Icon, { IconName } from "@ailibs/feather-react-ts";
import SvgData from "@ailibs/feather-react-ts/dist/set";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import {  Button, Col, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const IconPicker = forwardRef((props: any, ref: any) => {
  const { t }  = useTranslation();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const openedHandler = () => {
  }

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const hide = () => {
    setIsOpen(false);
  }

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  useImperativeHandle(ref, () => ({ 
    setIsOpen
  }));

  return (
    <Modal
      size={ props.size || "xl" }
      centered={true}
      isOpen={isOpen}
      zIndex={99999}
      backdrop="static"
      fade={false}
      onOpened={openedHandler}
      toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Icon Picker
      </ModalHeader>
      <ModalBody style={{ maxHeight: '500px', minHeight: '500px', overflowY: 'auto' }}>
        <Row>
          <Col>
            <div className="mb-2">
              <Input name="iconText" type="text" onChange={changeHandler} value={search} style={{ width: 300 }} placeholder="Search" className="form-control" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="icon-picker-container d-flex flex-wrap gap-1">
              {
                  Object.keys(SvgData).filter(x => x.toLowerCase().includes(search)).map((key: string, index: number) => {
                  return (
                    <Button key={index} type="button" color="light" className="icon-picker-item" onClick={() => {
                      props.onIconSelect(key);
                      hide();
                      }}>
                      <div className="text-center mb-2"><Icon name={key as IconName} /></div>
                      <div className="text-center">{ key }</div>
                    </Button>
                  );
                })
              }
            </div>
          </Col>
        </Row>
        
      </ModalBody>
    </Modal>
  );
});

export default IconPicker;