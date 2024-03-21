import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { columnDefs } from "./TestDefs";
import { SyntheticEvent, useEffect, useState } from "react";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { executeIdle, getMap } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import api from "../../common/api";
import { useTranslation } from "react-i18next";
import TestEdit from "./TestEdit";
import DateTimePicker from "../../components/Common/DateTimePicker";
import ReactApexChart from "react-apexcharts";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import moment from "moment";
import WorkCenterEqp from "../../components/Common/WorkCenterEqp";

const TestList = (props: any) => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const { refetch, post, put, del } = useApi("test", getSearch, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    console.log("etstst", getSearch())
    const result = await refetch();
    if(result.data)
      setList(result.data);
  };

  useEffect(() => {
    editRef.current.setForm({ testMultiLang: "한글::베트남" });
    editRef.current.setShowModal(false);
  }, []);

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};

    if(initRow.testId){
      const result = await post(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox("수정이 완료되었습니다.");
      }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        searchHandler();
        closeModal();
        alertBox("작성이 완료되었습니다.");
      }else if(result.data == -1){
        alertBox(`동일한 항목이 존재합니다.<br />Test Id: ${newRow.testId}`);
      }
    }
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox("삭제할 행을 선택해 주세요.");
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();
        alertBox("@DELETE_COMPLETE");
      }
    }, async () => {

    });    
  }

  const testHandler = async () => {
    const promise1 = Promise.resolve(3);
    const promise2 = new Promise((resolve, reject) => {
      setTimeout(resolve, 500, 'fa');
    });
    const promise3 = new Promise((resolve, reject) => {
      setTimeout(resolve, 1000, 'foo');
    });

    promise2.then(result => {
      console.log("promise2 resolved");
    });

    promise3.then(result => {
      console.log("promise3 resolved");
    });

    Promise.all([promise1, promise2, promise3]).then((values) => {
      console.log(values);
    });

  }
  
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      title: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
      title: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
      title: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
  ];

  const changeHandler = (event: SyntheticEvent<Element, Event>, newValues: Dictionary[]) => { 
    console.log(newValues);
  }

  useEffect(() => {
    searchHandler();
  }, []);

  return (
    <>      
      <ListBase
        editHandler={() => { setForm({ testMultiLang: "한글::베트남" }); }}
        deleteHandler={deleteHandler}
        folder="System Management"
        title="Test"
        postfix="Management"
        icon="bold"
        postButtons={
          <Button type="button" color="purple" onClick={testHandler}>
            <i className="uil uil-question-circle me-2"></i> {t("@TEST")}
          </Button>
        }
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <div>
            <DateTimePicker name="fromDt" defaultValue={moment().add(-2, 'days').toDate()}  placeholderText="조회시작" 
                showTimeInput={true} showTimeSelect={true} timeIntervals={5} dateFormat="yyyy-MM-dd HH:mm" required={true} />
                <input type="hidden" name="eqpCode" />
            </div>

            <Row>
              <Col>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </Col>
              <Col>
                <Input name="testId" type="text" size={5} style={{ width: 120 }} placeholder="테스트ID" className="form-control" />
              </Col>
              <Col>
                <Input name="testName" type="text" size={5} style={{ width: 150 }} placeholder="테스트명" className="form-control" />
              </Col>
              <Col>
                <Input name="remark" type="text" size={5} style={{ width: 200 }} placeholder={t("@REMARK")} className="form-control" />
              </Col>
              <WorkCenterEqp name="eqpCode" style={{ width: 200 }} workcenterRef="workcenter" />
              <Col>
                <select name="useYn" className="form-select">
                  <option value="">{t("@USEYN")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }>
          <GridBase
            ref={gridRef}
            columnDefs={columnDefs()}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}     
            onCellDoubleClicked={(e: CellDoubleClickedEvent) => { setForm(e.data); }}
          />
      </ListBase>
      <TestEdit
        ref={editRef}
        onComplete={editCompleteHandler}
      />
    </>
  );
};

export default TestList;
