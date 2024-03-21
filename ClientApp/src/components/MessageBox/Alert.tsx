import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { executeIdle } from "../../common/utility";

let alertFn: { alert: any, confirm: any } = { alert: null, confirm: null };
export const alertBox = (message: string) => {
  alertFn.alert(message);
}

export const confirmBox = (message: string, yesCallback: () => void, noCallback: () => void) => {
  alertFn.confirm(message, yesCallback, noCallback);
}

const Alert = forwardRef((props: any, ref: any) => {
  const { t }  = useTranslation();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const type = useRef<"alert" | "confirm">("alert");
  const messageText = useRef<string | undefined>("");
  const headerText = useRef<string | undefined>("");
  
  const headerRef = useRef<any>();
  const messageRef = useRef<any>();

  const alertButtonRef = useRef<any>();
  const confirmButtonRef = useRef<any>();

  const yesRef = useRef<() => void>();
  const noRef = useRef<() => void>();
  
  const alert = (message: string, header?: string) => {
    type.current = "alert";
    messageText.current = t(message);
    headerText.current = t(header);

    setIsOpen(true);
  }

  const confirm = (message: string, yesCallback: () => void, noCallback?: () => void, header?: string) => {
    type.current = "confirm";
    messageText.current = t(message);
    headerText.current = t(header);
    
    setIsOpen(true);

    yesRef.current = yesCallback;
    noRef.current = noCallback;
  }

  alertFn.alert = alert;
  alertFn.confirm = confirm;

  const openedHandler = () => {
    if(type.current === "alert"){
      confirmButtonRef.current.style["display"] = "none";
      alertButtonRef.current.style["display"] = "block";
    }else if(type.current === "confirm"){
      alertButtonRef.current.style["display"] = "none";
      confirmButtonRef.current.style["display"] = "block";
    }

    messageRef.current.innerHTML = messageText.current;
    headerRef.current.innerHTML = headerText.current || "Alert";
  }

  const hide = () => {
    setIsOpen(false);
  }

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  useImperativeHandle(ref, () => ({ 
    alert,
    confirm
  }));

  return (
    <Modal
      size={ props.size || "sm" }
      centered={true}
      isOpen={isOpen}
      zIndex={99999}
      backdrop={false}
      fade={false}
      contentClassName="alert-content"      
      onOpened={openedHandler}
      toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <div ref={headerRef}></div>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <div ref={messageRef}></div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div ref={alertButtonRef} style={{ display: "none" }}>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="submit" color="light" onClick={hide}>
                  <i className="uil uil-times me-2"></i> {t("@CLOSE")}
                </Button>
              </div>
            </div>
            <div ref={confirmButtonRef} style={{ display: "none" }}>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="submit" color="primary" onClick={() => { hide(); executeIdle(() => { yesRef.current?.apply(this); }) } }>
                  <i className="uil uil-check me-2"></i> {t("@YES")}
                </Button>
                <Button type="button" color="light" onClick={() => { hide(); executeIdle(() => { noRef.current?.apply(this); }) } }>
                  <i className="uil uil-times me-2"></i> {t("@NO")}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
});

export default Alert;