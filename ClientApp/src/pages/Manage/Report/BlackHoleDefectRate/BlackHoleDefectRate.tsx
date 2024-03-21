import moment from "moment";
import { useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import AutoCombo from "../../../../components/Common/AutoCombo";
import { Button, Col, Input, Modal, Row } from "reactstrap";
import GridBase from "../../../../components/Common/Base/GridBase";
import {
  BlackHoleNgImgList,
  BlackHoleNglist,
} from "./BlackHoleDefectRateDefs";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../../../common/api";
import style from "./BlackHoleDefect.module.scss";
import BatchMinMaxChart from "./BatchMinMaxChart";
import PnlMinMaxChart from "./PnlMinMaxChart";
import BatchDefectChart from "./BatchDefectChart";
import PnlDefectChart from "./PnlDefectChart";
import { CellClickedEvent } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import WorkCenterEqp from "../../../../components/Common/WorkCenterEqp";

const BlackHoleDefectRate = () => {
  const { t } = useTranslation();
  const searchedData = useRef<any>({});

  const [searchRef, getSearch] = useSearchRef();
  const [ngimgRef, setNgImgList] = useGridRef();
  const [ngListRef, setNgList] = useGridRef();

  const batchMinMaxRef = useRef<any>();
  const batchDefectRef = useRef<any>();
  const pnlMinMaxRef = useRef<any>();
  const pnlDefectRef = useRef<any>();

  const [modal_center, setmodal_center] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null | undefined = null;
  let image = new Image();
  const errorInfo = useRef<any>();

  const defaultData = useRef<any>({});

  const searchHandler = async (_?: Dictionary) => {

    const { data } = await api<any>(
      "get",
      "BlackHoleDefectRate/chartdata",
      getSearch()
    );

    if (data) {
      searchedData.current = getSearch();
      batchMinMaxRef.current.setChart(data[0], getSearch()["fjd"]);
      batchDefectRef.current.setChart(data[1], getSearch()["fjd"]);
      pnlMinMaxRef.current.setChart([], getSearch()["fjd"]);
      pnlDefectRef.current.setChart([], getSearch()["fjd"]);
    }
  };

  const selectRollId = async (th:"minmaxavg"|"defect" , d:any ) => {
   const reqData = {...searchedData.current, ...d};
   if(th === "minmaxavg")
   {
    const { data } = await api<any>("get","BlackHoleDefectRate/minmaxavg",{
     rollId: reqData["roll_id"],
     fjd : reqData["fjd"]
    });
    if(data)
    {
     pnlMinMaxRef.current.setChart(data, reqData["fjd"], reqData["roll_id"]);
    }
   }
   else if(th === "defect")
   {
    const {data} = await api<any>("get","BlackHoleDefectRate/peneldefect", {
      rollId: reqData["roll_id"],
      fjd : reqData["fjd"]
    });
    if(data)
    {
     pnlDefectRef.current.setChart(data[0], reqData["fjd"], reqData["roll_id"]);
     setNgImgList(data[1].sort((a:any,b:any)=> new Date(a["time"]).getTime() - new Date(b["time"]).getTime()));
     defaultData.current = data[1];
    } 
   }
  }

  const PnlSelect = useCallback((e:any)=> {
   const filte = [...defaultData.current].filter((f:any)=>f.panel_id === e.panel_id);
   setNgImgList(filte.sort((a:any,b:any)=> new Date(a["time"]).getTime() - new Date(b["time"]).getTime()));
  },[ngimgRef.current])

  const drawImage = (
    ctx: CanvasRenderingContext2D | null | undefined,
    img: HTMLImageElement
  ) => {
    ctx?.drawImage(img, 0, 0);
  };

  const tog_center = (e: any) => {
    setmodal_center(!modal_center);

    image.onload = () => {
      canvas = canvasRef.current!;
      context = canvas.getContext("2d");

      canvasRef.current!.width = image.width;
      canvasRef.current!.height = image.height;

      drawImage(context, image);
    };

    image.src = "http://172.20.1.14/downloads" + e.filelocation;
  };

  const errorClick = (e: CellClickedEvent) => {
    if (e.data) {
      //setNgdata(e.data);
      tog_center(e.data);
      errorInfo.current = e.data;
    }
  };


  const onSplit = async(startPanel:string,workorder:string,operSeqNo:number,startNum:number,endNum:number,s:string,rollId:string,operCode:string) =>{
    //startPanel:string,workorder:string,operSeqNo:string,startNum:number,endNum:number,s:string,rollId:string,operCode:string

    const blackHole = await api<Dictionary[]>("post", "panel/panelitemcontroll", { 
      startPanel
      ,workorder
      ,operSeqNo
      ,startNum
      ,endNum
      ,s
     });
    const chemJudge = await api<Dictionary[]>("post", "panel/panelrealtimecontroll", { 
      startPanel
      ,workorder
      ,startNum
      ,endNum
     });
    const aoiTotal = await api<Dictionary[]>("post", "panel/panelrollmappingconroll", { 
      rollId
      ,workorder
      ,operSeqNo
      ,operCode
      ,startPanel
      ,startNum
      ,endNum
     });

     Promise.allSettled([blackHole,chemJudge,aoiTotal]).then((results: any) => {console.log("Ttttttttt", results)});
  }

  return (
    <>
      <ListBase
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker
                  name="fromDt"
                  defaultValue={moment().add(-3, "month").toDate()}
                  placeholderText={t("@SEARCH_START_DATE")} 
                  required={true}
                />{/* 조회시작 */}
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker
                  name="toDt"
                  placeholderText={t("@SEARCH_END_DATE")} 
                  required={true}
                />{/* 조회종료 */}
              </div>
              <div>
                <AutoCombo
                  required={true}
                  name="itemCode"
                  sx={{ minWidth: "200px" }}
                  placeholder={t("@COL_ITEM_CODE")}
                  mapCode="item"
                /> {/* 제품코드 */}
              </div>
              <div style={{ minWidth: "150px" }}>
                <select
                  required
                  name="fjd"
                  className="form-select"
                  defaultValue={""}
                >
                  <option value="">{t("@SELECT_ITEM")}</option> {/* 항목선택 */}
                  <option value="Residue">Residue</option>
                  <option value="HoleSize">HoleSize</option>
                </select>
              </div>
              <div style={{ minWidth: 250 }}>
                <Input name="rollNo" type="text" className="form-control" placeholder="Roll No" />
              </div>
              <div style={{ minWidth: 250 }}>
                <Input name="workorder" type="text" className="form-control" placeholder="BATCH(WORKORDER)" />
              </div>
              <div>
              {/* //startPanel:string,workorder:string,operSeqNo:number,startNum:number,endNum:number,s:string,rollId:string,operCode:string */}
                {/* <Button onClick={async()=> await onSplit("SL003-231011-002","VCT231009056-00011",30,1,50,"+","MB231006-4325","L07040")} /> */}
              </div>
            </div>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={9}>
            {/* <div style={{height:"35px"}}>
            CHARTS
          </div> */}
            <div className={style.layout}>
              <div className={style.chartsLayout}>
                <div className={style.chart}>
                  <BatchMinMaxChart
                    ref={batchMinMaxRef}
                    selectBatch={selectRollId}
                  />
                </div>
                <div className={style.chart}>
                  <PnlMinMaxChart
                    ref={pnlMinMaxRef}
                    title="HOLE SIZE TREND"
                    color="#FF1700"
                  />
                </div>
                <div className={style.chart}>
                  <BatchDefectChart
                    ref={batchDefectRef}
                    selectBatch={selectRollId}
                  />
                </div>
                <div className={style.chart}>
                  <PnlDefectChart ref={pnlDefectRef} PnlSelect={PnlSelect} />
                </div>
              </div>
            </div>
          </Col>
          <Col style={{ width: "100%" }}>
            {/* <Row style={{ height: "49%", marginBottom: "0.5rem" }}>
              <GridBase
                ref={ngListRef}
                columnDefs={BlackHoleNglist()}
                onGridReady={() => {
                  setNgList([]);
                }}
              />
            </Row> */}
            <Row style={{ height: "100%" }}>
              <GridBase
                ref={ngimgRef}
                columnDefs={BlackHoleNgImgList()}
                onCellClicked={errorClick}
                onGridReady={() => {
                  setNgImgList([]);
                }}
              />
            </Row>
          </Col>
        </Row>
      </ListBase>

      <Modal
        size="lg"
        isOpen={modal_center}
        toggle={(e: any) => {
          tog_center(e);
        }}
        centered={true}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">{"DETAIL IMAGE"}</h5>
          <button
            type="button"
            onClick={() => {
              setmodal_center(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body d-flex" style={{width:"100%",height:"100%"}}>
          <div style={{flex:1}}>
            <canvas ref={canvasRef} />
          </div>
          <div style={{flex:1, width:"100%",height:"200px",fontSize:"1.2rem" ,display:"flex",flexDirection:"column"}}>
            <div style={{width:"100%",display:"flex", borderBottom:"1px dashed black"}}>
              <div style={{flex:1,fontWeight:"bold"}}>PNL BarCode</div>
              <div style={{flex:2}}>{`: ${errorInfo?.current && errorInfo?.current["panel_id"]}`}</div>
            </div>
            <div style={{width:"100%",display:"flex", borderBottom:"1px dashed black"}}>
              <div style={{flex:1,fontWeight:"bold"}}>NUM</div>
              <div style={{flex:2}}>{`: ${errorInfo?.current && errorInfo?.current["num"]}`}</div>
            </div>
            <div style={{width:"100%",display:"flex", borderBottom:"1px dashed black"}}>
              <div style={{flex:1,fontWeight:"bold"}}>FJD</div>
              <div style={{flex:2}}>{`: ${errorInfo?.current && errorInfo?.current["fjd"]}`}</div>
            </div>
            <div style={{width:"100%",display:"flex", borderBottom:"1px dashed black"}}>
              <div style={{flex:1,fontWeight:"bold"}}>WD</div>
              <div style={{flex:2}}>{`: ${errorInfo?.current && errorInfo?.current["wd"]}mm`}</div>
            </div>
            <div style={{width:"100%",display:"flex", borderBottom:"1px dashed black"}}>
              <div style={{flex:1,fontWeight:"bold"}}>CRT</div>
              <div style={{flex:2}}>{`: ${errorInfo?.current && errorInfo?.current["crt"]}%`}</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BlackHoleDefectRate;
