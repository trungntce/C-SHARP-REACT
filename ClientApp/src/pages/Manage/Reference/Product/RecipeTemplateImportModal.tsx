import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Col, Input, Label, Modal, Row } from "reactstrap";
import { confirmBox } from "../../../../components/MessageBox/Alert";
import api from "../../../../common/api";
import { showProgress } from "../../../../components/MessageBox/Progress";
import { downloadFile, yyyymmddhhmmss } from "../../../../common/utility";
import { contentType } from "../../../../common/types";

const RecipeTemplateImportModal = forwardRef((props: any, ref: any) => { 
  const [isOpen, setIsOpen] = useState<any>(false);

  useImperativeHandle(ref, () => ({ 
    onToggleModal
  }));

  const onToggleModal = (e: any) => { 
    setIsOpen(!isOpen);
  }

  const onClickImport = async () => { 
    const files: any = document.getElementById('fileUpload');
    props.onComplete(files);
    setIsOpen(!isOpen);
  }

  const getInfoFile = () => { 
    const file: any = document.getElementById('fileUpload');
    if (file && file.files.length > 0) {
      const lbl = document.getElementById('lblContent');
      if (lbl && lbl !== undefined) { 
        lbl.innerText = file.files[0].name;
      }
    }
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
          <Col md={12}>
          <div className="mb-3">
            <Label className="form-label" htmlFor="files">
            첨부파일_FileUpload
            </Label>
            <Col md={12}>
              <div 
                style={{ height : '100%', border: '1px solid #ccc'}} 
                onClick={() => {
                document.getElementById('fileUpload')?.click();
              }}>
                <Input name="files" 
                  type="file" 
                  id="fileUpload" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  onChange={getInfoFile} 
                  hidden
                />
                <a type="submit" className="btn btn-primary" onClick={() => { 
                  }}>
                  <i className="uil uil-file me-2"></i>파일 선택
                </a>
                &nbsp;&nbsp;
                <span id="lblContent"></span>
              </div>
            </Col>
          </div>
        </Col>
          </Row>
        </div>
        <div className="modal-footer justify-content-end">
          <Button onClick={onClickImport}>Tải lên</Button>
        </div>
      </Modal>  
    </>
  );
});

export default RecipeTemplateImportModal;

