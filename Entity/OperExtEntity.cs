namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

public class OperExtEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string OperationCode { get; set; } = default!;
    public string OperationDesc { get; set; } = default!;
    public string TranOperName { get; set; } = default!;
    public string WorkingUom { get; set; } = default!;
    public char EnableFlag { get; set; }

    public char? FormType { get; set; }
    public char? OperYn { get; set; }
    public char? ScanEqpYn { get; set; }
    public char? ScanWorkerYn { get; set; }
    public char? ScanMaterialYn { get; set; }
    public char? ScanToolYn { get; set; }
    public char? ScanPanelYn { get; set; }
    public char? ScanType { get; set; }
    public char? StartYn { get; set; }
    public char? EndYn { get; set; }
    public char? ReworkYn { get; set; }
    public char? SplitYn { get; set; }
    public char? MergeYn { get; set; }
    public string? Remark { get; set; }
    public string? CreateUser { get; set; } = default!;
    public DateTime? CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime? UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{OperationCode},{OperationDesc}";
    }
}