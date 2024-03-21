namespace WebApp;

using Framework;
using System;
using System.Data;
using System.Dynamic;
using System.Globalization;

public class PanelInterlockErrorService : MinimalApiService, IMinimalApi
{
    const string FDC_CD = "5202";
    const string PV_CD = "5001";
    const string SV_CD = "5002";
    const string SPC_CD = "5003";
    const string SPC_8RULE_CD = "5103";
    const string ETC_CD = "5006";
    const string OTHER_CD = "5008";

    public PanelInterlockErrorService(ILogger<MinimalApiService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/totalerror", nameof(TotalError));
        return RouteAllEndpoint(group);
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

        obj.FromDate = startDay.AddHours(8);
        // PV
        obj.InterlockCode = PV_CD;
        DataTable dtPV = DataContext.StringDataSet("@PanelInterlockError.TotalErrorList", RefineExpando(obj, true)).Tables[0];
        InterlockOccur(dtPV, resultDt, obj.InterlockCode, fromDt);

        // SV
        obj.InterlockCode = SV_CD;
        DataTable dtSV = DataContext.StringDataSet("@PanelInterlockError.TotalErrorList", RefineExpando(obj, true)).Tables[0];
        InterlockOccur(dtSV, resultDt, obj.InterlockCode, fromDt);

        // SPC
        obj.InterlockCode = SPC_8RULE_CD;
        DataTable dtSPC = DataContext.StringDataSet("@PanelInterlockError.TotalErrorList", RefineExpando(obj, true)).Tables[0];
        InterlockOccur(dtSPC, resultDt, "5003", fromDt);

        // ETC
        obj.InterlockCode = ETC_CD;
        DataTable dtEtc = DataContext.StringDataSet("@PanelInterlockError.TotalErrorList", RefineExpando(obj, true)).Tables[0];
        InterlockOccur(dtEtc, resultDt, obj.InterlockCode, fromDt);

        // OTHER
        obj.InterlockCode = OTHER_CD;
        DataTable dtAbnormal = DataContext.StringDataSet("@PanelInterlockError.TotalErrorList", RefineExpando(obj, true)).Tables[0];
        InterlockOccur(dtAbnormal, resultDt, obj.InterlockCode, fromDt);

        obj.InterlockCode = FDC_CD;
        DataTable dtFDC = DataContext.StringDataSet("@PanelInterlockError.FDCTotalErrorList", RefineExpando(obj, true)).Tables[0];
        InterlockOccur(dtFDC, resultDt, obj.InterlockCode, fromDt);


        FindLabel(resultDt, "category", "interlockMajorName", codeId => CodeService.CodeName("INTERLOCK_MAJOR", codeId));

        if (!isExcel)
            return Results.Json(ToDic(resultDt));

        return ExcelDownTotalError(resultDt, "TOTALERROR");
    }

    private static DataTable InterlockOccur(DataTable dt, DataTable resultDt, string interlockCode, string fromDt) 
    {
        DateTime today = GetToday(interlockCode);
        DateTime dayPrevMonth = today.AddMonths(-1);
        DateTime beginPrevMonth = new DateTime(dayPrevMonth.Year, dayPrevMonth.Month, 1).AddHours(8);
        DateTime endPrevMonth = new DateTime(dayPrevMonth.Year, dayPrevMonth.Month, DateTime.DaysInMonth(dayPrevMonth.Year, dayPrevMonth.Month)).AddDays(1).AddHours(8);

        DayOfWeek weekStart = DayOfWeek.Sunday;
        DateTime startingWeekDate = GetToday(interlockCode);
        while (startingWeekDate.DayOfWeek != weekStart)
        {
            startingWeekDate = startingWeekDate.AddDays(-1);
        }

        DateTime prvStartDate = startingWeekDate.AddDays(-7);
        DateTime prvEndDate = startingWeekDate;
        float[] occur = new float[11];
        float[] complete = new float[11];
        float[] rate = new float[11];

        occur[0] = dt.Rows.Count;

        for (int i = 0; i < dt.Rows.Count; i++)
        {
            var onDate = dt.Rows[i].TypeCol<DateTime>("on_date");
            var judge = dt.Rows[i].TypeCol<int>("judge");

            complete[0] += judge; // Year
            // previous month
            if (DateTime.Compare(onDate, beginPrevMonth) >= 0 && DateTime.Compare(onDate, endPrevMonth) < 0)
            {
                occur[1] = occur[1] + 1;
                complete[1] = complete[1] + judge;
            }
            // current month
            if (DateTime.Compare(onDate, beginPrevMonth.AddMonths(1)) >= 0 && DateTime.Compare(onDate, endPrevMonth.AddMonths(1)) < 0)
            {
                occur[2] = occur[2] + 1;
                complete[2] = complete[2] + dt.Rows[i].TypeCol<int>("judge");
            }

            if (DateTime.Compare(onDate, prvStartDate) >= 0 && DateTime.Compare(onDate, prvEndDate) < 0)
            {
                occur[3] = occur[3] + 1;
                complete[3] = complete[3] + judge;
            }

            if (DateTime.Compare(onDate, GetToday(interlockCode)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode).AddDays(1)) < 0)
            {
                occur[10] = occur[10] + 1;
                complete[10] = complete[10] + judge;
            }
            if (DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-1)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode)) < 0)
            {
                occur[9] = occur[9] + 1;
                complete[9] = complete[9] + judge;
            }
            if (DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-2)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-1)) < 0)
            {
                occur[8] = occur[8] + 1;
                complete[8] = complete[8] + judge;
            }
            if (DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-3)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-2)) < 0)
            {
                occur[7] = occur[7] + 1;
                complete[7] = complete[7] + judge;
            }
            if (DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-4)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-3)) < 0)
            {
                occur[6] = occur[6] + 1;
                complete[6] = complete[6] + judge;
            }
            if (DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-5)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-4)) < 0)
            {
                occur[5] = occur[5] + 1;
                complete[5] = complete[5] + judge;
            }
            if (DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-6)) >= 0 && DateTime.Compare(onDate, GetToday(interlockCode).AddDays(-5)) < 0)
            {
                occur[4] = occur[4] + 1;
                complete[4] = complete[4] + judge;
            }
        }

        for (int i = 0; i < complete.Length; i++)
        {
            if (occur[i] != 0)
            {
                rate[i] = complete[i] / occur[i] * 100;
            }
        }

        DataRow count = resultDt.NewRow();
        DataRow comp = resultDt.NewRow();
        DataRow rateDr = resultDt.NewRow();

        count.ItemArray = new object[] { interlockCode, "발생건수" }.Concat(occur.Cast<object>()).ToArray();
        comp.ItemArray = new object[] { interlockCode, "처리" }.Concat(complete.Cast<object>()).ToArray();
        rateDr.ItemArray = new object[] { interlockCode, "완료율" }.Concat(rate.Cast<object>()).ToArray();
        resultDt.Rows.Add(count);
        resultDt.Rows.Add(comp);
        resultDt.Rows.Add(rateDr);

        return resultDt;
    }

    private static DateTime GetToday(string interlockCode)
    {
        DateTime today = DateTime.ParseExact(DateTime.Now.ToString("yyyy-MM-dd"), "yyyy-MM-dd", CultureInfo.InvariantCulture);
        return today.AddHours(8);
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
}
