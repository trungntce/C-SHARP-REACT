namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Unity.Interception.Utilities;

public class MoniteringService : MinimalApiService, IMinimalApi
{
	public MoniteringService(ILogger<MoniteringService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
		// 공정별제조현황 모니터링 실적 데이터
		group.MapGet("real", nameof(realList));

		group.MapGet("recognition", nameof(Recognition));

		// 인터락 모니터링 4분할 데이터
		group.MapGet("param", nameof(ParamList));
		group.MapGet("ipqc", nameof(IpqcList));
		group.MapGet("spc", nameof(SpcList));
		group.MapGet("analysis", nameof(Analysis));

		// 불량률 BBT 수율 데이터

		return RouteAllEndpoint(group);
	}

	public static List<DataTable> List()
	{
		//DataTable dt1 = DataContext.StringDataSet("@Monitering.InnerOuterList").Tables[0];
		//DataTable dt2 = DataContext.StringDataSet("@Monitering.InnerList").Tables[0];
		//DataTable dt3 = DataContext.StringDataSet("@Monitering.OuterList").Tables[0];

		List<DataTable> lstData = new List<DataTable>();
		//lstData.Add(dt1);
		//lstData.Add(dt2);
		//lstData.Add(dt3);

		return lstData;
	}

	[ManualMap]
	public static List<IEnumerable<IDictionary>> realList()
	{
		dynamic obj = new ExpandoObject();

		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@Monitering.InnerOuterRealList", obj).Tables[0]);
		IEnumerable<IDictionary> dt2 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@Monitering.InnerRealList", obj).Tables[0]);
		IEnumerable<IDictionary> dt3 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@Monitering.OuterRealList", obj).Tables[0]);



		List<IEnumerable<IDictionary>> lstData = new List<IEnumerable<IDictionary>>();
		lstData.Add(dt1);
		lstData.Add(dt2);
		lstData.Add(dt3);


		return lstData;
	}

	[ManualMap]
	public static IEnumerable<IDictionary> Recognition()
	{
		dynamic obj = new ExpandoObject();
		obj.FromDt = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 8, 0, 0);
		obj.ToDt = DateTime.Now;
		DataTable dt1 = DataContext.StringDataSet("@Barcode.RecognitionList", RefineExpando(obj)).Tables[0];


		return ToDic(dt1);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> IpqcList()
	{
		dynamic obj = new ExpandoObject();

		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@Monitering.IpqcList", obj).Tables[0]);

		return dt1;
	}

	[ManualMap]
	public static IEnumerable<IDictionary> SpcList()
	{
		dynamic obj = new ExpandoObject();

		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@Monitering.SpcList", obj).Tables[0]);

		return dt1;
	}

	[ManualMap]
	public static IEnumerable<IDictionary> Analysis()
	{
		dynamic obj = new ExpandoObject();

		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@Monitering.AnalysisList", obj).Tables[0]);


		return dt1;
	}

	[ManualMap]
	public static IEnumerable<IDictionary> ParamList(DateTime fromDt, DateTime toDt)
	{
		dynamic obj = new ExpandoObject();
		obj.FromDt = fromDt;
		obj.ToDt = toDt;

		//DataTable dt = DataContext.StringDataSet("@Monitering.ParamErrorList", RefineExpando(obj, true)).Tables[0];

		DataTable dt = DataContext.DataSet("dbo.sp_panel_4m_param_row_group_list", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt);
	}

}

