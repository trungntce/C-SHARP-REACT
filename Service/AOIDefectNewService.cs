namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Globalization;
using Framework;

public class AOIDefectNewService : MinimalApiService, IMinimalApi
{
    public AOIDefectNewService(ILogger<AOIDefectNewService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
		group.MapGet("totaldefectchart", nameof(TotalDefectChart));
        // group.MapGet("detaildefectbarchart", nameof(DetailDefectBarChart));
        group.MapGet("detaildefectchart", nameof(DetailDefectChart));
        group.MapGet("detaildefecteqp", nameof(DetailDefectEqp));
        group.MapGet("listdefectdeqp", nameof(ListDefectEqp));
        group.MapGet("listmodel", nameof(ListModel));

        return RouteAllEndpoint(group);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ListModel()
	{
		dynamic obj = new ExpandoObject();

        // Month
        DateTime fromDate = new DateTime(GetToday().Year, GetToday().Month, 1).AddHours(8);
        DateTime toDate = GetToday().AddDays(1).AddHours(8);
        obj.FromMonth = fromDate;
        obj.ToMonth = toDate;

        //Weekly
        DayOfWeek weekStart = DayOfWeek.Sunday;
        DateTime startingWeekDate = GetToday();
        while (startingWeekDate.DayOfWeek != weekStart)
        {
            startingWeekDate = startingWeekDate.AddDays(-1);
        }
        fromDate = startingWeekDate.AddHours(8);
        toDate = GetToday().AddDays(1).AddHours(8);
        obj.FromWeek = fromDate;
        obj.ToWeek = toDate;

        // Yester day
        fromDate = GetToday().AddDays(-1).AddHours(8);
        toDate = GetToday().AddHours(8); ;
        obj.FromYesterday = fromDate;
        obj.ToYesterday = toDate;

        // Today
        fromDate = GetToday().AddHours(8);
        toDate = GetToday().AddDays(1).AddHours(8);
        obj.FromToday = fromDate;
        obj.ToToday = toDate;

        DataTable dt = DataContext.StringDataSet("@AOIDefectNew.AOIList", RefineExpando(obj, true)).Tables[0];
        //DataTable dt = DataContext.DataSet("dbo.sp_aoi_model_list", obj).Tables[0];

        return ToDic(dt);
	}

	[ManualMap]
	public static IResult TotalDefectChart(string? appCode, string? modelCode, string? modelName, string? ngCodes, string? eqpCodes, string? workcenterCode, string? operCode)
	{
		dynamic obj = new ExpandoObject();
        DateTime month = GetToday().AddMonths(-3);
        DateTime fromDate = new DateTime(month.Year, month.Month, 1).AddHours(8);

        obj.ToDt = fromDate;
        obj.AppCode = appCode;
		obj.ModelCode = modelCode;
		obj.ModelName = modelName;
		obj.NgCodes = string.IsNullOrEmpty(ngCodes) ? null : ngCodes;
        obj.EqpCodes = string.IsNullOrEmpty(eqpCodes) ? null : eqpCodes;
        obj.WorkcenterCode = workcenterCode;
        obj.OperCode = operCode;

        DataTable dt = null;

        DataTable dtMonthly = GetDataChartMonth(dt, "@AOIDefectNew.AOIDefectChart", obj, ngCodes);
        DataTable dtWeekly = GetDataChartWeekly(dt, "@AOIDefectNew.AOIDefectChart", obj, ngCodes);
        DataTable dtDaily = GetDataChartDaily(dt, "@AOIDefectNew.AOIDefectChart", obj, ngCodes);

        List<DataTable> dataTables = new List<DataTable>();
        dataTables.Add(dtMonthly);
        dataTables.Add(dtWeekly);
        dataTables.Add(dtDaily);

        return Results.Json(dataTables);
    }

    [ManualMap]
	public static IResult DetailDefectChart(string eqpCode, string eqpCodes, string? appCode, string? modelCode, string? modelName, string? ngCodes, string? workcenterCode, string? operCode, string? itemCode)
	{
        List<DataTable> dtResult = new List<DataTable>();

        string[] eqps = eqpCodes.Split(",");
        foreach (string _eqpCode in eqps)
        {
            DataTable dtrs = new DataTable();
            dtrs.Columns.Add("eqp_code", typeof(string));
            dtrs.Columns.Add("eqp_name", typeof(string));
            dtrs.Columns.Add("date_mwd", typeof(string));
            dtrs.Columns.Add("from_dt", typeof(string));
            dtrs.Columns.Add("to_dt", typeof(string));
            dtrs.Columns.Add("ng_cnt", typeof(int));
            dtrs.Columns.Add("ng_pcs_cnt", typeof(int));
            dtrs.Columns.Add("pcs_total", typeof(int));
            dtrs.Columns.Add("pnl_total", typeof(int));

            dynamic obj = new ExpandoObject();
            obj.ModelCode = string.IsNullOrEmpty(modelCode) ? "-1" : modelCode;
            obj.WorkcenterCode = string.IsNullOrEmpty(workcenterCode) ? "-1" : workcenterCode;
            obj.EqpCode = _eqpCode;
            obj.NgCodes = string.IsNullOrEmpty(ngCodes) ? "-1" : ngCodes;
            obj.ItemCode = string.IsNullOrEmpty(itemCode) ? "-1" : itemCode;
            obj.OperCode = string.IsNullOrEmpty(operCode) ? "-1" : operCode;
            obj.AppCode = string.IsNullOrEmpty(appCode) ? "-1" : appCode;


            DataTable dt = DataContext.DataSet("dbo.sp_aoi_defect_eqp_for_chart", obj).Tables[0];

            foreach (DataRow _row in dt.Rows)
            {
                string dateMwd = "";
                DateTime startDt = _row.TypeCol<DateTime>("start_dt");
                DateTime endDt = _row.TypeCol<DateTime>("end_dt");
                // MONTHLY
                if (_row.TypeCol<int>("ord") < 5)
                {
                    dateMwd = startDt.Month + "월";
                }
                // WEEKLY
                if (_row.TypeCol<int>("ord") > 4 && _row.TypeCol<int>("ord") < 9)
                {
                    dateMwd = GetWeekNumber(startDt) + "w";
                }
                // DAILY
                if (_row.TypeCol<int>("ord") > 8)
                {
                    dateMwd = _row.TypeCol<DateTime>("start_dt").ToString("MM/dd");
                }

                DataRow row = dtrs.NewRow();
                row.ItemArray = new object[] {
                    _eqpCode,
                    _row.TypeCol<string>("eqp_name"),
                    dateMwd,
                    startDt.ToString("yyyy-MM-dd HH:mm:ss"),
                    endDt.ToString("yyyy-MM-dd HH:mm:ss"),
                    _row.TypeCol<int>("ng_pcs_total"),
                    _row.TypeCol<int>("ng_pcs_cnt"),
                    _row.TypeCol<int>("pcs_total"),
                    _row.TypeCol<int>("total_cnt")
                };
                dtrs.Rows.Add(row);
            }
            dtResult.Add(dtrs);
        }

        return Results.Json(dtResult);
    }

    private static DataTable GetDefectByDate(string label, DateTime fromDt, DateTime toDt, DataTable dt, DataTable dtResult, dynamic obj, string? ngCodes)
    {
        DataTable dtTotalCnt = DataContext.StringDataSet("@AOIDefectNew.AOIDefectCountPanel", RefineExpando(obj, true)).Tables[0];

        float openCnt = 0, shortCnt = 0, holeCnt = 0, etcCnt = 0, footCnt = 0, totalCnt = 0, ngCnt = 0, pcsCnt = 0, ngPcsCnt = 0;
        
        if (dtTotalCnt.Rows.Count > 0)
        {
            totalCnt = dtTotalCnt.Rows[0].TypeCol<int>("total_cnt");
        }
        if (dt != null && dt.Rows.Count > 0)
        {
            pcsCnt += dt.Rows[0].TypeCol<int>("pcs_cnt");
            if (string.IsNullOrEmpty(ngCodes))
            {
                ngPcsCnt += dt.Rows[0].TypeCol<int>("ng_pcs_cnt");
            } else {
                ngPcsCnt += dt.Rows[0].TypeCol<int>("ng_cnt");
            }
        }
        DataRow newrow = dtResult.NewRow();
        newrow.ItemArray = new object[] {
            fromDt.ToString("yyyy-MM-dd HH:mm:ss"),
            toDt.ToString("yyyy-MM-dd HH:mm:ss"),
            label,
            Math.Round(ngCnt, 2),
            Math.Round(openCnt, 2),
            Math.Round(shortCnt, 2),
            Math.Round(holeCnt, 2),
            Math.Round(etcCnt, 2),
            Math.Round(footCnt, 2),
            Math.Round(totalCnt, 2),
            Math.Round(pcsCnt, 2),
            Math.Round(ngPcsCnt, 2)
        };
        dtResult.Rows.Add(newrow);
        return dtResult;
    }

    private static DataTable GetDataChartDaily(DataTable data, string sqlId, dynamic obj, string? ngCodes)
    {
        DataTable dt = AddChartColumns();

        DateTime fromDate = GetToday().AddDays(-3).AddHours(8);
        DateTime toDate = GetToday().AddDays(-2).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.ToString("MM/dd"), fromDate, toDate, data, dt, obj, ngCodes);

        fromDate = GetToday().AddDays(-2).AddHours(8);
        toDate = GetToday().AddDays(-1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.ToString("MM/dd"), fromDate, toDate, data, dt, obj, ngCodes);

        fromDate = GetToday().AddDays(-1).AddHours(8);
        toDate = GetToday().AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.ToString("MM/dd"), fromDate, toDate, data, dt, obj, ngCodes);

        fromDate = GetToday().AddHours(8);
        toDate = GetToday().AddDays(1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.ToString("MM/dd"), fromDate, toDate, data, dt, obj, ngCodes);

        return dt;
    }

    private static DataTable GetDataChartWeekly(DataTable data, string sqlId, dynamic obj, string? ngCodes)
    {
        DataTable dt = AddChartColumns();

        DayOfWeek weekStart = DayOfWeek.Sunday;
        DateTime startingWeekDate = GetToday();
        while (startingWeekDate.DayOfWeek != weekStart)
        {
            startingWeekDate = startingWeekDate.AddDays(-1);
        }

        DateTime fromDate = startingWeekDate.AddDays(-21).AddHours(8);
        DateTime toDate = startingWeekDate.AddDays(-14).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(GetWeekNumber(fromDate) + "w", fromDate, toDate, data, dt, obj, ngCodes);

        fromDate = startingWeekDate.AddDays(-14).AddHours(8);
        toDate = startingWeekDate.AddDays(-7).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(GetWeekNumber(fromDate) + "w", fromDate, toDate, data, dt, obj, ngCodes);

        fromDate = startingWeekDate.AddDays(-7).AddHours(8);
        toDate = startingWeekDate.AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(GetWeekNumber(fromDate) + "w", fromDate, toDate, data, dt, obj, ngCodes);


        fromDate = startingWeekDate.AddHours(8);
        toDate = GetToday().AddDays(1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(GetWeekNumber(fromDate) + "w", fromDate, toDate, data, dt, obj, ngCodes);
        return dt;
    }

    private static int GetWeekNumber(DateTime dateTime)
    {
        Calendar calendar = CultureInfo.InvariantCulture.Calendar;
        int weekNumber = calendar.GetWeekOfYear(dateTime, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
        return weekNumber;
    }

    private static DataTable GetDataChartMonth(DataTable data, string sqlId, dynamic obj, string? ngCodes)
    {
        DataTable dt = AddChartColumns();

        DateTime month = GetToday().AddMonths(-3);
        DateTime fromDate = new DateTime(month.Year, month.Month, 1).AddHours(8);
        DateTime toDate = new DateTime(month.Year, month.Month, DateTime.DaysInMonth(month.Year, month.Month)).AddDays(1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        
        GetDefectByDate(fromDate.Month + "월", fromDate, toDate, data, dt, obj, ngCodes);

        month = GetToday().AddMonths(-2);
        fromDate = new DateTime(month.Year, month.Month, 1).AddHours(8);
        toDate = new DateTime(month.Year, month.Month, DateTime.DaysInMonth(month.Year, month.Month)).AddDays(1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.Month + "월", fromDate, toDate, data, dt, obj, ngCodes);

        month = GetToday().AddMonths(-1);
        fromDate = new DateTime(month.Year, month.Month, 1).AddHours(8);
        toDate = new DateTime(month.Year, month.Month, DateTime.DaysInMonth(month.Year, month.Month)).AddDays(1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.Month + "월", fromDate, toDate, data, dt, obj, ngCodes);

        fromDate = new DateTime(GetToday().Year, GetToday().Month, 1).AddHours(8);
        toDate = GetToday().AddDays(1).AddHours(8);
        obj.FromDate = fromDate;
        obj.ToDate = toDate;
        if (sqlId != null)
        {
            data = DataContext.StringDataSet(sqlId, RefineExpando(obj, true)).Tables[0];
        }
        GetDefectByDate(fromDate.Month + "월", fromDate, toDate, data, dt, obj, ngCodes);
        return dt;
    }

    private static DataTable AddChartColumns()
    {
        DataTable dtResult = new DataTable();
        dtResult.Columns.Add("fromDt", typeof(string));
        dtResult.Columns.Add("toDt", typeof(string));
        dtResult.Columns.Add("dateMwd", typeof(string));
        dtResult.Columns.Add("totalNg", typeof(float));
        dtResult.Columns.Add("open", typeof(float));
        dtResult.Columns.Add("short", typeof(float));
        dtResult.Columns.Add("hole", typeof(float));
        dtResult.Columns.Add("etc", typeof(float));
        dtResult.Columns.Add("foot", typeof(float));
        dtResult.Columns.Add("totalCnt", typeof(float));
        dtResult.Columns.Add("pcsCnt", typeof(float));
        dtResult.Columns.Add("ngPcsCnt", typeof(float));

        return dtResult;
    }
    private static DateTime GetToday()
    {
        DateTime today = DateTime.ParseExact(DateTime.Now.ToString("yyyy-MM-dd"), "yyyy-MM-dd", CultureInfo.InvariantCulture);
        return today;
    }

    [ManualMap]
    public static IResult ListDefectEqp(DateTime fromDt, DateTime toDt, string? modelCode, string? appCode, string? ngCodes, string? operCode, string? itemCode, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.ModelCode = string.IsNullOrEmpty(modelCode) ? "-1" : modelCode;
        obj.NgCodes = string.IsNullOrEmpty(ngCodes) ? "-1" : ngCodes;
        obj.ItemCode = string.IsNullOrEmpty(itemCode) ? "-1" : itemCode;
        obj.OperCode = string.IsNullOrEmpty(operCode) ? "-1" : operCode;
        obj.AppCode = string.IsNullOrEmpty(appCode) ? "-1" : appCode;

        DataTable dt = DataContext.DataSet("dbo.sp_aoi_defect_list_by_eqp", obj).Tables[0];

        DataTable table = new DataTable();
        table.Columns.Add("mes_date", typeof(DateTime));
        table.Columns.Add("eqp_name", typeof(string));
        table.Columns.Add("eqp_code", typeof(string));
        table.Columns.Add("ng_name", typeof(string));
        table.Columns.Add("ng_cnt", typeof(int));
        table.Columns.Add("pcs_total", typeof(int));
        table.Columns.Add("panel_qty", typeof(int));

        for (int i = 0; i < dt.Rows.Count; i++)
        {
            DataRow row = dt.Rows[i];
            //string eqpCode = row.TypeCol<string>("eqp_code");
            //DateTime mesDate = row.TypeCol<DateTime>("mes_date");
            //string ngCode = row.TypeCol<string>("ng_code");
            //string panelId = row.TypeCol<string>("panel_id");
            int ngCnt = row.TypeCol<int>("ng_pcs_cnt");
            int pcsTotal = row.TypeCol<int>("pcs_total");
            int panelQty = row.TypeCol<int>("panel_qty");
            //List<string> panelIds = new List<string>();
            //panelIds.Add(panelId);
            //for (int j = i + 1; j < dt.Rows.Count; j++)
            //{
            //    DataRow rowj = dt.Rows[j];
            //    if (eqpCode == rowj.TypeCol<string>("eqp_code")
            //        && ngCode == rowj.TypeCol<string>("ng_code") 
            //        && mesDate.CompareTo(rowj.TypeCol<DateTime>("mes_date")) == 0) {
            //        ngCnt += rowj.TypeCol<int>("ng_pcs_cnt");
            //        if (!panelIds.Contains(rowj.TypeCol<string>("panel_id"))) {
            //            panelIds.Add(rowj.TypeCol<string>("panel_id"));
            //            pcsTotal += rowj.TypeCol<int>("pcs_total");
            //            panelQty += rowj.TypeCol<int>("panel_qty");
            //        }
            //        i++;
            //    } 
            //    else
            //    {
            //        break;
            //    }

            //}

            DataRow newrow = table.NewRow();
            newrow.ItemArray = new object[] { 
                row.TypeCol<DateTime>("mes_date"),
                row.TypeCol<string>("eqp_name"),
                row.TypeCol<string>("eqp_code"),
                row.TypeCol<string>("ng_name"),
                ngCnt,
                pcsTotal,
                panelQty
            };
            table.Rows.Add(newrow);
        }

        if (!isExcel) {
            return Results.Json(ToDic(table));
        }
        return WorstExcelDown(table, "worst-detail-download");
    }

    private static IResult WorstExcelDown(DataTable dt, string fileName)
    {
        dt.Columns.Add("defect_rate", typeof(string));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("mes_date", "검사일자", 30, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("mes_date")?.ToString("yyyy-MM-dd") ?? string.Empty; }),
            new("eqp_name", "설비명", 40, typeof(string), null),
            new("eqp_code", "작업설비 명", 40, typeof(string), null),
            new("panel_qty", "PNL", 20, typeof(string), null),
            new("ng_name", "항목", 40, typeof(string), null),
            new("defect_rate", "불량률", 20, typeof(string), (row) => DevideFormat(row, "ng_cnt", "pcs_total").ToString() + "%")
        };
        using var excel = ExcelEx.ToExcel(dt, mapList);
        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    private static double DevideFormat(DataRow row, string numCol, string denomCol)
    {
        return Math.Round(row.TypeCol<double>(UtilEx.ToSnake(numCol)) / row.TypeCol<double>(UtilEx.ToSnake(denomCol)) * 100, 2);
    }

    [ManualMap]
    public static IResult DetailDefectEqp(string eqpCode, string eqpCodes, DateTime fromDt, DateTime toDt, string? appCode, string? modelCode, string? modelName, string? ngCodes, string? workcenterCode, string? operCode, string? itemCode, bool isExcel = false)
    {
        dynamic obj = new ExpandoObject();
        // obj.EqpCode = eqpCode;
        obj.FromDt = fromDt;
        obj.ToDt = toDt;
        obj.AppCode = string.IsNullOrEmpty(appCode) ? "-1" : appCode;
        obj.ModelCode = string.IsNullOrEmpty(modelCode) ? "-1" : modelCode;
        obj.EqpCodes = string.IsNullOrEmpty(eqpCodes) ? "-1" : eqpCodes;
        obj.NgCodes = string.IsNullOrEmpty(ngCodes) ? "-1" : ngCodes;
        obj.WorkcenterCode = string.IsNullOrEmpty(workcenterCode) ? "-1" : workcenterCode;
        obj.OperCode = string.IsNullOrEmpty(operCode) ? "-1" : operCode;
        obj.ItemCode = string.IsNullOrEmpty(itemCode) ? "-1" : itemCode;

        DataTable dt = DataContext.DataSet("dbo.sp_aoi_defect_eqp_list", obj).Tables[0];
        if (!isExcel)
        {
            return Results.Json(ToDic(dt));
        }
        return EqpDetailExcelDown(dt, "eqp-detail-download");
    }

    private static IResult EqpDetailExcelDown(DataTable dt, string fileName)
    {
        dt.Columns.Add("defect_rate", typeof(string));

        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("mes_date", "검사일자", 35, typeof(DateTime), (row) => { return row.TypeCol<DateTime?>("mes_date")?.ToString("yyyy-MM-dd HH:mm:ss") ?? string.Empty; }),
            new("eqp_name", "설비명", 40, typeof(string), null),
            new("eqp_code", "작업설비 명", 40, typeof(string), null),
            new("workorder", "Batch No", 40, typeof(string), null),
            new("panel_id", "PNL No", 40, typeof(string), null),
            new("ng_name", "검사 증", 40, typeof(string), null),
            new("defect_rate", "PNL 불량률", 20, typeof(string), (row) => DevideFormat(row, "ng_pcs_cnt", "pcs_total").ToString() + "%")

        };
        using var excel = ExcelEx.ToExcel(dt, mapList);
        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [ManualMap]
    public static IEnumerable<IDictionary> GetEqpByWorkcenter(string workcenterCode)
    {
        dynamic obj = new ExpandoObject();
        obj.workcenterCode = workcenterCode;

        return null;
    }
}
