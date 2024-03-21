import moment from "moment";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { Button, Input, Table } from "reactstrap";
import shortid from "shortid";
import api from "../../common/api";
import { contentType, UploadFile } from "../../common/types";
import { downloadFile, executeIdle, showLoading } from "../../common/utility";
import { alertBox } from "../MessageBox/Alert";
import style from "./Uploader.module.scss";
import UploaderTable from "./UploaderTable";

const Uploader = forwardRef((props: any, ref: any) => {
  const valueRef = useRef<any>();
  const dropRef = useRef<any>();
  const spinnerRef = useRef<any>();
  const tableRef = useRef<any>();

  const filesRef = useRef<UploadFile[]>([]);
  const folder = props.folder || "Common";
  const ymd = moment().format('YYYYMMDD');

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = [];

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      const key = shortid.generate();
      newFiles.push({ key: key, folder: folder, ymd: ymd, name: file.name, size: file.size, type: file.type });

      formData.append(key, file, file.name);
    })

    const query = new URLSearchParams({ folder: folder, ymd: ymd });

    spinnerRef.current.style.display = "block";

    api<number>("upload", `file?${query.toString()}`, formData).then(result => {
      if(result.data){
        const f = [...filesRef.current, ...newFiles];
        filesRef.current = f;
        valueRef.current.value = JSON.stringify(f);
        tableRef.current.setFiles(filesRef.current);

        spinnerRef.current.style.display = "none";
      }
    }).catch(error => {
      alertBox(error.response.data?.detail ?? "시스템 오류가 발생했습니다.");
      spinnerRef.current.style.display = "none";
      return;
    });
  }

  const delHandler = (file: UploadFile, i: number) => {
    const f = [...filesRef.current];
    f.splice(i, 1);
    filesRef.current = f;
    valueRef.current.value = JSON.stringify(f);
    tableRef.current.setFiles(filesRef.current);
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  useImperativeHandle(ref, () => ({ 
    setViewMode: () => {
      dropRef.current.style.display = "none";
      tableRef.current.setViewMode(true);
    }
  }));

  useEffect(() => {
    executeIdle(() => {
      if(valueRef.current?.value){
        filesRef.current = JSON.parse(valueRef.current?.value);
        tableRef.current.setFiles(filesRef.current);
      }
    });
  })

  return (
    <>
      <div className={style.uploaderContainer} style={props.style}>
      <input ref={valueRef} name={props.name} type="hidden" />
        
        { !props.readOnly && (
          <>
            <div ref={spinnerRef} className="uploader-spinner">
              <div className="uploader-spinner-inner">
                <div className="spinner-border text-primary">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div ref={dropRef} className="mb-2 dropable">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <a type="submit" className="btn btn-primary" onClick={() => { 
                  
                  }}>
                  <i className="uil uil-file me-2"></i> 파일 선택
                </a>
                {' '}
                {
                  isDragActive ? (<>파일 드래그 완료</>) : <>파일을 드래그 하거나 파일 선택 버튼을 눌러주세요. 최대(30MB)</>
                }
              </div>
            </div>
          </>
        ) }
        <div style={props.tableStyle}>
          <UploaderTable
            ref={tableRef}
            onDelete={delHandler}
          />
        </div>
      </div>
    </>
  );
});

export default Uploader;