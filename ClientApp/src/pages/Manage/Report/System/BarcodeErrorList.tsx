import { CellClickedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import { columnDefs } from "./BarcodeErrorDefs";
import { useTranslation } from "react-i18next";

const BarcodeErrorList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const { refetch } = useApi("panelreport/error", getSearch, gridRef);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null | undefined = null;
  let image = new Image();

  useEffect(()=> {
    searchHandler();
  },[])

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data) {
      const list: Dictionary[] = result.data;
      setList(list);

      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const drawImage = (ctx: CanvasRenderingContext2D | null | undefined, img: HTMLImageElement) => {
    ctx?.drawImage(img, 0, 0);
  };

  const cellClick = (e: CellClickedEvent) => {
    if(e.data) {
      image.onload = () => {
        canvas = canvasRef.current!;
        context = canvas.getContext("2d");
        
        canvasRef.current!.width = image.width;
        canvasRef.current!.height = image.height;
  
        drawImage(context, image);
      }
      if(!e.data.imgPath) {
        if (!canvas || !context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
      }else {
        image.src = "http://172.20.1.14/downloads/MES/ERRIMG/" + e.data.imgPath;
      }
      
    }
  }

  return (
    <>
      <ListBase
        title="BarcodeError"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-5, 'days').toDate()} placeholderText= {t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText={t("@SEARCH_END_DATE")} required={true} /> {/* 조회종료 */}
              </div>
            </div>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col id="grid-list-container" md={7}>
              <GridBase
                ref={gridRef}
                columnDefs={columnDefs()}
                alwaysShowHorizontalScroll={true}
                onCellClicked={cellClick}
              />
            </Col>
            <Col id="grid-error-container" md={5}>
              <canvas ref={canvasRef} />
            </Col>
          </Row>
        </ListBase>
      
    
    </>
  )

}

export default BarcodeErrorList;