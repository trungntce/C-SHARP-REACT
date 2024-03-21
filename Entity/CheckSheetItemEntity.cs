namespace WebApp;

using System;
using System.Collections.Generic;
using System.Numerics;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class CheckSheetItemEntity : BaseEntity
{
    public string ChecksheetCode { get; set; } = default!;
    public string ChecksheetItemCode { get; set; } = default!;
    public string EqpCode { get; set; } = default!;
    public string ChecksheetTypeName { get; set; } = default!;

    public int CheckFreqNum { get; set; } = 1;
    public string? DayType { get; set; } = default!;

    public string? DayVal { get; set; } = default!;

    public string? DailyCheckType { get; set; } = default!;
    public string? DailyCheckDate { get; set; } = default!;
    public int Ord { get; set; } = default!;
    public string? ExchgPeriod { get; set; } = default!;
    public string? StandardVal { get; set; } = default!;
    public string? MinVal { get; set; } = default!;
    public string? MaxVal { get; set; } = default!;
    public string Method { get; set; } = default!;
    public string? InspectPoint { get; set; } = default!;
    public string? UnitMeasureCode { get; set; } = default!;
    public string? MeasurePeriod { get; set; } = default!;
    public string InputType { get; set; } = "text";
    public DateTime? ValidStrtDt { get; set; }
    public string? Remark { get; set; }
    public char? UseYn { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }
    public string? ImgPath { get; set; } = default!;
    public string? ImgNm { get; set; } = default!;

    public override string ToString()
    {
        return $"{ChecksheetCode}, {ChecksheetItemCode}, {ChecksheetTypeName}, {Remark}, {UseYn}";
    }


}

public class CheckSheetItemList : List<CheckSheetItemEntity>
{
    public CheckSheetItemList(IEnumerable<CheckSheetItemEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
