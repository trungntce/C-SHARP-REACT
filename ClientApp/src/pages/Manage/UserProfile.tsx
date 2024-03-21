import { forwardRef, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Input, Label, Form, Card, CardBody } from "reactstrap";
import api from "../../common/api";
import { setFormData, useSubmitHandler } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import ListBase from "../../components/Common/Base/ListBase";
import { alertBox } from "../../components/MessageBox/Alert";
import { globalContext } from "../../components/VerticalLayout/Menu";

const UserProfile = (props: any) => {
  const { t } = useTranslation();
  
  const formRef = useRef<any>();
  const submitHandler = useSubmitHandler(async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    const result = await api<any>("post", "/user/profile", newRow);
      if(result.data > 0){
        alertBox("수정이 완료되었습니다.");

        localStorage.setItem("user-name", newRow.userName);
        localStorage.setItem("user-lang", newRow.nationCode);
        localStorage.setItem("user-email", newRow.email);

        globalContext.refreshProfile && globalContext.refreshProfile();
        globalContext.refreshLang && globalContext.refreshLang(newRow.nationCode);
      }
    }
  );

  useEffect(() => {
    setFormData(formRef.current, {
      userId: localStorage.getItem("user-id"),
      userName: localStorage.getItem("user-name"),
      nationCode: localStorage.getItem("user-lang"),
      email: localStorage.getItem("user-email"),
    });
  }, []);
  
  return (
    <>
      <ListBase
        folder="My Account"
        title="My"
        postfix="Page"
        icon="user"
        buttons={[]}
        >
          <Row>
            <Col md={4}>
              <Card>
                <div className="card-header">
                  <h4 className="card-title mb-0">
                    <i className="mdi mdi-emoticon-wink-outline me-1"></i> Profile Edit
                  </h4>
                </div>
                <CardBody>
                  <Form
                    innerRef={formRef}
                    onSubmit={submitHandler}
                    className="edit-wrap">
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label className="form-label">
                            사용자ID *
                          </Label>
                          <Input name="userId" type="text" disabled={true} required={true} autoComplete="off" className="form-control" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="password">
                            패스워드 <span className='text-primary'>(변경시에만 입력)</span>
                          </Label>
                          <Input name="password" type="password" autoComplete="off" className="form-control" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="userName">
                            사용자명 *
                          </Label>
                          <Input name="userName" type="text" required={true} autoComplete="off" className="form-control" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="icon">
                            언어코드 *
                          </Label>
                          <AutoCombo
                            name="nationCode" sx={{ width: "auto" }} placeholder="국가코드"
                            mapCode="code" category="LANG_CODE" required={true} />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Label className="form-label" htmlFor="email">
                            Email
                          </Label>
                          <Input name="email" type="email" autoComplete="off" className="form-control" />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="d-flex justify-content-end gap-2">
                          <Button type="submit" color="primary">
                            <i className="uil uil-check me-2"></i> {t("@COMPLETE")}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>  
            </Col>
          </Row>
                
      </ListBase>
    </>    
  );
};

export default UserProfile;
