namespace WebApp;

using System;
using System.Collections.Generic;
using System.Numerics;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class CheckSheetEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ChecksheetCode { get; set; } = default!;
    public string ChecksheetGroupCode { get; set; } = default!;
    public string WorkcenterCode { get; set; } = default!;
    public string WorkcenterDescription { get; set; } = default!;
    public int parentId { get; set; } = default!;
    public DateTime? ValidStrtDt { get; set; }
    public DateTime? ValidEndDt { get; set; }
    public string rev { get; set; } = default!;
    public string? Remark { get; set; }
    public char? UseYn { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ChecksheetCode},{ChecksheetGroupCode}, {Remark}, {UseYn}";
    }


}

public class CheckSheetList : List<CheckSheetEntity>
{
public CheckSheetList(IEnumerable<CheckSheetEntity> list) : base(list)
{
}

public override string ToString()
{
    return string.Join(Environment.NewLine, this);
}
}
