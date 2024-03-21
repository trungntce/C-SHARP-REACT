import React, { useEffect, useState } from 'react';
import ListBase from '../../../../components/Common/Base/ListBase';
import { useApi, useGridRef, useSearchRef } from '../../../../common/hooks';
import { Button, Col, Row } from 'reactstrap';
import SearchBase from '../../../../components/Common/Base/SearchBase';
import { dateFormat, downloadFile, yyyymmddhhmmss } from './../../../../common/utility';
import { showProgress } from '../../../../components/MessageBox/Progress';
import { alertBox } from '../../../../components/MessageBox/Alert';
import { contentType } from '../../../../common/types';
import api from '../../../../common/api';
import TotalErrorTable from './TotalErrorTable';
import { useTranslation } from 'react-i18next';

const TotalErrorNewList = () => {
	const { t } = useTranslation();
	const [gridRef, setList] = useGridRef();
	const [searchRef, getSearch] = useSearchRef();
	const [data, setData] = useState([]);

	const { refetch } = useApi("panelinterlockerror/totalerror", getSearch, gridRef)

	useEffect(() => {
		searchHandler();
	}, [])

	const searchHandler = async() => {
		const result = await refetch();
		if (result.data) {
			// setList(result.data);
			setData(result.data);
		}
	}

	const excelHandler = async (e:any) => {
    e.preventDefault();
		if (data.length <= 0) { 
			alertBox(t("@MSG_ALRAM_TYPE4"));  //"데이터가 없습니다."
      return;
		}

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "panelinterlockerror/totalerror", param);
    downloadFile(`totalerror_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

	return (
	 <>
	 	<ListBase 
			buttons={<></>}
	 		search={
				<SearchBase 
	 				ref={searchRef} 
	 				searchHandler={searchHandler}
	 				postButtons={
	 	  <>
	 	    <Button type="button" color="outline-primary" onClick={excelHandler}>
	 	      <i className="mdi mdi-file-excel me-1"></i>Excel
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
	 				<div className="pb-2" style={{ height: "100%" }}>
	 					<TotalErrorTable data={data} />
	 				</div>
	 			</Col>
	 		</Row>
	 	</ListBase>  
	 </>
	);
};

export default TotalErrorNewList;
