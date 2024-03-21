namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Drawing2D;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class TraceService : MinimalApiService, IMinimalApi
{
    public TraceService(ILogger<TraceService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/4m", nameof(List4M));
        group.MapGet("/multi", nameof(ListMultiCondition));
        group.MapPost("/4m/multi", nameof(List4MMultiCondition));

        group.MapGet("/job", nameof(JobList));
        group.MapGet("/job/select", nameof(JobSelect));
        group.MapGet("/panel", nameof(PanelList));
        group.MapGet("/piece", nameof(PieceList));
        group.MapGet("/piecemap", nameof(PieceMapList));
        group.MapGet("/panelrecipe", nameof(PanelRecipeList));
        group.MapGet("/panelparam", nameof(PanelParamList));

        group.MapGet("/rollmap", nameof(RollMapList));
        group.MapGet("/panelbygroup", nameof(PanelListByGroupKey));
        group.MapGet("/layup", nameof(LayupList));
        group.MapGet("/panelpiecemap", nameof(PanelPieceMapList));

        group.MapGet("/defect", nameof(DefectList));
        group.MapGet("/spc", nameof(SpcList));
        group.MapGet("/qtime", nameof(QTimeList));

        group.MapGet("/param", nameof(ParamList));
        group.MapGet("/paramex", nameof(ParamListEx));
        group.MapGet("/recipe", nameof(RecipeList));
        group.MapGet("/recipeex", nameof(RecipeListEx));

        group.MapGet("/raw", nameof(RawList));
        group.MapGet("/rawcandle", nameof(RawCancleList));
        group.MapGet("/rawcandlemin", nameof(RawCancleMinList));

        group.MapGet("/panelrejudge", nameof(PanelRejudge));

        group.MapGet("/materialhistory", nameof(MaterialHistory));

        group.MapGet("/chemjudgeworkorder", nameof(ChemJudgeListForWorkorder));
        group.MapGet("/chemjudgepanelid", nameof(ChemJudgeListForPanelId));

        group.MapGet("/blackholecnt", nameof(BlackHoleCnt));
        group.MapGet("/blackholetotal", nameof(BlackHoleTotal));
        group.MapGet("/blackhole", nameof(BlackHoleList));
        group.MapGet("/blackholepnlthickness", nameof(BlackHolePnlThickness));

		group.MapGet("/aoitotal", nameof(AoiTotal));
        group.MapGet("/aoicols", nameof(AoiCols));
        group.MapGet("/aoidetail", nameof(AoiDetail));

        group.MapGet("/aoipnltotal", nameof(AoiPnlTotal));

		group.MapGet("/chem", nameof(ChemList));

        group.MapGet("/panel4m", nameof(Panel4MList));
        group.MapGet("/paneljudgedx", nameof(PanelJudgeDx));
        group.MapGet("/rawtablecalc", nameof(RawTableSelectCalc));

        return RouteAllEndpoint(group);
    }

    public static IEnumerable<IDictionary> List(string panelId, char? operType)
    {
        panelId = panelId.Trim();

        DataTable dt = DataContext.DataSet("dbo.sp_panel_item_trace", new { panelId }).Tables[0];

        if (operType == 'B')
        {
            dt.DefaultView.RowFilter = "panel_id is not null";
            dt = dt.DefaultView.ToTable();
        }
        else if (operType == 'R')
        {
            dt.DefaultView.RowFilter = "recipe_judge is not null and param_judge is not null";
            dt = dt.DefaultView.ToTable();
        }

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        FindLabel(dt, "paramJudge", "paramJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));
        FindLabel(dt, "recipeJudge", "recipeJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListMultiCondition(DateTime fromDt, DateTime toDt, string? panelId, string? eqpCode, string? toolCode, string? workerCode, string? materialLot, string? materialCode)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt.AddDays(1);
        obj.PanelId = panelId;
        obj.EqpCode = eqpCode;
        obj.ToolCode = toolCode;
        obj.WorkerCode = workerCode;
        obj.MaterialLot = materialLot;
        obj.MaterialCode = materialCode;

        // 검색조건 없는 경우 리턴
        if (string.IsNullOrWhiteSpace(eqpCode) &&
            string.IsNullOrWhiteSpace(toolCode) &&
            string.IsNullOrWhiteSpace(workerCode) &&
            string.IsNullOrWhiteSpace(materialLot) &&
            string.IsNullOrWhiteSpace(materialCode))
            return new List<IDictionary>();

        DataTable dt = DataContext.DataSet("dbo.sp_panel_item_trace_multi_condition", obj).Tables[0];
        
        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        FindLabel(dt, "paramJudge", "paramJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));
        FindLabel(dt, "recipeJudge", "recipeJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> List4M(string workorder, char? operType)
    {
        workorder = workorder.Trim();

        DataTable dt = DataContext.DataSet("dbo.sp_panel_4m_trace", new { workorder }).Tables[0];

        if (operType == 'B')
        {
            dt.DefaultView.RowFilter = "workorder is not null";
            dt = dt.DefaultView.ToTable();
        }

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        Func<string, string> reworkInitialName = (string value) => {
            var reworkName = CodeService.CodeName("REWORKREASON", value);
            var initialName = CodeService.CodeName("INITREASON", value);

            if (!string.IsNullOrWhiteSpace(reworkName) && reworkName != value)
                return reworkName;

            if (!string.IsNullOrWhiteSpace(initialName) && initialName != value)
                return initialName;

            return value;
        };

        FindLabel(dt, "reworkInitialCode", "reworkInitialName", reworkInitialName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> List4MMultiCondition(DateTime fromDt, DateTime toDt, [FromBody] Dictionary<string, string>? dic = null)
    {
        var emptyToNull = (string? s) =>  string.IsNullOrWhiteSpace(s) || s.Trim() == "[]" ? null : s;

		dynamic obj     = new ExpandoObject();

        obj.FromDt = fromDt;
        obj.ToDt = toDt;

        obj.OperJson    = emptyToNull(dic.SafeTypeKey<string>("operJson"));
        obj.ModelJson   = emptyToNull(dic.SafeTypeKey<string>("modelJson"));
		obj.EqpJson     = emptyToNull(dic.SafeTypeKey<string>("eqpJson"));
        obj.WorkerJson  = emptyToNull(dic.SafeTypeKey<string>("workerJson"));
        obj.ToolJson    = emptyToNull(dic.SafeTypeKey<string>("toolJson"));

		obj.MatLotJson  = emptyToNull(dic.SafeTypeKey<string>("matLotJson"));
        obj.MatCodeJson = emptyToNull(dic.SafeTypeKey<string>("matCodeJson"));
        obj.RecipeJson  = emptyToNull(dic.SafeTypeKey<string>("recipeJson"));
        obj.ParamJson   = emptyToNull(dic.SafeTypeKey<string>("paramJson"));

		DataTable dt = DataContext.DataSet("dbo.sp_panel_4m_trace_multi_condition", obj).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IEnumerable<IDictionary>> RollMapList(string? panelId, string? rollId, string? groupKey)
    {
        DataSet ds = DataContext.DataSet("dbo.sp_roll_map_list_by_panel", new { panelId, rollId, groupKey });
        DataTable dtRollSplit = ds.Tables[0];
        DataTable dtRollItem = ds.Tables[1];

        FindLabel(dtRollSplit, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return new List<IEnumerable<IDictionary>>() { ToDic(dtRollSplit), ToDic(dtRollItem) };
    }

    [ManualMap]
    public static IEnumerable<IDictionary> LayupList(string panelId)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_panel_layup_list_by_panel", new { panelId }).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelPieceMapList(string panelId)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_panel_piece_map_list_by_panel", new { panelId }).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelListByGroupKey(string groupKey)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_panel_item_list_by_group_key", new { groupKey }).Tables[0];

        FindLabel(dt, "paramJudge", "paramJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));
        FindLabel(dt, "recipeJudge", "recipeJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PieceList(string? workorder, string? panelId, string? pieceId, string? trayId, string? boxId)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;
        obj.PanelId = panelId;
        obj.PieceId = pieceId;
        //obj.TrayId = trayId;
        //obj.BoxId = boxId;

        if(string.IsNullOrEmpty(workorder) &&
            string.IsNullOrEmpty(panelId) &&
            string.IsNullOrEmpty(pieceId) &&
            string.IsNullOrEmpty(trayId) &&
            string.IsNullOrEmpty(boxId))

            return Enumerable.Empty<IDictionary>();

        DataTable dt = DataContext.StringDataSet("@Trace.PieceList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PieceMapList(string panelId)
    {
        DataTable dt = DataContext.StringDataSet("@Trace.PieceMapList", new { panelId }).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> JobList(DateTime fromDt, DateTime toDt, string? workorder, string? lot, string? vendorCode, string? itemCode, string? itemName, string? modelCode, string? modelName, string? panelId, int? panelCnt)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.Workorder = workorder; // like 검색용
        obj.Lot = lot; // equal 검색용
        obj.VendorCode = vendorCode;
        obj.ItemCode = itemCode;
        obj.ItemName = itemName;
        obj.ModelCode = modelCode;
        obj.ModelName = modelName;
        obj.PanelId = panelId;
        obj.PanelCnt = panelCnt;

        return ToDic(DataContext.StringDataSet("@Trace.JobList", RefineExpando(obj, true)).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> JobSelect(string? workorder, string? panelId)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder; // like 검색용
        obj.PanelId = panelId;

        DataTable dt = DataContext.StringDataSet("@Trace.JobSelect", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "workorderInterlockCode", "workorderInterlockName", codeId => CodeService.CodeName("HOLDINGREASON", codeId));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelList(string workorder)
    {
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;

        return ToDic(DataContext.StringDataSet("@Trace.PanelList", RefineExpando(obj, true)).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelRecipeList(string itemKey)
    {
        return ToDic(DataContext.StringDataSet("@Trace.PanelRecipeList", new { itemKey }).Tables[0], (string s) => s);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelParamList(string itemKey)
    {
        return ToDic(DataContext.StringDataSet("@Trace.PanelParamList", new { itemKey }).Tables[0], (string s) => s);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RawList(DateTime fromDt, DateTime toDt, char rawType, string tableName, string columnName, string? eqpCode)
    {
        var toDtOnly = new DateOnly(toDt.Year, toDt.Month, toDt.Day);
        if(toDtOnly.ToDateTime(new TimeOnly()) == toDt)
            toDt = toDt.AddDays(1);

        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
                
        var format = DataContext.SqlCache.GetSingleSql("Trace.RawList");
        string sql;
        if(rawType == 'L')
        {
            sql = string.Format(format, tableName, columnName, string.Empty);
        }
        else
        {
            sql = string.Format(format, tableName, columnName, "and\tequip = @eqp_code");
            obj.EqpCode = eqpCode;
        }

        DataTable dt = DataContext.StringDataSet(sql, RefineExpando(obj, true)).Tables[0];
        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RawCancleList(DateTime fromDt, DateTime toDt, char rawType, string tableName, string columnName, string? eqpCode)
    {
        int left = 100;

        var span = toDt - fromDt;

        string formatParam;

        if (span.TotalDays >= 7)
        {
            formatParam = "yyyy-MM-dd HH";
        }
        else if (span.TotalHours >= 24)
        {
            formatParam = "yyyy-MM-dd HH:mm";
            left = 15; // 10분단위
        }
        else if (span.TotalHours >= 6)
        {
            formatParam = "yyyy-MM-dd HH:mm"; // 1분단위
        }
        else
        {
            formatParam = "yyyy-MM-dd HH:mm:ss"; // 10초단위
            left = 18;
        }

        return DoRawCancleList(formatParam, left, fromDt, toDt, rawType, tableName, columnName, eqpCode);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RawCancleMinList(DateTime fromDt, DateTime toDt, char rawType, string tableName, string columnName, string? eqpCode)
    {
        if ((toDt - fromDt) < TimeSpan.FromMinutes(10))
            return RawList(fromDt, toDt, rawType, tableName, columnName, eqpCode);

        string formatParam = "yyyy-MM-dd HH:mm";
        int left = 100;

        return DoRawCancleList(formatParam, left, fromDt, toDt, rawType, tableName, columnName, eqpCode);
    }


    [ManualMap]
    public static IEnumerable<IDictionary> DoRawCancleList(string formatParam, int left, DateTime fromDt, DateTime toDt, char rawType, string tableName, string columnName, string? eqpCode)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.Format = formatParam;
        obj.Left = left;
        obj.RightPad = (left == 15 || left == 18) ? "0" : "";

        var format = DataContext.SqlCache.GetSingleSql("Trace.RawCandleList");
        string sql;
        if (rawType == 'L')
        {
            sql = string.Format(format, tableName, PlcInfotableService.ToSelectName(columnName), string.Empty);
        }
        else
        {
            sql = string.Format(format, tableName, PlcInfotableService.ToSelectName(columnName), "and\tequip = @eqp_code");
            obj.EqpCode = CleanEqpCode(eqpCode);
        }

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        DataTable dt = db.ExecuteStringDataSet(sql, RefineExpando(obj, true)).Tables[0];
        return ToDic(dt);
    }

    [ManualMap]
    public static string CleanEqpCode(string? eqpCode)
    {
        if (string.IsNullOrWhiteSpace(eqpCode))
            return string.Empty;

        if (eqpCode.IndexOf(':') > 0)
        {
            var spts = eqpCode.Split(':');
            var rtn = spts[0];

            return rtn;
        }

        return eqpCode;
    }

    [ManualMap]
    public static IEnumerable<IDictionary> DefectList(string workorder, int operSeqNo)
    {
        var dt = DataContext.StringDataSet("@Trace.DefectList", new { workorder, operSeqNo }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> SpcList(long jobId, int operSeqNo, long operId, string workorder)
    {
        return ToDic(DataContext.StringDataSet("@Trace.SpcList", new { jobId, operSeqNo, operId, workorder }).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> QTimeList(string workorder, int toOperSeqNo)
    {
        return ToDic(DataContext.StringDataSet("@Trace.QTimeList", new { workorder, toOperSeqNo }).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ParamList(string eqpCode, string modelCode, int operSeqNo)
    {
        return ToDic(DataContext.StringDataSet("@Trace.ParamList", new { eqpCode, modelCode, operSeqNo }).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ParamListEx(DateTime fromDt, DateTime toDt, string eqpCode, string modelCode, int operSeqNo)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return ToDic(db.ExecuteStringDataSet("@Trace.ParamListEx", new { fromDt, toDt, eqpCode, modelCode, operSeqNo }).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RecipeList(string eqpCode, string modelCode, int operSeqNo)
    {
        return ToDic(DataContext.StringDataSet("@Trace.RecipeList", new { eqpCode, modelCode, operSeqNo }).Tables[0]);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RecipeListEx(DateTime fromDt, DateTime toDt, string eqpCode, string modelCode, int operSeqNo)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return ToDic(db.ExecuteStringDataSet("@Trace.RecipeListEx", new { fromDt, toDt, eqpCode, modelCode, operSeqNo }).Tables[0]);
    }

    [ManualMap]
    public static int PanelRejudge(string groupKey)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@Trace.PanelRejudge", new { groupKey });
    }

    [ManualMap]
    public static IEnumerable<IDictionary> MaterialHistory(string workorder)
    {
        DataTable dt;

        // 생산된 반제품 - WORKORDER
        // 생산된 반제품이 창고에 들어가면 SFG~~~~로 자재코드 부여
        if (workorder.ToUpper().Contains("SFG"))
        {
            dt = DataContext.StringDataSetEx(Setting.ErpConn, "@Trace.MaterialHistorySFG", new { workorder }).Tables[0];
        }
        else
        {
            dt = DataContext.StringDataSetEx(Setting.ErpConn, "@Trace.MaterialHistoryTcard", new { workorder }).Tables[0];
        }

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ChemJudgeListForWorkorder(string workorder)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_chem_judge_list_by_workorder", new { workorder }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ChemJudgeListForPanelId(string panelId)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_chem_judge_list_by_panel_id", new { panelId }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ChemList(long eqpId, DateTime startDt)
    {
        DataTable dt = DataContext.StringDataSet("@Trace.ChemList", new { eqpId, startDt }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> BlackHoleCnt(string? workorderList, string? panelId)
    {
        var dt = DataContext.StringDataSet("@Trace.BlackHoleCnt", new { workorderList, panelId }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
	public static IEnumerable<IDictionary> BlackHoleTotal(string workorder)
	{
		var dt = DataContext.StringDataSet("@Trace.BlackHoleTotal", new { workorder }).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> BlackHoleList(string workorder, int operSeqNo)
	{
		var dt = DataContext.StringDataSet("@Trace.BlackHoleList", new { workorder, operSeqNo }).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> BlackHolePnlThickness(string panelId)
	{
		var dt = DataContext.StringDataSet("@Trace.BlackHolePnlThickness", new { panelId }).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> AoiTotal(string workorder)
	{
		var dt = DataContext.StringDataSet("@Trace.AoiTotal", new { workorder }).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> AoiCols(string workorder, int operSeqNo)
	{
		var dt = DataContext.StringDataSet("@Trace.AoiCols", new { workorder, operSeqNo }).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> AoiDetail(string workorder, int operSeqNo, string? panelId)
	{
		var dt = DataContext.StringDataSet("@Trace.AoiDetail", new { workorder, operSeqNo, panelId }).Tables[0];

		return ToDic(dt);
	}

	[ManualMap]
	public static IEnumerable<IDictionary> AoiPnlTotal(string panelId)
	{
        panelId = panelId.Trim();
        var dt = DataContext.StringDataSet("@Trace.AoiPnlTotal", new { panelId }).Tables[0];

		return ToDic(dt);
	}

    [ManualMap]
    public static IEnumerable<IDictionary> PanelJudgeDx(string? workorder, int? operSeqNo)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_panel_judge_diagnostic", new { workorder, operSeqNo }).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        FindLabel(dt, "paramJudge", "paramJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));
        FindLabel(dt, "recipeJudge", "recipeJudgeName", (string value) => CodeService.CodeName("PANEL_JUDGE", value));

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> Panel4MList(string workorder)
    {
        var dt = DataContext.StringDataSet("@Trace.Panel4MList", new { workorder }).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", (Func<string, string>)ErpEqpService.SelectCacheName);

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RawTableSelectCalc(string json)
    {
        DataTable dt = DataContext.DataSet("dbo.sp_raw_table_select_calc", new { json }).Tables[0];

        return ToDic(dt);
    }

    #region 4M Tool Map

    [ManualMap]
    public static DataTable ToolList4MCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("ToolList4MCache"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => { return DataContext.StringDataSet("@Trace.ToolList4M").Tables[0]; });

        return list;
    }

    [ManualMap]
    public static void ToolRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("ToolList4MCache"));
    }

    [ManualMap]
    public static Map ToolList4MMap(string? category = null)
    {
        return ToolList4MCache().AsEnumerable()
        .Select(x =>
        {
            return new MapEntity(x.TypeCol<string>("tool_code"), x.TypeCol<string>("tool_name"), null, 'Y');
        }).ToMap();
    }

    #endregion

    #region 4M Material Lot Map

    [ManualMap]
    public static DataTable MatLotList4MCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("MatLotList4MCache"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => { return DataContext.StringDataSet("@Trace.MatLotList4M").Tables[0]; });

        return list;
    }

    [ManualMap]
    public static void MatLotRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey(" MatLotList4MCache"));
    }

    [ManualMap]
    public static Map MatLotList4MMap(string? category = null)
    {
        return MatLotList4MCache().AsEnumerable()
        .Select(x =>
        {
            return new MapEntity(
                x.TypeCol<string>("material_lot"),
                $"[{x.TypeCol<string>("material_code")}]{x.TypeCol<string>("material_name")}", 
                null, 
                'Y');
        }).ToMap();
    }

    #endregion

    #region 4M Material Code Map

    [ManualMap]
    public static DataTable MatCodeList4MCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey("MatCodeList4MCache"),
            DateTime.Now.AddMinutes(GetCacheMin()),
            () => { return DataContext.StringDataSet("@Trace.MatCodeList4M").Tables[0]; });

        return list;
    }

    [ManualMap]
    public static void MatCodeRefreshMap()
    {
        UtilEx.RemoveCache(BuildCacheKey("MatCodeList4MCache"));
    }

    [ManualMap]
    public static Map MatCodeList4MMap(string? category = null)
    {
        return MatCodeList4MCache().AsEnumerable()
        .Select(x =>
        {
            return new MapEntity(x.TypeCol<string>("material_code"), x.TypeCol<string>("material_name"), null, 'Y');
        }).ToMap();
    }

    #endregion
}
