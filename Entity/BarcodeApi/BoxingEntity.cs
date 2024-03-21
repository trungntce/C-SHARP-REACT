namespace WebApp;

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Xml.Serialization;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class BoxingEntity : BaseEntity
{
    [JsonIgnore]
    [XmlIgnore]
    public string CorpId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string FacId { get; set; } = default!;
    [JsonIgnore]
    [XmlIgnore]
    public string IpAddr { get; set; } = default!;
    public string PanelId { get; set; } = default!;
    public string? InBoxId{ get; set; }
    public string? OutBoxId { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime ScanDt { get; set; }
    [JsonIgnore]
    [XmlIgnore]
    public DateTime CreateDt { get; set; }
    

    public override string ToString()
    {
        return $"{CorpId},{FacId},{IpAddr},{PanelId}";
    }
}
