namespace WebApp;

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Framework;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class RollEntity : BaseEntity
{
    [JsonIgnore]
    [XmlIgnore]
    public string CorpId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string FacId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string RowKey { get; set; } = default!;
    public string? GroupKey { get; set; } = default!;
    public string ChildNo { get; set; } = default!;
    public string DeviceId { get; set; } = default!;
    public string ParentId { get; set; } = default!; 
    public bool IsEngrave { get; set; } = default!; // 레이저 각인이 되어있는지 안되어있는지 판단하는 flag
    public List<Dictionary<string, object>>? ChildList { get; set; } = default!;
    public Dictionary<string, object>? GetChild(int index)
    {
        if (ChildList == null || ChildList.Count <= 0)
            return null;

        var dic = ChildList[index];

        foreach (string key in dic.Keys)
        {
            dic[key] = dic.TypeKey<string>(key);
        }

        return dic;
    }
    public string? LangCode { get; set; } = default!; 
    public string? Workorder { get; set; } = default!;
    public int? OperSeqNo { get; set; } = default!;
    public string? OperCode { get; set; } = default!;
    public string? EqpCode { get; set; } = default!;
    public string? WorkerCode { get; set; } = default!;
    public string? Reason { get; set; } = default!;
    public DateTime ScanDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime CreateDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime? StartDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime? EndDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{RowKey},{ParentId}";
    }
}
