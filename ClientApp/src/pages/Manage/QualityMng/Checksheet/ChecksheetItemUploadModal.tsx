import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Col, Input, Modal, Row, Table } from "reactstrap";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import api from "../../../../common/api";
import { showProgress } from "../../../../components/MessageBox/Progress";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";
import { contentType } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import { useGridRef } from "../../../../common/hooks";
import { columnDefErrUpload } from "./ChecksheetItemEqpDefs";

const ChecksheetItemUploadModal = forwardRef((props: any, ref: any) => { 
  const [isOpen, setIsOpen] = useState<any>(false);
  const [checksheetCode, setChecksheetCode] = useState<any>('');
  const [eqpCode, setEqpCode] = useState<any>('');
  const [errList, setErrList] = useState<any>([]);

  useImperativeHandle(ref, () => ({ 
    onToggleModal,
    setChecksheetCode,
    setEqpCode
  }));

  const onToggleModal = (e: any) => { 
    setIsOpen(!isOpen);
  }

  const onClickImport = async () => { 
    const files: any = document.getElementById('fileUpload');
    if (files && files.files.length > 0) {
      const { hideProgress, startFakeProgress } = showProgress("Import Excel progress", "progress");
      startFakeProgress();
      
      const formData = new FormData();
      formData.append('files', files.files[0]);
      const result = await api<any>("post", "checksheettypeEmt/uploadexcel?checksheetCode=" + checksheetCode + '&eqpCode=' + eqpCode, formData);
      if (result) {
        alertBox('Upload success!');
        setErrList(result.data);
      }
      hideProgress();
    } else {
      alertBox('Please select file to upload!');
    }
  }

  const onClickDownloadTemplate = async () => {
    const result = await api<any>("download", "checksheettypeEmt/downloadexceltemp", {});
    downloadFile(`checksheet_item_template_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
  }

  const getRowErrList = () => { 
    return errList.map((item: any, key: any) => { 
      return <tr key={key}>
        <td>{item.rowNo}</td>
        <td>{ item.remark }</td>
      </tr>
    });
  }

  return (
    <>
      <Modal
        size="lg"
        isOpen={isOpen}
        toggle={(e: any) => {
            onToggleModal(e);
        }}
        centered={true}
        >
        <div className="modal-header">
          Import Excel
          <button
            type="button"
            onClick={() => {
                setIsOpen(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            >
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div style={{ position: 'relative' }} className="modal-body">
          <Row>
            <Col md={3}>File import:</Col>
            <Col md={6}><Input type="file" id="fileUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" /></Col>
            <Col md={3}><Button onClick={onClickImport}>Tải lên</Button></Col>
          </Row>
          <Row>
            <Col md={12}>
              <a onClick={onClickDownloadTemplate}>Click to Download Template?</a>
            </Col>
          </Row>
          {
            errList.length > 0 ? 
              <Table bordered>
                <thead>
                  <tr>
                    <td>Dòng lỗi</td>
                    <td>Mô tả</td>
                  </tr>
                </thead>
                <tbody>
                { getRowErrList() }
                </tbody>
              </Table>
              : ''
          }
          <hr/>
        </div>
      </Modal>  
    </>
  );
});

export default ChecksheetItemUploadModal;

