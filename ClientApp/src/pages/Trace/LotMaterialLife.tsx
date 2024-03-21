import { CellDoubleClickedEvent, RowClassParams, RowHeightParams } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { contentType, Dictionary } from "../../common/types";
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
import { alertBox } from "../../components/MessageBox/Alert";
import { downloadFile, yyyymmddhhmmss } from "../../common/utility";
import { showProgress } from "../../components/MessageBox/Progress";


const LotMaterialLife = () => {
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


  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다. 
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "lotmaterial/getlist", { "workorder": lotIdRef.current.value.trim(), 'isExcel': true });
    downloadFile(`Material_${lotIdRef.current.value.trim()}_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  };

  const searchHandler = async (_?: Dictionary) => {
    lotRef.current.searchLot(null, lotIdRef.current.value.trim());

    api("get", "lotmaterial/getlist", { "workorder": lotIdRef.current.value.trim() }).then((result: Dictionary) => {

      console.log(result)
      if(result.data){
        //VCN230721182-00047
        const colList : Dictionary[] = [
            {
              headerName: "4MOperSeqNo",
              field: `oper_seq_no_4m`,
              width : 100,
            },
            {
              headerName: "4MOperName",
              field: `oper_name_4m`,
              width : 100,
            },
            {
              headerName: "Depth",
              field: `depth`,
              width : 350,
              cellStyle: (params: any) => {
                // console.log(params)
                if(!params.value.includes('┗')){
                  return {
                    "backgroundColor": "#eeffee",
                    fontWeight: "bold",
                  };
                }
              }
            },
            {
              headerName: "level",
              field: `level`,
              width : 60,
            },
            {
              headerName: "type",
              field: `type`,
              width : 100,
            },
            {
              headerName: "Material BATCH",
              field: `material_lot`,
              width : 250,
            },
            {
              headerName: "oper_seq_no",
              field: `oper_seq_no`,
              width : 100,
            },
            {
              headerName: "oper_desc",
              field: `oper_desc`,
              width : 150,
            },
            {
              headerName: "workcenter",
              field: `workcenter`,
              width : 200,
            },
            {
              headerName: "material_code",
              field: `material_code`,
              width : 250,
            },
            {
              headerName: "material_name",
              field: `material_name`,
              width : 250,
            },
            {
              headerName: t("@QTIME"), //"유수명",
              field: `expired_dt`,
              width : 150,
            },

        ];


        //??
        // ┳1
        // ┃┣2
        // ┃┗2
        // ┃ ┗3
        // ┃┣2
        // ┣━━┳━━2
        // ┃  ┗━━
        // ┗━━━━━
        

        //  ┣ level 0일때
        
        //  ┃  level 0번이 아닌 것의 -2

        //  ┃  level-1이 본인보다 클때

        //  ┗ 
        

        gridRef.current!.api.setColumnDefs(colList);
      }

      // console.log(result.data[2]);
      const rowList : any[] = [];

      const arr = result.data;
      console.log('arr', arr)

          
      arr.map((data : any) => {
        console.log(data)
        const depth = Number(data["level"]) !== 0 ? '　　　'.repeat(Number(data["level"])) + '┗━' : '';
        const tempRow : any = {};
        tempRow.depth = depth + data["materialLot"];
        tempRow.level = `${Number(data["level"])}`;
        tempRow.oper_seq_no_4m = data["operSeqNo4M"];
        tempRow.oper_name_4m = data["operName4M"];
        tempRow.type = data["type"];
        tempRow.create_dt = data["createDt"];
        tempRow.material_lot = data["materialLot"];
        tempRow.material_code = data["materialCode"];
        tempRow.oper_seq_no = data["operSeqNo"];
        tempRow.oper_desc = data["operDesc"];
        tempRow.workcenter = data["workcenter"];
        tempRow.maker = data["maker"];
        tempRow.material_name = data["materialName"];
        tempRow.expired_dt = data["expiredDt"];


        rowList.push(tempRow);
        // console.log(tempRow);
      })

      setList(rowList);

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
            postButtons={
              <>
                <Button
                  type="button"
                  color="outline-primary"
                  onClick={excelHandler}
                >
                  <i className="mdi mdi-file-excel me-1"></i> EXCEL
                </Button>
              </>
            }            
          >
            <Row>
              <Col style={{ minWidth: "280px" }}>
                <Input innerRef={lotIdRef} name="panelId" type="text" className="form-control" placeholder="BATCH(WORKORDER)" required={true} />
              </Col>
              <Col style={{ maxWidth: "150px" }}>

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
              <Col md={12} className="pb-2">
                <LotInfo 
                  ref={lotRef}                  
                />
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

export default LotMaterialLife;