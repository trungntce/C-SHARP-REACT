import { CellDoubleClickedEvent, FirstDataRenderedEvent, IRowNode, RowClassParams, RowDataUpdatedEvent, RowHeightParams, RowSelectedEvent } from "ag-grid-community";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover, Form } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef, useSubmitHandler, useSubmitRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import style from "./ProcessControl.module.scss";
import api from "../../../common/api";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useParams } from "react-router";
import { executeIdle, showLoading } from "../../../common/utility";

import { useTranslation } from "react-i18next";

const ControlBase = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  const [formRef, setForm] = useSubmitRef();
  const submitHandler = useSubmitHandler(props.searchHandler);

  useImperativeHandle(ref, () => ({ 
    setForm,
    getSearchRef: () => formRef
  }));

  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <>
      <Form 
        className="search-wrap"
        innerRef={formRef}
        onSubmit={submitHandler}
        >
        <Row>
          <Col md={2} style={{display:"flex", alignItems:"center"}}>
            { props.title }
          </Col>
          <Col className="d-inline-flex gap-2">
            { props.children }
          </Col>
          <Col size="auto" className="search-button-row " style={{ ...{ maxWidth: "200px" }, ...props.style}}>
            { props.buttons || 
              <>
                {props.preButtons }
                <Button type="submit" color="primary">
                  {t(props.title + " 실행")}
                </Button>
                {props.postButtons }
              </>
            }
          </Col>
        </Row>
      </Form>
    </>
  );
});

export default ControlBase;
