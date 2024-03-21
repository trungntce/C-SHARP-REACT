import React, { Component, useRef } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody, UncontrolledPopover, Table } from 'reactstrap';

export const TraceTest = () => {
  const popverRef = useRef<any>();
  const popRef = useRef<any>();

  return (
    <>
      <br></br><br></br><br></br><br></br>
      <div className="pt-5 text-center mt-5">
        <a id={`trace-popover-eqp-1`}>
          <i className="fa fa-search"></i>
          {' '}
          <span>
            테스트
          </span>
        </a>
        <UncontrolledPopover
          innerRef={popverRef}
          ref={popRef}
          trigger="legacy"
          target={`trace-popover-eqp-1`}
          placement="left"
          className="trace-popover-container">
          <PopoverHeader>Equipment</PopoverHeader>
          <PopoverBody>
            <Table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>설비코드</th>
                  <th>설비명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>aa</th>
                  <th>bb</th>
                </tr>
              </tbody>
            </Table>
            <Button type="button" color="light" style={{ width: 170 }} onClick={() => {
              console.log(popverRef.current);
              popRef.current.toggle();
            }}>
              닫기
            </Button>
          </PopoverBody>
        </UncontrolledPopover>
      </div>
    </>
  )
}
export default TraceTest;
