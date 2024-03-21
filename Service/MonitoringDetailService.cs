namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Math;

public class MonitoringDetailService : MinimalApiService, IMinimalApi, Map.IMap
{
    public MonitoringDetailService(ILogger<MonitoringDetailService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/getequip", nameof(GetEquip)); // 나중에 지울 것

        group.MapGet("/eqpreallist", nameof(EqpRealList));
        group.MapGet("/eqprealstatus", nameof(EqpRealStatusListCache));
        group.MapGet("/filter", nameof(EqpFilterList));
        group.MapGet("/eqp4mmodel", nameof(Eqp4MModelList));

        group.MapGet("/laoutoption", nameof(GetLayoutOption));

        group.MapGet("/detailcontents", nameof(DetailContenets));

        group.MapGet("detailtotalcontents", nameof(DetailTotalContenets));

        group.MapGet("/mdctnt", nameof(MiddleContents));

        group.MapGet("/matrixcontents", nameof(MatrixContents));

        group.MapGet("/getredirecturl", nameof(RedirectUrl));

        group.MapGet("/aoiyield", nameof(AoiYield));

		group.MapGet("/fqcyielddiff", nameof(FqcYieldDiff));

        group.MapGet("/bbtyield", nameof(BBTList));

        group.MapGet("/realst", nameof(RealSt));

        group.MapGet("/eqptypestatistics", nameof(EqpTypeStatistics));

        group.MapGet("/getmodellist", nameof(ModelList));

        group.MapGet("/getmodelhis", nameof(ModelHistory));

        group.MapGet("/getmodelrealhis", nameof(ModelRealHistory));

        group.MapGet("/getequipalarmlist", nameof(GetEquipAlarmList));

        group.MapGet("/performancelist", nameof(PerformanceList));

        group.MapGet("/eqpproductivity", nameof(EqpProductivity));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static DataTable PerformanceList(string? eqpcode)
    {
        dynamic obj = new ExpandoObject();
        obj.eqpCode = eqpcode;

        return DataContext.StringDataSet("@MonitoringDetail.PerformansList", RefineExpando(obj,true)).Tables[0];
    }

    [ManualMap]
    public static DataTable ModelList(string? facno, string? roomname, string? eqptype)
    {
        dynamic obj = new ExpandoObject();
        obj.facNo = facno;
        obj.roomName = roomname;
        obj.eqpTyoe = eqptype;

        return DataContext.StringDataSet("@MonitoringDetail.GetModel", RefineExpando(obj)).Tables[0];
    }

    [ManualMap]
    public static DataTable ModelHistory(string? eqpcode)
    {

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        dynamic obj = new ExpandoObject();
        obj.eqpCode = eqpcode;


        DataTable dt = db.ExecuteStringDataSet("@MonitoringDetail.GetModelHis", obj).Tables[0];

        return dt;
    }

    [ManualMap]
    public static DataTable GetEquipAlarmList(string? eqpcode)
    {
        /*var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        dynamic obj = new ExpandoObject();
        obj.eqpCode = eqpcode;



        DataTable dt = db.ExecuteStringDataSet("@MonitoringDetail.GetModelRealHis_TableInfo", obj).Tables[0];
        if (dt.Rows.Count == 0)
        {
            return null;
        }

        DataTable result = null;
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            string rawType = dt.Rows[i].TypeCol<string>("raw_type");
            obj.TableName = dt.Rows[i].TypeCol<string>("tablename");
            if (rawType.ToUpper() == "P")
            {
                //PC 설비

            }
            else
            {
                //PLC 설비
                result = db.ExecuteStringDataSet("@MonitoringDetail.GetEqpAlarmList_PLC", obj).Tables[0];
                if (result.Rows.Count > 0)
                {
                    return result;
                }
            }
        }*/

        // 파라미터 이상 알람 데이터 뽀려오기 - 설비상세  (운기백 담당) 

        DateTime now = DateTime.Now;

        DateTime to = new(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second - (now.Second % 10));
        DateTime from = to.AddSeconds(-1800);

        //dynamic obj1 = new ExpandoObject();
        //obj1.FromDt = "2023-07-16 17:16:00"; // 5분전
        //obj1.ToDt = "2023-07-16 17:20:00"; // 현재시간
        //obj1.Workorder = null;
        //obj1.EqpCode = "M-077-01-V001";
        //obj1.ModelCode = null;
        //obj1.ModelName = null;

        dynamic obj1 = new ExpandoObject();
        obj1.FromDt = from; // 5분전
        obj1.ToDt = to; // 현재시간
        obj1.Workorder = null;
        obj1.EqpCode = eqpcode;
        obj1.ModelCode = null;
        obj1.ModelName = null;

        DataTable dt1 = DataContext.DataSet("dbo.sp_panel_4m_param_row_group_list", RefineExpando(obj1, true)).Tables[0];

        return dt1;
    }

    [ManualMap]
    public static DataTable ModelRealHistory(string? eqpcode)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpcode;

        DataTable dt = db.ExecuteStringDataSet("@MonitoringDetail.GetModelRealHis_TableInfo", obj).Tables[0];
        if(dt.Rows.Count == 0)
        {
            return null;
        }
        //string rawType = dt.Rows[0].TypeCol<string>("raw_type");
        //obj.TableName = dt.Rows[0].TypeCol<string>("tablename");



        DataTable result = null;
        for(int i = 0; i < dt.Rows.Count; i++)
        {
            string rawType = dt.Rows[i].TypeCol<string>("raw_type");
            obj.TableName = dt.Rows[i].TypeCol<string>("tablename");
            if (rawType.ToUpper() == "P")
            {
                //PC 설비
                result = db.ExecuteStringDataSet("@MonitoringDetail.GetModelRealHis_PC", obj).Tables[0];

                if(result.Rows.Count > 0)
                {
                    return result;
                }
            }
            else
            {

                //PLC 설비
                result = db.ExecuteStringDataSet("@MonitoringDetail.GetModelRealHis_PLC", obj).Tables[0];
                if (result.Rows.Count > 0)
                {
                    return result;
                }
            }

        }
        //DataTable dt = db.ExecuteStringDataSet("@MonitoringDetail.GetModelRealHis", obj).Tables[0];
        return dt;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RealSt(string eqpcode)
    {
        var now = DateTime.Now.ToString("yyyy-MM-dd 08:00:00");

        var filter = DataContext.StringDataSet("@MonitoringDetail.FilterCollectionType").Tables[0];

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        dynamic obj = new ExpandoObject();

        obj.eqpCode = eqpcode;
        obj.mesDt = now;

        DataTable dt =  db.ExecuteStringDataSet("@MonitoringDetail.EqpRealst", obj).Tables[0];

        return ToDic(dt);
    }


    [ManualMap]
    public static List<IEnumerable<IDictionary>> AoiYield()
    {
        dynamic obj = new ExpandoObject();

		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.AoiMainYield", obj).Tables[0]);
		IEnumerable<IDictionary> dt2 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.AoiListYield", obj).Tables[0]);
		IEnumerable<IDictionary> dt3 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.AoiTotalYield", obj).Tables[0]);


		List<IEnumerable<IDictionary>> lstData = new List<IEnumerable<IDictionary>>();
		lstData.Add(dt1);
		lstData.Add(dt2);
        lstData.Add(dt3);

        return lstData;

	}

	[ManualMap]
	public static List<IEnumerable<IDictionary>> BBTList()
	{
		dynamic obj = new ExpandoObject();

		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSet("@MonitoringDetail.BBTList", RefineExpando(obj, true)).Tables[0]);
		IEnumerable<IDictionary> dt2 = ToDic(DataContext.StringDataSet("@MonitoringDetail.BBTTotal", RefineExpando(obj, true)).Tables[0]);

		List<IEnumerable<IDictionary>> lstData = new List<IEnumerable<IDictionary>>();
		lstData.Add(dt1);
		lstData.Add(dt2);

		return lstData;
	}

	[ManualMap]
    public static List<IEnumerable<IDictionary>> FqcYieldDiff()
    {

		IEnumerable<IDictionary> dt = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.FqcYieldDiff").Tables[0]);
		IEnumerable<IDictionary> dt1 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.FqcYieldMonth").Tables[0]);
		IEnumerable<IDictionary> dt2 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.FqcYieldWeek").Tables[0]);
        IEnumerable<IDictionary> dt3 = ToDic(DataContext.StringDataSetEx(Setting.ErpConn, "@MonitoringDetail.FqcYieldDays").Tables[0]);



		Dictionary<string, object> total = new Dictionary<string, object>();

		List<IEnumerable<IDictionary>> lstData = new List<IEnumerable<IDictionary>>();
        lstData.Add(dt);
		lstData.Add(dt1);
		lstData.Add(dt2);
		lstData.Add(dt3);


		return lstData;
    }

    [ManualMap]
    public static string RedirectUrl(string eqpcode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpcode;

        return DataContext.StringValue<string>("@MonitoringDetail.RedirectUrl", obj);
    }

    [ManualMap]
    public static List<DataTable> GetEquip(string mesDate, string equipment)
    {
        dynamic obj = new ExpandoObject();
        obj.MesDate = mesDate;
        obj.Equip = equipment;
        obj.Start = $"{mesDate} 08:00:00";
        var list = new List<DataTable>();

        foreach (var i in DataContext.StringDataSet("@MonitoringDetail.Select", obj).Tables)
        {
            list.Add(i);
        }

        return list;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GetLayoutOption(string roomname)
    {
        dynamic obj = new ExpandoObject();
        obj.Roomname = roomname;

        return ToDic(DataContext.StringDataSet("@MonitoringDetail.LayoutOption", obj).Tables[0]);
    }

    [ManualMap]
    public static EquipRealList EqpRealList(string? facno, string? roomname, string? eqptype, int? step)
    {
        dynamic obj = new ExpandoObject();
        obj.FacNo = facno;
        obj.RoomName = roomname;
        obj.EqpType = eqptype;
        obj.Step = step;

        return new EquipRealList(DataContext.StringEntityList<EquipRealEntity>("@MonitoringDetail.EqpRealList", RefineExpando(obj)));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> EqpRealStatusList()
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet("@MonitoringDetail.EqpRealStatusList", new { }).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> EqpRealStatusListCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddSeconds(29),
            EqpRealStatusList);

        return list;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> EqpFilterList(string? ftType)
    {
        dynamic obj = new ExpandoObject();
        obj.FtType = ftType;

        return ToDic(DataContext.StringDataSet("@MonitoringDetail.EqpFilterList", obj).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> Eqp4MModelList(string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.EqpCode = eqpCode;

        return ToDic(DataContext.StringDataSet("@MonitoringDetail.Eqp4MModelList", RefineExpando(obj)).Tables[0]);
    }

    [ManualMap]
    public static DataTable DetailContenets(string? eqpcode)
    {
        DateTime formatDt = DateTime.Now.AddHours(-8);

        dynamic obj = new ExpandoObject();
        obj.mesDt = formatDt.ToString("yyyy-MM-dd");
        obj.eqpCode = eqpcode;

        return DataContext.StringDataSet("@MonitoringDetail.DetailContents", RefineExpando(obj)).Tables[0];
    }

    [ManualMap]
    public static Dictionary<string, DataTable> DetailTotalContenets(string facno, string eqptype, int beforeday)
    {
        DateTime formatDt = DateTime.Now.AddHours(-8);

        dynamic obj = new ExpandoObject();
        obj.mesDt = formatDt.ToString("yyyy-MM-dd 08:00:00");
        obj.beforeDay = beforeday;
        obj.facNo = facno;
        obj.eqpType = eqptype;


        Dictionary<string, DataTable> data = new Dictionary<string, DataTable>();

        var resTable = DataContext.StringDataSet("@MonitoringDetail.DetailTotalContents", RefineExpando(obj)).Tables;

        data.Add("day_total", resTable[0]);
        data.Add("transition", resTable[1]);

        return data;
    }

    [ManualMap]
    public static Dictionary<string, DataTable> MiddleContents(string? facno, string roomname)
     {
        dynamic obj = new ExpandoObject();
        obj.FacNo = facno;
        obj.RoomName = roomname;

        Dictionary<string, DataTable> data = new Dictionary<string, DataTable>();

        var resTable = DataContext.StringDataSet("@MonitoringDetail.MiddleContents", RefineExpando(obj)).Tables;

        data.Add("res1", resTable[0]);
        data.Add("res2", resTable[1]);
        data.Add("res3", resTable[2]);

        return data;
    }

    [ManualMap]
    public static DataTable EqpTypeStatistics (string roomname)
    {

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        dynamic obj = new ExpandoObject();
        obj.roomName = roomname;


        return db.ExecuteStringDataSet("@MonitoringDetail.EqpTypeStatistics", RefineExpando(obj, true)).Tables[0];
        //return DataContext.StringDataSet("@MonitoringDetail.EqpTypeStatistics", RefineExpando(obj, true)).Tables[0];
    }

    [ManualMap]
    public static IEnumerable<IDictionary> MatrixContents(string roomname)
    {
        dynamic obj = new ExpandoObject();
        obj.RoomName = roomname;


        return ToDic(DataContext.StringDataSet("@MonitoringDetail.MatrixContents", RefineExpando(obj)).Tables[0]);
    }

    [ManualMap]
    public static DataTable EqpProductivity(DateTime toDt, int? roomName, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ToDt = toDt;
        obj.RoomName = roomName;
        obj.EqpCode = eqpCode;

        return DataContext.StringDataSet("@MonitoringDetail.EqpProductivity", RefineExpando(obj)).Tables[0];
    }

    [ManualMap]
    public static DataTable RoomListAllCache(string? facno)
    {
        dynamic obj = new ExpandoObject();
        obj.FacNo = facno;
        var list = UtilEx.FromCache(
            BuildCacheKey($"room_list_{facno}"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => {
                return DataContext.StringDataSet("@MonitoringDetail.RoomList", RefineExpando(obj)).Tables[0];
            });

        return list;
    }

    public static Map GetMap(string? category = null)
    {
        return RoomListAllCache(category).AsEnumerable()
       .OrderBy(x => x.TypeCol<string>("room_name"))
       .Select(y => {
           return new MapEntity(
               y.TypeCol<string>("room_name"),
               y.TypeCol<string>("room_name_des"),
               "",
               'Y');
       }).ToMap();
    }

    public static void RefreshMap()
    {
        throw new NotImplementedException();
    }
}
