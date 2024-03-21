import { useEffect, useRef, useState } from "react";
import { Button, Col, Input, Label, Modal, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary, contentType } from "../../../common/types";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { columnCountDefs, columnErrorDefs, ngTypes } from "./AOIVRSDefs";
import moment from "moment";
import GridBase from "../../../components/Common/Base/GridBase";
import { CellClickedEvent } from "ag-grid-community";
import api from "../../../common/api";

import AutoCombo from "../../../components/Common/AutoCombo";
import Select from "../../../components/Common/Select";
import { downloadFile, executeIdle, getLang, showLoading, yyyymmddhhmmss } from "../../../common/utility";
import { showProgress } from "../../../components/MessageBox/Progress";
import { alertBox } from "../../../components/MessageBox/Alert";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const AOIVRSList = () => {
  const { t } = useTranslation();
  const { workorder, dt } = useParams();

  const [searchRef, getSearch] = useSearchRef();

  const [gridCountRef, setCountList] = useGridRef();
  const [gridErrorRef, setErrorList] = useGridRef();
  const [modal_center, setmodal_center] = useState(false);
  const [ngData, setNgdata] = useState<Dictionary>([]);

  const fromDtRef = useRef<any>();
  const toDtRef = useRef<any>();
  const lotNoRef = useRef<any>();

  const { refetch } = useApi("aoivrs", getSearch, gridCountRef);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null | undefined = null;
  let image = new Image();

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data) {
      const ngcountlist: Dictionary[] = result.data;
      
      setCountList(result.data);

      setErrorList([]);
      
      const headerRow: Dictionary = {
        panelCnt: 0,
        ngPcsTotal: 0,
        pcsTotal: 0,
        ngcnt: 0
      }

      ngTypes.forEach(ng=> {
        headerRow[ng.field] = 0;
      });

      if(ngcountlist.length) {
        ngcountlist.forEach((item) => {
          headerRow.createDt = "Total";
          headerRow.panelCnt += item.panelCnt;
          headerRow.ngPcsTotal += item.ngPcsTotal;
          headerRow.pcsTotal += item.pcsTotal;
          headerRow.ngcnt += item.ngcnt;


          ngTypes.forEach(ng=> {
            headerRow[ng.field] += item[ng.field];
          });
        });

        gridCountRef.current!.api.setPinnedTopRowData([headerRow]);
      }
    }
  }

  useEffect(() => {
    if(workorder && dt){
      const fromDt = moment(dt).add(-30, 'days').toDate();
      const toDt = moment(dt).add(30, 'days').toDate();

      fromDtRef.current.setDate(fromDt);
      toDtRef.current.setDate(toDt);

      lotNoRef.current.value = workorder;

      executeIdle(() => {
        searchHandler();
      });
    }
  }, []);

  const drawImage = (ctx: CanvasRenderingContext2D | null | undefined, img: HTMLImageElement) => {
    ctx?.drawImage(img, 0, 0);
};

  const cellClick = async (e: CellClickedEvent) => {
    const params = getSearch();
    showLoading(gridErrorRef, true);

    const result = await api<any>("get", "aoivrs/nglist" , {fromDt: params.fromDt, toDt: params.toDt, workorder: e.data.workorder, ngName: params.ngName});

    if(result.data) setErrorList(result.data);
  }

  const errorClick = (e: CellClickedEvent) => {
    if(e.data) {
      setNgdata(e.data);
      tog_center(e.data);
    }
  }

  const tog_center = (e: any) => {
    setmodal_center(!modal_center);

    image.onload = () => {
      canvas = canvasRef.current!;
      context = canvas.getContext("2d");
      
      canvasRef.current!.width = image.width;
      canvasRef.current!.height = image.height;

      drawImage(context, image);
    }

    image.src = "http://172.20.1.14/downloads" + e.filelocation;
  }

  const excelHandler = async(e:any) => {
    e.preventDefault();

    if(gridCountRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download","aoivrs",param);
    downloadFile(`AOI_VRS검사DATA_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);

    hideProgress();
  }

  return (
    <>
      <ListBase
        folder="Quality Management"
        title="AOI/VRS"
        postfix="검사DATA조회"
        icon="check-square"
        buttons={[]}
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker ref={fromDtRef} name="fromDt" defaultValue={moment().add(-10, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker ref={toDtRef} name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <div>
                {/* 고객사 */}
                <AutoCombo name="vendorCode" parentname="vendorId" sx={{ width: "230px" }} placeholder={t("@COL_VENDOR_NAME")} mapCode="vendor" category="customer" />
              </div>
              <div>
                {/* 제품코드 */}
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ width: "280px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" />
              </div>
              <div>
                {/* 제품명 */}
                <Input name="itemName" placeholder={t("@COL_ITEM_NAME")} style={{ width: "250px"}} />
              </div>
              <div>
                {/* 모델코드 */}
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </div>
              <div>
                {/* 설비코드 */}
                <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
              </div>
              <div>
                <Input innerRef={lotNoRef} name="workorder" placeholder="BATCH" style={{ minWidth: "236px" }} />
              </div>
              <div>
               {/* 어플리케이션 */}
                <AutoCombo name="appCode" sx={{ minWidth: "170px" }} placeholder={t("@APPLICATION")} mapCode="app" />
              </div>
              <div>
                {/* 불량명 */}
                <Input name="ngName" type="text" placeholder={t("@COL_DEFECT_NAME")} />
              </div>
              <div>
                <Row>
                  <Col style={{ minWidth: "70px"}} className="text-end">
                  {/* 조회기준 */}
                    <Label htmlFor="groupby" className="form-label">{`${t("@COL_LOOKUP_STANDARD")}:`}</Label>
                  </Col>
                  <Col style={{ minWidth: "100px" }}>
                    <Select name="groupby" label={t("@COL_LOOKUP_STANDARD")} placeholder={t("@COL_LOOKUP_STANDARD")} defaultValue="LOT" mapCode="code" category="BBT_GROUPBY" required={true} className="form-select" />
                  </Col>
                </Row>
              </div>
            </div>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col xl={9}>
              <GridBase
                ref={gridCountRef}
                columnDefs={columnCountDefs()}
                className="ag-grid-bbt"
                containerId="grid-bbt-wrap"
                alwaysShowHorizontalScroll={true}
                onCellClicked={cellClick}
                onGridReady={() => {
                  setCountList([]);
                }}
              />
            </Col>
            <Col xl={3}>
              <Row style={{ height: "100%" }}>
                <Col>
                  <GridBase
                    ref={gridErrorRef}
                    columnDefs={columnErrorDefs()}
                    className="ag-grid-bbt"
                    alwaysShowHorizontalScroll={true}
                    onCellClicked={errorClick}
                    onGridReady={() => {
                      setErrorList([]);
                    }}
                  />
                </Col>
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
            <h5 className="modal-title mt-0">{getLang(ngData.ngName)}</h5>
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
          <div className="modal-body d-flex justify-content-center align-items-center">
            <canvas ref={canvasRef} />
          </div>
        </Modal>        
    </>
  )
}

export default AOIVRSList;