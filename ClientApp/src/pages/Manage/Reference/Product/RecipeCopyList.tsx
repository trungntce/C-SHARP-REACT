import { CellDoubleClickedEvent } from "ag-grid-community";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { columnDefs } from "./RecipeCopyDefs";
import { useTranslation } from "react-i18next";
import { isNullOrWhitespace } from "../../../../common/utility";
import { CircularProgress, Fade, LinearProgress } from "@mui/material";



//MADE BY SIFLEX
const RecipeCopyList = () =>{
  const { t } = useTranslation();
  const [searchFromRef, getSearchFrom] = useSearchRef();
  const [searchToRef, getSearchTo] = useSearchRef();
  const [fromModelCodeRef, setFromModelCodeList] = useGridRef();
  const [toModelCodeRef, setToModelCodeList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const cbFromModelCodeRef = useRef<any>();
  const cbToModelCodeRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [isDisableBtnCopy, setIsDisableBtnCopy] = useState(false);

  useEffect(() => { 
    init();
  }, []);

  const init = async () => { 
    setFromModelCodeList([]);
    setToModelCodeList([]);
  }

  const searchFromCodeHandler = async () => {
    api<any>("get", "recipecopy/fromCode", getSearchFrom()).then(
      (result) => {
        if (result.data) setFromModelCodeList(result.data);
      }
    );
  };

  const searchToCodeHandler = async () => {
    api<any>("get", "recipecopy/toCode", getSearchTo()).then(
      (result) => {
        if (result.data) setToModelCodeList(result.data);
      }
    );
  };

  const copyHandler = () => {
    const fromModelCode = cbFromModelCodeRef.current.getValue();
    const toModelCode = cbToModelCodeRef.current.getValue();
    if(isNullOrWhitespace(fromModelCode.value)) {
      alertBox(t('@MSG_NO_FROM_MODEL_CODE_REQUIRED'));
      return;
    }
    if(isNullOrWhitespace(toModelCode.value)) {
      alertBox(t('@MSG_NO_TO_MODEL_CODE_REQUIRED'));
      return;
    }
    if (toModelCode.value === fromModelCode.value) {
      alertBox(t('@MSG_NO_FROM_TO_CODE_NOT_SAME'));
      return;
    }

    confirmBox(t('@MSG_NO_CONFIRM_COPY'), async () => {
      setLoading(true);
      setIsDisableBtnCopy(true);
      api<any>("get", "recipecopy/copy", {
        fromModelCode: fromModelCode.value,
        toModelCode: toModelCode.value,
      }).then((result) => {
        if (result.data) {
          setLoading(false);
          if (result.data === 1) {
            alertBox(t('@MSG_NO_COPY_SUCCESS'));
          }
          if (result.data === -2) { 
            alertBox(t('@MSG_NO_DATA_TO_COPY'));
          }
          if (result.data === -3) { 
            alertBox(t('@MSG_NO_DATA_TO_COPY'));
          }
          setLoading(true);
          searchToCodeHandler();
          setLoading(false);
          setIsDisableBtnCopy(false);
        }
      });
    }, async () => {
      setLoading(false);
      setIsDisableBtnCopy(false);
      alertBox(t('@MSG_NO_COPY_DATA_FAILED'));
    });
  }

  return (
    <>
      <ListBase
        folder="Reference Management"
        title="Recipe From Code"
        icon="book-open"
        preButtons={<></>}
        buttons={<></>}
        search={<></>}>
        <Row>
            <SearchBase ref={searchFromRef} searchHandler={searchFromCodeHandler}>
              <Row>
                <Col>
                  <AutoCombo ref={cbFromModelCodeRef} name="modelCode" sx={{ minWidth: "300px" }} placeholder={t("@COL_MODEL_FROM_CODE")} mapCode="model"/>
                </Col>
              </Row>
            </SearchBase>
          </Row>
        <Row style={{ height: '45%' }}>
          <Col>
          <GridBase style={{ height: '100%' }}
              ref={fromModelCodeRef}
              columnDefs={columnDefs()}
          />
          </Col>
        </Row>
        <Row>
          <Col className="pt-2">
            <SearchBase ref={searchToRef}
              searchHandler={searchToCodeHandler}
              preButtons={<>
                <Button disabled={isDisableBtnCopy} type="button" color="success" onClick={copyHandler}>
                      <i className="uil uil-file-edit-alt me-2"></i> { t('@COPY_RECIPE') }
                </Button>
              </>
              }
              style={{ maxWidth: '400px' }}
            >
              <Row>
                <Col>
                  <AutoCombo ref={cbToModelCodeRef} name="modelCode" sx={{ minWidth: "300px" }} placeholder={t("@COL_MODEL_TO_CODE")} mapCode="model"/>
                </Col>
              </Row>
          </SearchBase>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? <LinearProgress  /> : <></> }
          </Col>
        </Row>
        <Row style={{ height: '45%' }}>
          <Col>
          <GridBase
              ref={toModelCodeRef}
              columnDefs={columnDefs()}
            />
          </Col>
        </Row>
      </ListBase>
    </>
  )
};

export default RecipeCopyList;
