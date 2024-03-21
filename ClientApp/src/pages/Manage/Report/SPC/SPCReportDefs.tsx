import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";
import { Dictionary } from "../../../../common/types";
import {  dateFormat, floatFormat } from "../../../../common/utility";
import moment from "moment";
import { useTranslation } from "react-i18next";


const returnColor = (judge : string) => {

}

export const ColumnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: "No.",
      field: "rowNum",
      width: 50,
      // tooltipValueGetter: (d:any) => d.data.itemName,
      cellRenderer: (d: any) => {
        return (
          <>
            <span>{d.data.rowNum}</span>
          </>
        )
      }
    },
    {
      headerName: "TYPE",
      field: "typeDesc",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    },
    {
      field: "workorder",
      headerName: "BATCH",
      width: 170,
      cellRenderer: (d: any) => {
        const link = `/trace4m/${d.data.workorder}`;
        return (
          <>
                    {/* <span className="detail-cell">
                      <a href={link}>
                        <span className="detail-cell-panel">{d.value}</span>
                      </a>
                    </span> */}
              <a href={link} target="_blank">
                <span className={
                  d.data.statusFlag == 'OK' ? 'judge-ok' : 
                  d.data.statusFlag == 'CHK' ? 'judge-chk' : 
                        'judge-ng'}>{d.data.workorder}</span>
              </a>
          </>
        );
      },
    }, 
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),  //"공정순서",
      field: "operSeqNo",
      width:  90,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    },
    // {
    //   field: "4M",
    //   headerName: "4M",
    //   width: 50,
    //   cellRenderer: (d: any) => {
    //     return (
    //       <>
    //         <span className={
    //               d.data.eqp ? 'judge-ok' : ''}>{d.data.eqp ? 'O' : 'X'}</span>
    //       </>
    //     )
    //   }
    // }, 
    {
      headerName: t("@COL_OPERATION_CODE"),  //"공정코드",
      field: "operName",
      width: 150,
      tooltipValueGetter: (d:any) => `[ ${d.data.operCode} ]`,
    },
    {
      headerName: t("@COL_ITEM_NAME"),  //"제품명",
      field: "itemName",
      width: 230,
      tooltipValueGetter: (d:any) => d.data.itemCode,
    },
    {
      headerName: t("@COL_MODEL_NAME"),  //"모델명",
      field: "modelName",
      width: 180,
      tooltipValueGetter: (d:any) => d.data.modelCode,
    },
    {
      headerName: t("@COL_EQP_NAME"),  //"설비명",
      field: "eqpName",
      width: 220,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },     
    {
      headerName: t("@MIN_VALUE"),  //"최소값",
      field: "min",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@MAX_VALUE"),  //"최대값",
      field: "max",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@RANGE"),  //"범위",
      field: "range",
      width: 80,
      valueFormatter: (d: any) => floatFormat(d.data.range, 3)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@COL_AVG"),  //"평균",
      field: "avg",
      width: 80,
      valueFormatter: (d: any) => floatFormat(d.data.avg, 3)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: t("@COL_JUDGMENT"),  //"판정",
      field: "statusFlag",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.statusFlag == 'OK' ? 'judge-ok' : 
                d.data.statusFlag == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.statusFlag}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "SPEC",
      field: "judgeSpecNg",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeSpecNg == 'OK' ? 'judge-ok' : 
                d.data.judgeSpecNg == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeSpecNg}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_1_X",
      field: "judgeRule1X",
      width: 100,
      cellRenderer: (d: any) => {
        console.log(d)
        return (
          <>
              <span className={
                d.data.judgeRule1X == 'OK' ? 'judge-ok' : 
                d.data.judgeRule1X == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule1X}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_1_R",
      field: "judgeRule1R",
      width: 100,
      cellRenderer: (d: any) => {
        console.log(d)
        return (
          <>
              <span className={
                d.data.judgeRule1R == 'OK' ? 'judge-ok' : 
                d.data.judgeRule1R == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule1R}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_2",
      field: "judgeRule2",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule2 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule2 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule2}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_3",
      field: "judgeRule3",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule3 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule3 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule3}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_4",
      field: "judgeRule4",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule4 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule4 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule4}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_5",
      field: "judgeRule5",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule5 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule5 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule5}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_6",
      field: "judgeRule6",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule6 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule6 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule6}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "RULE_7",
      field: "judgeRule7",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule7 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule7 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule7}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
      {
      headerName: "RULE_8",
      field: "judgeRule8",
      width: 100,
      cellRenderer: (d: any) => {
        return (
          <>
              <span className={
                d.data.judgeRule8 == 'OK' ? 'judge-ok' : 
                d.data.judgeRule8 == 'CHK' ? 'judge-chk' : 
                      'judge-ng'}>{d.data.judgeRule8}</span>
          </>
        );
      },
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "lsl",
      field: "lsl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.lsl, 3)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "usl",
      field: "usl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.usl, 3)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "lcl",
      field: "xbarCalcLcl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.xbarCalcLcl, 3)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "ucl",
      field: "xbarCalcUcl",
      width: 65,
      valueFormatter: (d: any) => floatFormat(d.data.xbarCalcUcl, 3)
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    // {
    //   field: "judgeCnt",
    //   headerName: "판넬(OK/NG)",
    //   width: 90,
    //   filter: false,
    //   cellRenderer: (d: any) => {
    //     return (
    //       <>
    //         <span className="judge-ok">{d.data.okCnt}</span>
    //         /
    //         <span className="judge-ng">{d.data.ngCnt}</span>
    //       </>
    //     );
    //   },
    // },
    {
      field: "inspectionDate",
      headerName: t("@INSPECTION_DATE"),  //"검사일",
      valueFormatter: (d: any) => dateFormat(d.data.inspectionDate, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      field: "startDt4M",
      headerName: `4M ${t("@START_TIME")}`,  //"4M 시작시간",
      valueFormatter: (d: any) => dateFormat(d.data.startDt4M, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      field: "endDt4M",
      headerName: `4M ${t("@END_TIME")}`,  //"4M 종료시간",
      valueFormatter: (d: any) => dateFormat(d.data.endDt4M, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    // {
    //   headerName: "검사시간",
    //   field: "inspectionTime",
    //   width: 65,
    //   valueFormatter: (d: any) => dateFormat(d.data.inspectionDate, "HH:mm"),
    //   // tooltipValueGetter: (d:any) => d.data.itemName,
    // }, 
  ]
};


export const DetailColumnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: "TYPE",
      field: "typeDesc",
      width: 100,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    },
    {
      field: "workorder",
      headerName: "BATCH",
      width: 170,
      cellRenderer: (d: any) => {
        // const spts = d.data.workorderList.split(',');
  
        return (
          <>
              <span>{d.data.workorder}</span>
              {/* {' '}
              { spts.length > 1 ? (
                <a id={`cup-popover-workorder-${d.data.rowNo}`} className="workorder-cell">
                  <i className="fa fa-search"></i>
                </a>
              ) : null }
              { spts.length > 1 ? (
                <UncontrolledPopover
                  trigger="legacy"
                  target={`cup-popover-workorder-${d.data.rowNo}`}
                  placement="right"
                  className="trace-popover-container"
                >
                  <PopoverHeader>BATCH List</PopoverHeader>
                  <PopoverBody>
                    <Table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>BATCH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spts.map((x: string, i: number) => (
                          <tr key={i}>
                            <th>{x}</th>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </PopoverBody>
                </UncontrolledPopover>
              ) : null } */}
          </>
        );
      },
    },  
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),  //"공정순서",
      field: "operSeqNo",
      width:  90,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    },
    {
      headerName: "data01",
      field: "data01",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data02",
      field: "data02",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data03",
      field: "data03",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data04",
      field: "data04",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data05",
      field: "data05",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data06",
      field: "data06",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data07",
      field: "data07",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data08",
      field: "data08",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data09",
      field: "data09",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data10",
      field: "data10",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data11",
      field: "data11",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data12",
      field: "data12",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data13",
      field: "data13",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data14",
      field: "data14",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data15",
      field: "data15",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data16",
      field: "data16",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data17",
      field: "data17",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data18",
      field: "data18",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data19",
      field: "data19",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    {
      headerName: "data20",
      field: "data20",
      width: 80,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
    
    {
      field: "inspectionDate",
      headerName: t("@INSPECTION_DATE"),  //"검사일",
      valueFormatter: (d: any) => dateFormat(d.data.inspectionDate, "YYYY-MM-DD HH:mm"),
      maxWidth: 125,
    },
    {
      headerName: t("@INSPECTION_TIME"),  //"검사시간",
      field: "inspectionTime",
      width: 65,
      // tooltipValueGetter: (d:any) => d.data.itemName,
    }, 
  ]
};

