namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Drawing.Printing;
using System.Dynamic;
using System.Linq;

using Framework;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Unity.Interception.Utilities;

public class ModelOperExtService : MinimalApiService, IMinimalApi
{
    public ModelOperExtService(ILogger<ModelOperExtService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("erpmodel", nameof(ErpModelList));
        group.MapGet("opereqplistbymodel", nameof(ErpOperEqpListByModel));
        group.MapGet("approvedoper", nameof(ApprovedOper));

        return RouteAllEndpoint(group);
    }
    
    public static List<ModelOperExtEntity> List(string modelCode)
    {        
        var erpOperListWithEqpJson = ErpOperEqpListByModel(modelCode);

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        List<ModelOperExtEntity> modelExtList = DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExt.List", RefineExpando(obj, true));

        foreach (var oper in erpOperListWithEqpJson)
        {
            var find = modelExtList.FirstOrDefault(x => x.OperationCode == oper.OperationCode && x.OperationSeqNo == oper.OperationSeqNo);
            if(find != null)
            {
                find.Adapt(oper);
                continue;
            }

            find = modelExtList.FirstOrDefault(x => x.OperationCode == oper.OperationCode);
            if (find != null)
            {
                find.Adapt(oper);
                continue;
            }
        }

        foreach (var erpOper in erpOperListWithEqpJson)
        {
            var erpEqpList = erpOper.OperEqpList; // ERP 설비 리스트
            var extEqpList = erpOper.EqpList; // ModelOperExt에 설정된 설비 리스트

            if (erpEqpList.Count <= 0)
                continue;

            if (extEqpList.Count <= 0)
            {
                erpEqpList.ForEach(x => x["useYn"] = 'Y'); // 설정 안된 경우 기본값 Y
            }
            else
            {
                erpEqpList.ForEach(x =>
                {
                    string eqpCode = x.TypeKey<string>("eqpCode");
                    x["useYn"] = extEqpList.Any(y => (y.TypeKey<string>("eqpCode") == eqpCode) && y.SafeTypeKey("useYn", 'N') == 'Y') ? 'Y' : 'N';
                });
            }

            erpOper.OperEqpJson = JsonConvert.SerializeObject(erpEqpList);
        }

        return erpOperListWithEqpJson;
    }


    [ManualMap]
    public static List<ModelOperExtEntity> ErpOperEqpListByModel(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExt.ErpOperEqpListByModel", RefineExpando(obj, true));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ErpModelList(string? itemCode, string? modelCode, string? modelDescription, string? itemCategoryCode, char? setupYn)
    {
        var modelList = ErpModelService.List(itemCode, modelCode, modelDescription, itemCategoryCode);
        var distinctList = DataContext.StringEntityList<ModelOperExtEntity>("@ModelOperExt.ModelDistinctList", new { }).Select(x => x.ModelCode);

        modelList.ForEach(x => {
            if (distinctList.Contains(x.TypeKey<string>("modelCode")))
            {
                x["setupYn"] = 'Y';
            }
        });

        if (setupYn == 'Y')
            return modelList.Where(x => x.TypeKey<char>("setupYn") == 'Y');

        return modelList;
    }

    public static int Update([FromBody] IDictionary<string, List<ModelOperExtEntity>> dic)
    {
        var modelCode = dic.Keys.First();
        var list = dic[modelCode];

        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;
        obj.Json = JsonConvert.SerializeObject(list);
        obj.DeleteAll = list.Count <= 1 ? 'N' : 'Y';

        return DataContext.StringNonQuery("@ModelOperExt.Update", RefineExpando(obj));
    }

    public static int Delete(string modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return DataContext.StringNonQuery("@ModelOperExt.Delete", RefineExpando(obj));
    }

    [ManualMap]
    public static IEnumerable<IDictionary> ApprovedOper(string? modelCode)
    {
        dynamic obj = new ExpandoObject();
        obj.ModelCode = modelCode;

        return ToDic(DataContext.StringDataSet("@ModelOperExt.ApprovedOper", RefineExpando(obj)).Tables[0]);
    }
}
