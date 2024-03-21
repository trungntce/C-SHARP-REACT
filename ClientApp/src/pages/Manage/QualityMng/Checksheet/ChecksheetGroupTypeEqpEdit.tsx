import { forwardRef, useRef } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import AutoCombo from "../../../../components/Common/AutoCombo";


const ChecksheetGroupTypeEqpEdit = forwardRef((props: any, ref: any) => {
    const initRow = useRef<Dictionary>();
    const form = useRef<any>();
    const { t } = useTranslation();

    const initHandler = (formRef: any, init: Dictionary) => {
        form.current = formRef;
        initRow.current = init;

        if (initRow.current.equipmentCode) {
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
                header="CheckSheet Group Eqp Item"
                initHandler={initHandler}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            >
                <Row>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetGroupCode">
                            관리코드*
                            </Label>
                            <Input name="checksheetGroupCode" readOnly type="text" required={true} autoComplete="off" className="form-control" />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="equipmentCode">
                            공정코드
                            </Label>
                            <AutoCombo name="equipmentCode" required={true}  placeholder="공정코드" mapCode="eqp" />
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
            </EditBase>
        </>
    );
});

export default ChecksheetGroupTypeEqpEdit;
