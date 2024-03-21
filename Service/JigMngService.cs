namespace WebApp;

using Framework;
using System.Collections.Generic;

public class JigMngService : BaseService
{
    public static JigMngList List(dynamic entity)
    {
        return new(DataContext.StringEntityList<JigMngEntity>("@JigMng.JigList", entity));
    }

    public static JigMngList JigGrpList(dynamic entity)
    {
        return new(DataContext.StringEntityList<JigMngEntity>("@JigMng.JigGrpList", entity));
    }

    public static JigMngList DupJigCheck(dynamic entity)
    {
        return new(DataContext.StringEntityList<JigMngEntity>("@JigMng.DupJigCheck", entity));
    }

    public static JigMngList DupJigGrpCheck(dynamic entity)
    {
        return new(DataContext.StringEntityList<JigMngEntity>("@JigMng.DupJigGrpCheck", entity));
    }

    public static int Insert(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@JigMng.JigInsert", param);
    }

    public static int InsertJigGrp(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@JigMng.JigGrpInsert", param);
    }

    public static int Update(IDictionary<string, object> dic)
    {
        return DataContext.StringNonQuery("@JigMng.JigUpdate", dic);

    }

    public static int UpdateJigGrp(IDictionary<string, object> dic)
    {
        return DataContext.StringNonQuery("@JigMng.JigGrpUpdate", dic);

    }

    public static int Delete(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@JigMng.JigDelete", param);
    }

    public static int DeleteJigGrp(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@JigMng.JigGrpDelete", param);
    }

    public static void RefreshMap(string corpCode)
    {
    }
}
