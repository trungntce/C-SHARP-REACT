namespace WebApp;

using System;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EMappingLayoutEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ModelCode { get; set; } = default!;
    public string? ModelName { get; set; }
    public string? ItemCode { get; set; }
    public string? ItemName { get; set; }
    public int PcsPerH { get; set; }
    public int PcsPerV { get; set; }
    public string PcsJson { get; set; } = default!;
    public string Remark { get; set; } = default!;
    public string CreateUser { get; set; } = default!;
    public string? CreateUserName { get; set; }
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public string? UpdateUserName { get; set; }
    public DateTime? UpdateDt { get; set; }

    public int TotalCount { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ModelCode},{PcsPerH},{PcsPerV}";
    }
}