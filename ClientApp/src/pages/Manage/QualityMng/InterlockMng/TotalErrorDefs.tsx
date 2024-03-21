import React from 'react';
import { percentFormat } from '../../../../common/utility';
import { useTranslation } from 'react-i18next';

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

export const TotalErrorDefs = () => {
	const { t } = useTranslation();
	return [
		{
			//headerName: "이상항목",
			headerName: t("@COL_ABNORMAL_ITEM"),
			headerClass: "no-leftborder",
			field: "interlockMajorName",
			cellStyle: (d: any) => {
				return {
					textAlign: "center",
					background: d.data.title === '발생건수' ? "#A8DF8E" : "",
					color: d.data.title === '발생건수' ? "#000" : "#00000030",
					fontWeight: d.data.title === '발생건수' ? "bold" : "",
					fontSize: 19
				}
			},
			cellRenderer: (d: any) => {
				if (d.data.interlockMajorName === '5202') {
					return 'FDC'
				}
				else return d.data.interlockMajorName
			}
		},
		{
			//headerName: "구분",
			headerName: t("@COL_DIVISION"),
			headerClass: "no-leftborder",
			field: "title",
			cellStyle: (d: any) => {
				return {
					textAlign: "center",
					background: d.data.title === '발생건수' ? "#A8DF8E" : "",
					fontSize: 19,
					fontWeight: d.data.title === '발생건수' ? "bold" : "",
				}
			},
		},
		{
			headerName: getDateOfDays(0).getFullYear() + 'Y',
			headerClass: "no-leftborder",

			children: [
				{
					headerName: "Total",
					field: "total",
					cellStyle: (d: any) => {
						return {
							textAlign: "center",
							background: d.data.title === '발생건수' ? "#A8DF8E" : "",
							fontSize: 19,
							fontWeight: d.data.title === '발생건수' ? "bold" : "",
						}
					},
					width: 120,
					cellRenderer: (d: any) => {
						if (d.data.title === '완료율') {
							return percentFormat(d.data.total)
						}
						else return d.data.total
					}
				},
			]
		},
		{
			//headerName: "월(Month)",
			headerName: t("@COL_MONTH"),
			headerClass: "no-leftborder",

			children: [
				{
					headerName: formatAsEnglishMonth(getToday().getMonth() - 1),
					headerClass: "no-leftborder",
					children: [
						{
							//headerName: "전월",
							headerName: t("@COL_PREVIOUS_MONTH"),
							field: "lastMonth",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.lastMonth)
								}
								else return d.data.lastMonth
							}
						}
					]
				},
				{
					headerName: formatAsEnglishMonth(getToday().getMonth()),
					headerClass: "no-leftborder",
					children: [
						{
							//headerName: "당월",
							headerName: t("@COL_CURRENT_MONTH"),
							field: "thisMonth",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.thisMonth)
								}
								else return d.data.thisMonth
							}
						}
					]
				},
			]
		},
		{

			//headerName: "전 주(" + getWeekNumber(getDateOfDays(-7)) + ")",
			headerName: `${t("@COL_LAST_WEEK")} ( ${getWeekNumber(getDateOfDays(-7))} ) `,
			headerClass: "no-leftborder",
			field: "week",
			cellStyle: (d: any) => {
				return {
					textAlign: "center",
					background: d.data.title === '발생건수' ? "#A8DF8E" : "",
					fontSize: 19,
					fontWeight: d.data.title === '발생건수' ? "bold" : "",
				}
			},
			width: 120,
			cellRenderer: (d: any) => {
				if (d.data.title === '완료율') {
					return percentFormat(d.data.week)
				}
				else return d.data.week
			}
		},
		{
			//headerName: "D-7 (최근 7일)",
			headerName: `D-7 (${t("@COL_LAST_7DAYS")})`,
			headerClass: "no-leftborder",
			children: [
				{
					headerName: getWeekNumber(getDateOfDays(-5)),
					headerClass: "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(-6)),
							field: "firstDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.firstDay)
								}
								else return d.data.firstDay
							}
						}
					]
				},
				{
					headerName: getWeekNumber(getDateOfDays(-4)),
					headerClass: "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(-5)),
							field: "secondDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.secondDay)
								}
								else return d.data.secondDay
							}
						}
					]
				},
				{
					headerName: getWeekNumber(getDateOfDays(-3)),
					headerClass: "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(-4)),
							field: "thirdDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.thirdDay)
								}
								else return d.data.thirdDay
							}
						}
					]
				},
				{
					headerName: getWeekNumber(getDateOfDays(-2)),
					headerClass: "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(-3)),
							field: "fourthDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.fourthDay)
								}
								else return d.data.fourthDay
							}
						}
					]
				},
				{
					headerName: getWeekNumber(getDateOfDays(-1)),
					headerClass: "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(-2)),
							field: "fifthDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.fifthDay)
								}
								else return d.data.fifthDay
							}
						}
					]
				},
				{
					headerName: getWeekNumber(getDateOfDays(0)),
					headerClass: "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(-1)),
							field: "sixthDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.sixthDay)
								}
								else return d.data.sixthDay
							}
						}
					]
				},
				{
					headerName : getWeekNumber(getDateOfDays(1)),
					headerClass : "no-leftborder",
					children: [
						{
							headerName: formatAsKoreanDate(getDateOfDays(0)),
							field: "seventhDay",
							width: 120,
							cellStyle: (d: any) => {
								return {
									textAlign: "center",
									background: d.data.title === '발생건수' ? "#A8DF8E" : "",
									fontSize: 19,
									fontWeight: d.data.title === '발생건수' ? "bold" : "",
								}
							},
							cellRenderer: (d: any) => {
								if (d.data.title === '완료율') {
									return percentFormat(d.data.seventhDay)
								}
								else return d.data.seventhDay
							}
						}
					]
				}
			]
		}
	];
}