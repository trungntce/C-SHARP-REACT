namespace WebApp;

using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Framework;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class PanelExEntity : BaseEntity
{
    [JsonIgnore]
    [XmlIgnore]
    public string CorpId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string FacId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public int ErrorNo { get; set; }
    
    public string DeviceId { get; set; } = default!;
    public string DeviceType { get; set; } = default!;
    public string LangCode { get; set; } = default!;
    public string PanelId { get; set; } = default!;
    public string? DefectCode { get; set; } = default!;
    public string? InterlockCode { get; set; } = default!;
    public string? OnUpdateUser { get; set; } = default!;
    public string? OffUpdateUser { get; set; } = default!;
    public string RollId { get; set; } = default!;
    public string? OnRemark { get; set; } = default!;
    public string? OffRemark { get; set; } = default!;
    public string AutoYn { get; set; } = default!;

    public DateTime ScanDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime CreateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{PanelId},{DeviceId}";
    }
}