import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Modal, ModalBody, ModalHeader, Progress, Row } from "reactstrap";
import { easeOutQuad } from "../../common/utility";

let progressFn: { show: any } = { show: null };
export const showProgress = (message: string, header?: string): 
{ 
    reportProgress: (value: number) => void, 
    hideProgress: () => void,
    startFakeProgress: (step?: number, interval?: number) => void
} => {
  return progressFn.show(message, header);
}

const ProgressBar = forwardRef((props: any, ref: any) => {
  const { t }  = useTranslation();
  
  const innerPercent = useRef(0);
  const timeoutHandle = useRef<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [header, setHeader] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [percent, setPercent] = useState<number>(0);

  const show = (message: string, header?: string): 
  { 
    reportProgress: (value: number) => void, 
    hideProgress: () => void,
    startFakeProgress: (step?: number, interval?: number) => void
  } => {
    setHeader(t(message));
    setMessage(t(header));
    setPercent(0);

    setIsOpen(true);
    
    return { 
      reportProgress: (value) => {
        setPercent(value);
      }, 
      hideProgress: () => {
        hide();
      },
      startFakeProgress: (step = 1, interval = 1000) => {
        innerPercent.current = 0;
        doFakeProgress(step, interval);
      }
    };
  }

  progressFn.show = show;

  const openedHandler = () => {
    
  }

  const doFakeProgress = (step: number, interval: number) => {
    innerPercent.current += step;
    const p = easeOutQuad(innerPercent.current/ 100) * 100;
    
    if(p >= 100)
      return;

    setPercent(p);
    
    timeoutHandle.current = window.setTimeout(() => { doFakeProgress(step, interval) }, 1000);
  }

  const hide = () => {
    clearTimeout(timeoutHandle.current);
    setIsOpen(false);
  }

  const toggle = () => {
    if(isOpen)
      clearTimeout(timeoutHandle.current);

    setIsOpen(!isOpen);
  }

  useImperativeHandle(ref, () => ({ 
    show
  }));

  return (
    <Modal
      size={ props.size || "md" }
      centered={true}
      isOpen={isOpen}
      zIndex={99999}
      backdrop={false}
      fade={false}
      contentClassName="progress-content"
      onOpened={openedHandler}
      toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <div>{header}</div>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <div className="mb-2">
              {message} : {percent.toFixed(2)}%
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Progress
              animated
              className={props.className}
              color={props.color}
              value={percent}
            />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
});

export default ProgressBar;