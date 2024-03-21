import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import { CommunicationStatusDefs } from "./CommunicationStatusDefs";
import { alertBox } from "../../../../components/MessageBox/Alert";
import api from "../../../../common/api";
import style from "../../../AnyPage/scss/common.module.scss"

const CommunicationStatusList = () => {
  const { t } = useTranslation();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const [autoSearch, setAutoSearch] = useState<any>({})

  const editBtn = useRef<any>();
  const [statusCnt, setStatusCnt] = useState({
    total: 0,
    run: 0,
    fail: 0,
    down: 0,
    isnull: 0,
    dasTotal: 0,
    dasRun: 0,
    dasFail: 0,
    dasDown: 0,
    dasIsnull: 0,
  });
  const [visiable, setVisiable] = useState(false);
  const [changesList, setChangesList] = useState<any>({});

  const { refetch } = useApi("barcode/communicationstatus", getSearch, gridRef);
  
  const [isRunning, setIsRunning] = useState<Boolean>(false);

  const setCnt = useCallback((result: any) => {
    const dasList = [...result].filter((f: any) =>
      f.hcCode.includes("DAS")
    );
    const nonDasList = [...result].filter(
      (f: any) => !f.hcCode.includes("DAS")
    );
    const total = nonDasList.length;
    const run = nonDasList.filter((f: any) => f.status === "run").length;
    const fail = nonDasList.filter((f: any) => f.status === "failure").length;
    const down = nonDasList.filter((f: any) => f.status === "down").length;
    const isnull = [...result].filter(
      (f: any) => f.status === null
    ).length;

    const dasTotal = dasList.length;
    const dasRun = dasList.filter((f: any) => f.status === "run").length;
    const dasFail = dasList.filter((f: any) => f.status === "failure").length;
    const dasDown = dasList.filter((f: any) => f.status === "down").length;
    const dasIsnull = dasList.filter((f: any) => f.status === null).length;
    setStatusCnt({
      total,
      run,
      fail,
      down,
      isnull,
      dasTotal,
      dasRun,
      dasFail,
      dasDown,
      dasIsnull,
    });
  }, []);

  const searchHandler = async (_?: Dictionary) => {
    setVisiable(false);

    const refetched = refetch();
    const vrseqpdt = api<any>("get","barcode/getvrseqpdt",{});

    Promise.allSettled([refetched, vrseqpdt]).then((result:any) => {
      if(result[0].value?.data && result[1].value?.data){
        const list = result[0].value?.data;
        const vrsEqpDt = result[1].value?.data;

        const newList = [...list].map((l:any)=>{
          const eqpDt = [...vrsEqpDt].find((vrs:any)=>vrs?.equip === l?.hcCode);
          return {
            ...l,
            eqp_last_dt : eqpDt ? eqpDt["eqp_last_dt"] : null
          }
        });
        editBtn.current.disabled = isRunning ? true : false;
        gridRef.current?.api.stopEditing();
        setCnt(newList);
        setList(newList);
        setVisiable(true);
      }
    })


    // const result = await refetch();
    // if (result.data) {
    //   editBtn.current.disabled = isRunning ? true : false;
    //   gridRef.current?.api.stopEditing();
    //   setCnt(result);
    //   setList(result.data);
    //   setVisiable(true);
    // }
  };

  useEffect(() => {
   editBtn.current.disabled = true;
  },[]);

  useEffect(() => {
   let intervelId:any;

   if(isRunning) {
    intervelId = setInterval(async()=>{

     const result = await api<any>("get","barcode/communicationstatus",{...autoSearch})

     if (result.data) {
       editBtn.current.disabled = isRunning ? true : false;
       gridRef.current?.api.stopEditing();
       setCnt(result);
       setList(result.data);
       setVisiable(true);
     }

    }, 5 * 60 * 1000); 
   } else {
    clearInterval(intervelId);
   }

   return () => {
    clearInterval(intervelId);
  };
  },[isRunning]);

  const getEditAllRows = () => {
    const rowData: Dictionary[] = [];
    gridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  };

  const handleCellValueChanged = useCallback(
    (e: any) => {
      setChangesList({
        ...changesList,
        [e.data["lastDt"]]: e.data,
      });
    },
    [changesList]
  );

  const editHandlers = async () => {
    if(isRunning) return;
    const rawList = getEditAllRows();
    const param: Dictionary = {};
    param.rawJson = JSON.stringify(Object.values(changesList));

    const result = await api<any>(
      "post",
      "barcode/communicationstatusupdate",
      param
    );
    if (result.data > 0) {
      alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));             //일괄저장이 완료되었습니다.
      searchHandler();
      setChangesList({});
    }
  };

  const AutoUpdateHandler = () => {
   setAutoSearch(getSearch());
   setIsRunning((prev)=>!prev);
  }

  const getRowStyle = useCallback((params: any) => {
     return {
       backgroundColor: params.data.ipAddress?.includes("Secondary") ?  "#141E461a" : "",
     };
 }, []);

  return (
    <>
      <ListBase
        title="BarcodeReader"
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button
              innerRef={editBtn}
              type="button"
              color="primary"
              onClick={editHandlers}
            >
              <i className={`uil uil-pen me-2`}></i> {t("@SAVE")}
            </Button>
          </div>
        }
        search={
          <SearchBase style={{maxWidth:"400px"}} ref={searchRef} searchHandler={()=>{
           isRunning ? ()=>{} : searchHandler();
          }}
          preButtons = {
           <>
            <text>[ Cycle Time : {`5${t("@MINUTE")}`} ]</text>  {/* 5분 */}
            <Button
             style={{fontWeight:"bold"}}
             type="button"
             color={isRunning ? "danger" : 'success'}
             onClick={AutoUpdateHandler}
             // onClick={()=>console.log("eeeeeeeee",getSearch())}
            >
            {`Auto ${isRunning ? "Update Stop":"Update Start"} `}
           </Button>
           </>
          }
          >
            <div className="search-row">
             <div style={{ minWidth: "250px" }}>
              <AutoCombo disabled={isRunning} name="eqpCode" placeholder={t("@COL_EQP_CODE")} mapCode="eqp"/> {/* 설비코드 */}
             </div>
             <div style={{ minWidth: "250px" }}>
              <Input name="eqpName" placeholder= {t("@COL_EQP_NAME")} disabled={Boolean(isRunning)} /> {/* 설비명 */}
             </div> 
             <div>
              <Label htmlFor="type" className="form-label">
              {`${t("@COMMUNICATION_STATUS")}:`} {/* 통신상태 */}
              </Label>
             </div> 
             <div style={{ minWidth: "150px" }}>
              <select name="commStatus" className="form-select" defaultValue={""} disabled={Boolean(isRunning)}>
               <option value="">Total</option>
               <option value="run">{t("@NORMAL")}</option> {/* 정상 */}
               <option value="failure">{t("@COMMUNICATIONS_FAILURE")}</option> {/* 통신장애 */}
               <option value="down">{t("@DOWN")}</option> {/* 다운 */}
              </select>
             </div>
            </div>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
         <div style={{height:"120px",display:"flex"}}>
          <Col style={{marginRight:"2.5px"}}>
           <Card style={{ height: "100%", borderColor: "#babfc7" }}>
            <CardHeader style={{backgroundColor: "#F8F8F8",borderBottom: "1px solid #babfc7",fontWeight: "bolder"}}>
             {`${t("@COL_EQUIPMENT")}${t("@COMMUNICATION_STATUS")}`}{/*설비 통신상태*/}
            </CardHeader>
            <CardBody>
             {!visiable ? ("") : (
              <div style={{width:"100%",height:"100%", display:"flex",flexDirection:"column"}}>
               <div style={{display:"flex",justifyContent:"space-around",flex:1}}>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                 <div style={{fontSize:"15px"}}>{`${t("@TOTAL")}:`} </div>{/*전체*/}
                 <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.total} EA`}</div>
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                 <div style={{fontSize:"15px",color: "#1B9C85"}}>{`${t("@NORMAL")}:`} </div>{/*정상*/}
                 <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.run} EA`}</div>
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                 <div style={{fontSize:"15px",color: "#FFB84C",}}>{`${t("@COMMUNICATIONS_FAILURE")}:`} </div>{/*통신장애*/}
                 <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.fail} EA`}</div>
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                 <div style={{fontSize:"15px",color: "#FF0060",}}>{`${t("@DOWN")}:`} </div>{/*다운*/}
                 <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.down} EA`}</div>
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
                 <div style={{fontSize:"15px"}}>{`${t("@UNCOMMUNICATED")}:`} </div>{/*미통신*/}
                 <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.isnull} EA`}</div>
                </div>
               </div>
               <div style={{display:"flex",justifyContent:"space-around",flex:1}}>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                  <div style={{width:"25px",height:"10px", backgroundColor:"#141E461a"}} />
                  <div style={{fontSize:"12px",fontWeight:500,marginLeft:".5rem"}}>{`2차 ${t("@COL_EQUIPMENT")}`} </div>{/*2차 설비*/}
                </div>
                  <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                  <div style={{fontSize:"12px"}}>{`(2 ~ 5${t("@MINUTE")} ${t("@COMMUNICATION_INTERRUPTION")})`}</div>{/*2 ~ 5 분 통신중단*/}
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                  <div style={{fontSize:"12px"}}>{`(5 ${t("@MINUTE")} ${t("@MORE")} ${t("@COMMUNICATION_INTERRUPTION")})`}</div>{/*5 분 이상 통신중단*/}
                </div>
                <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
                  <div style={{fontSize:"12px"}}>( - )</div>
                </div>
               </div>
              </div>)}
             </CardBody>
           </Card>
          </Col>
          <Col style={{marginLeft:"2.5px"}}>
           <Card style={{ height: "100%", borderColor: "#babfc7" }}>
           <CardHeader style={{backgroundColor: "#F8F8F8",borderBottom: "1px solid #babfc7",fontWeight: "bolder"}}>{`DAS ${t("@COMMUNICATION_STATUS")}`}</CardHeader>{/*DAS 통신상태*/}
           <CardBody>
           {!visiable ? ("") : (
            <div style={{width:"100%",height:"100%", display:"flex",flexDirection:"column"}}>
             <div style={{display:"flex",justifyContent:"space-around",flex:1}}>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
               <div style={{fontSize:"15px"}}>{`${t("@TOTAL")}:`} </div>{/*전체*/}
               <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.dasTotal} EA`}</div>
              </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
               <div style={{fontSize:"15px",color: "#1B9C85"}}>{`${t("@NORMAL")}:`} </div>{/*정상*/}
               <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.dasRun} EA`}</div>
              </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
               <div style={{fontSize:"15px",color: "#FFB84C",}}>{`${t("@COMMUNICATIONS_FAILURE")}:`} </div>{/*통신장애*/}
               <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.dasFail} EA`}</div>
              </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
               <div style={{fontSize:"15px",color: "#FF0060",}}>{`${t("@DOWN")}:`} </div>{/*다운*/}
               <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.dasFail} EA`}</div>
              </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center", fontWeight:"bold"}}>
               <div style={{fontSize:"15px"}}>{`${t("@UNCOMMUNICATED")}:`} </div>{/*미통신*/}
               <div style={{fontSize:"15px",fontWeight:500,marginLeft:".5rem"}}>{`${statusCnt.dasIsnull} EA`}</div>
              </div>
             </div>
             <div style={{display:"flex",justifyContent:"space-around",flex:1}}>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
              </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
               </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
               <div style={{fontSize:"12px"}}>{`(2 ~ 5${t("@MINUTE")} ${t("@COMMUNICATION_INTERRUPTION")})`}</div>{/*2 ~ 5 분 통신중단*/}
               </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
               <div style={{fontSize:"12px"}}>{`(5 ${t("@MINUTE")} ${t("@MORE")} ${t("@COMMUNICATION_INTERRUPTION")})`}</div>{/*5 분 이상 통신중단*/}
               </div>
              <div style={{flex:1,display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
               <div style={{fontSize:"12px"}}>( - )</div>
               </div>
             </div>
            </div>)}
            </CardBody>  
           </Card>
          </Col>
         </div>
         <div style={{height: "calc(100% - 130px)"}}>
          <GridBase
            ref={gridRef}
            columnDefs={CommunicationStatusDefs()}
            tooltipShowDelay={0}
            tooltipHideDelay={1000}
            suppressRowClickSelection={true}
            singleClickEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            onGridReady={() => setList([])}
            onCellValueChanged={handleCellValueChanged}
            getRowStyle={getRowStyle}
          />
         </div>
        </Row>
      </ListBase>
    </>
  );
};

export default CommunicationStatusList;
