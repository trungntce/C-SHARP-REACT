import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const ListBase = forwardRef((props: any, ref: any) => {
  const { t }  = useTranslation();

  const [paging, setPaging] = useState({ pageNo: 1, pageSize: 100, totalCount: 0, totalPage: 0, pageList: [] as number[] });
  
  useEffect(() => {

  }, [paging]);

  useImperativeHandle(ref, () => ({ 
    setPaging: (pageNo: number, pageSize: number, totalCount: number) => {
      const start = (pageNo - 4) <= 0 ? 1 : (pageNo - 4);
      const totalPage = Math.ceil(totalCount / pageSize);
      const end = Math.min(totalPage, start + 9);
  
      const pageList: number[] = [];
      for(let i = start; i <= end; i++){
        pageList.push(i);
      }

      setPaging({ pageNo: pageNo, pageSize: pageSize, totalCount: totalCount, totalPage: totalPage, pageList: pageList });
    }
  }));

  const clickHandler = (page: number) => {
    props.onPaging && props.onPaging(page);
  }

  return (
    <div className={`page-content ${props.className}`}>
      <div className="container-fluid">
        <Breadcrumb 
          folder={props.folder}
          icon={props.icon}
          breadcrumbItem={props.title} />
        <Row className="page-body">
          <Col className="col-12">
            <Card className="list-wrap">
              {
                props.search && (
                  <CardHeader>
                    { props.search }
                  </CardHeader>
                )
              }
              <CardBody>
                { props.children }
                <Row className="page-card-footer">
                  <Col xl={props.startCol || 3}>
                    {props.leftButtons }
                  </Col>
                  <Col xl={props.centerCol || 4}>
                    {
                      props.showPagination &&
                      <div className="d-flex justify-content-center">
                        <Pagination aria-label="Page navigation example">
                          <PaginationItem disabled={paging.pageNo <= 1}>
                            <PaginationLink previous onClick={(e: any) => {
                                clickHandler(paging.pageNo - 10 < 1 ? 1 : paging.pageNo - 10);
                              }} />
                          </PaginationItem>
                          {
                            paging.pageList.map((page: number, index: number) => {
                              return (
                                <PaginationItem key={index} active={page === paging.pageNo}>
                                  <PaginationLink onClick={(e: any) => {
                                    clickHandler(page);
                                  }}>
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })
                          }
                          <PaginationItem disabled={paging.pageNo >= paging.totalPage}>
                            <PaginationLink next onClick={(e: any) => {
                                clickHandler(paging.pageNo + 10 > paging.totalPage ? paging.totalPage : paging.pageNo + 10);
                              }} />
                          </PaginationItem>
                        </Pagination>
                      </div>
                    }
                  </Col>
                  <Col xl={props.endCol || 5} className="list-button-wrap">
                    {
                      props.buttons || 
                      <div className="d-flex gap-2 justify-content-end">
                        {props.preButtons }
                        <Button type="button" color="primary" onClick={props.editHandler}>
                          <i className="uil uil-pen me-2"></i> {t("@WRITE")}
                        </Button>
                        <Button type="button" color="light" onClick={props.deleteHandler}>
                          <i className="uil uil-trash me-2"></i> {t("@DELETE")}
                        </Button>
                        {props.postButtons }
                      </div>
                    }
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
})

export default ListBase;