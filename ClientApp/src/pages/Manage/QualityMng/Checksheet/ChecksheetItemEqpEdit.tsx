import { SyntheticEvent, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, FormText } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import EditBase from "../../../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import AutoCombo from "../../../../components/Common/AutoCombo";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import moment from "moment";
import { Autocomplete, Checkbox, InputAdornment, TextField } from "@mui/material";
import api from "../../../../common/api";


const ChecksheetItemEqpEdit = forwardRef((props: any, ref: any) => {
    const initRow = useRef<Dictionary>();
    const form = useRef<any>();
    const { t } = useTranslation();
    const [dayCheckType, setDayCheckType] = useState<any>('D');
    const [optionValues, setOptionValues] = useState<Dictionary[]>([]);
    const dailyCheckDateRef = useRef<any>("");
    const autoDailyCheckTypeRef = useRef<any>();
    const [isImgInputType, setIsImgInputType] = useState<any>(false);
    const imgRef = useRef<any>();
    const checkImgRef = useRef<any>();
    const [checked, setChecked] = useState<any>(true);
    const imgPathRef = useRef<any>('');
    const imgNmRef = useRef<any>('');

    const initHandler = (formRef: any, init: Dictionary) => {
        dailyCheckDateRef.current = init.dailyCheckDate;
        imgPathRef.current = init.imgPath;
        imgNmRef.current = init.imgNm;

        setIsImgInputType(false);
        setChecked(true);
        if (init.inputType === 'image') { 
            setIsImgInputType(true);
        }

        form.current = formRef;
        initRow.current = init;
        if (initRow.current.checksheetItemCode) {
            form.current.elements["checksheetItemCode"].disabled = true;
        } else {
        }
        setDayCheckType(init.dailyCheckType);
    }

    const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    }


    const submitHandler = async (formData: FormData, row: Dictionary) => {
        if (isImgInputType && checked) { 
            const files: any = document.getElementById('fileImg');
            if (!files || files.files.length <= 0) { 
                alert('Please select file image')
                return;
            }
            if (files) {
                const _formData = new FormData();
                _formData.append('files', files.files[0]);
                await api<any>("post", "checksheettypeEmt/upload", _formData).then((res: any) => { 
                    if (res.data) { 
                        const obj: any = res.data;
                        row.imgPath = obj.path;
                        row.imgNm = obj.fileName;
                    }
                }).catch(err => { 
                    alert('Upload error!');
                });
            }
        }
        if (isImgInputType && !checked) { 
            row.imgPath = imgPathRef.current;
            row.imgNm = imgNmRef.current;
        }
        if (!isImgInputType) { 
            row.imgPath = '';
            row.imgNm = '';
        }
        console.log(row, initRow.current, dailyCheckDateRef.current)
        row.dailyCheckDate = dailyCheckDateRef.current;

        if (dayCheckType !== 'D' && row.dailyCheckDate === '') { 
            alert('측정주기 Required!');
            return false;
        }

        props.onComplete(row, initRow.current);
    }

    const onChangeInputType = (event: any, value: Dictionary | null) => {
        console.log('Value: ', value);
        setIsImgInputType(false);
        if (null !== value && value.value === 'image') { 
            setIsImgInputType(true);
        }
    }

    const onChangeFileImg = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setChecked(true);
    }

    const onChangeCheckFileImg = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setChecked(!checked);
    }

    return (
        <>
            <EditBase
                ref={ref}
                header="CheckSheet Eqp Item"
                initHandler={initHandler}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
            >
                 <Row>
                    <Input type="hidden" name="checksheetCode" className="form-control" autoComplete="off"></Input>
                    <Input type="hidden" name="eqpCode" className="form-control" autoComplete="off"></Input>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetItemCode">
                            {t("@CKSICODE")}
                            </Label>
                            <Input name="checksheetItemCode" required={true} type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checksheetTypeName">
                            {t("@CKSTYPE")}
                            </Label>
                            <Input name="checksheetTypeName" required={true}  placeholder="공정코드"  className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="checkFreqNum">
                            {t("@FREQ")}
                            </Label>
                            <Input required={true} defaultValue={1} name="checkFreqNum" type="number" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="ord">
                            {t("@ORD")}
                            </Label>
                            <Input name="ord" required={true} type="number" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="inputType">
                            {t("@INPUTTYPE")}
                            </Label>
                            <AutoCombo onChange={ onChangeInputType } name="inputType" required={true}  placeholder="입력유형" mapCode="code" category="CHK_INPUT_TYPE" />
                        </div>
                    </Col>
                    {
                        isImgInputType === true ? <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="fileImg">
                            Hình ảnh tiêu chuẩn
                                </Label>
                            <Row>
                                <Col md={11}>
                                    <Input type="file"
                                        name="fileImg"
                                        id="fileImg"
                                            className="form-control"
                                        accept="image/*"
                                            onChange={onChangeFileImg}
                                            ref={imgRef}
                                        />
                                        <FormText>
                                        {imgNmRef.current}
                                        </FormText>
                                </Col>
                                <Col md={1}>
                                        <Checkbox checked={checked}
                                            title="The checked for change file image"
                                            ref={checkImgRef}
                                            onChange={onChangeCheckFileImg}
                                            className="form-control"
                                            color="success" sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
                                </Col>
                            </Row>
                        </div>
                        </Col> : <></>
                    }
                    
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="dailyCheckType">
                            {t("@DAYCKTYPE")}
                            </Label>
                            <AutoCombo required={true}  name="dailyCheckType"  placeholder="일일점검형" mapCode="code" category="CHK_DAILY_CK_TYPE" />
                        </div>
                    </Col>
                    
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="exchgPeriod">
                            {t("@EXPERIOD")}
                            </Label>
                            <Input name="exchgPeriod" required={false} type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="standardVal">
                            {t("@STANDARD_VALUE")}
                            </Label>
                            <Input name="standardVal" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="minVal">
                            {t("@MINVAL")}
                            </Label>
                            <Input name="minVal" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="maxVal">
                            {t("@MAXVAL")}
                            </Label>
                            <Input name="maxVal" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="useYn">
                            {t("@USEYN")}
                            </Label>
                            <select name="useYn" className="form-select" defaultValue={"Y"} required={true}>
                                <option value="">{t("@USEYN")}</option>
                                <option value="Y">Y</option>
                                <option value="N">N</option>
                            </select>
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="method">
                            {t("@METHOD")}
                            </Label>
                            <Input name="method" required={true} type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="inspectPoint">
                            {t("@INSPECTPOINT")}
                            </Label>
                            <Input name="inspectPoint" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="remark">
                                {t("@REMARK")}
                            </Label>
                            <Input name="remark" type="text" className="form-control" autoComplete="off" />
                        </div>
                    </Col>
                </Row>
            </EditBase>
        </>
    );
});

export default ChecksheetItemEqpEdit;
