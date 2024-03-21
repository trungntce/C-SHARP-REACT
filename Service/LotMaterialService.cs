namespace WebApp;
using Framework;
using System.Collections.Generic;
using System.Data;
using System.Text.RegularExpressions;

public class LotMaterialService : MinimalApiService, IMinimalApi
{
    public LotMaterialService(ILogger<LotMaterialService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/getlist", nameof(GetList));
        return RouteAllEndpoint(group);
    }
    [ManualMap]
    public static List<DataTable> List(string workorder)
    {

        var ds = DataContext.DataSet("dbo.sp_panel_oper_miss_list", new { workorder });
        List<DataTable> dtList = new List<DataTable>();
        dtList.Add(ds.Tables[0]);
        dtList.Add(ds.Tables[1]);
        dtList.Add(ds.Tables[2]);



        return dtList;
    }

    [ManualMap]
    public static IResult GetList(string workorder, bool isExcel = false)
    {

        
        DataTable lotMaterial = DataContext.StringDataSet("@LotMaterial.LotMaterialInfo", new { workorder }).Tables[0];

        Dictionary<string, object> result = new Dictionary<string, object>();

        List<Dictionary<string, object>> materialList = new List<Dictionary<string, object>>();

        int level = 0;
        for (int i = 0; i < lotMaterial.Rows.Count; i++)
        {
            string lot = lotMaterial.Rows[i].TypeCol<string>("material_lot");

            int groupNo = lotMaterial.Rows[i].TypeCol<int>("group_no");

            Dictionary<string, object> materialRow = new Dictionary<string, object>();

            materialRow.Add("level", lotMaterial.Rows[i].TypeCol<int>("level"));
            materialRow.Add("oper_seq_no_4m", lotMaterial.Rows[i].TypeCol<string>("oper_seq_no_4m"));
            materialRow.Add("oper_code_4m", lotMaterial.Rows[i].TypeCol<string>("oper_code_4m"));
            materialRow.Add("oper_name_4m", lotMaterial.Rows[i].TypeCol<string>("oper_name_4m"));
            materialRow.Add("material_lot", lotMaterial.Rows[i].TypeCol<string>("material_lot"));
            materialRow.Add("material_code", lotMaterial.Rows[i].TypeCol<string>("material_code"));
            materialRow.Add("material_name", lotMaterial.Rows[i].TypeCol<string>("material_name"));
            materialRow.Add("expired_dt", lotMaterial.Rows[i].TypeCol<string>("expired_dt"));
            materialRow.Add("layer_no", lotMaterial.Rows[i].TypeCol<string>("layer_no"));
            materialRow.Add("oper_seq_no", lotMaterial.Rows[i].TypeCol<string>("oper_seq_no"));
            materialRow.Add("oper_desc", lotMaterial.Rows[i].TypeCol<string>("oper_desc"));
            materialRow.Add("workcenter", lotMaterial.Rows[i].TypeCol<string>("workcenter"));
            materialRow.Add("main", lotMaterial.Rows[i].TypeCol<string>("main"));
            materialRow.Add("type", lotMaterial.Rows[i].TypeCol<string>("type"));
            materialRow.Add("group_no", lotMaterial.Rows[i].TypeCol<int>("group_no"));

            materialList.Add(materialRow);

            DataTable dt;

            // 생산된 반제품 - WORKORDER

            // 생산된 반제품이 창고에 들어가면 SFG~~~~로 자재코드 부여
            if(groupNo == 1)
            {
                if (lot.ToUpper().Contains("SFG"))
                {
                    dt = DataContext.StringDataSetEx(Setting.ErpConn, "@LotMaterial.MaterialHistorySFG", new { workorder = lot }).Tables[0];
                }
                else
                {
                    dt = DataContext.StringDataSetEx(Setting.ErpConn, "@LotMaterial.MaterialHistoryTcard", new { workorder = lot }).Tables[0];
                }

                for (int j = 0; j < dt.Rows.Count; j++)
                {
                    Dictionary<string, object> semiProduct = new Dictionary<string, object>();

                    semiProduct.Add("level", dt.Rows[j].TypeCol<int>("level"));
                    semiProduct.Add("material_lot", dt.Rows[j].TypeCol<string>("material_lot"));
                    semiProduct.Add("material_code", dt.Rows[j].TypeCol<string>("material_code"));
                    semiProduct.Add("material_name", dt.Rows[j].TypeCol<string>("material_name"));
                    semiProduct.Add("expired_dt", dt.Rows[j].TypeCol<string>("expired_dt"));
                    semiProduct.Add("layer_no", dt.Rows[j].TypeCol<string>("layer_no"));
                    semiProduct.Add("main", dt.Rows[j].TypeCol<string>("main"));
                    semiProduct.Add("type", dt.Rows[j].TypeCol<string>("type"));
                    semiProduct.Add("maker", dt.Rows[j].TypeCol<string>("maker"));
                    semiProduct.Add("create_dt", "");

                    materialList.Add(semiProduct);


                    if (level < dt.Rows[j].TypeCol<int>("level"))
                        level = dt.Rows[j].TypeCol<int>("level");
                }
            }
        }
        result.Add("level", level);
        result.Add("data", materialList);

        static DataTable ToDataTable(List<Dictionary<string, object>> list)
        {
            DataTable result = new DataTable();
            if (list.Count == 0)
                return result;

            var columnNames = list.SelectMany(dict => dict.Keys).Distinct();
            result.Columns.AddRange(columnNames.Select(c => new DataColumn(c)).ToArray());
            for (int i = 0; i < list.Count; i++)
            {
                var row = result.NewRow();
                foreach (var key in list[i].Keys)
                {
                    row[key] = list[i][key];
                }


                result.Rows.Add(row);
            }

            return result;
        }

        var response = ToDataTable(materialList);

        if (!isExcel)
            return Results.Json(ToDic(response));

        return ExcelDown(response, "Batch_Material");

    }

    [ManualMap]
    public static IResult ExcelDown(DataTable dt, string fileName)
    {
        List<Tuple<string, string, double, Type, Func<DataRow, object>?>> mapList = new()
        {
            new("oper_seq_no_4m", "OperSeqNo4M", 30, typeof(string), null),
            new("oper_name_4m", "OperName4M", 30, typeof(string), null),
            new("material_lot", "MaterialLot", 30, typeof(string), null),
            new("level", "Level", 10, typeof(string), null),
            new("type", "Type", 10, typeof(string), null),
            new("oper_seq_no", "Oper_Seq_No", 20, typeof(string), null),
            new("oper_desc", "Oper_Desc", 30, typeof(string), null),
            new("workcenter", "WorkCenter", 30, typeof(string), null),
            new("material_code", "MaterialCode", 30, typeof(string), null),
            new("material_name", "MaterialNode", 30, typeof(string), null),
            new("expired_dt", "ExpiredDt", 25, typeof(string), null),

        };

        //materialRow.Add("level", lotMaterial.Rows[i].TypeCol<int>("level"));
        //materialRow.Add("material_lot", lotMaterial.Rows[i].TypeCol<string>("material_lot"));
        //materialRow.Add("material_code", lotMaterial.Rows[i].TypeCol<string>("material_code"));
        //materialRow.Add("material_name", lotMaterial.Rows[i].TypeCol<string>("material_name"));
        //materialRow.Add("expired_dt", lotMaterial.Rows[i].TypeCol<string>("expired_dt"));
        //materialRow.Add("layer_no", lotMaterial.Rows[i].TypeCol<string>("layer_no"));
        //materialRow.Add("oper_seq_no", lotMaterial.Rows[i].TypeCol<string>("oper_seq_no"));
        //materialRow.Add("oper_desc", lotMaterial.Rows[i].TypeCol<string>("oper_desc"));
        //materialRow.Add("workcenter", lotMaterial.Rows[i].TypeCol<string>("workcenter"));
        //materialRow.Add("main", lotMaterial.Rows[i].TypeCol<string>("main"));
        //materialRow.Add("type", lotMaterial.Rows[i].TypeCol<string>("type"));
        //materialRow.Add("group_no", lotMaterial.Rows[i].TypeCol<int>("group_no"));

        using var excel = ExcelEx.ToExcel(dt, mapList);

        return Results.File(excel.GetAsByteArray(), "application/force-download", $"{fileName}-{DateTime.Now:yyyyMMdd}.xlsx");
    }

}

