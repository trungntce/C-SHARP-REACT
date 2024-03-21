namespace WebApp;

using Framework;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Dynamic;
using System.Linq;
using Mapster;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Unity.Interception.PolicyInjection.MatchingRules;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Newtonsoft.Json;
using ProtoBuf;
using Force.DeepCloner;
using Org.BouncyCastle.Crypto.Modes.Gcm;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Diagnostics;

public class TestService : MinimalApiService, IMinimalApi
{
    static TestList _list = new TestList(new List<TestEntity>()
    { 
        new TestEntity(){
            CorpId = "SIFLEX",
            FacId = "SIFLEX",
            TestId = "테스트ID",
            TestName = "테스트네임",
            Quantity = 12,
            UseYn = 'Y',
            Sort = 1,
            Icon = "plus",
            Remark = "remark",
            CreateUser = "admin",
            CreateDt = DateTime.Now
        },
        new TestEntity(){
            CorpId = "SIFLEX",
            FacId = "SIFLEX",
            TestId = "테스트ID2",
            TestName = "테스트네임2",
            Quantity = 15,
            UseYn = 'Y',
            Sort = 2,
            Remark = "remark2",
            CreateUser = "admin",
            CreateDt = DateTime.Now
        }
    });

    public TestService(ILogger<TestService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/test", nameof(Test));
        group.MapPut("/test2", nameof(Test2));
        group.MapGet("/gbr", nameof(GbrSelect));

        group.MapGet("/rolliteminsert", nameof(RollItemInsert));


        return RouteAllEndpoint(group);
    }
    
    public static TestList ListAll()
    {        
        return _list;
    }

    [ManualMap]
    public static void RollItemInsert ()
    {
        DataTable test = DataContext.DataSet("sp_roll_item_exists", new { rowKey =""}).Tables[0];

        for (int i = 0; i < test.Rows.Count; i++)
        {

            dynamic obj = new ExpandoObject();
            obj.RowKey = NewShortId();
            obj.RollRowKey = test.Rows[i].TypeCol<string>("roll_row_key");
            obj.RollGroupKey = test.Rows[i].TypeCol<string>("roll_group_key");
            obj.RollId = test.Rows[i].TypeCol<string>("roll_id");
            obj.CreateDt = test.Rows[i].TypeCol<DateTime>("create_dt");
            obj.RecipeJudge = test.Rows[i].TypeCol<char>("recipe_judge");
            obj.ParamJudge = test.Rows[i].TypeCol<char>("param_judge");

            var insert = DataContext.NonQuery("sp_roll_item_exists_insert", RefineExpando(obj));

            break;
        }
    }

    public static TestList List(ILogger<TestService> logger, string? testId, string? TestName, string? remark, char? useYn, string? itemCode, int? inventoryItemId)
    {
        string result = LanguageService.GetLang("테스트::Bài kiểm tra::Test", "ko-KR,en-US");

        var ds = DataContext.StringDataSetBy(Setting.ErpConn, "@BarcodeApi.Common.ErpBomList", new { workorder = "VPN230620100-00195", operSeqNo = 1400 });

        return new TestList(_list
            .Where(x => testId == null || x.TestId == testId)
            .Where(y => TestName == null || y.TestName.IndexOf(TestName, StringComparison.InvariantCultureIgnoreCase) >= 0)
            .Where(z => remark == null || z.Remark?.IndexOf(remark, StringComparison.InvariantCultureIgnoreCase) >= 0)
            .Where(xx => useYn == null || xx.UseYn == useYn)
        );
    }

    public static TestEntity? Select(string testId)
    {
        return _list.FirstOrDefault(x => x.TestId == testId);      
    }

    public static int Insert([FromBody] TestEntity entity)
    {
        if (Select(entity.TestId) != null)
            return -1;

        RemoveCache();

        _list.Add(entity);

        return 1;
    }

    public static int Update([FromBody] TestEntity entity)
    {
        var test = Select(entity.TestId);

        if (test == null)
            return 0;

        entity.Adapt(test);

        return 1;
    }

    public static int Delete(string testId)
    {
        var test = Select(testId);
        if(test == null)
            return 0;

        _list.Remove(test);

        return 1;
    }

    public static TestList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }

    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    [ManualMap]
    public static string GbrSelect(string fileName)
    {

        if (File.Exists(($@"D:\\Upload\GBR\VRS\{fileName}")))
        {
			return File.ReadAllText($@"D:\\Upload\GBR\VRS\{fileName}");
        }
        else
        {
			return "fail";
		}

    }

    [ManualMap]
    public static int Test(TestEntity2 entity)
    {
        entity.AdditionalProp3.Add("k", "v");

        TestEntity2 copy = entity.Adapt<TestEntity2>();
        TestEntity2 copy2 = entity.DeepClone();

        entity.AdditionalProp3.Add("k2", "v2");

        (ResultEnum resultEnum, string remark) t1 = ChkInsertBaseRecipe(new { });
        (bool isChk, int count, int operSeqNo) t2 = FirsOpertMaterialChk(new OperationEntity());

        var tt1 = t1.GetType();
        var tt2 = t2.GetType();

        return 2;
    }

    [ManualMap]
    public static int Test2(ILogger<TestService> logger, string t)
    {
        var watch = Stopwatch.StartNew();

        string panelId = "test11111";

        watch.Restart();
        Thread.Sleep(3000);
        logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "logic1");

        watch.Restart();
        Thread.Sleep(2000);
        logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "logic2");

        watch.Restart();
        Thread.Sleep(5000);
        logger.LogCritical("[PNL: {panelId}, {elapsed}] {method}", panelId, watch.Elapsed.ToString("mm':'ss':'fff"), "logic3");

        return 2;
    }

    public class TestEntity2
    {
        public string AdditionalProp1 { get; set; } = default!;

        public int AdditionalProp2 { get; set; }

        public Dictionary<string, object?> AdditionalProp3 { get; set; } = default!;
    }

    [ManualMap]
    public static (ResultEnum resultEnum, string remark) ChkInsertBaseRecipe(dynamic objRecipeOrParam)
    {
        return (ResultEnum.OkPanel, "");
    }

    [ManualMap]
    public static (bool isChk, int count, int operSeqNo) FirsOpertMaterialChk(OperationEntity currOperInfo)
    {
        return new(false, 0, 0);
    }
}
