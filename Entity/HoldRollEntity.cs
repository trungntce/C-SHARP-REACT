namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class HoldRollEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string RowKey { get; set; } = default!;
    public string RollId { get; set; } = default!;
    public string? OnRemark { get; set; }
    public string? OffRemark { get; set; }
    public string? HoldCode { get; set; }
    public string? OnUpdateUser { get; set; }
    public string? OffUpdateUser { get; set; }
    public DateTime? OnDt { get; set; }
    public DateTime? OffDt { get; set; } 

    public override string ToString()
    {
        return $"{CorpId},{FacId},{RowKey}";
    }
}

public class HoldRollList : List<HoldRollEntity>
{
    public HoldRollList(IEnumerable<HoldRollEntity> list) : base(list)
    {
    }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
