import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Row, Col, Button, Input, Label, Modal, ModalHeader, ModalBody, Form, Card, CardHeader, CardBody, InputGroup, InputGroupText, Table, UncontrolledTooltip, UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { Dictionary } from "../../../common/types";
import { currencyFormat, devideFormat, executeIdle, percentFormat } from "../../../common/utility";
import { alertBox } from "../../../components/MessageBox/Alert";
import { ngTypes } from "./AOIVRSDefs";
import { ReverseMaxtrix } from "./EMappingLayoutList";

const EMappingUnionView = forwardRef((props: any, ref: any) => {  
  const [pcsDic, setPcsDic] = useState<ReverseMaxtrix>({});
  const [hv, setHV] = useState<number[]>([0, 0]);
  const ngDic = useRef<Dictionary>({});
  const totalRow = useRef<Dictionary | undefined>({});
  const aoiMax = useRef<number>(0);
  const bbtMax = useRef<number>(0);
  const blackholeMax = useRef<number>(0);
  const aoiDetail = useRef<Dictionary[]>();
  const bbtDetail = useRef<Dictionary[]>();
  const blackholeDetail = useRef<Dictionary[]>();

  const findPcs = (y: number, x:number) => {
    const list = getkeyList();

    for(let i in list){
      const pcsIndex = list[i];
      const xy = pcsDic[pcsIndex];
      if(xy["x"] == x && xy["y"] == y){
        return { index: pcsIndex, xy: xy };
      }
    }
  }

  const getkeyList = () => {
    return Object.keys(pcsDic).map(x => parseInt(x, 10));
  }

  useImperativeHandle(ref, () => ({ 
    setLayout: (row: Dictionary) => {      
      setPcsDic(JSON.parse(row.pcsJson));

      const h = parseInt(row.pcsPerH);
      const v = parseInt(row.pcsPerV);

      const list = getkeyList();

      for (let i = list.length - 1; i >= 0; i--) {
        const pcsIndex = list[i];
        const pcs = pcsDic[pcsIndex];

        if (pcs.x! >= h || pcs.y! >= v)
          delete pcsDic[pcsIndex];
      }

      setHV([h, v]);
    },
    setNgDic: (dic: Dictionary) => {
      ngDic.current = dic;
    },
    setTotal: (row: Dictionary, aoi: Dictionary[], bbt: Dictionary[], blackhole: Dictionary[], searchParam: Dictionary) => {
      totalRow.current = row;
      aoiDetail.current = searchParam.aoiShow ? aoi : [];
      bbtDetail.current = searchParam.bbtShow ? bbt : [];
      blackholeDetail.current = searchParam.blackholeShow ? blackhole : [];
      
      const dic = {...pcsDic};

      for(let key in dic){
        if(dic[key]){
          dic[key].aoi = undefined;
          dic[key].aoiTotal = undefined;
          dic[key].bbt = undefined;
          dic[key].bbtTotal = undefined;
          dic[key].blackhole = undefined;
          dic[key].blackholeTotal = undefined;
        }
      }

      if(searchParam.aoiShow){
        const aoiList = ngDic.current["aoi"];
        if(aoiList?.length){
          aoiList.forEach((x: Dictionary) => {
            const pieceNo = x.pieceNo;
            if(dic[pieceNo]){
              dic[pieceNo].aoiTotal = (dic[pieceNo].aoiTotal ?? 0) + 1;
            }
          });
        }
      }

      if(searchParam.bbtShow){
        const bbtList = ngDic.current["bbt"];
        if(bbtList?.length){
          bbtList.forEach((x: Dictionary) => {
            const pieceNo = x.pieceNo;
            if(dic[pieceNo]){
              dic[pieceNo].bbtTotal = (dic[pieceNo].bbtTotal ?? 0) + 1;
            }
          });
        }
      }

      if(searchParam.blackholeShow){
        const blackholeList = ngDic.current["blackhole"];
        if(blackholeList?.length){
          blackholeList.forEach((x: Dictionary) => {
            const pieceNo = x.pieceNo;
            if(dic[pieceNo]){
              dic[pieceNo].blackholeTotal = (dic[pieceNo].blackholeTotal ?? 0) + 1;
            }
          });
        }
      }

      // 각 항목별 최소 최대값 계산해서 저장
      Object.values(dic).map(x => x).forEach(x => {
        aoiMax.current = Math.max(aoiMax.current, x.aoiTotal ?? 0);
        bbtMax.current = Math.max(bbtMax.current, x.bbtTotal ?? 0);
        blackholeMax.current = Math.max(blackholeMax.current, x.blackholeTotal ?? 0);
      });

      setPcsDic(dic);
    },
    setPanel: (row: Dictionary, aoi: Dictionary[], bbt: Dictionary[], blackhole: Dictionary[], searchParam: Dictionary) => {
      totalRow.current = undefined;
      aoiDetail.current = searchParam.aoiShow ? aoi : [];
      bbtDetail.current = searchParam.bbtShow ? bbt : [];
      blackholeDetail.current = searchParam.blackholeShow ? blackhole : [];

      const dic = {...pcsDic};

      for(let key in dic){
        if(dic[key]){
          dic[key].aoi = undefined;
          dic[key].aoiTotal = undefined;
          dic[key].bbt = undefined;
          dic[key].bbtTotal = undefined;
          dic[key].blackhole = undefined;
          dic[key].blackholeTotal = undefined;
        }
      }

      const aoiList = ngDic.current["aoi"]?.filter((x: Dictionary) => x.panelId == row.panelId && searchParam.aoiShow);
      if(aoiList?.length && aoiList[0].pieceNo){
        aoiList.forEach((x: Dictionary) => {
          const pieceNo = x.pieceNo;
          if(dic[pieceNo])
            dic[pieceNo].aoi = 1;
        });
      }

      const bbtList = ngDic.current["bbt"]?.filter((x: Dictionary) => x.panelId == row.panelId && searchParam.bbtShow);
      if(bbtList?.length && bbtList[0].pieceNo){
        bbtList.forEach((x: Dictionary) => {
          const pieceNo = x.pieceNo;
          if(dic[pieceNo])
            dic[pieceNo].bbt = 1;
        });
      }

      const blackholeList = ngDic.current["blackhole"]?.filter((x: Dictionary) => x.panelId == row.panelId && searchParam.blackholeShow);
      if(blackholeList?.length && blackholeList[0].pieceNo){
        blackholeList.forEach((x: Dictionary) => {
          const pieceNo = x.pieceNo;
          if(dic[pieceNo])
            dic[pieceNo].blackhole = 1;
        });
      }

      setPcsDic(dic);
    }
  }));

  const cellRender = (y: number, x:number) => {
    const pcs = findPcs(y, x);
    if(!pcs)
      return;

    const aoiList = aoiDetail.current?.filter(x => x.pieceNo == pcs.index);
    const bbtList = bbtDetail.current?.filter(x => x.pieceNo == pcs.index);
    const blackholeList = blackholeDetail.current?.filter(x => x.pieceNo == pcs.index);

    if(!totalRow.current )
      return (
        <>
          <span className="pcs-index">{ pcs.index }</span>
          <div className="ng-container"> 
            <div id={`emapping-popover-pcs-${pcs.index}`}>
              { (pcs.xy.aoi || pcs.xy.aoi && pcs.xy.bbt) && (<div className="pcs-aoi">A</div>) }
              { !pcs.xy.aoi && pcs.xy.bbt && (<div className="pcs-bbt">B</div>) }
              {/* { pcs.xy.aoi && pcs.xy.bbt && (<div className="pcs-aoi-bbt">AB</div>) } */}
            </div>
            { (pcs.xy.aoi || pcs.xy.bbt || pcs.xy.blackhole) && (
              <UncontrolledPopover 
                trigger="legacy"
                target={`emapping-popover-pcs-${pcs.index}`}
                className="emapping-popover-container"
              >
                <PopoverHeader>
                  검사 Detail
                </PopoverHeader>
                <PopoverBody>
                  { pcs.xy.aoi && (
                    <>
                      <Label className="label-aoi">AOI</Label>
                      <Table className="table table-bordered table-thead-tr-th-center">
                        <thead className="table-light">
                          <tr>
                            <th>불량명</th>

                            {ngTypes.map((x: Dictionary, i: number) => (
                              <React.Fragment key={i}>
                                { aoiList![0] && aoiList![0][x.field] ? (
                                <>
                                  <th>{x["headerName"]}</th>
                                </>
                              ) : "" }
                              </React.Fragment>
                            ))}   
                          </tr>
                        </thead>
                        <tbody>
                          {aoiList?.map((x: Dictionary, i: number) => (
                            <tr key={i}>
                              <th>수량</th>
                              {ngTypes.map((x: Dictionary, j: number) => (
                                <React.Fragment key={j}>
                                  { aoiList![0] && aoiList![0][x.field] ? (
                                  <>
                                    <th>{aoiList![0][x.field]}</th>
                                  </>
                                ) : "" }
                                </React.Fragment>
                              ))}   
                            </tr>
                          ))}                      
                        </tbody>
                      </Table>
                    </>
                  ) }
                  { !pcs.xy.aoi && pcs.xy.bbt && ( // aoi bbt 같이 안나오게 예외처리
                    <>
                      <Label className="label-bbt">BBT</Label>
                      <Table className="table table-bordered table-thead-tr-th-center">
                        <thead className="table-light">
                          <tr>
                            <th rowSpan={2}>Application</th>
                            <th colSpan={8}>불량(판정 기준)</th>
                          </tr>
                          <tr>
                            <td>4W</td>
                            <td>Aux</td>
                            <td>Both</td>
                            <td>C</td>
                            <td>ER</td>
                            <td>Open</td>
                            <td>SPK</td>
                            <td>Short</td>
                          </tr>
                        </thead>
                        <tbody>
                          {bbtList?.map((x: Dictionary, i: number) => (
                            <tr key={i}>
                              <td>{x["appName"]}</td>
                              
                              <td>{currencyFormat(x["4WCnt"])}</td>
                              <td>{currencyFormat(x["auxCnt"])}</td>
                              <td>{currencyFormat(x["bothCnt"])}</td>
                              <td>{currencyFormat(x["cCnt"])}</td>
                              <td>{currencyFormat(x["erCnt"])}</td>
                              <td>{currencyFormat(x["openCnt"])}</td>
                              <td>{currencyFormat(x["spkCnt"])}</td>
                              <td>{currencyFormat(x["shortCnt"])}</td>
                            </tr>
                          ))}                      
                        </tbody>
                      </Table>
                    </>
                  ) }

                  { pcs.xy.blackhole && (
                    <>
                      <Label className="label-blackhole">BlackHole</Label>
                      <Table className="table table-bordered table-thead-tr-th-center">
                        <thead className="table-light">
                          <tr>
                            <th>구분</th>
                            <th>불량수</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blackholeList?.map((x: Dictionary, i: number) => (
                            <tr key={i}>
                              <td>{x["ngType"]}</td>
                              <td>{currencyFormat(x["ngCnt"])}</td>
                            </tr>
                          ))}                      
                        </tbody>
                      </Table>
                    </>
                  ) }                  
                </PopoverBody>
              </UncontrolledPopover>
            ) }
          </div>          
        </>
      );

    if(totalRow.current )
      return (
        <>
          <div className="total-wrap">
            <div className={getTotalClassName()} id={`emapping-popover-pcs-${pcs.index}`}>
              <div className={ pcs.xy.aoiTotal ? "total-aoi" : "" } style={{ opacity: getAOITotalPercent(pcs.xy.aoiTotal) }}>
                {pcs.xy.aoiTotal}
              </div>
              <div className={ pcs.xy.bbtTotal ? "total-bbt" : "" } style={{ opacity: getBBTTotalPercent(pcs.xy.bbtTotal) }}>
                {pcs.xy.bbtTotal}
              </div>
              <div className={ pcs.xy.blackholeTotal ? "total-blackhole" : "" } style={{ opacity: getBlackHileTotalPercent(pcs.xy.blackholeTotal) }}>
                {pcs.xy.blackholeTotal}
              </div>
            </div>
            { (pcs.xy.aoiTotal || pcs.xy.bbtTotal || pcs.xy.blackholeTotal ) && (
              <UncontrolledPopover 
                trigger="legacy"
                target={`emapping-popover-pcs-${pcs.index}`}
                className="emapping-popover-container"
              >
                <PopoverHeader>
                  검사 Detail
                </PopoverHeader>
                <PopoverBody>
                  { (aoiList?.length ?? 0) > 0 && (
                    <>
                      <Label className="label-aoi">AOI</Label>
                      <Table className="table table-bordered table-thead-tr-th-center">
                        <thead className="table-light">
                          <tr>
                            <th>불량명</th>

                            {ngTypes.map((x: Dictionary, i: number) => (
                              <React.Fragment key={i}>
                                { aoiList![0][x.field] ? (
                                <>
                                  <th>{x["headerName"]}</th>
                                </>
                              ) : "" }
                              </React.Fragment>
                            ))}   
                          </tr>
                        </thead>
                        <tbody>
                          {aoiList?.map((x: Dictionary, i: number) => (
                            <tr key={i}>
                              <th>수량</th>
                              {ngTypes.map((x: Dictionary, j: number) => (
                                <React.Fragment key={j}>
                                  { aoiList![0][x.field] ? (
                                  <>
                                    <th>{aoiList![0][x.field]}</th>
                                  </>
                                ) : "" }
                                </React.Fragment>
                              ))}   
                            </tr>
                          ))}                      
                        </tbody>
                      </Table>
                    </>
                  ) }

                  { (bbtList?.length ?? 0) > 0 && (
                    <>
                      <Label className="label-bbt">BBT</Label>
                      <Table className="table table-bordered table-thead-tr-th-center">
                        <thead className="table-light">
                          <tr>
                            <th rowSpan={2}>Application</th>
                            <th colSpan={8}>불량(판정 기준)</th>
                          </tr>
                          <tr>
                            <td>4W</td>
                            <td>Aux</td>
                            <td>Both</td>
                            <td>C</td>
                            <td>ER</td>
                            <td>Open</td>
                            <td>SPK</td>
                            <td>Short</td>
                          </tr>
                        </thead>
                        <tbody>
                          {bbtList?.map((x: Dictionary, i: number) => (
                            <tr key={i}>
                              <td>{x["appName"]}</td>
                              
                              <td>{currencyFormat(x["4WCnt"])}</td>
                              <td>{currencyFormat(x["auxCnt"])}</td>
                              <td>{currencyFormat(x["bothCnt"])}</td>
                              <td>{currencyFormat(x["cCnt"])}</td>
                              <td>{currencyFormat(x["erCnt"])}</td>
                              <td>{currencyFormat(x["openCnt"])}</td>
                              <td>{currencyFormat(x["spkCnt"])}</td>
                              <td>{currencyFormat(x["shortCnt"])}</td>
                            </tr>
                          ))}                      
                        </tbody>
                      </Table>
                    </>
                  ) }

                  { (blackholeList?.length ?? 0) > 0 && (
                    <>
                      <Label className="label-blackhole">BlackHole</Label>
                      <Table className="table table-bordered table-thead-tr-th-center">
                        <thead className="table-light">
                          <tr>
                            <th>구분</th>
                            <th>불량수</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blackholeList?.map((x: Dictionary, i: number) => (
                            <tr key={i}>
                              <td>{x["ngType"]}</td>
                              <td>{currencyFormat(x["ngCnt"])}</td>
                            </tr>
                          ))}                      
                        </tbody>
                      </Table>
                    </>
                  ) }                  
                </PopoverBody>
              </UncontrolledPopover>
            ) }
          </div>
        </>
      );
  }

  const getClassName = (y: number, x:number) => {
    const pcs = findPcs(y, x);
    if(!pcs)
      return;

    return !!pcs.xy.blackhole;
  }

  const getTotalClassName = () => {
    return (hv[0] / hv[1]) > 2 ? "total-container-v" : "total-container-h"
  }

  const getAOITotalPercent = (ngCnt: number | undefined) => {
    if(!ngCnt)
      return 0;

    if(aoiMax.current <= 1)
      return 0.5;

    return (ngCnt / (aoiMax.current <= 0 ? 1 : aoiMax.current));
  }
  const getBBTTotalPercent = (ngCnt: number | undefined) => {
    if(!ngCnt)
      return 0;

    if(bbtMax.current <= 1)
      return 0.5;

    return (ngCnt / (bbtMax.current <= 0 ? 1 : bbtMax.current));
  }
  const getBlackHileTotalPercent = (ngCnt: number | undefined) => {
    if(!ngCnt)
      return 0;

    if(blackholeMax.current <= 1)
      return 0.5;      

    return (ngCnt / (blackholeMax.current <= 0 ? 1 : blackholeMax.current));
  }

  useEffect(() => {
  }, []);

  return (
    <Table className="table table-bordered table-emapping" style={{ height: "100%" }}>
      <tbody>
        {[...Array(hv[1]).keys()].map((y: number) => (
          (
            <tr key={y} style={{ height: `${100 / hv[1]}%` }}>
              {[...Array(hv[0]).keys()].map((x: number) => (
                (
                  <td key={x} style={{ width: `${100 / hv[0]}%` }}
                    className={getClassName(y, x) ? "pcs-blackhole" : ""}
                    onClick={() => {
                      
                    }}>
                      <>{ cellRender(y, x) }</>
                  </td>
                )
              ))}
            </tr>
          )
        ))}
      </tbody>
    </Table>
  );
});

export default EMappingUnionView;
