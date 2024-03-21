import moment from "moment";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getSearchParamsForLocation } from "react-router-dom/dist/dom";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Card, CardHeader, CardBody } from "reactstrap";
import api from "../../common/api";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";
import style from "./Trace.module.scss";

const ApiHistoryView = forwardRef((props: any, ref: any) => {  
  const [row, setRow] = useState<Dictionary>({});

  const requestRef = useRef<any>();
  const responseRef = useRef<any>();
  const resultRef = useRef<any>();
  
  useImperativeHandle(ref, () => ({ 
    setRow: (row: Dictionary) => {
      setRow(row);

      if(row.request){
        var request = JSON.stringify(JSON.parse(row.request), undefined, 2);
        requestRef.current.innerHTML = syntaxHighlight(request);
      }else{
        requestRef.current.innerHTML = "";
      }

      if(row.response && row.response != "Too Long Response"){
        var response = JSON.stringify(JSON.parse(row.response), undefined, 2);
        responseRef.current.innerHTML = syntaxHighlight(response);
      }else{
        responseRef.current.innerHTML = "";
      }

      resultRef.current.innerHTML = "";
    }
  }));

  const copyClipboard = (str: string) => {
    navigator.clipboard.writeText(str);
  }

  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  useEffect(() => {
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <Card style={{ height: "100%" }}>
        <CardHeader>
          Detail View
        </CardHeader>
        <CardBody>
          { !setRow ? "" : (
            <>
              <Row>
                <Col md={2}>
                  <Label>Client</Label>
                </Col>
                <Col md={4}>
                  {row.client}
                </Col>
                <Col md={2}>
                  <Label>Host</Label>
                </Col>
                <Col md={4}>
                  {row.host}
                </Col>
              </Row>
              <Row className="mb-1">
                <Col md={2}>
                  <Label>[{row.method}]</Label>
                </Col>
                <Col md={10}>
                  <Input bsSize="sm" name="path" type="text" defaultValue={row.path} className="form-control input-sm" placeholder="Path" />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={2}>
                  <Label>Query</Label>
                </Col>
                <Col md={10}>
                  <Input bsSize="sm" name="path" type="text" defaultValue={row.query} className="form-control input-sm" placeholder="Path" />
                </Col>
              </Row>
              <Row>
                <Col>
                  <pre ref={requestRef}></pre>
                </Col>
              </Row>
              <Row>
                <Col>
                  <pre ref={responseRef}></pre>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex gap-2 justify-content-end mb-1">
                    <Button type="button" color="info" onClick={() => {
                      if(row.request){
                        var request = JSON.stringify(JSON.parse(row.request), undefined, 2);
                        copyClipboard(request);
                      }else{
                        copyClipboard("");
                      }                
                    }}>
                      <i className="fa fa-fw fa-copy"></i>{" "}
                      Request Copy
                    </Button>
                    <Button type="button" color="success" onClick={() => {
                      if(row.response){
                        var response = JSON.stringify(JSON.parse(row.response), undefined, 2);
                        copyClipboard(response);
                      }else{
                        copyClipboard("");
                      }                      
                    }}>
                      <i className="fa fa-fw fa-copy"></i>{" "}
                      Response Copy
                    </Button>
                    <Button type="button" color="primary" onClick={() => {
                      let param = {};
                      if(row.request)
                        param = JSON.parse(row.request);

                      api(row.method.toLowerCase(), row.path + row.query, param).then((result) => {
                        if(result.data){
                          var response = JSON.stringify(result.data, undefined, 2);
                          resultRef.current.innerHTML = syntaxHighlight(response);
                        }
                      });
                    }}>
                      <i className="fa fa-fw fa-paper-plane"></i>{" "}
                      Do Request
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <pre ref={resultRef}></pre>
                </Col>
              </Row>
            </>
            )
          }        
        </CardBody>
      </Card>
    </div>
  );
});

export default ApiHistoryView;
