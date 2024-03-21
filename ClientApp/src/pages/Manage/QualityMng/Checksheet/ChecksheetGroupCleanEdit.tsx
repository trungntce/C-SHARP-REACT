import { forwardRef, useRef } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import AutoCombo from "../../../../components/Common/AutoCombo";


const ChecksheetGroupProdEdit = forwardRef((props: any, ref: any) => {
    const initRow = useRef<Dictionary>();
    const form = useRef<any>();
    const { t } = useTranslation();

    const initHandler = (formRef: any, init: Dictionary) => {
        form.current = formRef;
        initRow.current = init;

        if (initRow.current.checksheetGroupCode) {
            form.current.elements["checksheetGroupCode"].disabled = true;
        } else {
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
                header="Check Sheet Group Prod"
                initHandler={initHandler}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            >
                <Row>
                    <Input name="groupType" type="hidden" value={"PROD"} required={true} autoComplete="off" className="form-control" />
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetGroupCode">
                                관리코드
                            </Label>
                            <Input name="checksheetGroupCode" type="text" required={true} autoComplete="off" className="form-control" />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetGroupName">
                                관리명
                            </Label>
                            <Input name="checksheetGroupName" type="text" required={true} autoComplete="off" className="form-control" />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="workcenterCode">
                                작업장코드
                            </Label>
                            <AutoCombo name="workcenterCode" placeholder="작업장코드" mapCode="workcenter" />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="useYn">
                                사용여부
                            </Label>
                            <select name="useYn" className="form-select" defaultValue={"Y"} required={true}>
                                <option value="">{t("@USEYN")}</option>
                                <option value="Y">Y</option>
                                <option value="N">N</option>
                            </select>
                        </div>
                    </Col>
                    <Col md={8}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="remark">
                                설명
                            </Label>
                            <Input name="remark" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                </Row>
            </EditBase>
        </>
    );
});

export default ChecksheetGroupProdEdit;
