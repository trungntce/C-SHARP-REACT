namespace WebApp;

using System;
using System.Collections.Generic;
using Mapster;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

public class ModelOperExtEntity : BaseEntity
{
    [AdaptIgnore]
    public string CorpId { get; set; } = default!;
    [AdaptIgnore]
    public string FacId { get; set; } = default!;
    [AdaptIgnore]
    public string ModelCode { get; set; } = default!;
    [AdaptIgnore]
    public int OperationSeqNo { get; set; }
    [AdaptIgnore]
    public string OperationCode { get; set; } = default!;
    [AdaptIgnore]
    public string OperationDesc { get; set; } = default!;
    [AdaptIgnore]
    public string WorkingUom { get; set; } = default!;
    [AdaptIgnore]
    public char EnableFlag { get; set; }

    [AdaptIgnore]
    public string TranLang { get; set; }

    //SIFLEX , MODEL RECIPE COPY
    public string? FromModelCode { get; set; }
    public string? ToModelCode { get; set; }

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
    [AdaptIgnore]
    public string? OperEqpJson { get; set; }
    public List<Dictionary<string, object>> OperEqpList
    {
        get
        {
            if (string.IsNullOrWhiteSpace(OperEqpJson))
                return new();

            var rtn = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(OperEqpJson);
            if (rtn == null)
                rtn = new();

            return rtn;
        }
    }
    public string? EqpJson { get; set; }
    public List<Dictionary<string, object>> EqpList
    {
        get
        {
            if (string.IsNullOrWhiteSpace(EqpJson))
                return new();

            var rtn = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(EqpJson);
            if (rtn == null)
                rtn = new();

            return rtn;
        }
    }
    public string? Remark { get; set; }
    [AdaptIgnore]
    public string? CreateUser { get; set; } = default!;
    [AdaptIgnore]
    public DateTime? CreateDt { get; set; }
    [AdaptIgnore]
    public string? UpdateUser { get; set; }
    [AdaptIgnore]
    public DateTime? UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{OperationCode},{OperationDesc}";
    }
}