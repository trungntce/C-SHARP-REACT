import React, { useEffect, useState } from 'react';
import { percentFormat } from '../../../../common/utility';
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next';


//SIFLEX에서 만든 파일
const getDateOfDays = (day : number) => {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + day);

  return startDate;
}

const formatAsKoreanDate = (date : Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

const formatAsEnglishMonth = (month : number) => {
	const months = [
		'Jan(01).', 'Feb(02).', 'Mar(03).', 'Apr(04).', 'May(05).', 'Jun(06).',
		'Jul(07).', 'Aug(08).', 'Sep(09).', 'Oct(10).', 'Nov(11).', 'Dec(12).'
	];

	return months[month];
}

const getWeekNumber = (date : Date) => {
	const yearStart = new Date(date.getFullYear(), 0, 1);

	const diff = date.getTime() - yearStart.getTime();

	const oneWeek = 7 * 24 * 60 * 60 * 1000;
	const weekNumber = Math.ceil(diff / oneWeek);

	return 'W' + weekNumber;
}

const getToday = () => {
	return new Date();
}

const DIV = styled.div`
  height: calc(100vh - 200px);
  width: 100%;
  overflow: auto;
`;

const TABLE = styled.table`
	width: 100%;
  border-collapse: collapse;
  font-family: '맑은 고딕',Malgun Gothiic,'고딕','돋움',Dotum,AppleGothic,Sans-serif;
`;

const THEAD = styled.thead`
	font-size: 20px;
  position: sticky;
  top: 0px;
  background-color: #eee;
`;

const TH = styled.th`
	text-align: center;
	border: 1px solid #ccc;
	background-color: #eee;
	color: #000;
	padding-top: 8px;
	padding-bottom: 8px;
`;
const THBOLD = styled.th`
	text-align: center;
	border: 1px solid #ccc;
	background-color: #eee;
	color: #000;
	padding-top: 8px;
	padding-bottom: 8px;
  font-weight: bold;
`;

const TR = styled.tr`
	text-align: center;
	background: ${props => props.color};
  color: ${props => props.color === '#04AA6D' ? '#fff' : '#000'}
`;

const TD = styled.td`
	border: 1px solid #ddd;
	padding-top: 12px;
	padding-bottom: 12px;
  color: ${props => props.color};
`;

const TDBOLD = styled.td`
	border: 1px solid #ddd;
	padding-top: 12px;
	padding-bottom: 12px;
  font-weight: bold;
  color: ${props => props.color};
`;

const TBODY = styled.tbody`
	font-size: 20px;
`;

const Highlight = styled.div`
  font-weight: 900;
  color: blue;
`;

const NumberText = styled.div`
  font-weight: 600;
`;

const NumberTextUnderline = styled.div`
  font-weight: 600;
  text-decoration: underline !important;
`;

const TotalErrorTable = (props: any) => {
  const { t } = useTranslation();
  const [currentClick, setCurrentClick] = useState<number>(-1);
  const percentFormatter = (val: number) => { 
    const newval = Math.round(val);
    if (val == 100) { 
      return <Highlight>{ newval }%</Highlight>
    }
    return <NumberText>{ newval }%</NumberText>;
  }
  
  const numberHeader = (val: number, title: string, type: string, category: string, index: number) => {
    if (title === '발생건수') { 
      if (type === 'total') {
        return <NumberText>{val}</NumberText>;
      }
      return <NumberTextUnderline><a onClick={() => openWindow(index, category, type)}>{val}</a></NumberTextUnderline>;
    }
    return <NumberText>{val}</NumberText>;
  }
  
  const openWindow = (index:number, category: string, type: string) => {
    setCurrentClick(index);
    if (category === '5202') {
      window.open('/fdcinterlock?category=' + category + '&type=' + type, '_blank')?.focus();
    } else {
      window.open('/panelinterlock?category=' + category + '&type=' + type, '_blank')?.focus();
    }
  }

  const getRow = (item: any, index: number) => { 
    const title = item.title === "발생건수" ? t("@NUMBER_OCCURRENCES") 
                : item.title === "처리" ?  t("@PROCESSING") 
                : item.title === "완료율" ? t("@COMPLETION_RATE") 
                : "";
    let category:string = "";
    switch (item.category) {
      case "5202" :
        category = "FDC";
        break;
      case '5006' :
        category = t("@MANUAL_INTERLOCK");
        break;
      default :
        if(item.interlockMajorName.includes("(PV)")){
          category = `${t("@EQP_FAILURE")} (PV)`;         //설비이상 (PV)
        }
        else if(item.interlockMajorName.includes("(SV)")){
          category = `${t("@EQP_FAILURE")} (SV)`;         //설비이상 (SV)
        }
        else if(item.interlockMajorName.includes("SPC")){
          category = `SPC ${t("@FAILURE")}`;              //SPC 이상
        }
        else if(item.interlockMajorName.includes("약품")){
          category = `${t("@CHEM")} ${t("@FAILURE")}`;    //약품 이상
        }
    }
    return <>
          <TDBOLD color={(item.title === '발생건수') ? "#000" : "#eee"}>
          {/* {item.category === '5202' ? 'FDC' : ( item.category === '5006' ? t("@MANUAL_INTERLOCK") : item.interlockMajorName )} */}
          {category}
          </TDBOLD>
					<TDBOLD>{ title }</TDBOLD>
          <TD>
            {(item.title === '완료율') ? percentFormatter(item.total) : numberHeader(item.total, item.title, 'total', item.category, index + 1)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.lastMonth) : numberHeader(item.lastMonth, item.title, 'lastMonth', item.category, index + 2)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.thisMonth) : numberHeader(item.thisMonth, item.title, 'thisMonth', item.category, index + 3)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.week) : numberHeader(item.week, item.title, 'week', item.category, index + 4)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.firstDay) : numberHeader(item.firstDay, item.title, 'firstDay', item.category, index + 5)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.secondDay) : numberHeader(item.secondDay, item.title, 'secondDay', item.category, index + 6)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.thirdDay) : numberHeader(item.thirdDay, item.title, 'thirdDay', item.category, index + 7)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.fourthDay) : numberHeader(item.fourthDay, item.title, 'fourthDay', item.category, index + 8)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.fifthDay) : numberHeader(item.fifthDay, item.title, 'fifthDay', item.category, index + 9)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.sixthDay) : numberHeader(item.sixthDay, item.title, 'sixthDay', item.category, index + 10)}
					</TD>
					<TD>
						{(item.title === '완료율') ? percentFormatter(item.seventhDay) : numberHeader(item.seventhDay, item.title, 'seventhDay', item.category, index + 11)}
					</TD>
			</>;
  }

  const getDataRows = (data: any) => { 
    data.forEach((item: any) => {
      if (item.category === '5001') { // PV
        item.index = 2;
      } else if (item.category === '5002') { // SV
        item.index = 3;
      } else if (item.category === '5003' || item.category === '5103') { // SPC
        item.index = 1;
      } else if (item.category === '5202') { // FDC
        item.index = 4;
      } else if (item.category === '5006') { // ETC
        item.index = 6;
      } else if (item.category === '5008') { // 약품 이상
        item.index = 5;
      } else { 
        item.index = 7;
      }
    });

    for (let i = 0; i < data.length; i++) { 
      for (let j = i + 1; j < data.length; j++) { 
        if (data[i].index > data[j].index) { 
          let tmp = data[i];
          data[i] = data[j];
          data[j] = tmp;
        }
      }
    }
    return data.map((item:any, index: number) => { 
      return <TR key={index} color={(item.title === '발생건수') ? "rgb(218, 238, 243)" : "#fff"}>{ getRow(item, 1000 * ( index + 1)) }</TR>;
    });
	}

  return <>
    <DIV>
      <TABLE>
        <THEAD>
          <TR>
            <TH rowSpan={3}>{t("@COL_ABNORMAL_ITEM")}</TH>     {/* 이상항목 */}
            <TH rowSpan={3}>{t("@COL_DIVISION")}</TH>         {/* 구분 */}
            <TH>{ getDateOfDays(0).getFullYear() + 'Y' }</TH>
            <TH colSpan={2}>{`${t("@COL_MONTH")}(Month)`}</TH>      {/* 월(Month) */}
            <TH rowSpan={3}>{ `${t("@PREVIOUS_WEEK")}(${getWeekNumber(getDateOfDays(-7))})` }</TH>
            <TH colSpan={7}>{`D-7 (${t("@COL_LAST_7DAYS")})`}</TH>   {/* D-7 (최근 7일) */}
          </TR>
          <TR>
            <TH rowSpan={2}>Total</TH>
            <TH>{formatAsEnglishMonth(getToday().getMonth() - 1) }</TH>
            <TH>{formatAsEnglishMonth(getToday().getMonth())}</TH>
            <TH>{ getWeekNumber(getDateOfDays(-5)) }</TH>
            <TH>{ getWeekNumber(getDateOfDays(-4)) }</TH>
            <TH>{ getWeekNumber(getDateOfDays(-3)) }</TH>
            <TH>{ getWeekNumber(getDateOfDays(-2)) }</TH>
            <TH>{ getWeekNumber(getDateOfDays(-1)) }</TH>
            <TH>{ getWeekNumber(getDateOfDays(0)) }</TH>
            <THBOLD>{ getWeekNumber(getDateOfDays(1)) }</THBOLD>
          </TR>
          <TR>
            <TH>{t("@COL_PREVIOUS_MONTH")}</TH>   {/* 전월 */}
            <TH>{t("@COL_CURRENT_MONTH")}</TH>    {/* 당월 */}
            <TH>{formatAsKoreanDate(getDateOfDays(-6))}</TH>
            <TH>{formatAsKoreanDate(getDateOfDays(-5))}</TH>
            <TH>{formatAsKoreanDate(getDateOfDays(-4))}</TH>
            <TH>{formatAsKoreanDate(getDateOfDays(-3))}</TH>
            <TH>{formatAsKoreanDate(getDateOfDays(-2))}</TH>
            <TH>{formatAsKoreanDate(getDateOfDays(-1))}</TH>
            <THBOLD>{formatAsKoreanDate(getDateOfDays(0))}</THBOLD>
          </TR>
        </THEAD>
        <TBODY>
          { getDataRows(props.data) }
        </TBODY>
      </TABLE>
    </DIV>
	</>
};

export default TotalErrorTable;
