import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Input, Label, Card, CardBody, Form, InputGroup, InputGroupText, Table, CardHeader } from "reactstrap";
import { setFormData, useApi, useSubmitHandler } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import Select from "../../components/Common/Select";
import { executeIdle } from "../../common/utility";
import IconInput from "../../components/Common/IconInput";
import AutoCombo from "../../components/Common/AutoCombo";
import MenuAuthEdiit from "./MenuAuthEdit";

const MenuEdiit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  
  const initRow = useRef<Dictionary>({});
  const formRef = useRef<any>();
  const [isShowEdit, setIsShowEdit] = useState({ isShow: false });
  const iconRef = useRef<any>();
  const authRef = useRef<any>();

  useImperativeHandle(ref, () => ({ 
    setShowModal: (isShow: boolean) => {
      setIsShowEdit({ isShow: isShow });
    },
    setForm: (row: Dictionary) => {      
      initRow.current = row;
    }
  }));

  useEffect(() => {
    if(isShowEdit.isShow){
      setFormData(formRef.current, initRow.current);

      executeIdle(() => {
        iconRef.current.setIconText(initRow.current.icon);
      });

      if (initRow.current.menuId) {
      } else {
      }

      authRef.current.setForm(initRow.current);
    }
  }, [isShowEdit]);
  
  const submitHandler = useSubmitHandler((formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  });

  if(!isShowEdit.isShow)
    return null;

  return (
    <>
      <Card className="edit-wrap">
        <CardHeader className="gray100">
          {t("@COL_BASIC_INFORMATION")}   {/* 기본정보 */}
        </CardHeader>
        <CardBody>
          <Form
            innerRef={formRef}
            onSubmit={submitHandler}>
            <Row>
              <Col md={5}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="parentId">
                    {t("@TOP_MENU")}    {/* 상위메뉴 */}
                  </Label>
                  <Select name="parentId" label={t("@TOP_MENU")} placeholder={t("@TOP_MENU")} mapCode="menu" category="depth2" className="form-select" />
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="menuType">
                    {`${t("@MENU_TYPE")} *`}    {/* 메뉴종류 * */}
                  </Label>
                  <Select name="menuType" label={t("@MENU_TYPE")} placeholder={t("@MENU_TYPE")} mapCode="code" category="MENU_TYPE" required={true} className="form-select" />
                </div>
              </Col>
              <Col md={2}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="useYn">
                    {`${t("@MENU_TYPE")} *`}    {/* 사용여부 * */}
                  </Label>
                  <select name="useYn" defaultValue={"Y"} required={true} className="form-select">
                    <option value="">{t("@MENU_TYPE")}</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                </div>
              </Col>
              <Col md={2}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="menuSort">
                    {`${t("@SORT")} *`}   {/* 순서 * */}
                  </Label>
                  <Input name="menuSort" type="number" defaultValue={0} required={true} autoComplete="off" className="form-control" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={5}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="icon">
                    {t("@MENU_ICON")}   {/* 메뉴아이콘 */}
                  </Label>
                  <IconInput ref={iconRef} formRef={formRef} name="icon" />
                </div>
              </Col>
              <Col md={7}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="menuName">
                    {`${t("@MENU_NAME")} *`}    
                  </Label>
                  <Input name="menuId" type="hidden" />
                  <Input name="menuName" type="text" required={true} autoComplete="off" className="form-control" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="menuBody">
                    {t("@MENU_CONTENTS")}   {/* 메뉴내용 */}
                  </Label>
                  <Input name="menuBody" type="text" className="form-control" autoComplete="off" />
                </div>
              </Col>
              <Col md={4}>
                <Label className="form-label" htmlFor="menuBody">
                  {t("@OFFICER")}   {/* 담당자 */}
                 </Label>
                <Input name="manager" type="text" className="form-control" autoComplete="off" />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-end gap-2 mt-1">
                  <Button type="submit" color="primary">
                    <i className="uil uil-check me-2"></i> {t("@COMPLETE")}
                  </Button>
                  <Button type="button" color="light" onClick={props.onCancel}>
                    <i className="uil uil-times me-2"></i> {t("@CANCEL")}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <MenuAuthEdiit 
        ref={authRef}
      />
    </>
  );
});

export default MenuEdiit;
