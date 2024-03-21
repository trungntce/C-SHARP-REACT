import React, { useEffect } from 'react';
import ListBase from '../../../../components/Common/Base/ListBase';
import GridBase from '../../../../components/Common/Base/GridBase';
import { useApi, useGridRef, useSearchRef } from '../../../../common/hooks';
import { TotalErrorDefs } from './TotalErrorDefs';
import { Button, Col, Row } from 'reactstrap';
import SearchBase from '../../../../components/Common/Base/SearchBase';
import DateTimePicker from '../../../../components/Common/DateTimePicker';
import { dateFormat, downloadFile, yyyymmddhhmmss } from './../../../../common/utility';
import moment from 'moment';
import { showProgress } from '../../../../components/MessageBox/Progress';
import { alertBox } from '../../../../components/MessageBox/Alert';
import { contentType } from '../../../../common/types';
import api from '../../../../common/api';
import { useTranslation } from 'react-i18next';

const TotalErrorList = () => {
	const [gridRef, setList] = useGridRef();
	const [searchRef, getSearch] = useSearchRef();
	const { t } = useTranslation();

	const { refetch } = useApi("panelinterlock/totalerror", getSearch, gridRef)

	useEffect(() => {
		searchHandler();
	}, [])

	const searchHandler = async() => {
		const result = await refetch();
		if (result.data) setList(result.data);
	}

	const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      //alertBox("데이터가 없습니다.");
		alertBox(t("@MSG_ALRAM_TYPE4"));
		return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "panelinterlock/totalerror", param);
    downloadFile(`totalerror_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

	return (
		<>
			<ListBase
				buttons = { 
					<>
					</>
				}
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
						{/* <Col style={{ maxWidth : "120px" }}>
							<DateTimePicker name="fromDt" dateFormat="yyyy-MM-dd" required={true} />
						</Col> */}
					</SearchBase>
				}
			>
				<Row style={{ height : "100%" }}>
					<Col>
						<div className="pb-2" style={{ height : "100%" }}>
							<GridBase
								rest={{
									textAlign : "center", 
									fonstSize : 19
								}}
								ref={gridRef}
								columnDefs={TotalErrorDefs()}
								className='ag-grid-total-error'
								rowSelection={'multiple'}
							/>
						</div>
					</Col>
				</Row>
			</ListBase>  
		</>
	);
};

export default TotalErrorList;