namespace WebApp;

using System;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class PanelItemEntity : BaseEntity
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
    [JsonIgnore]
    [XmlIgnore]
    public string? PanelRowKey { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public int ErrorNo { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public int ErrorRemark { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public string? RollId { get; set; }
    public string? DeviceId { get; set; } = default!;
    public string PanelGroupKey { get; set; } = default!;
    public string? ModelCode { get; set; } = default!;
    public string PanelId { get; set; } = default!;
    public string? OperCode { get; set; } = default!;
    public string? EqpCode { get; set; } = default!;
    public string? ImgPath { get; set; } = default!;
    public string? LangCode { get; set; } = default!;
    public string? ItemKey { get; set; } = default!;

    //바코드 스캔 정보    
    public string? ResultSource { get; set; } = default!;
    public DateTime? TriggerTime { get; set; } = default!;
    public DateTime? DecodeTime { get; set; } = default!;
    public int? ReadSetup { get; set; } = default!;
    public int? ModuleSize { get; set; } = default!;
    public int? GoodReads { get; set; } = default!;
    public int? BadReads { get; set; } = default!;
    public int? PassedValidation { get; set; } = default!;
    public int? FailedValidation { get; set; } = default!;
    public int? TriggerOverruns { get; set; } = default!;
    public int? BufferOverflows { get; set; } = default!;
    public int? FocusMm { get; set; } = default!;

    public DateTime ScanDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime CreateDt { get; set; }


    public override string ToString()
    {
        return $"{RowKey},{PanelRowKey},{DeviceId},{RollId}";
    }
}
