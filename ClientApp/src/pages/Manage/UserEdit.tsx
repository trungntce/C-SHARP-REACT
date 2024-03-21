import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import AutoCombo from "../../components/Common/AutoCombo";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";

const UserEdit = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const initRow = useRef<Dictionary>();
  const form = useRef<any>();
  const passwordLabelRef = useRef<any>();

  const initHandler = (formRef: any, init: Dictionary) => {
    form.current = formRef; 
    initRow.current = init;
    
    if(initRow.current.userId){
      form.current.elements["userId"].disabled = true;
      form.current.elements["password"].required = false;
      passwordLabelRef.current.innerHTML = `${t("@PASSWORD")} <span class='text-primary'>(${t("@ENTER_ONLY_CHANGE")})</span>`;        //패스워드 <span class='text-primary'>(변경시에만 입력)</span>
    }else{
      form.current.elements["password"].required = true;
      passwordLabelRef.current.innerHTML = `${t("@PASSWORD")} *`;                        //패스워드 *
    }
  }

  const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {    
  }

  const submitHandler = (formData: FormData, row: Dictionary) => {
    props.onComplete(row, initRow.current);
  }

  return (
    <>
      <EditBase 
        ref={ref}
        header="User Edit"
        initHandler={initHandler}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        >
        <Row>
          <Col md={4}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="userId">
                {`${t("@USER")} *`}                                    {/*사용자ID */}
              </Label>
              <Input name="userId" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={4}>
            <div className="mb-3">
              <label ref={passwordLabelRef} className="form-label" htmlFor="password">
                {`${t("@PASSWORD")} *`}                                                   {/*패스워드 */}
              </label>
              <Input name="password" type="password" autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={4}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="userName">
                {`${t("@USER_NAME")} *`}                                                       {/*사용자명 */}
              </Label>
              <Input name="userName" type="text" required={true} autoComplete="off" className="form-control" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="icon">
                {`${t("@COUNTRY_CODE")} *`}                                              {/*언어코드 */}
              </Label>
              <AutoCombo 
                name="nationCode" sx={{ width: "auto" }} placeholder={t("@COUNTRY_CODE")} 
                mapCode="code" category="LANG_CODE" required={true} />
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="email">
                Email
              </Label>
              <Input name="email" type="email" autoComplete="off" className="form-control" />
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="useYn">
                {`${t("@USEYN")} *`}                                               {/*사용여부 */}
              </Label>
              <select name="useYn" defaultValue={"Y"} required={true} className="form-select">
                <option value="">{t("@USEYN")}</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-3">
              <Label className="form-label" htmlFor="remark">
                {`${t("@REMARK")}`}                                                     {/*설명 */}
              </Label>
              <Input name="remark" type="text" className="form-control" autoComplete="off" />
            </div>
          </Col>
        </Row>
      </EditBase>
    </>    
  );
});

export default UserEdit;
