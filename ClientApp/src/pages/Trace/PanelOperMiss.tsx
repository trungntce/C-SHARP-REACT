import { CellDoubleClickedEvent, RowClassParams, RowHeightParams } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import PanelSearch from "./PanelSearch";
import { traceDefs } from "./TraceDefs";
import style from "./Trace.module.scss";
import LotInfo from "./LotInfo";
import { rollDefs } from "./TraceRollDefs";
import api from "../../common/api";
import { layupDefs } from "./TraceLayupDefs";
import { pieceDefs } from "./TracePieceDefs";
import { boxDefs } from "./TraceBoxDefs";
import PieceSearch from "./PieceSearch";
import ParamChart from "./ParamChart";
import RecipeChart from "./RecipeChart";
import { useTranslation } from "react-i18next";


const PanelOperMiss = () => {
  const { t } = useTranslation();
  // const lotRef = useRef<any>();

  const lotRef = useRef<any>();
  
  // const panelIdRef = useRef<any>();
  const lotIdRef = useRef<any>();


  // const panelSearchRef = useRef<any>();
  // const pieceSearchRef = useRef<any>();
  // const paramChartRef = useRef<any>();
  // const recipeChartRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef,  setList] = useGridRef();
  // const [rollGridRef, setRollList] = useGridRef();
  // const [layupGridRef, setLayupList] = useGridRef();
  // const [pcsGridRef, setPcsList] = useGridRef();
  // const [boxGridRef, setBoxList] = useGridRef();

  const[colDef,setColDef]= useState<any[]>([])

  // const { refetch } = useApi("trace", getSearch, gridRef); 
  

  const searchHandler = async (_?: Dictionary) => {
    lotRef.current.searchLot(null, lotIdRef.current.value.trim());
    
    api("get", "panelopermiss/getlist", { "workorder": lotIdRef.current.value.trim() }).then((result: Dictionary) => {
      if(result.data){
        // console.log(result.data)
        const colList : Dictionary[] = [
          {
            headerName: "PNL ID",
            field: "panel_id",
            maxWidth: 250,     
            cellRenderer: (d: any) => {
              const link = `/trace/${d.value}`;
              return (
                <>
                  <span className="detail-cell">
                    <a href={link}>
                      <span className="detail-cell-panel">{d.value}</span>
                    </a>
                  </span>
                </>
              )
            }     
          }   
        ];
        result.data[0].map((col : any) => {
          colList.push({
            headerName: `${col["oper"]}`,
            field: `${col["oper_seq_no"]}`,
            width: 40,
            cellStyle: (params: any) => {
              // console.log(params.data)
              if(params.value === 'Y'){
                return {
                  fontSize: "0px",
                  "background-color": "#00ff00",
                  fontWeight: "bold",
                  border:"1px solid gray"
                };
              }else if(params.value === 'N'){
                return {
                  fontSize: "0px",
                  "background-color": "#ffffff",
                  fontWeight: "bold",
                  border:"1px solid gray"
                };
              }else if(params.value === 'I'){
                return {
                  fontSize: "0px",
                  "background-color": "#ff0000",
                  fontWeight: "bold",
                  border:"1px solid gray"
                };
              }else if(params.value === 'D'){
                return {
                  fontSize: "0px",
                  "background-color": "#000000",
                  fontWeight: "bold",
                  border:"1px solid gray"
                };
              }
        
              }
          })
        });  
        gridRef.current!.api.setColumnDefs(colList);
      }

      // console.log(result.data[2]);
      const rowList : any[] = [];

      const arr = result.data[2];

      const maxOper = result.data[2][result.data[2].length-1].oper_seq_no;

      let tempPanelId = '';
      let tempRow : any = {};
      

      // arr.map((data : any) => {
      //   if(data["panel_id"] !== tempPanelId){
      //     tempRow["panel_id"] = data["panel_id"];
      //   }

      //   tempRow[`${data["oper_seq_no"]}`] = data["panel_info"];

      //   if(data["oper"] === maxOper){
      //     rowList.push(tempRow);
      //     tempRow = {};
      //   }
        
      // })
      arr.map((data : any) => {
        if(data["panel_id"] !== tempPanelId){
          tempRow["panel_id"] = data["panel_id"];
        }

        tempRow[`${data["oper_seq_no"]}`] = data["panel_info"];

        if(data["oper_seq_no"] === maxOper){
          rowList.push(tempRow);
          tempRow = {};
        }
        
      })
      setList(rowList);
      
    
      // console.log(rowList)

      setList(rowList);

       
      // const tttt = [...result.data[2]].reduce((pre:any,cur:any)=>{
      //   pre[cur.oper_seq_no] 
      //   ? pre[cur.oper_seq_no].push(cur) 
      //   : pre[cur.oper_seq_no] = [cur]
      // return pre;
      // },{})
      // console.log("eeeeeeeeeeeee",tttt)

    });

    // refetch().then((result: Dictionary) => {
    //   if(result.data){
    //     const list: Dictionary[] = result.data;

    //     setList(list);

    //     const headerRow: Dictionary = {
    //       recipeJudge: "",
    //       paramJudge: "",
    //       spcJudge: "",
    //     }
        
    //     if(list.some(x => x.recipeJudge == "N")){
    //       headerRow.recipeJudge = "N";
    //     }else if(list.some(x => x.recipeJudge == "O")){
    //       headerRow.recipeJudge = "O";
    //     }

    //     if(list.some(x => x.paramJudge == "N")){
    //       headerRow.paramJudge = "N";
    //     }else if(list.some(x => x.paramJudge == "O")){
    //       headerRow.paramJudge = "O";
    //     }

    //     if(list.some(x => x.spcJudge == "N")){
    //       headerRow.spcJudge = "N";
    //     }else if(list.some(x => x.ipqcStatus == "OK")){
    //       headerRow.spcJudge = "O";
    //     }

    //     if(headerRow.recipeJudge == "N" || headerRow.paramJudge == "N" || headerRow.spcJudge == "N"){
    //       headerRow.totalJudge = "N";
    //     }else if(headerRow.recipeJudge == "O" && headerRow.paramJudge == "O" && !headerRow.spcJudge){ // null 인 경우가 O로 나옴
    //       headerRow.totalJudge = "O";
    //     }

    //     gridRef.current!.api.setPinnedTopRowData([headerRow]);
    //   }
    // });

    // rollGridRef.current!.api.showLoadingOverlay();

    

    // api("get", "trace/rollmap", { "panelId": panelIdRef.current.value }).then((result: Dictionary) => {
    //   if(result.data){
    //     setRollList(result.data[0]);
    //   }
    // });

    // layupGridRef.current!.api.showLoadingOverlay();
    // api("get", "trace/layup", { "panelId": panelIdRef.current.value }).then((result: Dictionary) => {
    //   if(result.data)
    //   setLayupList(result.data);
    // });

    // pcsGridRef.current!.api.showLoadingOverlay();
    // api("get", "trace/panelpiecemap", { "panelId": panelIdRef.current.value }).then((result: Dictionary) => {
    //   if(result.data)
    //   setPcsList(result.data);
    // });
  };

  // const panelSelectedHandler = (panel: Dictionary) => {
  //   panelIdRef.current.value = panel.panelId;
  //   console.log();
  //   searchHandler();
  // }

  // const getRowHeight = useCallback((params: RowHeightParams) => {
  //   if(params.data.panelId)
  //     return 60;
  //   else
  //     return 35;
  // }, []);

  useEffect(() => {
    
  }, []);

  return (
    <>
      <ListBase
        className={style.traceWrap}
        buttons={[]}
        editHandler={() => {
        }}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}            
          >
            <Row>
              <Col style={{ minWidth: "280px" }}>
                <Input innerRef={lotIdRef} name="panelId" type="text" className="form-control" placeholder="LOT(WORKORDER)" required={true} />
              </Col>
              {/* <Col style={{ maxWidth: 180 }}>
                <Button type="button" color="info" style={{ width: 170 }} onClick={() => {
                  panelSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  판넬 바코드 검색
                </Button>
              </Col>
              <Col>
                <Button type="button" color="success" style={{ width: 220 }} onClick={() => {
                  pieceSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  PCS/SHEET/TRAY/BOX 검색
                </Button>       
              </Col>
              <Col>
                <select name="operType" className="form-select">
                  <option value="">전체공정</option>
                  <option value="B">고속스캔 공정</option>
                  <option value="R">레시피/파라미터 공정</option>
                </select>
              </Col> */}
            </Row>
          </SearchBase>
        }
      >
        <Row className={style.traceGridContainer} style={{ height: "100%" }}>
        {/* <Row style={{ height: "calc(100% - 100px)" }}> */}
        <Row style={{ height: "100px" }}>
              <Col md={8} className="pb-2">
                <LotInfo 
                  ref={lotRef}                  
                />
              </Col>

              <Col md={4} className="pb-2">
                <Card style={{ height: "85%"}}>
                  <CardHeader>
                    {t("@COL_MARKING_INFORMATION")}
                  </CardHeader>
                    <CardBody>
                        <>
                          <Row>
                            <Row>
                              <Col md={6} className="text-truncate" style={{display:'flex', alignItems:'center'}}>
                                <Label>{t("@COL_NORMAL_REGISTRATION")} : &nbsp;</Label>
                                <div style={{ width: '20px', height:'20px', marginLeft:'20px', marginTop:'-5px', backgroundColor:'#00ff00', border : '2px solid gray'}}></div>
                              </Col>
                              <Col md={6} className="text-truncate" style={{display:'flex', alignItems:'center'}}>
                                <Label>{`${t("@COL_UNREGISTERED")} PNL`} : &nbsp;</Label>
                                <div style={{ width: '20px', height:'20px', marginLeft:'11px', marginTop:'-5px', backgroundColor:'#ffffff', border : '2px solid gray'}}></div>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6} className="text-truncate" style={{display:'flex', alignItems:'center'}}>
                                <Label>{`${t("@COL_INTERLOCK")} PNL`} : &nbsp;</Label>
                                <div style={{ width: '20px', height:'20px', marginLeft:'7px', marginTop:'-4px', backgroundColor:'#ff0000', border : '2px solid gray'}}></div>
                              </Col>
                              <Col md={6} className="text-truncate" style={{display:'flex', alignItems:'center'}}>
                                <Label>{`${t("@COL_DEFECT")} PNL`} : &nbsp;</Label>
                                <div style={{ width: '20px', height:'20px', marginLeft:'11px', marginTop:'-4px', backgroundColor:'#000000', border : '2px solid gray'}}></div>
                              </Col>  
                            </Row>
                            
                          </Row>
                          {/* <Row>
                            <Col md={3} className="text-truncate">
                              <Label>Release:</Label> {'dateFormat(lot.jobReleaseDate)'}
                            </Col>
                            <Col md={4} className="text-truncate">
                              <Label>고객사:</Label> [{'lot.vendorCode'}] {'lot.vendorFullName'}
                            </Col>
                            <Col md={3} className="text-truncate">
                              <Label>PCS/Release QTY:</Label> {'lot.jobUomQty'}/{'lot.releaseQty'}
                            </Col>
                            <Col md={2} className="text-truncate">
                              <Label>PNL QTY:</Label> {'lot.jobPnlQty'}
                            </Col>
                          </Row> */}
                        </>
                    </CardBody>
                  </Card>
              </Col>
            </Row>
        <Row style={{ height: "calc(100% - 100px)" }}>
              <Col>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={gridRef}
                    columnDefs={colDef}
                    rowMultiSelectWithClick={false}
                    suppressRowClickSelection={true}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                    onGridReady={() => {
                      setList([]);
                    }}
                  />
                </div>              
              </Col>
            </Row>
          {/* <Col md={9}>
            <Row style={{ height: "100px" }}>
              <Col className="pb-2">
                <LotInfo 
                  // ref={lotRef}
                />
              </Col>
            </Row>
            
          </Col> */}
          {/* <Col md={3}>
            <div style={{ height: "100%" }}>
              <Row className="pb-2" style={{ height: "25%" }}>
                <Col>
                  <GridBase
                    ref={rollGridRef}
                    columnDefs={rollDefs({})}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setRollList([]);
                    }}
                    rowClassRules={{
                      'panel-row': (param: RowClassParams) => { 
                        return !!param.data.panelId;
                      },
                      'not-panel-row ': (param: RowClassParams) => { 
                        return !param.data.panelId 
                      },
                    }}
                  />
                </Col>
              </Row>
              <Row className="pb-2"  style={{ height: "25%" }}>
                <Col>
                  <GridBase
                    ref={layupGridRef}
                    columnDefs={layupDefs()}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setLayupList([]);
                    }}
                    rowClassRules={{
                      'main-row': (param: RowClassParams) => { 
                        return param.data.mainYn == 'Y';
                      },
                      'not-main-row ': (param: RowClassParams) => { 
                        return param.data.mainYn != 'Y';
                      },
                    }}
                  />
                </Col>
              </Row>
              <Row className="pb-2"  style={{ height: "30%" }}>
                <Col>
                  <GridBase
                    ref={pcsGridRef}
                    columnDefs={(() => {
                      return pieceDefs().filter(x => x.headerClass != "multi4m");
                    })()}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setPcsList([]);
                    }}
                  />
                </Col>
              </Row>
              <Row className="pb-2"  style={{ height: "20%" }}>
                <Col>
                  <GridBase
                    ref={boxGridRef}
                    columnDefs={boxDefs()}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setBoxList([]);
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Col> */}
        </Row>
      </ListBase>

      {/* <PanelSearch
        ref={panelSearchRef}
        onPanelSelected={panelSelectedHandler}
      />

      <PieceSearch
        ref={pieceSearchRef}
        onPanelSelected={panelSelectedHandler}
      />

      <ParamChart
        ref={paramChartRef}
        initHandler={() => {}}
      />

      <RecipeChart
        ref={recipeChartRef}
        initHandler={() => {}}
      /> */}
    </>
  );
};

export default PanelOperMiss;















