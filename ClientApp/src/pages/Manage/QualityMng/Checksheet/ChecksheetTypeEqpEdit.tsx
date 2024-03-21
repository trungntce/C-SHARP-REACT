import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import AutoCombo from "../../../../components/Common/AutoCombo";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import moment from "moment";

const ChecksheetTypeEqpEdit = forwardRef((props: any, ref: any) => {
    const groupType = useRef<any>(props.groupType);
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
                header="CheckSheet Eqp"
                initHandler={initHandler}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            >
                <Row>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetGroupCode">
                                관리코드
                            </Label>
                            {
                                groupType.current === 'EMT' ? <AutoCombo name="checksheetGroupCode" required={true} placeholder="작업장코드" mapCode="checksheetemt" autoComplete="off" className="form-control"/> : ''
                            }
                            {
                                groupType.current === 'PROD' ? <AutoCombo name="checksheetGroupCode" required={true} placeholder="작업장코드" mapCode="checksheetprod" autoComplete="off" className="form-control"/> : ''
                            }
                            {
                                groupType.current === 'PM' ? <AutoCombo name="checksheetGroupCode" required={true} placeholder="작업장코드" mapCode="checksheetpm" autoComplete="off" className="form-control"/> : ''
                            }
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetCode">
                                관리코드
                            </Label>
                            <Input name="checksheetCode" type="text" required={true} autoComplete="off" className="form-control" />
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
                </Row>
                <Row>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="remark">
                                설명
                            </Label>
                            <Input name="remark" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                </Row>
                <Input name="rev" defaultValue={1} type="hidden" className="form-control" autoComplete="off"/>
            </EditBase>
        </>
    );
});

export default ChecksheetTypeEqpEdit;
