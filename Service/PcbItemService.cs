namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Transactions;
using Framework;
using Microsoft.Extensions.Options;

public class PcbItemService : BaseService
{
    public static PcbItemList List(dynamic entity)
    {
        return new (DataContext.StringEntityList<PcbItemEntity>("@PcbItem.PcbItemList", entity));
    }

    public static PcbItemList DupItemCheck(dynamic entity)
    {
        return new (DataContext.StringEntityList<PcbItemEntity>("@PcbItem.DupItemCheck", entity));
    }

public static int Insert(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@PcbItem.PcbItemInsert", param);
    }

    public static int Update(IDictionary<string, object> dic)
    {
        return DataContext.StringNonQuery("@PcbItem.PcbItemUpdate", dic);
    }

    public static int Delete(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@PcbItem.PcbItemDelete", param);
    }

    public static void RefreshMap(string corpCode)
    {
    }


}
