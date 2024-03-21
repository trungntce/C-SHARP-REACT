import React, { useRef, useState } from "react";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
} from "reactstrap";
import Breadcrumb from "../components/Common/Breadcrumb";
import { Dictionary } from "../common/types";

const env = import.meta.env.VITE_ENV;

const AGGrid = () => {
  const gridRef = useRef<any>();
  const [rowData, setRowData] = useState<Dictionary[]>([]);
  const columnDefs = [
    {
      headerName: "디버깅 시간",
      field: "dbgChgYmdhms",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 4,
    },
    {
      headerName: "담당자",
      field: "chgEmp",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "검사지그",
      field: "jigId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "검사구분",
      field: "inspeqpType",
      minWidth: 300,
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "P/N",
      field: "itemId",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "검사항목",
      field: "inspItem",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "타입",
      field: "dbgSettingType",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "이전값",
      field: "dbgChgvalBef",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "현재값",
      field: "dbgChgvalAft",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "변경사유",
      field: "dbgChgvalReason",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 5,
    },
  ];

  const editorRef = useRef({});

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const editHandler = (entity: Dictionary) => {
    setShowModal(true);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(formData);
    console.log(data);
  };

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumb folder="AG Grid" icon="grid" breadcrumbItem="AG Grid" />

          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={10} className="d-inline-flex gap-2">
                      <Dropdown
                        isOpen={showDropdown}
                        toggle={() => setShowDropdown(!showDropdown)}
                      >
                        <DropdownToggle tag="button" className="btn btn-light">
                          검색필드 <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>제목</DropdownItem>
                          <DropdownItem>내용</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>작성자</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                      <Input type="text" size={5} style={{ width: 150 }} />

                      <div className="d-flex align-items-center gap-2">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          id="autoSizingCheck2"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="autoSizingCheck2"
                        >
                          삭제된 항목만 검색
                        </Label>
                      </div>
                    </Col>
                    <Col lg={2} className="d-flex gap-2 justify-content-end">
                      <Button type="button" color="primary">
                        <i className="uil uil-search me-2"></i> 검색
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div
                    className="ag-theme-alpine mb-3"
                    style={{ width: "100%", height: 500 }}
                  >
                    <AgGridReact
                      ref={gridRef}
                      rowData={rowData}
                      columnDefs={columnDefs}
                      rowSelection={"single"}
                      rowMultiSelectWithClick={true}
                      onCellDoubleClicked={(
                        event: CellDoubleClickedEvent
                      ) => {}}
                    />
                  </div>
                  <Row>
                    <Col xl={2}></Col>
                    <Col xl={8}>
                      <div className="d-flex justify-content-center">
                        <Pagination aria-label="Page navigation example">
                          <PaginationItem disabled>
                            <PaginationLink previous href="#" />
                          </PaginationItem>
                          <PaginationItem active>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">4</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">5</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">6</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">7</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">8</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">9</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">10</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink next href="#" />
                          </PaginationItem>
                        </Pagination>
                      </div>
                    </Col>
                    <Col xl={2}>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          type="button"
                          color="primary"
                          onClick={() => {
                            editHandler({});
                          }}
                        >
                          <i className="uil uil-pen me-2"></i> 작성
                        </Button>
                        <Button type="button" color="light">
                          <i className="uil uil-trash me-2"></i> 삭제
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Modal
        size="lg"
        centered={true}
        isOpen={showModal}
        toggle={() => {
          setShowModal(!showModal);
        }}
      >
        <ModalHeader
          toggle={() => {
            setShowModal(!showModal);
          }}
        >
          Edit
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <Label className="form-label" htmlFor="formrow-firstname-input">
                First name
              </Label>
              <Input type="text" className="form-control" name="firstname" />
            </div>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="formrow-email-input">
                    Email
                  </Label>
                  <Input type="email" className="form-control" name="email" />
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <Label
                    className="form-label"
                    htmlFor="formrow-password-input"
                  >
                    Password
                  </Label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <Editor
                  onInit={(evt: any, editor: any) =>
                    (editorRef.current = editor)
                  }
                  tinymceScriptSrc="/tinymce.min.js"
                  initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | casechange blocks | bold italic backcolor | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | removeformat",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button type="submit" color="primary">
                    <i className="uil uil-check me-2"></i> 완료
                  </Button>
                  <Button
                    type="button"
                    color="light"
                    onClick={() => {
                      setShowModal(false);
                    }}
                  >
                    <i className="uil uil-times me-2"></i> 닫기
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AGGrid;
