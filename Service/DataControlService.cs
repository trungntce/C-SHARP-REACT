namespace WebApp;

using System;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;

public class DataControlService : MinimalApiService, IMinimalApi
{
    public DataControlService(ILogger<DataControlService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/panelitem", nameof(PanelItem));
        group.MapGet("/panelrealtime", nameof(PanelRealtime));
        group.MapGet("/panelrollmapping", nameof(PanelRollMapping));
        group.MapGet("/laseroper", nameof(LaserOper));
        group.MapGet("/end4m", nameof(End4m));
        group.MapGet("/endcancel4m", nameof(End4mCancel));
        group.MapGet("/delete4m", nameof(Delete4m));
        group.MapGet("/changematerialexpired", nameof(MaterialExpiredDateChange));
        return RouteAllEndpoint(group);
    }

    
    [ManualMap]
    public static int PanelItem(string startPanel, string workorder, int operSeqNo, int startNum, int endNum, string s)
    {
        DataTable ptsData = DataContext.StringDataSet("@BarcodeApi.Panel.PanelItemControlSelect", new { workorder, operSeqNo }).Tables[0];
        string groupKey = ptsData.Rows[0].TypeCol<string>("group_key");
        string deviceId = ptsData.Rows[0].TypeCol<string>("device_id");
        string eqpCode = ptsData.Rows[0].TypeCol<string>("eqp_code");
        DateTime startDt = ptsData.Rows[0].TypeCol<DateTime>("start_dt");
        DateTime endDt = ptsData.Rows[0].TypeCol<DateTime>("end_dt");


        int deleteCnt = DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControlDelete", new { groupKey });


        Random rand = new Random();

        int ranA = rand.Next(3, 10);
        int ranB = rand.Next(3, 10);

        TimeSpan gap = (endDt.AddMinutes(-ranA) - startDt.AddMinutes(ranB)) / Math.Abs(startNum - endNum);

        DateTime standard = startDt.AddMinutes(ranB);


        //롤 판넬 각인
        //TimeSpan gap = (endDt.AddMinutes(-6) - startDt.AddSeconds(120)) / Math.Abs(startNum - endNum);

        //DateTime standard = startDt.AddSeconds(120); 

        int cnt = 0;

        if (s == "+")
        {
            for (int i = startNum; i <= endNum; i++)
            {
                string id = NewShortId();

                string panelNum = String.Format("{0:D3}", i);
                string panel = startPanel + "-" + panelNum;
                DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

                dynamic obj = new ExpandoObject();
                obj.ItemKey = id;
                obj.PanelGroupKey = groupKey;
                obj.DeviceId = deviceId;
                obj.EqpCode = eqpCode;
                obj.PanelId = panel;
                obj.ScanDt = scanDt;
                obj.CreateDt = standard;


                cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControl", RefineExpando(obj));


                standard += gap;
            }
        }
        else if (s == "-")
        {
            for (int i = endNum; i >= startNum; i--)
            {
                string id = NewShortId();

                string panelNum = String.Format("{0:D3}", i);
                string panel = startPanel + "-" + panelNum;
                DateTime scanDt = standard.AddMinutes(-ranB).AddSeconds(-(ranA * 7));

                dynamic obj = new ExpandoObject();
                obj.ItemKey = id;
                obj.PanelGroupKey = groupKey;
                obj.DeviceId = deviceId;
                obj.EqpCode = eqpCode;
                obj.PanelId = panel;
                obj.ScanDt = scanDt;
                obj.CreateDt = standard;


                cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelItemControl", RefineExpando(obj));


                standard += gap;
            }
        }
        return cnt;
    }

    [ManualMap]
    public static int PanelRealtime(string startPanel, string workorder, int startNum, int endNum)
    {

        DataTable model = DataContext.StringDataSet("@BarcodeApi.Panel.PanelRealtimeControlBom", new { workorder }).Tables[0];
        string modelCode = model.Rows[0].TypeCol<string>("model_code");

        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {

            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;

            dynamic obj = new ExpandoObject();
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.ModelCode = modelCode;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.PanelRealtimeControlInsert", RefineExpando(obj));
        }

        return cnt;
    }

    [ManualMap]
    public static int PanelRollMapping(string deviceId, string rollId, string workorder, int operSeqNo, string operCode, string eqpCode, string startPanel, int startNum, int endNum)
    {
        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {
            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;

            dynamic obj = new ExpandoObject();
            obj.RollId = rollId;
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.OperSeqNo = operSeqNo;
            obj.OperCode = operCode;
            obj.EqpCode = eqpCode;
            obj.DeviceId = deviceId;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.RollPanelMappingInsert", RefineExpando(obj));
        }

        return cnt;
    }

    [ManualMap]
    public static int LaserOper(string deviceId, string rollId, string workorder, int operSeqNo, string operCode, string eqpCode, string startPanel, int startNum, int endNum)
    {
        int cnt = 0;

        for (int i = startNum; i <= endNum; i++)
        {
            string panelNum = String.Format("{0:D3}", i);
            string panel = startPanel + "-" + panelNum;

            dynamic obj = new ExpandoObject();
            obj.RollId = rollId;
            obj.PanelId = panel;
            obj.Workorder = workorder;
            obj.OperSeqNo = operSeqNo;
            obj.OperCode = operCode;
            obj.EqpCode = eqpCode;
            obj.DeviceId = deviceId;

            cnt += DataContext.StringNonQuery("@BarcodeApi.Panel.RollPanelMappingInsert", RefineExpando(obj));
        }

        return cnt;
    }

    [ManualMap]
    public static int End4m(string workorder, int operSeqNo, string eqpCode)
    {
        if (string.IsNullOrWhiteSpace(workorder) || string.IsNullOrWhiteSpace(operSeqNo.ToString()) || string.IsNullOrWhiteSpace(eqpCode))
        {
            return -1;
        }
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;
        obj.OperSeqNo = operSeqNo;
        obj.EqpCode = eqpCode;

        int cnt = DataContext.StringNonQuery("@DataControl.End4m", RefineExpando(obj));
        return cnt;
    }

    [ManualMap]
    public static int End4mCancel(string workorder, int operSeqNo, string eqpCode)
    {
        if(string.IsNullOrWhiteSpace(workorder) || string.IsNullOrWhiteSpace(operSeqNo.ToString()) || string.IsNullOrWhiteSpace(eqpCode))
        {
            return -1;
        }
        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;
        obj.OperSeqNo = operSeqNo;
        obj.EqpCode = eqpCode;

        DataTable getGroupKey = DataContext.StringDataSet("@DataControl.GetGroupKey", RefineExpando(obj)).Tables[0];
        if (getGroupKey.Rows.Count == 0)
        {
            return -1;
        }
        string groupKey = getGroupKey.Rows[0].TypeCol<string>("group_key");

        int cnt = DataContext.StringNonQuery("@DataControl.End4MCancel", new { groupKey });
        return 1;
    }

    [ManualMap]
    public static int Delete4m(string workorder, int operSeqNo, string eqpCode)
    {
        if (string.IsNullOrWhiteSpace(workorder) || string.IsNullOrWhiteSpace(operSeqNo.ToString()) || string.IsNullOrWhiteSpace(eqpCode))
        {
            return -1; 
        }

        dynamic obj = new ExpandoObject();
        obj.Workorder = workorder;
        obj.OperSeqNo = operSeqNo;
        obj.EqpCode = eqpCode;

        DataTable getGroupKey = DataContext.StringDataSet("@DataControl.GetGroupKey", RefineExpando(obj)).Tables[0];
        if (getGroupKey.Rows.Count == 0)
        {
            return - 1;
        }

        string groupKey = getGroupKey.Rows[0].TypeCol<string>("group_key");
        string panelGroupKey = getGroupKey.Rows[0].TypeCol<string>("group_key");

        DataContext.StringNonQuery("@DataControl.DeleteItem", new { panelGroupKey });
        int cnt = DataContext.NonQuery("dbo.sp_panel_4m_delete", new { groupKey });

        //int cnt = DataContext.StringNonQuery("@DataControl.DeleteItem", RefineExpando(obj));




        return cnt;
    }


    [ManualMap]
    public static int MaterialExpiredDateChange(string material, DateTime expiredDt)
    {
        int cnt = DataContext.StringNonQuery("@DataControl.ChangeExpiredDt", new { material, expiredDt });
        return cnt;
    }

}
