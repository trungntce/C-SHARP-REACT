namespace WebApp;

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class OperationEntity : BaseEntity
{
    public string? RowKey { get; set; } = default!;
    public string? GroupKey { get; set; } = default!;
    public string? Workorder { get; set; } = default!;
    public string? OperCode { get; set; } = default!;
    public int? OperSeqNo { get; set; } = default!;
    public string? EqpCode { get; set; } = default!;
    public string? ModelCode { get; set; } = default!;
    public string? StartYn { get; set; } = default!;
    public string? EndYn { get; set; } = default!;

    public bool? RecipeParamJudge {  get; set; }

}
