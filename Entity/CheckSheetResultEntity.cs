namespace WebApp;

using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;

public class CheckSheetResultEntity : BaseEntity
{

    public string ChecksheetCode { get; set; } = default!;
    public string ChecksheetItemCode { get; set; } = default!;
    public string WorkcenterCode { get; set; } = default!;
    public string WorkcenterDescription { get; set; } = default!;
    public string CheckUser { get; set; } = default!;
    public char CheckStatus { get; set; } = '0';
    public DateTime? CheckDate { get; set; }
    public char DayType { get; set; }
    public string? Checkvalue { get; set; } = default!;
    public string? CreateUser { get; set; } = default!;
    public override string ToString()
    {
        return $"{ChecksheetCode},{ChecksheetItemCode}, {CheckUser} {Checkvalue}";
    }
}
