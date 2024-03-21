namespace WebApp;

using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Numerics;

public class ChecksheetGroupCleanItemEntity : BaseEntity
{

    public string ChecksheetGroupCode { get; set; } = default!;
    public string ItemCode { get; set; } = default!;
    public string? ItemName { get; set; } = default!;
    public string? Remark { get; set; } = default!;
    public char? UseYn { get; set; }
    public DateTime? CreateDt { get; set; }
    public string? CreateUser { get; set; } = default!;
    public override string ToString()
    {
        return $"{ChecksheetGroupCode},{ItemCode}, {ItemName}, {Remark}, {UseYn}";
    }
}

public class ChecksheetGroupCleanItemList : List<ChecksheetGroupCleanItemEntity>
{
    public ChecksheetGroupCleanItemList(IEnumerable<ChecksheetGroupCleanItemEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
