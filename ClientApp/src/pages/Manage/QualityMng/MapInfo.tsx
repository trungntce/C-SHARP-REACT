import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Card, CardHeader, CardBody } from "reactstrap";
import api from "../../../common/api";
import { Dictionary } from "../../../common/types";


const MapInfo = forwardRef((props: any, ref: any) => {  
  const [map, setMap] = useState<Dictionary>();
  
  const searchMap = (panelId?: string, workorder?: string) => {
    const result = api<any>("get", "emapping/map/select", { panelId, workorder }).then((result) => {
      if(result.data && result.data.length)
      setMap((result.data as Dictionary[])[0]);
    })
  }  

  useImperativeHandle(ref, () => ({ 
    setMap,
    searchMap
  }));

  useEffect(() => {
  }, []);

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader>
        Mapping 정보
      </CardHeader>
      <CardBody>
        { !map ? "" : (
          <>
            <Row>
              <Col md={4} className="text-truncate">
                <Label>Panel ID:</Label> {map.panelId}
              </Col>
              <Col md={3} className="text-truncate">
                <Label>총 PCS:</Label> {map.totalPcs}
              </Col>
              <Col md={2} className="text-truncate">
                <Label>OK(BBT):</Label> {map.bbtOk}
              </Col>
              <Col md={2} className="text-truncate">
                <Label>NG(BBT):</Label> {map.bbtNg}
              </Col>
            </Row>
          </>
          )
        }        
      </CardBody>
    </Card>
  );
});

export default MapInfo;
