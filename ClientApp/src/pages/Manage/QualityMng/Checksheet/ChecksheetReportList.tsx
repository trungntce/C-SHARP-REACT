import { Dictionary } from "../../../../common/types";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import { columnChecksheetReportDefs, columnResultDefs, columnResultImgDefs } from "../../../Manage/QualityMng/Checksheet/ChecksheetReportDefs";
import { Button, Col, Input, Label, Modal, Row, Table } from "reactstrap";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import moment from "moment";
import MultiAutoCombo from "../../../../components/Common/MultiAutoCombo";
import api from "../../../../common/api";
import ChecksheetModalPreview from "./ChecksheetModalPreview";

const ChecksheetReportList = (props: any) => { 
  const { t } = useTranslation();

    const listRef = useRef<any>();
    const [searchRef, getSearch] = useSearchRef();
    const [gridRef, setList] = useGridRef();
    const [gridResultRef, setResultList] = useGridRef();
    const [gridResultImgRef, setResultImgList] = useGridRef();
    const previewRef = useRef<any>();
    const pageNo = useRef<number>(1);
    const fromDtRef = useRef<any>();
    const toDtRef = useRef<any>();
    const fromDt = useRef<any>(moment().add(-10, 'days').toDate());
    const toDt = useRef<any>(moment().toDate());
    const getParamSearch = () => { 
        const params = getSearch();
        if (params["eqpCode"]) {
            const list = JSON.parse(params["eqpCode"] as string);
            const values = list.filter((y: any) => y.value).map((x: any) => x.value);
            params["eqpCodes"] = values.join(",");
        }
        return params;
    }
    const { refetch } = useApi("checksheetresult/listreport", getParamSearch, gridRef);

    const pagingHandler = (page: number) => {
        pageNo.current = page;
        searchHandler();
    }
    

    const searchHandler = async (_?: Dictionary) => {
        // setList([]);

        gridRef.current?.api.setColumnDefs(genColDefs());
        const result = await refetch();
        if (result.data) { 
            const data: Dictionary[] = result.data;
            const newdata: Dictionary[] = [];
            if (undefined !== data[0] && data[0].length > 0) { 
                data[0].forEach((item: Dictionary) => {
                    newdata.push(item);
                });
            }
            const items: Dictionary[] = [];
            if (undefined !== data[1] && data[1].length > 0) {
                data[1].forEach((item: Dictionary) => { 
                    items.push(item);
                })
            }

            for (let i = 0; i < newdata.length; i++) { 
                let obj = newdata[i];
                const eqpCode = obj.eqp_code;
                const workcenterCode = obj.workcenter_code;
                let _fromDt = fromDt.current;
                do { 
                    let dayCheck = 'X';
                    let nightCheck = 'X';
                    let cntTotal = 0;
                    for (let j = 0; j < items.length; j++) { 
                        let eqp = items[j];
                        if (eqpCode === eqp.eqp_code && workcenterCode === eqp.workcenter_code
                            && eqp.check_date === moment(_fromDt).format('YYYYMMDD')) {
                            /*
                            const cntCheck = eqp.cnt_check;
                            const cntCheckedDay = eqp.cnt_checked_day;
                            const cntCheckedNight = eqp.cnt_checked_night;
                            if (cntCheckedDay === cntCheck) { 
                                dayCheck = 'O';
                            }
                            if (cntCheckedNight === cntCheck) { 
                                nightCheck = 'O';
                            }*/
                            dayCheck = eqp.check_day_text;
                            nightCheck = eqp.check_night_text;

                            cntTotal = eqp.cnt_check;
                            break;
                        }
                    }
                    obj["col" + moment(_fromDt).format('YYYYMMDD') + "total"] = cntTotal;
                    obj["col" + moment(_fromDt).format('YYYYMMDD') + "d"] = dayCheck;
                    obj["col" + moment(_fromDt).format('YYYYMMDD') + 'n'] = nightCheck;
                    _fromDt = moment(_fromDt).add(1, 'days').toDate();
                } while (_fromDt <= toDt.current);
            }
            
            setList(newdata);
            
            const headerRow: Dictionary = {
                no: '',
                workcenter_code: '',
                workcenter_name: '',
                eqp_code: '',
                eqp_name: '',
            };
            let _fromDt1 = fromDt.current;
            do { 
                const dayKey = "col" + moment(_fromDt1).format('YYYYMMDD') + "d";
                const nightKey = "col" + moment(_fromDt1).format('YYYYMMDD') + "n";
                let cntNgDay = 0;
                let cntNgNight = 0;
                for (let i = 0; i < newdata.length; i++) { 
                    const obj = newdata[i];
                    if (obj[dayKey] === 'OK') { 
                        cntNgDay++;
                    }
                    if (obj[nightKey] === 'OK') { 
                        cntNgNight++;
                    }
                }
                headerRow[dayKey] = cntNgDay + '/' + newdata.length;
                headerRow[nightKey] = cntNgNight + '/' + newdata.length;
                _fromDt1 = moment(_fromDt1).add(1, 'days').toDate();
            } while (_fromDt1 <= toDt.current);

            gridRef.current!.api.setPinnedTopRowData([headerRow]);
        }
    };

    const genColDefs = () => { 
        let _fromDt = fromDt.current;
        const colDefs: Dictionary[] = columnChecksheetReportDefs();
        do {
            const headerName = moment(_fromDt).format('YYYY-MM-DD');
            const colKey = "col" + moment(_fromDt).format('YYYYMMDD');
            let obj: Dictionary = {
                headerName: headerName,
                width: '160',
                children: [
                    {
                        headerName: "주간",
                        field: "col" + moment(_fromDt).format('YYYYMMDD') + "d",
                        filter: "agTextColumnFilter",
                        width: 80,
                        cellStyle: {
                            textAlign: 'center'
                        },
                        cellRenderer: (e: any) => { 
                            const data = e.data;
                            return (<>
                                <u style={{ cursor: 'pointer' }} onClick={() => onClickCellReport(e.data, headerName, 'D', getSearch().groupType, getSearch().dailyCheckType)}>
                                    {data[colKey + 'd']}
                                </u>
                            </>);
                        }
                    },
                    {
                        headerName: "야간",
                        field: "col" + moment(_fromDt).format('YYYYMMDD') + 'n',
                        filter: "agTextColumnFilter",
                        width: 80,
                        cellStyle: {
                            textAlign: 'center'
                        },
                        cellRenderer: (e: any) => { 
                            return (<>
                                <u style={{ cursor: 'pointer' }} onClick={() => onClickCellReport(e.data, headerName, 'N', getSearch().groupType, getSearch().dailyCheckType)}>
                                    {e.data[colKey + 'n']}
                                </u>
                            </>);
                        }
                    }
                ],
                field: "col" + moment(_fromDt).format('MMDD'),
            };
            colDefs.push(obj);
            _fromDt = moment(_fromDt).add(1, 'days').toDate();
        } while (_fromDt <= toDt.current);

        return colDefs;
    }

    const onChangeFromDt = (date: any) => { 
        fromDt.current = date;
        fromDtRef.current.setDate(moment(date).toDate());
    }

    const onChangeToDt = (date: any) => { 
        toDt.current = date;
        toDtRef.current.setDate(moment(date).toDate());
    }

    const paramResultItems = useRef<Dictionary>();
    const getParamResult = () => { 
        return {
            checkDate: paramResultItems.current?.checkDate,
            eqpCode: paramResultItems.current?.eqpCode,
            workcenterCode: paramResultItems.current?.workcenterCode,
            workType: paramResultItems.current?.workType,
            groupType: paramResultItems.current?.groupType,
            dailyCheckType: paramResultItems.current?.dailyCheckType
        };
    }

    const { refetch: itemRefetch } = useApi("checksheetresult/listreportbyday", getParamResult, gridResultRef);

    const onClickCellReport = async (item: Dictionary, checkDate: any, workType: any, groupType: any, dailyCheckType: any) => { 
        paramResultItems.current = {
            checkDate: checkDate,
            eqpCode: item.eqp_code,
            workcenterCode: item.workcenter_code,
            workType: workType,
            groupType: groupType,
            dailyCheckType: dailyCheckType
        };
        console.log(paramResultItems.current, item);

        const result = await itemRefetch();
        if (result.data) { 
            setResultList(result.data);
        }
    }

    const onShowImage = async (item: any) => { 
        const params = {
            checksheetCode: item.checksheetCode,
            itemCode: item.checksheetItemCode
        };
        const result = await api<any>("get", "checksheetresult/listitemimg", params);
        if (result.data) { 
            setResultImgList(result.data);
        }
    }

    
    const toggleCenter = (e: any) => {
        previewRef.current.setImgUrl("/api/checksheetresult/showimg?guid=" + e.guid);
        previewRef.current.onToggleModal(e);
  }

    useEffect(() => {
       // searchHandler();
    }, []);

    return (
        <>
            <ListBase
                folder="System Management"
                title="Check Sheet Report"
                postfix="Management"
                icon="user-plus"
                ref={listRef}
                showPagination={true}
                onPaging={pagingHandler}
                onGridReady={() => {
                    setList([]);
                }}
                buttons={
                    <>
                       
                    </>
                }
                search={
                    <SearchBase
                        ref={searchRef}
                        searchHandler={searchHandler}
                    >
                        <Row style={{ width: '100%' }}>
                            <Col md={2}>
                                <AutoCombo name="workcenterCode"  mapCode="workcenter" placeholder="작업장코드" className="form-control" />
                            </Col>
                            <Col md={3}>
                                <MultiAutoCombo limitTags={1} name="eqpCode" placeholder="설비코드" mapCode="eqp" maxSelection={20} sx={{ width: "100%" }} />
                            </Col>
                            <Col md={2}>
                            <select name="groupType" className="form-select" defaultValue={"PROD"} required={true}>
                                <option value="PROD">제조 Check sheet</option>
                                <option value="EMT">설비 Check sheet</option>
                                <option value="PM">Checksheet PM</option>
                                <option value="CLEAN">청소 Check sheet</option>
                            </select>
                            </Col>
                            <Col md={1}>
                            <select name="dailyCheckType" className="form-select" defaultValue={"D"} required={true}>
                                <option value="D">Ngày</option>
                                <option value="W">Tuần</option>
                                <option value="M">Tháng</option>
                                <option value="Y">Năm</option>
                            </select>
                            </Col>
                            <Col md={1}>
                                <DateTimePicker onChange={(date:any) => onChangeFromDt(date)} ref={fromDtRef} name="fromDt" defaultValue={fromDt.current} placeholderText="조회시작" required={true} />
                            </Col>
                            <Col md={1}>
                                <DateTimePicker onChange={(date:any) => onChangeToDt(date)} ref={toDtRef} name="toDt" defaultValue={toDt.current} placeholderText="조회종료" required={true} />
                            </Col>
                        </Row>
                    </SearchBase>

                }>
                <Row style={{ height: "50%" }}>
                    <Col md={12}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={gridRef}
                                columnDefs={columnChecksheetReportDefs()}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{ height: "50%" }}>
                    <Col md={8}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={gridResultRef}
                                columnDefs={columnResultDefs(onShowImage)}
                            />
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="pb-2" style={{ height: "100%" }}>
                            <GridBase
                                ref={gridResultImgRef}
                                columnDefs={columnResultImgDefs(toggleCenter)}
                            />
                        </div>
                    </Col>
                </Row>
            </ListBase>
            <ChecksheetModalPreview ref={previewRef} />
        </>
    );
}

export default ChecksheetReportList;
