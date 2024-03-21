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

const UploaderTable = forwardRef((props: any, ref: any) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [viewMode, setViewMode] = useState(false);

  useImperativeHandle(ref, () => ({ 
    setFiles,
    setViewMode
  }));

  useEffect(() => {
  })

  return (
    <>
      <Table className="table table-file">
        <thead className="table-light">
          <tr>
            <th>File Name</th>
            <th>Size</th>
            { !viewMode && (<th style={{ width: 45 }}>삭제</th>) }
          </tr>
        </thead>
        <tbody>
          {files.map((x: UploadFile, i: number) => (
            <tr key={i}>
              <td>
                <a onClick={async () => {
                  const result = await api<any>("download", "file", x);
                  downloadFile(
                    x.name,
                    contentType.stream,
                    [result.data]
                  );
                }}>
                  {x["name"]}
                  {' '}
                  <i className="fa fa-download" style={{ position: "relative", top: "2px" }} />
                </a>
              </td>
              <td>{x["size"]}</td>
              { !viewMode && (
                <td className="text-center">
                  <Button type="button" onClick={() => { props.onDelete(x, i); }} className="btn-light btn-link">
                    <i className="fa fa-fw fa-times" />
                  </Button>       
                </td>
              ) }
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
});

export default UploaderTable;