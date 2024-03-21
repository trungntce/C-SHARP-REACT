//import axios from "axios";

//import React, { Component, useEffect, useCallback, useRef, useState } from "react";
import { forwardRef, useRef, useState } from "react";
import { Row, Col, Button, Input, Label } from "reactstrap";
import { Dictionary } from "../../common/types";
import EditBase from "../../components/Common/Base/EditBase";
import { useTranslation } from "react-i18next";
import LangTextBox from "../../components/Common/LangTextBox";

const DocManageEdit = forwardRef((props: any, ref: any) => {
    const { t } = useTranslation();
    const initRow = useRef<Dictionary>();

    const initHandler = (formRef: any, init: Dictionary) => {
        initRow.current = init;

        if (initRow.current.defectgroupCode) {
            formRef.elements["defectgroupCode"].disabled = true;
        } else {
        }
    };

    const submitHandler = (formData: FormData, row: Dictionary) => {
        props.onComplete(row, initRow.current);
    };


    const [selectedFile, setselectedFile] = useState({ selectedFile: "", name: "", type: "", lastModifiedDate:"" });
    
    // On file select (from the pop up)
   function onFileChange (event:any) {
        // Update the state
       console.log(event.target.files);
       const file: any = document.getElementById("att_file");
       file.value = event.target.files[0].name;
    };

    // On file upload (click the upload button)
   function onFileUpload (){
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "myFile",
            selectedFile.selectedFile,
           selectedFile.name
        );

        // Details of the uploaded file
        console.log(selectedFile);

        // Request made to the backend api
        // Send formData object
        //axios.post("api/uploadfile", formData);
    };

    // File content to be displayed after
    // file upload is complete
    function fileData  (){
        if (selectedFile) {
            return (
                < div >
                    < h2 > File Details:</ h2 >
                    < p >
                        File Name: {" "}
                        {selectedFile.name}
                    </ p >


                    < p >
                        File Type: {" "}
                        {selectedFile.type}
                    </ p >


                    < p >
                        Last Modified: {" "}
                        {selectedFile.lastModifiedDate}
                    </ p >
                </ div >
            );
        }
        else {
            return (
                < div >
                    < br />
                    < h4 >
                        Choose before Pressing the Upload
                        button
                    </ h4 >
                </ div >
            );
        }
    };







    return (
        <EditBase
            ref={ref}
            header="DefectGroup Edit"
            initHandler={initHandler}
            submitHandler={submitHandler}
        >
            <Row>
                <Col md={4} style={{ display:"none" }}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="doc_no">
                            {"문서구분"}
                        </Label>
                        <Input name="doc_no" type="text" className="form-control"  />
                    </div>
                </Col>

                <Col md={4}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="doc_type">                        
                            {"문서구분"}
                        </Label>
                        <Input name="doc_type" type="text"   className="form-control" required={true} />
                    </div>
                </Col>
                <Col md={4}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="doc_name">
                            {"문서명"}
                        </Label>
                        <Input name="doc_name" type="text"   className="form-control" required={true} />
                    </div>
                </Col>
                <Col md={4}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="doc_content">
                            {"내용설명"}
                        </Label>
                        <Input name="doc_content" type="text"   className="form-control" required={true} />
                    </div>
                </Col>

                <Col md={4} style={{ "display": "none" }}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="att_file">
                            {"첨부파일"}
                        </Label>
                        <input name="att_file" id="att_file" type="text" className="form-control"  />
                    </div>
                </Col>

                <Col md={4}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="files">
                            {"첨부파일"}
                        </Label>
                        <Input name="files" type="file" accept=".pdf,.doc,.docx,.txt,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="form-control" required={true} onChange={onFileChange} />
                    </div>
                </Col>
               

                <Col md={2}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="use_yn">
                            {t("@USEYN")}
                        </Label>
                        <select name="use_yn" className="form-select" defaultValue={"Y"} required={true}>
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
                            {t("@REMARK")}
                        </Label>
                        <Input name="remark" type="text" className="form-control"  />
                    </div>
                </Col>

                
            </Row>
        </EditBase>
    );
});

export default DocManageEdit;

