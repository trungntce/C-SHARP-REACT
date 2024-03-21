import moment from "moment";
import { useSearchRef } from "../../common/hooks";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { Button, Col, Row } from "reactstrap";
import api from "../../common/api";
import SearchBase from "../../components/Common/Base/SearchBase";
import { downloadFile, yyyymmddhhmmss } from "../../common/utility";
import { Dictionary, contentType } from "../../common/types";
import { showProgress } from "../../components/MessageBox/Progress";

const RawDataDown = () => {
  const [aoiSearchRef, getAoiSearch] = useSearchRef();
  const [panelParamRef, getPanelParamSearch] = useSearchRef();

  const aoiExcelHandle = async(_?: Dictionary) => {
    const { hideProgress, startFakeProgress } = showProgress("Aoi Raw Data Excel Download", "progress");
    startFakeProgress();
    const result = await api<any>("download","/download/aoirawdata", getAoiSearch());
    downloadFile(`AOI Raw Data_${yyyymmddhhmmss()}.xlsx`,contentType.excel,[result.data].sort((a:any,b:any)=>new Date(a["create_dt"]).getTime() - new Date(b["create_dt"]).getTime()));
    hideProgress();
  }

  const panelExcelHandle = async(_?: Dictionary) => {
    const { hideProgress, startFakeProgress } = showProgress("Aoi Raw Data Excel Download", "progress");
    startFakeProgress();
    const result = await api<any>("download","/download/panelparam", getPanelParamSearch());
    downloadFile(`Panel Param_${yyyymmddhhmmss()}.xlsx`,contentType.excel,[result.data].sort((a:any,b:any)=>new Date(a["create_dt"]).getTime() - new Date(b["create_dt"]).getTime()));
    hideProgress();
  }

  return (
    <div style={{width:"100%", height:"100%",overflowY:"scroll"}}>
      <div style={{width:"30%"}}>
        <SearchBase ref={aoiSearchRef} 
          buttons={<Button type="button" color="outline-primary" onClick={aoiExcelHandle}><i className="mdi mdi-file-excel me-1"/>Excel </Button>}>
          <Row>
            <Col style={{fontSize:"1.3rem"}}>Aoi Raw Data</Col>
            <Col>
              <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText="조회시작" required={true} />
            </Col>
          </Row>
        </SearchBase>
        <SearchBase ref={panelParamRef} 
          buttons={<Button type="button" color="outline-primary" onClick={panelExcelHandle} ><i className="mdi mdi-file-excel me-1"/>Excel </Button>}>
          <Row>
            <Col style={{fontSize:"1.3rem"}}>TB Panel Param</Col>
            <Col>
              <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText="조회시작" required={true} />
            </Col>
          </Row>
        </SearchBase>
      </div>
    </div>
  );
};

export default RawDataDown;
