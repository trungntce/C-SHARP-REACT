namespace WebApp;

using System;
using System.Collections;
using System.Data;
using System.Dynamic;
using System.Linq;

using Framework;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml.FormulaParsing.Excel.Functions.RefAndLookup;

public class JobService : MinimalApiService, IMinimalApi
{
    public JobService(ILogger<JobService> logger) : base(logger)
    {
    }

    public static IEndpointRouteBuilder RouteEndpoint(MinimalApiMapperFunc group)
    {
        group.MapGet("/erpjob", nameof(ErpJobSelect));
        group.MapGet("/erpoper", nameof(ErpOperList));
        group.MapGet("/erpreq", nameof(ErpReqList));
        group.MapGet("/erptool", nameof(ErpToolList));

        group.MapGet("/mesjob", nameof(MesJobSelect));
        group.MapGet("/mesoper", nameof(MesOperList));
        group.MapGet("/mesreq", nameof(MesReqList));
        group.MapGet("/mestool", nameof(MesToolList));

        group.MapGet("/tran", nameof(Trans));

        return RouteAllEndpoint(group);
    }

    #region Erp

    [ManualMap]
    public static IEnumerable<IDictionary> ErpJobSelect(string jobNo) => ToDic(ErpJobDt(jobNo));
    [ManualMap]
    public static DataTable ErpJobDt(string jobNo) => DataContext.StringDataSetEx(Setting.ErpConn, "@Job.ErpJobSelect", new { jobNo}).Tables[0];

    [ManualMap]
    public static IEnumerable<IDictionary> ErpOperList(string jobNo) => ToDic(ErpOperDt(jobNo));
    [ManualMap]
    public static DataTable ErpOperDt(string jobNo) => DataContext.StringDataSetEx(Setting.ErpConn, "@Job.ErpOperList", new { jobNo }).Tables[0];

    [ManualMap]
    public static IEnumerable<IDictionary> ErpReqList(string jobNo) => ToDic(ErpReqDt(jobNo));
    [ManualMap]
    public static DataTable ErpReqDt(string jobNo) => DataContext.StringDataSetEx(Setting.ErpConn, "@Job.ErpReqList", new { jobNo }).Tables[0];

    [ManualMap]
    public static IEnumerable<IDictionary> ErpToolList(string jobNo) => ToDic(ErpToolDt(jobNo));
    [ManualMap]
    public static DataTable ErpToolDt(string jobNo) => DataContext.StringDataSetEx(Setting.ErpConn, "@Job.ErpToolList", new { jobNo }).Tables[0];

    #endregion

    #region Mes

    [ManualMap]
    public static IEnumerable<IDictionary> MesJobSelect(string jobNo)
    {
        DataTable jobDt = DataContext.StringDataSet("@Job.MesJobSelect", new { jobNo }).Tables[0];

        return ToDic(jobDt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> MesOperList(string jobNo)
    {
        DataTable operDt = DataContext.StringDataSet("@Job.MesOperList", new { jobNo }).Tables[0];

        return ToDic(operDt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> MesReqList(string jobNo)
    {
        DataTable operDt = DataContext.StringDataSet("@Job.MesReqList", new { jobNo }).Tables[0];

        return ToDic(operDt);
    }

    [ManualMap]
    public static IEnumerable<IDictionary> MesToolList(string jobNo)
    {
        DataTable operDt = DataContext.StringDataSet("@Job.MesToolList", new { jobNo }).Tables[0];

        return ToDic(operDt);
    }

    [ManualMap]
    public static int MesOperDelete(string jobNo)
    {
        return DataContext.StringNonQuery("@Job.MesOperDelete", new { jobNo });
    }

    [ManualMap]
    public static int MesReqDelete(string jobNo)
    {
        return DataContext.StringNonQuery("@Job.MesReqDelete", new { jobNo });
    }

    [ManualMap]
    public static int MesToolDelete(string jobNo)
    {
        return DataContext.StringNonQuery("@Job.MesToolDelete", new { jobNo });
    }

    #endregion

    #region Mes - Delete

    [ManualMap]
    public static int ErpOperDelete(string jobNo) => DataContext.StringNonQuery("@Job.MesOperDelete", new { jobNo });

    [ManualMap]
    public static int ErpReqDelete(string jobNo) => DataContext.StringNonQuery("@Job.MesReqDelete", new { jobNo });

    [ManualMap]
    public static int ErpToolDelete(string jobNo) => DataContext.StringNonQuery("@Job.MesToolDelete", new { jobNo });

    #endregion

    #region Trans

    [ManualMap]
    public static int Trans(bool isDelete, string jobNo)
    {
        if (isDelete)
        {
            ErpOperDelete(jobNo);
            ErpReqDelete(jobNo);
            ErpToolDelete(jobNo);
        }

        var rtn = 0;

        var mergeFormat = BulkCopy.MergeQuery;

        var jobTuple = new Tuple<string, string, string>("erp_wip_job_entities", "JOB_ID", "");
        var operTuple = new Tuple<string, string, string>("erp_wip_operations", "WIP_OPERATION_ID", "[\"WIP_OPERATION_ID\",\"SOB_ID\",\"ORG_ID\",\"JOB_ID\",\"JOB_NO\",\"BOM_ITEM_ID\",\"ITEM_UOM_CODE\",\"OPERATION_SEQ_NO\",\"OPERATION_ID\",\"OPERATION_COMMENT\",\"RESOURCE_ID\",\"WORKCENTER_ID\",\"WIP_RELEASE_QTY\",\"ONHAND_FLAG\",\"ONHAND_PNL_QTY\",\"ONHAND_PCS_QTY\",\"RTR_SHEET\",\"CREATION_DATE\",\"CREATED_BY\",\"LAST_UPDATE_DATE\",\"LAST_UPDATED_BY\"]");
        var reqTuple = new Tuple<string, string, string>("erp_wip_requirements", "WIP_REQUIREMENT_ID", "[\"WIP_REQUIREMENT_ID\",\"SOB_ID\",\"ORG_ID\",\"JOB_ID\",\"JOB_NO\",\"BOM_ITEM_ID\",\"WIP_OPERATION_ID\",\"COMPONENT_INV_ITEM_ID\",\"COMPONENT_BOM_ITEM_ID\",\"BOM_COMPONENT_TYPE\",\"UOM_CODE\",\"REQUIRED_QTY\",\"ISSUE_METHOD_CODE\",\"CREATION_DATE\",\"CREATED_BY\",\"LAST_UPDATE_DATE\",\"LAST_UPDATED_BY\"]");
        var toolTuple = new Tuple<string, string, string>("erp_wip_routing_tool", "WIP_ROUTING_TOOL_ID", "");

        rtn += BulkCopy.BulkCopyToMes(jobTuple, mergeFormat, ErpJobDt(jobNo));
        rtn += BulkCopy.BulkCopyToMes(operTuple, mergeFormat, ErpOperDt(jobNo));
        rtn += BulkCopy.BulkCopyToMes(reqTuple, mergeFormat, ErpReqDt(jobNo));
        rtn += BulkCopy.BulkCopyToMes(toolTuple, mergeFormat, ErpToolDt(jobNo));

        return rtn;
    }

    #endregion
}
