namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Transactions;
using Framework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

public class PanelInterlockService : MinimalApiService, IMinimalApi
{
	public PanelInterlockService(ILogger<PanelInterlockService> logger) : base(logger)
	{
	}

	public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
	{
        group.MapGet("union", nameof(UnionList));

        group.MapGet("/from", nameof(FromList));
        group.MapGet("/param", nameof(ParamList));
        group.MapGet("/recipe", nameof(RecipeList));
        group.MapGet("/spc", nameof(SpcList));
        group.MapGet("/qtime", nameof(QtimeList));
        group.MapGet("/process", nameof(ProcessList));
        group.MapGet("/processex", nameof(ProcessListEx));
        group.MapGet("/totalerror", nameof(TotalError));

        group.MapGet("/spc4munion", nameof(Spc4MUnionList));
        group.MapGet("/spc4m8rule", nameof(Spc4M8RuleList));
        group.MapGet("/chem4m", nameof(Chem4MList));

        group.MapPut("/process", nameof(ProcessInsert));
        group.MapPost("/processjudge", nameof(ProcessJudgeUpdate));
        group.MapPost("/processsettle", nameof(ProcessSettleUpdate));
        group.MapDelete("/process", nameof(ProcessDelete));

        group.MapPost("/deletejson", nameof(DeleteJson));
        group.MapPost("/processdeletejson", nameof(ProcessDeleteJson));

        group.MapPut("/issue", nameof(IssueInsert));
        group.MapPost("/issue", nameof(IssueUpdate));

        group.MapGet("/defect", nameof(PanelDefectList));
        group.MapGet("/rework", nameof(PanelReworkList));

        group.MapGet("/realtime", nameof(RealtimeInterlockSelect));
        group.MapPost("/realtime", nameof(RealtimeUpdate));

        group.MapGet("/workorder", nameof(WorkorderInterlockList));
        group.MapPut("/workorder", nameof(WorkorderInterlockInsert));
        group.MapPost("/workorder", nameof(WorkorderInterlockUpdate));

		group.MapGet("/panel", nameof(PanelList));

		return RouteAllEndpoint(group);
	}

	public static IEnumerable<IDictionary> List(char fromToDtType, DateTime fromDt, DateTime toDt, 
		string? interlockCode, char? autoYn, string? judgeCodeFirst, string? judgeCodeSecond, string? eqpCode,
		string? modelCode, string? operCode, string? workorder, string? panelId)
	{
        dynamic obj = new ExpandoObject();

        obj.FromToDtType = fromToDtType;
		obj.FromDt= fromDt;
		obj.ToDt = toDt.AddDays(1);
        obj.InterlockCode = interlockCode;
        obj.AutoYn = autoYn;
        obj.JudgeCodeFirst = judgeCodeFirst;
        obj.JudgeCodeSecond = judgeCodeSecond;
        obj.EqpCode = eqpCode;
        obj.ModelCode = modelCode;
        obj.OperCode = operCode;
        obj.Workorder = workorder;
        obj.PanelId = panelId;

		DataTable dt = DataContext.StringDataSet("@PanelInterlock.List", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", ErpEqpService.SelectCacheName);
        FindLabel(dt, "interlockCode", "interlockName", codeId => CodeService.CodeName("HOLDINGREASON", codeId));        

        FindLabel(dt, "judgeCodeFirst", "judgeNameFirst", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "settleCodeFirst", "settleNameFirst", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "reworkCodeFirst", "reworkNameFirst", codeId => CodeService.CodeName("REWORKREASON", codeId));
        FindLabel(dt, "defectCodeFirst", "defectNameFirst", codeId => CodeService.CodeName("DEFECTREASON", codeId));

        FindLabel(dt, "judgeCodeSecond", "judgeNameSecond", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "settleCodeSecond", "settleNameSecond", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "reworkCodeSecond", "reworkNameSecond", codeId => CodeService.CodeName("REWORKREASON", codeId));
        FindLabel(dt, "defectCodeSecond", "defectNameSecond", codeId => CodeService.CodeName("DEFECTREASON", codeId));

        FindLabel(dt, "referenceCodeFirst", "referenceNameFirstDefect", codeId => CodeService.CodeName("DEFECTREASON", codeId));
        FindLabel(dt, "referenceCodeFirst", "referenceNameFirstRework", codeId => CodeService.CodeName("REWORKREASON", codeId));

        FindLabel(dt, "referenceCodeSecond", "referenceNameSecondDefect", codeId => CodeService.CodeName("DEFECTREASON", codeId));
        FindLabel(dt, "referenceCodeSecond", "referenceNameSecondRework", codeId => CodeService.CodeName("REWORKREASON", codeId));

        return ToDic(dt);
	}

    [ManualMap]
    public static IResult UnionList(char fromToDtType, DateTime fromDt, DateTime toDt,
    string? interlockCodeMajor, string? interlockCode, string? judgeCodeFirst, string? judgeCodeSecond, string? eqpCode,
    string? modelCode, string? operCode, string? workorder, char? processStatus, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        obj.FromToDtType = fromToDtType;
        obj.FromDt = SearchFromDt(fromDt);
        obj.ToDt = SearchToDt(toDt);
        obj.InterlockCodeMajor = interlockCodeMajor;
        obj.InterlockCode = interlockCode;
        obj.JudgeCodeFirst = judgeCodeFirst;
        obj.JudgeCodeSecond = judgeCodeSecond;
        obj.EqpCode = eqpCode;
        obj.ModelCode = modelCode;
        obj.OperCode = operCode;
        obj.Workorder = workorder;
        obj.ProcessStatus = processStatus;

        DataTable dt = DataContext.StringDataSet("@PanelInterlock.Union4MList", RefineExpando(obj, true)).Tables[0];

        //dt.Columns.Add("judge_target", typeof(string));

        var judgeList = CodeService.ListCache("SPC_RULE_JUDGE_CONTROL");        

        FindLabel(dt, "eqpCode", "eqpName", ErpEqpService.SelectCacheName);
        FindLabel(dt, "interlockCode", "interlockName", codeId => CodeService.CodeName("HOLDINGREASON", codeId));
        FindLabel(dt, "interlockCodeMajor", "interlockNameMajor", codeId => {
            if (codeId == "5103")
                codeId = "5003";

            return CodeService.CodeName("INTERLOCK_MAJOR", codeId);
        });


        FindLabel(dt, "workorderInterlockCode", "workorderInterlockName", codeId => CodeService.CodeName("HOLDINGREASON", codeId));

        FindLabel(dt, "judgeCodeFirst", "judgeNameFirst", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "settleCodeFirst", "settleNameFirst", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "reworkCodeFirst", "reworkNameFirst", codeId => CodeService.CodeName("REWORKREASON", codeId));
        FindLabel(dt, "defectCodeFirst", "defectNameFirst", codeId => CodeService.CodeName("DEFECTREASON", codeId));

        FindLabel(dt, "judgeCodeSecond", "judgeNameSecond", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "settleCodeSecond", "settleNameSecond", codeId => CodeService.CodeName("INTERLOCK_TO_TYPE", codeId));
        FindLabel(dt, "reworkCodeSecond", "reworkNameSecond", codeId => CodeService.CodeName("REWORKREASON", codeId));
        FindLabel(dt, "defectCodeSecond", "defectNameSecond", codeId => CodeService.CodeName("DEFECTREASON", codeId));

        FindLabel(dt, "referenceCodeFirst", "referenceNameFirstDefect", codeId => CodeService.CodeName("DEFECTREASON", codeId));
        FindLabel(dt, "referenceCodeFirst", "referenceNameFirstRework", codeId => CodeService.CodeName("REWORKREASON", codeId));

        FindLabel(dt, "referenceCodeSecond", "referenceNameSecondDefect", codeId => CodeService.CodeName("DEFECTREASON", codeId));
        FindLabel(dt, "referenceCodeSecond", "referenceNameSecondRework", codeId => CodeService.CodeName("REWORKREASON", codeId));

        if (!isExcel)
            return Results.Json(ToDic(dt));

        return ExcelDown(dt, "이상발생List");
    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        DataTable excelDt = dt.Copy();
        excelDt.Columns.Add("status");
        excelDt.Columns.Add("final_name");
        
        foreach (DataRow row in excelDt.Rows)
        {
            //완료
            if(row.TypeCol<string>("judge_code_first") != null && row.TypeCol<string>("settle_code_first") != null)
            {
                row["status"] = row.TypeCol<string>("judge_code_first").Equals(row.TypeCol<string>("settle_code_first")) ? "V":"";
            }

            //인터락
            if (row.TypeCol<string>("workorder_interlock_code") != null)
            {
                row["workorder_interlock_code"] = "V";
            }

            //최종판정
            if (row.TypeCol<string>("judge_code_first") != null && row.TypeCol<string>("settle_code_first") != null)
            {
                row["final_name"] = row.TypeCol<string>("judge_code_first").Equals(row.TypeCol<string>("settle_code_first")) ? row.TypeCol<string>("judge_name_first") : "";
            }
            if (row.TypeCol<string>("judge_code_second") != null && row.TypeCol<string>("settle_code_second") != null)
            {
                row["final_name"] = row.TypeCol<string>("judge_code_second").Equals(row.TypeCol<string>("settle_code_second")) ? row.TypeCol<string>("judge_name_second") : "";
            }

            switch (row.TypeCol<string>("judge_code_second") ?? (row.TypeCol<string>("judge_code_first") ?? string.Empty))
            {
                case "R":
                    if (row.TypeCol<string>("rework_approve_dt_first") != null || row.TypeCol<string>("rework_approve_dt_second") != null)
                    {
                        row["final_name"] = "승인";
                    }
                    if (row.TypeCol<string>("rework_refuse_dt_first") != null || row.TypeCol<string>("rework_refuse_dt_second") != null)
                    {
                        row["final_name"] = "반려";
                    }
                    break;
               /* case "D":
                    if (row.TypeCol<string>("defect_off_dt_first") != null || row.TypeCol<string>("defect_off_dt_second") != null)
                    {
                        row["final_name"] = "해제";
                    }
                    break;*/
                default:
                    break;
            }
        }

        Dictionary<string, string> colDic = new()
        {
            //기본정보
            { "workorder", "Batch No."},
            {"status","완료"},
            {"workorder_interlock_code", "인터락"},
            {"model_code", "모델코드"},
            {"model_name", "모델명"},
            {"eqp_code", "설비코드"},
            {"eqp_name", "설비명"},
            {"oper_seq_no", "공순"},
            {"oper_code", "공정코드"},
            {"oper_name", "공정명"},
            //인터락
            {"gubun", "구분"},
            {"interlock_name_major", "분류"},
            {"interlock_name", "소분류"},
            {"panel_cnt", "판넬" },
            //결과
            {"final_name", "최종판정"},
            //공정기술
            {"judge_name_first", "1차판정"},
            //{"judge_attach_first", "첨부"},
            {"judge_method_first", "처리방법"},
            {"rework_name_first", "상세코드"},
            //제품기술
            {"settle_name_first", "1차합의"},
            //{"settle_attach_first", "첨부"},
            {"settle_remark_first", "합의사유"},
            //공정기술
            {"judge_name_second", "2차판정"},
            //{"judge_attach_second", "첨부"},
            {"judge_method_second", "처리방법"},
            {"rework_name_second", "상세코드"},
            //제품기술
            {"settle_name_second", "2차합의"},
            //{"settle_attach_second", "첨부"},
            {"settle_remark_second", "합의사유"},
            //4M
            {"max_on_dt", "발생시간"},
            {"start_dt_4m", "4M Start"},
            {"end_dt_4m", "4M End"}
        };

        return Results.File(ExcelEx.ToExcelSimple(excelDt, colDic), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IResult TotalError(string? fromDt, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();

        if (fromDt == null)
        {
            fromDt = DateTime.Now.ToString("yyyy-MM-dd");
        }

        DateTime today = DateTime.ParseExact(fromDt, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        DateTime lastMonth = new DateTime(today.AddMonths(-1).Year, today.AddMonths(-1).Month, 1);
        DateTime startDay = new DateTime(today.AddMonths(-1).Year, 1, 1);

        obj.FromDate = startDay.ToString("yyyy-MM-dd");

        DataTable dt = DataContext.StringDataSet("@PanelInterlock.TotalErrorList", RefineExpando(obj, true)).Tables[0];

        int rowcount = dt.Rows.Count;

        DataTable resultDt = new DataTable();
        resultDt.Columns.Add("category", typeof(string));
        resultDt.Columns.Add("title", typeof(string));
        resultDt.Columns.Add("total", typeof(float));
        resultDt.Columns.Add("last_month", typeof(float));
        resultDt.Columns.Add("this_month", typeof(float));
        resultDt.Columns.Add("week", typeof(float));
        resultDt.Columns.Add("first_day", typeof(float));
        resultDt.Columns.Add("second_day", typeof(float));
        resultDt.Columns.Add("third_day", typeof(float));
        resultDt.Columns.Add("fourth_day", typeof(float));
        resultDt.Columns.Add("fifth_day", typeof(float));
        resultDt.Columns.Add("sixth_day", typeof(float));
        resultDt.Columns.Add("seventh_day", typeof(float));

        float[] occur = new float[11];
        float[] complete = new float[11];
        float[] rate = new float[11];

        var lastCode = dt.Rows[0].TypeCol<String>("interlock_major_code");

        for (int i = 0; i <= dt.Rows.Count; i++)
        {
            if (i == dt.Rows.Count || lastCode != dt.Rows[i].TypeCol<String>("interlock_major_code"))
            {
                DataRow count = resultDt.NewRow();
                DataRow comp = resultDt.NewRow();

                count.ItemArray = new object[] { lastCode, "발생건수" }.Concat(occur.Cast<object>()).ToArray();
                comp.ItemArray = new object[] { lastCode, "처리" }.Concat(complete.Cast<object>()).ToArray();

                resultDt.Rows.Add(count);
                resultDt.Rows.Add(comp);

                for (int j = 0; j < complete.Length; j++)
                {
                    if (complete[j] != 0)
                    {
                        rate[j] = complete[j] / occur[j] * 100;
                    }
                }

                DataRow rateDr = resultDt.NewRow();

                rateDr.ItemArray = new object[] { lastCode, "완료율" }.Concat(rate.Cast<object>()).ToArray();

                resultDt.Rows.Add(rateDr);

                if (i == dt.Rows.Count) break;

                occur = new float[11];
                complete = new float[11];
                rate = new float[11];

                lastCode = dt.Rows[i].TypeCol<String>("interlock_major_code");
            }

            DataRow temp = dt.Rows[i];

            TimeSpan difference = dt.Rows[i].TypeCol<DateTime>("on_date") - today;
            int dayDifference = difference.Days;

            int currentDayOfWeek = (int)today.DayOfWeek;

            int colIndex = dayDifference + 10;

            if (currentDayOfWeek + dayDifference >= -7 && currentDayOfWeek + dayDifference <= -1)
            {
                occur[3] = occur[3] + 1;

                if (dt.Rows[i].TypeCol<String>("judge_code_first") != null && (dt.Rows[i].TypeCol<string>("judge_code_first") == dt.Rows[i].TypeCol<string>("settle_code_first")))
                {
                    complete[3] = complete[3] + 1;
                }

                else if (dt.Rows[i].TypeCol<String>("judge_code_second") != null && (dt.Rows[i].TypeCol<string>("judge_code_second") == dt.Rows[i].TypeCol<string>("settle_code_second")))
                {
                    complete[3] = complete[3] + 1;
                }
            }

            if (dt.Rows[i].TypeCol<DateTime>("on_date").Month == lastMonth.Month)
            {
                occur[0] = occur[0] + 1;
                occur[1] = occur[1] + 1;

                if (dt.Rows[i].TypeCol<String>("judge_code_first") != null && (dt.Rows[i].TypeCol<string>("judge_code_first") == dt.Rows[i].TypeCol<string>("settle_code_first")))
                {
                    complete[1] = complete[1] + 1;
                    complete[0] = complete[0] + 1;
                }

                else if (dt.Rows[i].TypeCol<String>("judge_code_second") != null && (dt.Rows[i].TypeCol<string>("judge_code_second") == dt.Rows[i].TypeCol<string>("settle_code_second")))
                {
                    complete[1] = complete[1] + 1;
                    complete[0] = complete[0] + 1;
                }
            }
            else if (dt.Rows[i].TypeCol<DateTime>("on_date").Month == lastMonth.Month + 1)
            {
                occur[0] = occur[0] + 1;
                occur[2] = occur[2] + 1;

                if (dt.Rows[i].TypeCol<String>("judge_code_first") != null && (dt.Rows[i].TypeCol<string>("judge_code_first") == dt.Rows[i].TypeCol<string>("settle_code_first")))
                {
                    complete[2] = complete[2] + 1;
                    complete[0] = complete[0] + 1;
                }

                else if (dt.Rows[i].TypeCol<String>("judge_code_second") != null && (dt.Rows[i].TypeCol<string>("judge_code_second") == dt.Rows[i].TypeCol<string>("settle_code_second")))
                {
                    complete[2] = complete[2] + 1;
                    complete[0] = complete[0] + 1;
                }

                if (colIndex >= 4)
                {
                    occur[colIndex] = occur[colIndex] + 1;

                    if (dt.Rows[i].TypeCol<String>("judge_code_first") != null && (dt.Rows[i].TypeCol<string>("judge_code_first") == dt.Rows[i].TypeCol<string>("settle_code_first")))
                    {
                        complete[colIndex] = complete[colIndex] + 1;
                    }

                    else if (dt.Rows[i].TypeCol<String>("judge_code_second") != null && (dt.Rows[i].TypeCol<string>("judge_code_second") == dt.Rows[i].TypeCol<string>("settle_code_second")))
                    {
                        complete[colIndex] = complete[colIndex] + 1;
                    }
                }
            }
            else if (dt.Rows[i].TypeCol<DateTime>("on_date").Year == today.Year)
            {
                occur[0] = occur[0] + 1;

                if (dt.Rows[i].TypeCol<String>("judge_code_first") != null && (dt.Rows[i].TypeCol<string>("judge_code_first") == dt.Rows[i].TypeCol<string>("settle_code_first")))
                {
                    complete[0] = complete[0] + 1;
                }

                else if (dt.Rows[i].TypeCol<String>("judge_code_second") != null &&  (dt.Rows[i].TypeCol<string>("judge_code_second") == dt.Rows[i].TypeCol<string>("settle_code_second")))
                {
                    complete[colIndex] = complete[colIndex] + 1;
                }
            }
        }
        
        FindLabel(resultDt, "category", "interlockMajorName", codeId => CodeService.CodeName("INTERLOCK_MAJOR", codeId));

        if (!isExcel)
            return Results.Json(ToDic(resultDt));

        return ExcelDownTotalError(resultDt, "TOTALERROR");
    }

    [ManualMap]
    public static IResult ExcelDownTotalError(DataTable dt, string fileName)
    {
        var today = DateTime.Now;

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("interlockMajorName", "이상항목", 25, typeof(string), null),
            new("title", "구분", 25, typeof(string), null),

            new("total", "Total", 12, typeof(float), null),
            new("last_month", "전월", 12, typeof(float), null),
            new("this_month", "당월", 12, typeof(float), null),
            new("week", "전주", 12, typeof(float), null),

            new("first_day", today.AddDays(-6).ToString("MM월 dd일"), 12, typeof(float), null),
            new("second_day", today.AddDays(-5).ToString("MM월 dd일"), 12, typeof(float), null),
            new("third_day", today.AddDays(-4).ToString("MM월 dd일"), 12, typeof(float), null),
            new("fourth_day", today.AddDays(-3).ToString("MM월 dd일"), 12, typeof(float), null),
            new("fifth_day", today.AddDays(-2).ToString("MM월 dd일"), 12, typeof(float), null),
            new("sixth_day", today.AddDays(-1).ToString("MM월 dd일"), 12, typeof(float), null),
            new("seventh_day", today.ToString("MM월 dd일"), 12, typeof(float), null),
        };

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

        public static int Insert([FromBody] Dictionary<string, object?> dic)
    {
        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        return DataContext.StringNonQuery("@PanelInterlock.Insert", RefineParam(param));
    }

    [ManualMap]
    public static char? RealtimeInterlockSelect(string panelId)
    {
        return DataContext.StringValue<char?>("@PanelInterlock.RealtimeInterlockSelect", new { panelId });
    }

    [ManualMap]
    public static int Update(Database db, Dictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@PanelInterlock.Update", RefineParam(dic));
    }

    [ManualMap]
    public static int GroupKey4MUpdate(Database db, Dictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@PanelInterlock.GroupKey4MUpdate", RefineParam(dic));
    }

    [ManualMap]
    public static int GroupKeyUpdate(Database db, Dictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@PanelInterlock.GroupKeyUpdate", RefineParam(dic, false));
    }

    [ManualMap]
    public static int DeleteJson([FromBody] Dictionary<string, object?> dic)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        var list = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(dic.TypeKey<string>("json"));
        if (list == null)
            return 0;

        using TransactionScope scope = new();

        // 프로세스 삭제
        int processResult = db.ExecuteStringNonQuery("@PanelInterlock.ProcessDelete", RefineParam(param));

        int result = 0;

        // 판넬인터락 삭제
        foreach (var item in list)
        {
            string headerGroupKey = item.TypeKey<string>("headerGroupKey");
            string panelJson = item.TypeKey<string>("panelJson");
            if (string.IsNullOrWhiteSpace(panelJson))
                panelJson = "[]";

            int itemResult = db.ExecuteStringNonQuery("@PanelInterlock.DeleteById", InlineExpando(new { headerGroupKey, panelJson }));
            if (itemResult <= 0)
                return itemResult;

            result += itemResult;
        }

        scope.Complete();

        return result;
    }

    [ManualMap]
    public static int ProcessDeleteJson([FromBody] Dictionary<string, object?> dic)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        return db.ExecuteStringNonQuery("@PanelInterlock.ProcessDelete", RefineParam(param));
    }

    [ManualMap]
    public static int ProcessInsert([FromBody] PanelInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var list = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(entity.Json!);
        if (list == null)
            return 0;

        using TransactionScope scope = new();

        foreach (var item in list)
        {
            
            string groupKey = item.TypeKey<string>("groupKey");
            if(string.IsNullOrWhiteSpace(groupKey))
                groupKey = NewGuid();

            item["groupKey"] = groupKey;

            // 4M이 있는 경우
            if (!string.IsNullOrWhiteSpace(item.TypeKey<string>("headerGroupKey")))
            {
                int result4M = GroupKey4MUpdate(db, item);
                //if (result4M <= 0)
                //    return result4M;
            }

            // 판넬이 있는 경우
            if (!string.IsNullOrWhiteSpace(item.SafeTypeKey("panelJson", string.Empty)))
            {
                int itemResult = GroupKeyUpdate(db, item);
                //if (itemResult <= 0)
                //    return itemResult;
            }
        }

        entity.Json = JsonConvert.SerializeObject(list.Select(x => new { groupKey =  x.TypeKey<string>("groupKey") }));

        // process 테이블 추가
        int result =  db.ExecuteStringNonQuery("@PanelInterlock.ProcessMerge", RefineEntity(entity));
        if (result <= 0)
            return result;

        scope.Complete();

        return result;
    }

    [ManualMap]
    public static int ProcessJudgeUpdate([FromBody] PanelInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@PanelInterlock.ProcessJudgeUpdate", RefineEntity(entity));
    }

    [ManualMap]
    public static int ProcessSettleUpdate([FromBody] PanelInterlockProcessEntity entity)
    {
        using TransactionScope scope = new();

        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        // 합의 여부
        if(entity.SettleYn == 'Y')
        {
            // 합의가 된 경우 후속 처리
            switch (entity.SettleCode)
            {
                case 'D': // 폐기
                    {
                        Dictionary<string, object> dic = new()
                        {
                            { "json", entity.Json! },
                            { "step", entity.Step! }
                        };

                        int result = DefectInsert(db, dic);
                        //if(result <= 0) // 판넬은 없고 배치만 있는 경우 처리
                        //    return 0;

                        break;
                    }
                case 'R': // 재처리
                    {
                        Dictionary<string, object> dic = new()
                        {
                            { "json", entity.Json! },
                            { "step", entity.Step! }
                        };

                        int result = ReworkInsert(db, dic);
                        //if (result <= 0) // 판넬은 없고 배치만 있는 경우 처리
                        //    return 0;

                        break;
                    }
                case 'U': // 양품화
                    {
                        Dictionary<string, object> dic = new()
                        {
                            { "json", entity.Json! },
                            { "remark", entity.JudgeRemark! },
                        };

                        int result = Update(db, dic);
                        //if (result <= 0) // 판넬은 없고 배치만 있는 경우 처리
                        //    return 0;

                        break;
                    }
                default:
                    return 0;
            }
        }

        int settleResult = db.ExecuteStringNonQuery("@PanelInterlock.ProcessSettleUpdate", RefineEntity(entity));

        scope.Complete();

        return settleResult;
    }

    [ManualMap]
    public static int ProcessDelete([FromBody] PanelInterlockProcessEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@PanelInterlock.ProcessDelete", RefineEntity(entity));
    }

    [ManualMap]
    public static int IssueInsert([FromBody] PanelInterlockIssueEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        var list = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(entity.Json!);
        if (list == null)
            return 0;

        using TransactionScope scope = new();

        foreach (var item in list)
        {
            string groupKey = item.TypeKey<string>("groupKey");
            if (string.IsNullOrWhiteSpace(groupKey))
                groupKey = NewGuid();

            item["groupKey"] = groupKey;

            // 4M이 있는 경우
            if (!string.IsNullOrWhiteSpace(item.TypeKey<string>("headerGroupKey")))
            {
                int result4M = GroupKey4MUpdate(db, item);
            }

            // 판넬이 있는 경우
            if (!string.IsNullOrWhiteSpace(item.SafeTypeKey("panelJson", string.Empty)))
            {
                int itemResult = GroupKeyUpdate(db, item);
            }
        }

        entity.Json = JsonConvert.SerializeObject(list.Select(x => new { groupKey = x.TypeKey<string>("groupKey") }));

        // Issue 저장
        int result = db.ExecuteStringNonQuery("@PanelInterlock.IssueInsert", RefineEntity(entity));
        if (result <= 0)
            return result;

        scope.Complete();

        return result;
    }

    [ManualMap]
    public static int IssueUpdate([FromBody] PanelInterlockIssueEntity entity)
    {
        var db = DataContext.Create(null);
        db.IgnoreParameterSame = true;

        return db.ExecuteStringNonQuery("@PanelInterlock.IssueUpdate", RefineEntity(entity));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> FromList(string interlockCode, string itemKey)
    {
        return interlockCode switch
        {
            "5001" => ParamList(itemKey),
            "5002" => RecipeList(itemKey),
            "5003" => SpcList(itemKey),
            "5007" => QtimeList(itemKey),
            _ => new List<Dictionary<string, object>>()
        };
    }

    [ManualMap]
    public static int DefectInsert(Database db, IDictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@PanelInterlock.DefectInsert", RefineParam(dic));
    }

    [ManualMap]
    public static int ReworkInsert(Database db, IDictionary<string, object> dic)
    {
        return db.ExecuteStringNonQuery("@PanelInterlock.ReworkInsert", RefineParam(dic));
    }

    [ManualMap]
	public static IEnumerable<IDictionary> ParamList(string itemKey)
	{
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.ParamList", new { itemKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> RecipeList(string itemKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.RecipeList", new { itemKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> SpcList(string itemKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.SpcList", new { itemKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> QtimeList(string itemKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.QtimeList", new { itemKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> Spc4MUnionList(string headerGroupKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.Spc4MUnionList", new { headerGroupKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> Spc4M8RuleList(string headerGroupKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.Spc4M8RuleList", new { headerGroupKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> Chem4MList(string headerGroupKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.Chem4MList", new { headerGroupKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ProcessList(string groupKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.ProcessList", new { groupKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ProcessListEx(string groupKey)
    {
        DataTable dt = DataContext.StringDataSet("@PanelInterlock.ProcessListEx", new { groupKey }).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelDefectList(string groupKey)
    {
        dynamic obj = new ExpandoObject();

        obj.GroupKey = groupKey;

        DataTable dt = DataContext.StringDataSet("@PanelInterlock.DefectList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> PanelReworkList(string groupKey)
    {
        dynamic obj = new ExpandoObject();

        obj.GroupKey = groupKey;

        DataTable dt = DataContext.StringDataSet("@PanelInterlock.ReworkList", RefineExpando(obj, true)).Tables[0];

        return ToDic(dt);
    }

    [ManualMap]
    public static int RealtimeUpdate([FromBody] Dictionary<string, object?> dic)
    {
        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        return DataContext.StringNonQuery("@PanelInterlock.RealtimeUpdate", RefineParam(param));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> WorkorderInterlockList(string workorder)
    {
        dynamic obj = new ExpandoObject();

        obj.Workorder = workorder;

        DataTable dt = DataContext.StringDataSet("@PanelInterlock.WorkorderInterlockList", RefineExpando(obj, true)).Tables[0];

        FindLabel(dt, "eqpCode", "eqpName", ErpEqpService.SelectCacheName);
        FindLabel(dt, "interlockCode", "interlockName", codeId => CodeService.CodeName("HOLDINGREASON", codeId));

        return ToDic(dt);
    }

    [ManualMap]
    public static int WorkorderInterlockInsert([FromBody] Dictionary<string, object?> dic)
    {
        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

        int cnt = DataContext.StringValue<int>("@PanelInterlock.WorkorderInterlockCnt", RefineParam(param));
        if (cnt > 0)
            return -1;

        return DataContext.StringNonQuery("@PanelInterlock.WorkorderInterlockInsert", RefineParam(param));
    }

    [ManualMap]
    public static int WorkorderInterlockUpdate([FromBody] Dictionary<string, object?> dic)
    {
        var param = dic.ToCleanDic().ToDictionary(x => x.Key, y => y.Value!);

		int cnt = DataContext.StringValue<int>("@PanelInterlock.WorkorderInterlockCnt", RefineParam(param));
		if (cnt <= 0)
			return -1;

		return DataContext.StringNonQuery("@PanelInterlock.WorkorderInterlockUpdate", RefineParam(param));
    }

	[ManualMap]
	public static IEnumerable<IDictionary> PanelList(string headerGroupKey)
	{
		dynamic obj = new ExpandoObject();

		obj.HeaderGroupKey = headerGroupKey;

		DataTable dt = DataContext.StringDataSet("@PanelInterlock.PanelList", RefineExpando(obj, true)).Tables[0];

		return ToDic(dt, x => x);
	}
}

