namespace WebApp;

using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Framework;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class PanelEntity : BaseEntity
{
    [JsonIgnore]
    [XmlIgnore]
    public string CorpId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string FacId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string? RowKey { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string? GroupKey { get; set; } = default!;
    public string DeviceId { get; set; } = default!;
    public List<Dictionary<string,object>>? WorkorderList { get; set; } = default!;
    public string? Workorder { get; set; } = default!;
    public int? OperSeqNo { get; set; } = default!;
    public string? OperCode { get; set; } = default!;
    public string? EqpCode { get; set; } = default!;
    public List<Dictionary<string,object>>? OrderCodeNo { get; set; } = default!;
    public Dictionary<string, object>? GetWorkorderOper(int index)
    {
        if (OrderCodeNo == null || OrderCodeNo.Count <= 0)
            return null;

        var dic = OrderCodeNo[index];

        foreach (string key in dic.Keys)
        {
            dic[key] = dic.TypeKey<string>(key);
        }

        return dic;
    }

    public List<Dictionary<string, string>>? EqpList { get; set; }
    public List<Dictionary<string, string>>? WorkerList { get; set; }
    public List<Dictionary<string, string>>? MaterialList { get; set; }
    public List<Dictionary<string, string>>? ToolList { get; set; }
    public string? LangCode { get; set; } = default!;
    public string? WorkType { get; set; } = default!;
    public DateTime ScanDt { get; set; } = DateTime.Now;
    [JsonIgnore]
    [XmlIgnore]
    public DateTime CreateDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime? StartDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime? EndDt { get; set; }

    public int? HistoryNo { get; set; }
    public string? Method { get; set; }
    public string? ParamJson { get; set; }
    public string? ModifyWorker { get; set; }
    public string? ReworkCode { get; set; }
    public string? InterlockCode { get; set; }
    public string? DefectCode { get; set; }
    public string? InitialCode { get; set; }

    //판넬 워크오더-수량 맵핑 값
    public List<Dictionary<string, object>>? PanelQuantityList { get; set; }

    
    public int? PanelQuantity { get; set; }

    //nullable로 받고 사용할것(팀장님)
    public string? CodegroupId { get; set; }

    public string? Remark { get; set;}

    public string? UpdateUser { get; set; }

    public string? Code { get; set; }

    public string? PtsType { get; set; }

    public bool? RecipeParamJudge { get; set; }

    public string? DeviceType { get; set; }

    public bool IsControlModel { get; set; } = false;

    [JsonIgnore]
    [XmlIgnore]
    public string? Context { get; set; } = default!;
    public override string ToString()
    {
        return $"{CorpId},{FacId},{RowKey},{DeviceId}";
    }
}