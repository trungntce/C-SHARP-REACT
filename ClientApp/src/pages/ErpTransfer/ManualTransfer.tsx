import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label, Card, CardHeader, CardBody } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { ColDef, RowSelectedEvent } from "ag-grid-community";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import style from "./History.module.scss";
import api from "../../common/api";
import { executeIdle } from "../../common/utility";
import { AgGridReact } from "ag-grid-react";
import { AxiosResponse } from "axios";
import { alertBox } from "../../components/MessageBox/Alert";
import { showProgress } from "../../components/MessageBox/Progress";

const columnDefs:  ColDef[] = [     
];

const ManualTransfer = (props: any) => {
  const { t } = useTranslation();

  const listRef = useRef<any>();  
  const [searchRef, getSearch] = useSearchRef();  

  const compareRef = useRef<any>();
  const mergeRef = useRef<any>();
  const deleteCopyRef = useRef<any>();

  const [erpJobGridRef, setErpJobList] = useGridRef();
  const [erpOperGridRef, setErpOperList] = useGridRef();
  const [erpReqGridRef, setErpReqList] = useGridRef();
  const [erpToolGridRef, setErpToolList] = useGridRef();

  const [mesJobGridRef, setMesJobList] = useGridRef();
  const [mesOperGridRef, setMesOperList] = useGridRef();
  const [mesReqGridRef, setMesReqList] = useGridRef();
  const [mesToolGridRef, setMesToolList] = useGridRef();

  const jobData: { erp: Dictionary[], mes: Dictionary[] } = { erp: [], mes: [] };
  const operData: { erp: Dictionary[], mes: Dictionary[] } = { erp: [], mes: [] };
  const reqData: { erp: Dictionary[], mes: Dictionary[] } = { erp: [], mes: [] };
  const toolData: { erp: Dictionary[], mes: Dictionary[] } = { erp: [], mes: [] };

  const autoSizeAll = useCallback((ref: RefObject<AgGridReact<any>>, skipHeader: boolean) => {
    const allColumnIds: any[] = [];
    ref.current!.columnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    ref.current!.columnApi.autoSizeColumns(allColumnIds, skipHeader);
  }, []);

  const searchHandler = async (_?: Dictionary) => {
    erpSearch();

    mesSearch();
  };

  const erpSearch = () => {
    erpJobGridRef!.current!.api.showLoadingOverlay();
    erpOperGridRef!.current!.api.showLoadingOverlay();
    erpReqGridRef!.current!.api.showLoadingOverlay();
    erpToolGridRef!.current!.api.showLoadingOverlay();

    api<Dictionary[]>("get", "job/erpjob", getSearch()).then(result => {
      bindGrid(erpJobGridRef, result, setErpJobList);
      jobData.erp = result.data;

      if(result.data.length){
        compareRef.current.disabled = false;
        mergeRef.current.disabled = false;
        deleteCopyRef.current.disabled = false;
      }else{
        compareRef.current.disabled = true;
        mergeRef.current.disabled = true;
        deleteCopyRef.current.disabled = true;
      }
    });

    api<Dictionary[]>("get", "job/erpoper", getSearch()).then(result => {
      bindGrid(erpOperGridRef, result, setErpOperList);
      operData.erp = result.data;
    });

    api<Dictionary[]>("get", "job/erpreq", getSearch()).then(result => {
      bindGrid(erpReqGridRef, result, setErpReqList);
      reqData.erp = result.data;
    });

    api<Dictionary[]>("get", "job/erptool", getSearch()).then(result => {
      bindGrid(erpToolGridRef, result, setErpToolList);
      toolData.erp = result.data;
    });
  }

  const mesSearch = () => {
    mesJobGridRef!.current!.api.showLoadingOverlay();
    mesOperGridRef!.current!.api.showLoadingOverlay();
    mesReqGridRef!.current!.api.showLoadingOverlay();
    mesToolGridRef!.current!.api.showLoadingOverlay();

    api<Dictionary[]>("get", "job/mesjob", getSearch()).then(result => {
      bindGrid(mesJobGridRef, result, setMesJobList);
      jobData.mes = result.data;
    });

    api<Dictionary[]>("get", "job/mesoper", getSearch()).then(result => {
      bindGrid(mesOperGridRef, result, setMesOperList);
      operData.mes = result.data;
    });

    api<Dictionary[]>("get", "job/mesreq", getSearch()).then(result => {
      bindGrid(mesReqGridRef, result, setMesReqList);
      reqData.mes = result.data;
    });

    api<Dictionary[]>("get", "job/mestool", getSearch()).then(result => {
      bindGrid(mesToolGridRef, result, setMesToolList);
      toolData.mes = result.data;
    });
  }

  const bindGrid = (ref: RefObject<AgGridReact<any>>, result: AxiosResponse<Dictionary[], any>, bindFunc: (data: Dictionary[]) => void) => {
    if(!result.data || !result.data.length){
      bindFunc([]);        
      return;        
    }

    const list = result.data;

    const colDefs = [...columnDefs];
    const row = list[0];

    let index = 0
    for (let key in row) {
      colDefs.push({ field: key,});

      index++;
      if(index > 20)
        break;
    }

    ref.current!.api.setColumnDefs(colDefs);

    bindFunc(list);

    executeIdle(() => {
      autoSizeAll(ref, false);
    });
  }

  const compareHandler = () => {
    try{
      compareRow(jobData.erp[0], jobData.mes[0]);

      for(let i = 0; i < operData.erp.length; i++){
        compareRow(operData.erp[i], operData.mes[i]);
      }

      for(let i = 0; i < reqData.erp.length; i++){
        compareRow(reqData.erp[i], reqData.mes[i]);
      } 

      for(let i = 0; i < toolData.erp.length; i++){
        compareRow(toolData.erp[i], toolData.mes[i]);
      }

      alertBox("동일한 데이터입니다.");

    }catch(ex){
      alertBox(ex as string);
    }
  }

  const compareRow = (erpRow: Dictionary, mesRow: Dictionary) => {
    for (let key in erpRow) {
      if(erpRow[key] != mesRow[key]){
        throw `ERP: ${key} ${erpRow[key]} <> MES: ${mesRow[key]}`;
      }

      break;
    }
  }

  const doTransfer = (isDelete: boolean) => {
    const param = { jobNo: jobData.erp[0]["jobNo"], isDelete: isDelete };

    const { hideProgress, startFakeProgress } = showProgress("ERP JOB Transfer", "progress");
    startFakeProgress();

    api<number>("get", "job/tran", param).then(result => {
      if(result?.data){
        hideProgress();
        alertBox(`${result.data}건이 전송 되었습니다.`);
        searchHandler();
      }
    })
  }

  const mergeHandler = () => {  
    doTransfer(false);
  }

  const deleteCopyHandler = () => {  
    doTransfer(true);
  }

  useEffect(() => {
    compareRef.current.disabled = true;
    mergeRef.current.disabled = true;
    deleteCopyRef.current.disabled = true;
  }, []);

  return (
    <>
      <ListBase
        buttons={[]}
        ref={listRef}
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col style={{ minWidth: "300px" }}>
                <Input name="jobNo" placeholder="Workorder" required={true} />
              </Col>
              <Col style={{ minWidth: "400px" }}>
                <Button innerRef={compareRef} type="button" color="info" className="me-2" style={{ width: "80px" }} onClick={compareHandler}>
                  <i className="fa-solid fa-right-left"></i>{" "}
                  비교
                </Button>    
                <Button innerRef={mergeRef} type="button" color="success" className="me-2" style={{ width: "100px" }} onClick={mergeHandler}>
                  <i className="fa-solid fa-right-from-bracket"></i>{" "}
                  Merge
                </Button>    
                <Button innerRef={deleteCopyRef} type="button" color="primary" style={{ width: "150px" }} onClick={deleteCopyHandler}>
                <i className="fa-solid fa-right-to-bracket"></i>{" "}
                  Delete and Copy
                </Button>    
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={6}>
              <div className="pb-2" style={{ height: "15%" }}>
                <GridBase ref={erpJobGridRef} columnDefs={[]} onGridReady={() => { setErpJobList([]); }} />
              </div>
              <div className="pb-2" style={{ height: "35%" }}>
                <GridBase ref={erpOperGridRef} columnDefs={[]} onGridReady={() => { setErpOperList([]); }} />
              </div>
              <div className="pb-2" style={{ height: "30%" }}>
                <GridBase ref={erpReqGridRef} columnDefs={[]} onGridReady={() => { setErpReqList([]); }} />
              </div>
              <div className="pb-2" style={{ height: "20%" }}>
                <GridBase ref={erpToolGridRef} columnDefs={[]} onGridReady={() => { setErpToolList([]); }} />
              </div>
            </Col>
            <Col md={6} style={{ height: "100%" }}>
              <div className="pb-2" style={{ height: "15%" }}>
                <GridBase ref={mesJobGridRef} columnDefs={[]} onGridReady={() => { setMesJobList([]); }} />
              </div>
              <div className="pb-2" style={{ height: "35%" }}>
                <GridBase ref={mesOperGridRef} columnDefs={[]} onGridReady={() => { setMesOperList([]); }} />
              </div>
              <div className="pb-2" style={{ height: "30%" }}>
                <GridBase ref={mesReqGridRef} columnDefs={[]} onGridReady={() => { setMesReqList([]); }} />
              </div>
              <div className="pb-2" style={{ height: "20%" }}>
                <GridBase ref={mesToolGridRef} columnDefs={[]} onGridReady={() => { setMesToolList([]); }} />
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );
};

export default ManualTransfer;
