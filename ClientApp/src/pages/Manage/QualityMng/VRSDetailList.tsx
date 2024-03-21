import { useEffect, useRef, useState } from "react";
import { Col, Input, Modal, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { columnDefs } from "./VRSDetailDefs";
import moment from "moment";
import GridBase from "../../../components/Common/Base/GridBase";
import panel1 from "../../../assets/images/VRS_Panel1.png";
import AutoCombo from "../../../components/Common/AutoCombo";
import api from "../../../common/api";
import { gbrToSvg } from "../../../common/utility";
import svgPanZoom from "svg-pan-zoom"
import { useTranslation } from "react-i18next";

const VRSDetailList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("aoivrs/detail", getSearch, gridRef);
  
  const pointRows = useRef<Dictionary[]>([]);

  const gbrRef = useRef<any>();

  const pixelPerCm = window.screen.width / (window.screen.availWidth * window.devicePixelRatio / 2.54);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    const params = getSearch();
    if(result.data) setList(result.data);

    gbrRef.current.innerHTML = "";
    
    pointRows.current = [];

    result.data.map((e:any) => {
      pointRows.current.push({
        posX: -260 + e.xlocationCm  * pixelPerCm * (6.3),
        posY: -220 + e.ylocationCm  * pixelPerCm * (7.6),
        posR: 2,
        ngcode: e.ngcode
      })

    });

    if(params.bomItemCode) {
      drawGbr(params.bomItemCode); 
    }
    else{
      drawGbr("noGbr") ;
    }
   
  }
  
  // useEffect(() => {
  //   searchHandler();
  // }, []);

  const drawGbr = (name: any) => {
    // B0900505722-MHA-02.gbr
    api<any>("get", "test/gbr", {fileName: name + ".gbr"}).then(result => {
      if(result.data === "fail") {
        gbrRef.current.innerHTML = "<svg width='450' height='450'></svg>";
        drawCircles(pointRows.current);
      }else{
        gbrRef.current.innerHTML = gbrToSvg(result.data);  
      }
  
      const svg = gbrRef.current.children[0];
      const width = parseInt(svg.getAttribute("width")); // Unit: mm
      const height = parseInt(svg.getAttribute("height")); // Unit: mm

      console.log(svg.children);
  
      if(width && height){
        svg.setAttribute("width", width * 1.5); // mm * 2 => px
        svg.setAttribute("height", height * 1.5); // mm * 2 => px
        svg.children[2] ?  svg.children[2].setAttribute("stroke-width", "0.2") : svg.children[1].setAttribute("stroke-width", "0.2");
      }

      drawCircles(pointRows.current);
  
      const panZoom = svgPanZoom(svg, {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
      });
    });
  }
  

  const drawCircles = (rows: Dictionary) => {
    rows.map((row: any) => {
      if(row.ngcode == "0") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#FFBF00");  
      }else if(row.ngcode == "25") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#A5DF00");
      }else if(row.ngcode == "1") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#04B486");
      }else if(row.ngcode == "2") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#045FB4");
      }else if(row.ngcode == "9") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#5F04B4");
      }else if(row.ngcode == "19") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#8A0886");
      }else if(row.ngcode == "4") {
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "#FE2EC8");
      }else{
        drawCircle(Math.round(row.posX), Math.round(row.posY), row.posR, "red");
      }
    })
  }

  const drawCircle = (x: number, y: number, r: number, color: string) => {
    const svg = gbrRef.current.children[0];
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttributeNS(null, 'cx', x.toString());
    circle.setAttributeNS(null, 'cy', y.toString());
    circle.setAttributeNS(null, 'r', r.toString());
    circle.setAttributeNS(null, 'style', `stroke: ${color}; stroke-width: 0.5px;` );
    svg.appendChild(circle);
  }

  return (
    <>
      <ListBase
        folder="Quality Management"
        title="VRS Detail"
        postfix="불량 분석"
        icon="check-square"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText={t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
              </Col>
              <Col>
                <DateTimePicker name="toDt" placeholderText={t("@SEARCH_END_DATE")} required={true} /> {/* 조회종료 */}
              </Col>
              <Col>
                <AutoCombo name="bomItemCode" parentname="bomItemId" sx={{ width: "230px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" category="itemRevision" /> {/* 모델코드 */}
              </Col>
              <Col>
                <Input name="workorder" type="text" placeholder="BATCH No" />
              </Col>
              <Col>
                <Input name="panel" type="text" placeholder="PNL" />
              </Col>
              <Col>
                <Input name="ngName" type="text" placeholder={t("@COL_DEFECT_NAME")} /> {/* 불량명 */}
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={6} className="d-flex justify-content-center align-items-center">
              <div ref={gbrRef} />
            </Col>
            <Col md={6}>
              <GridBase
                ref={gridRef}
                columnDefs={columnDefs()}
                className="ag-grid-bbt"
                alwaysShowHorizontalScroll={true}
                onGridReady={() => {
                  setList([]);
                }}
              />
            </Col>
          </Row>
        </ListBase>
    </>

  )

}

export default VRSDetailList;