namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

public class ReworkRollService : MinimalApiService, IMinimalApi, Map.IMap
{
    public ReworkRollService(ILogger<ReworkRollService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapPut("/put", nameof(InsertPut));
        group.MapPut("/putparentroll", nameof(InsertPutParentRoll));
        group.MapPut("/approve", nameof(InsertApprove));
        group.MapPut("/refuse", nameof(InsertRefuse));

        return RouteAllEndpoint(group);
    }
    
    public static ReworkRollList ListAll()
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;

		return new ReworkRollList(DataContext.StringEntityList<ReworkRollEntity>("@ReworkRoll.List", RefineExpando(obj)));
    }
    
    public static ReworkRollList List(string? parentRollId, string? rollId, char? approveYn)
    {
        dynamic obj = new ExpandoObject();
        obj.PageNo = 1;
        obj.PageSize = 99999;
        obj.ParentRollId = parentRollId;
        obj.RollId = rollId;
        obj.ApproveYn = approveYn;
        if (approveYn != null)
        {
            return new ReworkRollList(DataContext.StringEntityList<ReworkRollEntity>("@ReworkRoll.SplitList", RefineExpando(obj, true)));
        }
        else
        {
            return new ReworkRollList(DataContext.StringEntityList<ReworkRollEntity>("@ReworkRoll.List", RefineExpando(obj, true)));
        }

        
    }

    public static ReworkRollList ListAllCache()
    {
        var list = UtilEx.FromCache(
            BuildCacheKey(),
            DateTime.Now.AddMinutes(GetCacheMin()),
            ListAll);

        return list;
    }
    public static int Delete(string rollId, string putDt)
    {
        dynamic obj = new ExpandoObject();
        obj.RollId = rollId;
        obj.PutDt = putDt;

        RemoveCache();

        return DataContext.StringNonQuery("@ReworkRoll.Delete", RefineExpando(obj));
    }
    public static ReworkRollEntity? Select(string rollId)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = rollId;

        return DataContext.StringEntity<ReworkRollEntity>("@ReworkRoll.Select", RefineExpando(obj, true));
    }
    public static int Update([FromBody] ReworkRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.operSeq = entity.OperSeq;
        obj.operCode = entity.OperCode;
        obj.operName = entity.OperName;
        obj.rollReworkId = entity.RollReworkId;
        obj.reworkCode = entity.ReworkCode;
        obj.putRemark = entity.PutRemark;
        obj.putUpdateUser = entity.PutUpdateUser;
        RemoveCache();

        return DataContext.StringNonQuery("@ReworkRoll.Update", RefineEntity(entity));
    }

    public static int Insert([FromBody] ReworkRollEntity entity)
    {
        //if (Select(panelId) != null)
        //    return -1;

        RemoveCache();

        //return DataContext.StringNonQuery("@BarcodeApi.Panel.InterlockInsert", new { entity.panelId, interlockCode, onRemark, onUpdateUser });
        return DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkRollInsert", new {});
    }

    [ManualMap]
    public static int InsertPut([FromBody] ReworkRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.operSeq = entity.OperSeq;
        obj.operCode = entity.OperCode;
        obj.operName = entity.OperName;
        obj.rollId = entity.RollId;
        obj.reworkApproveYn = 'N';
        obj.reworkCode = entity.ReworkCode;
        obj.putRemark = entity.PutRemark;
        obj.putUpdateUser = entity.PutUpdateUser;
        DataTable nullCheck = DataContext.StringDataSet("@ReworkRoll.RollNullCheck", RefineExpando(obj, true)).Tables[0];
        int rowCnt = nullCheck.Rows.Count;
        if (rowCnt > 0) {
            return -2;
        } else {
            //roll_realtime
            //int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkYn", RefineExpando(obj, true));
            //roll_interlock
            int cnt2 = DataContext.StringNonQuery("@ReworkRoll.ReworkInsert", RefineExpando(obj, true));
            return cnt2;
        }
    }

    [ManualMap]
    public static int InsertPutParentRoll([FromBody] ReworkRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.operSeq = entity.OperSeq;
        obj.operCode = entity.OperCode;
        obj.operName = entity.OperName;
        obj.parentRollId = entity.ParentRollId;
        obj.reworkApproveYn = 'N';
        obj.reworkCode = entity.ReworkCode;
        obj.putRemark = entity.PutRemark;
        obj.putUpdateUser = entity.PutUpdateUser;
        DataTable nullCheck = DataContext.StringDataSet("@ReworkRoll.MotherRollNullCheck", RefineExpando(obj, true)).Tables[0];
        int rowCnt = nullCheck.Rows.Count;
        if (rowCnt > 0)
        {
            return -2;
        }
        else
        {
            //realtime
            //int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkRollYn", RefineExpando(obj, true));
            //interlock
            int cnt2 = DataContext.StringNonQuery("@ReworkRoll.ReworkRollInsert", RefineExpando(obj, true));
            return cnt2;
        }
    }


    [ManualMap]
    public static int InsertApprove([FromBody] ReworkRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.reworkApproveYn = 'Y';
        obj.approveRemark = entity.ApproveRemark;
        obj.approveUpdateUser = entity.ApproveUpdateUser;
        //roll_realtime
        //int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkYn", RefineExpando(obj, true));
        //roll_interlock
        int cnt2 = DataContext.StringNonQuery("@ReworkRoll.ReworkApproveInsert", RefineExpando(obj, true));

        return cnt2;
    }
    [ManualMap]
    public static int InsertRefuse([FromBody] ReworkRollEntity entity)
    {
        dynamic obj = new ExpandoObject();
        obj.rollId = entity.RollId;
        obj.reworkApproveYn = 'N';
        obj.refuseRemark = entity.RefuseRemark;
        obj.refuseUpdateUser = entity.RefuseUpdateUser;
        //int cnt = DataContext.StringNonQuery("@BarcodeApi.Roll.ReworkYn", RefineExpando(obj, true));
        int cnt2 = DataContext.StringNonQuery("@ReworkRoll.ReworkRefuseInsert", RefineExpando(obj, true));

        return cnt2;
    }
    public static void RemoveCache()
    {
        UtilEx.RemoveCache(BuildCacheKey());
    }

    public static Map GetMap(string? category = null)
    {
        throw new NotImplementedException();

    }

    public static void RefreshMap()
    {
        RemoveCache();
    }
}
