import moment from "moment";
import React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getSearchParamsForLocation } from "react-router-dom/dist/dom";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Card, CardHeader, CardBody, UncontrolledPopover, PopoverBody, Table } from "reactstrap";
import api from "../../common/api";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";

const LotInfo = forwardRef((props: any, ref: any) => { 
  const { t } = useTranslation(); 
  const [lot, setLot] = useState<Dictionary>();
  const [list, setList] = useState<Dictionary[]>([]);
  
  const searchLot = (panelId?: string, workorder?: string) => {
    api<any>("get", "trace/job/select", { panelId, workorder }).then((result) => {
      if(result.data && result.data.length)
        setLot((result.data as Dictionary[])[0]);
    })
  }  

  const searchHandler = async () => {
    const result = await api<Dictionary[]>("get", "panelinterlock/workorder", { workorder: lot?.workorder });
    if(result?.data?.length){
      setList(result.data);
    }
  }

  useImperativeHandle(ref, () => ({ 
    setLot,
    searchLot
  }));

  useEffect(() => {
  }, []);

  return (
    <Card style={{ height: "85%" }}>
      <CardHeader style={{ paddingRight: "12px" }}>
        {`BATCH${t("@COL_STANDARD_INFORMATION")}`}

        <div className="float-end">
          { lot ? (
            <>
              <a id={`interlock-popover-lot-${lot.workorder}`} onClick={searchHandler}>
                { lot.workorderInterlockId ? 
                  (<span className="badge bg-danger">INTERLOCK</span>) 
                : (<span className="badge bg-primary">NO INTERLOCK</span>)
                }  
                
              </a>
              <UncontrolledPopover 
                // trigger="legacy"
                target={`interlock-popover-lot-${lot.workorder}`}
                placement="auto" 
                className="trace-popover-container">
                <PopoverBody>
                  <Table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>{t("@COL_DIVISION")}</th>                                                     {/*구분*/}
                        <th>{t("@OPER_SEQ")}</th>                                                         {/*공순*/}
                        <th>{t("@COL_OPERATION_NAME")}</th>                                               {/*공정명*/}
                        <th>{t("@COL_EQP_NAME")}</th>                                                     {/*설비명*/}
                        <th>{t("@INTERLOCK_CODE")}</th>                                                   {/*인터락코드*/}
                        <th>{t("@COL_AUTO")}</th>                                                         {/*자동*/}
                        <th>{`${t("@COL_REGISTRATION")}/${t("@COL_RELEASE")} ${t("@COL_REASON")}`}</th>   {/*등록/해제 사유*/}
                        <th>{`${t("@COL_REGISTRATION")}/${t("@COL_RELEASE")} ${t("@OFFICER")}`}</th>      {/*등록/해제 담당자*/}
                        <th>{`${t("@COL_REGISTRATION")}/${t("@COL_RELEASE")} ${t("@@COL_DATE")}`}</th>    {/*등록/해제 일시*/}
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((x: Dictionary, i: number) => (
                        (
                          <React.Fragment key={i}>
                            <tr>
                            <td style={{ minWidth: "40px" }} className="text-danger">{t("COL_REGISTRATION")}</td> {/* 등록 */}
                              <td rowSpan={2}>{x["operSeqNo"]}</td>
                              <td rowSpan={2} style={{ minWidth: "120px" }}>{x["operName"]}</td>
                              <td rowSpan={2} style={{ minWidth: "120px" }}>{x["eqpName"]}</td>
                              <td rowSpan={2} style={{ minWidth: "200px" }}>{x["interlockName"]}</td>
                              <td rowSpan={2} style={{ minWidth: "40px" }}>{x["autoYn"]}</td>

                              <td>{x["onRemark"]}</td>
                              <td style={{ minWidth: "70px" }}>{x["onUserName"]}</td>
                              <td style={{ minWidth: "80px" }}>{dateFormat(x["onDt"], "MM-DD HH:mm")}</td>
                            </tr>                          
                            <tr>
                            <td className="text-primary">{t("COL_RELEASE")}</td>  {/* 해제 */}
                              <td>{x["offRemark"]}</td>
                              <td style={{ minWidth: "70px" }}>{x["offUserName"]}</td>
                              <td style={{ minWidth: "80px" }}>{dateFormat(x["offDt"], "MM-DD HH:mm")}</td>
                            </tr>
                          </React.Fragment>
                        )
                      ))}
                      {
                        !list.length ? (
                          <tr>
                            <td colSpan={8} className="text-center">
                              발생내역이 없습니다.
                            </td>
                          </tr>
                        ) : null
                      }
                    </tbody>
                  </Table>
                </PopoverBody>
              </UncontrolledPopover>
            </>
          ) : "" }
          { lot && lot.jobStatus ? (
            <>
              <span className="badge bg-light text-secondary ms-1" style={{ border: "solid 1px #ccc" }}>{lot.jobStatus}</span>
              {lot.application1 ? 
                <span className="badge bg-light text-secondary ms-1" style={{ border: "solid 1px #ccc" }} >{lot.application1}</span>
              : ''}
              {lot.application2 ? 
                <span className="badge bg-light text-secondary ms-1" style={{ border: "solid 1px #ccc" }}>{lot.application2}</span>
              : ''}
              {lot.codeType ? 
                <span className="badge bg-light text-secondary ms-1" style={{ border: "solid 1px #ccc" }}>{lot.codeType}</span>
              : ''}
            </>
          ) : "" }
        </div>
      </CardHeader>
      <CardBody>
        { !lot ? "" : (
          <>
            <Row>
              <Col md={3} className="text-truncate">
                <Label>Batch:</Label> {lot.workorder}
                <Button type="button" size="sm" color="light"
                  style={{ padding: "3px 6px", marginLeft: "3px" }}
                  onClick={() => { window.open(`/trace4m/${lot.workorder}`) }}>
                  <i className="uil uil-external-link-alt"></i>
                </Button>
              </Col>
              <Col md={4} className="text-truncate">
                <Label>{`${t("@PRODUCT")}:`}</Label> [{lot.itemCode}] {lot.itemDescription},
              </Col>
              <Col md={3} className="text-truncate">
                <Label>{`${t("@COL_MODEL_CODE")}:`}</Label> <span></span>{lot.modelCode}
              </Col>
              <Col md={2} className="text-truncate">
                <Label>{`${t("@TYPE")}:`}</Label> {lot.uomCode}
              </Col>
            </Row>
            <Row>
              <Col md={3} className="text-truncate">
                <Label>Release:</Label> {dateFormat(lot.jobReleaseDate)}
              </Col>
              <Col md={4} className="text-truncate">
                <Label>{`${t("@COL_VENDOR_NAME")}:`}</Label> [{lot.vendorCode}] {lot.vendorFullName}
              </Col>
              <Col md={3} className="text-truncate">
                <Label>PCS/Release QTY:</Label> {lot.jobUomQty}/{lot.releaseQty}
              </Col>
              <Col md={2} className="text-truncate">
                <Label>PNL QTY:</Label> {lot.jobPnlQty}
              </Col>
            </Row>
          </>
          )
        }        
      </CardBody>
    </Card>
  );
});

export default LotInfo;
