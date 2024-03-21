namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;

using Framework;
using Newtonsoft.Json;

public class Map : List<MapEntity>
{
    public interface IMap
    {
        public static abstract Map GetMap(string? category = null);

        public static abstract void RefreshMap();
    }

        
    public class MapInfra : Tuple<Func<string?, Map>, Action>
    {
        public MapInfra(Func<string?, Map> func, Action act) : base(func, act)
        {
        }
    }

    public Map(List<MapEntity> map) : base(map)
    {
    }        
}

public static class MapExtension
{
    public static Map ToMap(this IEnumerable<MapEntity> list)
    {
        return new Map(list.ToList());
    }
}

public class MapService : MinimalApiService, IMinimalApi
{
    public MapService(ILogger<MapService> logger) : base(logger)
    {
    }

    static IDictionary<string, Map.MapInfra> _mapList = 
        new Dictionary<string, Map.MapInfra>()
    {
        { "code",               new Map.MapInfra(CodeService.GetMap, CodeService.RefreshMap) },
        { "codegroup",          new Map.MapInfra(CodegroupService.GetMap, CodegroupService.RefreshMap) },
        { "menu",               new Map.MapInfra(MenuService.GetMap, MenuService.RefreshMap) },
        { "menusearch",         new Map.MapInfra(MenuService.GetMapForSearch, MenuService.RefreshMap) },
        { "worker",             new Map.MapInfra(WorkerService.GetMap, WorkerService.RefreshMap) },
		{ "item",               new Map.MapInfra(ErpItemService.GetMap, ErpItemService.RefreshMap) },
        { "model",              new Map.MapInfra(ErpModelService.GetMap, ErpModelService.RefreshMap) },
        { "vendor",             new Map.MapInfra(ErpVendorService.GetMap, ErpVendorService.RefreshMap) },
        { "app",                new Map.MapInfra(ErpApplicationService.GetMap, ErpApplicationService.RefreshMap) },
        { "eqp",                new Map.MapInfra(ErpEqpService.GetMap, ErpEqpService.RefreshMap) },
        { "workcnetereqp",      new Map.MapInfra(ErpEqpService.GetMapWorkCenterEqp, ErpEqpService.RefreshMap) },
        { "person",             new Map.MapInfra(ErpPersonService.GetMap, ErpPersonService.RefreshMap) },
		{ "oper",               new Map.MapInfra(ErpOperService.GetMap, ErpOperService.RefreshMap) },
		{ "workcenter",         new Map.MapInfra(ErpWorkCenterService.GetMap, ErpWorkCenterService.RefreshMap) },

		{ "user",               new Map.MapInfra(UserService.GetMap, UserService.RefreshMap) },
        { "usergroup",          new Map.MapInfra(UsergroupService.GetMap, UsergroupService.RefreshMap) },

        { "error",              new Map.MapInfra(ErrorService.GetMap, ErrorService.RefreshMap) },
        { "errorgroup",         new Map.MapInfra(ErrorgroupService.GetMap, ErrorgroupService.RefreshMap) },

        { "codedefect",         new Map.MapInfra(DefectService.CodeGetMap, DefectService.CodeRefreshMap) },
        { "defect",             new Map.MapInfra(DefectService.GetMap, ErrorService.RefreshMap) },
        { "defectgroup",        new Map.MapInfra(DefectgroupService.GetMap, DefectgroupService.RefreshMap) },

        { "inforoom",           new Map.MapInfra(PlcInfotableService.RoomGetMap, PlcInfotableService.RoomRefreshMap) },
        { "infoeqp",            new Map.MapInfra(PlcInfotableService.GetMap, PlcInfotableService.RefreshMap) },

        { "infotable",          new Map.MapInfra(PlcInfotableService.TableGetMap, PlcInfotableService.RefreshMap) },
        { "infocol",            new Map.MapInfra(PlcInfotableService.ColumnGetMap, PlcInfotableService.ColumnRefreshMap) },
        { "infocolbytable",     new Map.MapInfra(PlcInfotableService.ColumnGetMapByTable, PlcInfotableService.ColumnRefreshMap) },
        { "infocolbytablenojson",     new Map.MapInfra(PlcInfotableService.ColumnGetMapByTableNoJson, PlcInfotableService.ColumnRefreshMap) },

        { "inforoompc",         new Map.MapInfra(PcInfotableService.RoomGetMap, PcInfotableService.RoomRefreshMap) },
        { "infotablepc",        new Map.MapInfra(PcInfotableService.GetMap, PcInfotableService.RefreshMap) },
        { "infoeqptablepc",     new Map.MapInfra(PcInfotableService.EqpGetMap, PcInfotableService.EqpRefreshMap) },
		{ "infoeqppc",          new Map.MapInfra(PcInfotableService.EqppcGetMap, PcInfotableService.EqpRefreshMap) },
		{ "infocolbytablepc",   new Map.MapInfra(PcInfotableService.ColumnGetMapByTable, PcInfotableService.ColumnRefreshMap) },

        { "operext",            new Map.MapInfra(OperExtService.GetMap, OperExtService.RefreshMap) },
        { "workinguom",         new Map.MapInfra(OperExtService.UomGetMap, OperExtService.UomRefreshMap) },

        { "roomlist",           new Map.MapInfra(MonitoringDetailService.GetMap, MonitoringDetailService.RefreshMap) },
        { "typelist",           new Map.MapInfra(MngOperationService.GetMap, MonitoringDetailService.RefreshMap) },

        { "eqpareagroup",       new Map.MapInfra(EqpAreaGroupService.GetMap, EqpAreaGroupService.RefreshMap) },
		{ "eqparea",            new Map.MapInfra(EqpAreaService.EqpAreaGetMap, EqpAreaService.EqpAreaRefreshMap) },

        { "interlock",          new Map.MapInfra(InterlockService.GetMap, InterlockService.RefreshMap) },
        { "rework",             new Map.MapInfra(ReworkService.GetMap, ReworkService.RefreshMap) },

        { "param",              new Map.MapInfra(ParamService.GetMap, ParamService.RefreshMap) },
        { "recipe",             new Map.MapInfra(RecipeService.GetMap, RecipeService.RefreshMap) },

		{ "recipeparamgroup",   new Map.MapInfra(RecipeService.GroupGetMap, RecipeService.RefreshMap) },

        { "healthcheckreader",  new Map.MapInfra(BarcodeService.GetMap, RecipeService.RefreshMap) },

        { "tool4m",             new Map.MapInfra(TraceService.ToolList4MMap, TraceService.ToolRefreshMap) },
        { "matlot4m",           new Map.MapInfra(TraceService.MatLotList4MMap, TraceService.MatLotRefreshMap) },
        { "matcode4m",          new Map.MapInfra(TraceService.MatCodeList4MMap, TraceService.MatCodeRefreshMap) },

        { "diwater",            new Map.MapInfra(DiWaterService.DiWaterLisGetMap, DiWaterService.DiWaterListRefreshMap) },
        { "diwaterEqp",         new Map.MapInfra(DiWaterService.GetMap, DiWaterService.RefreshMap) },
        { "diwaterCol",         new Map.MapInfra(DiWaterService.DiWaterColLisGetMap, DiWaterService.DiWaterColListRefreshMap) },

        { "enigList",           new Map.MapInfra(ENIGService.GetMap, DiWaterService.RefreshMap) },

        { "spcdescription",     new Map.MapInfra(SPCReportService.GetMap, SPCReportService.RefreshMap) },
        { "spcblack",           new Map.MapInfra(SPCReportService.GetMapBlack, SPCReportService.RefreshMapBlack) },
        { "operclass",          new Map.MapInfra(ChemReportService.GetMap, ChemReportService.RefreshMap) },
        { "chemicallist",       new Map.MapInfra(ChemReportService.ChemGetMap, ChemReportService.ChemNaleListRefreshMap) },

        { "checksheetemt",      new Map.MapInfra(ChecksheetEqpService.EmtGetMap, ChecksheetEqpService.RefreshMap) },
        { "checksheetpm",       new Map.MapInfra(ChecksheetEqpService.PmGetMap, ChecksheetEqpService.RefreshMap) },
        { "checksheetprod",     new Map.MapInfra(ChecksheetEqpService.ProdGetMap, ChecksheetEqpService.RefreshMap) },
        { "checksheetclean",     new Map.MapInfra(ChecksheetCleanService.GetMap, ChecksheetCleanService.RefreshMap) },

        { "operbyworkcenter",     new Map.MapInfra(OperInspMatter4MService.GetMap, OperInspMatter4MService.RefreshMap) },

        { "operType",           new Map.MapInfra(MessengerService.GetMap, MessengerService.RefreshMap) },
        { "messengerUserGroup", new Map.MapInfra(MessengerService.GetUserGroupMap, MessengerService.RefreshMap) },
        { "messengerUser",      new Map.MapInfra(MessengerService.GetUserMap, MessengerService.RefreshMap) },
    };

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        return RouteAllEndpoint(group);
    }

    public static List<MapEntity> List(string mapCode, string? category, string langCode = "ko-KR")
    {
        if (!_mapList.ContainsKey(mapCode))
            return new List<MapEntity>();

        var rtn = _mapList[mapCode].Item1.Invoke(category);

        if (langCode == "ko-KR!vi-VN" || langCode == "vi-VN!ko-KR")
        {
            rtn.ForEach(x =>
            {
                x.Label = CommonService.SetLangCodeRemark(ResultEnum.LangCodeKoVi, langCode, x.Label);
            });
        }
        else
        {
            rtn.ForEach(x =>
            {
                x.Label = LanguageService.LangText(x.Label, langCode);
            });
        }


        return rtn;
    }

    public static void Refresh(string mapCode)
    {
        _mapList[mapCode].Item2.Invoke();
    }
}


