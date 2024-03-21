namespace WebApp;

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class PanelLayupEntity : BaseEntity
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
    public string GroupKey { get; set; } = default!;
    public List<string> PanelId { get; set; } = default!;
    public string? OperCode { get; set; } = default!;
    public string? EqpCode { get; set; } = default!;
    public string? LangCode { get; set; } = default!;
    public string? ImgPath { get; set; } = default!;
    public DateTime ScanDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime CreateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{GroupKey},{PanelId}";
    }
}