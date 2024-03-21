namespace WebApp;

using System;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class RollItemEntity : BaseEntity
{
    public string RowKey { get; set; } = default!;
    public string RollRowKey { get; set; } = default!;
    public string IpAddr { get; set; } = default!;
    public string RollId { get; set; } = default!;
    public DateTime ScanDt { get; set; }
    public DateTime CreateDt { get; set; }
    public char? DefectYn { get; set; }
    public string? DefectCode { get; set; }
    public DateTime? DefectDt { get; set; }

    public override string ToString()
    {
        return $"{RowKey},{RollRowKey},{RollId}";
    }
}
