namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class InterlockRollEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string RowKey { get; set; } = default!;
    //public string ItemKey { get; set; } = default!;
    public string RollId { get; set; } = default!;
    public string PanelId { get; set; } = default!;
    public char? AutoYn { get; set; } = default!;
    public char? OffYn { get; set; } = default!;
    public string? OnRemark { get; set; }
    public string? OffRemark { get; set; }
    public string? InterlockCode { get; set; }
    public string? OnUpdateUser { get; set; }
    public string? OffUpdateUser { get; set; }
    public DateTime? OnDt { get; set; }
    public DateTime? OffDt { get; set; } 

    public override string ToString()
    {
        return $"{CorpId},{FacId},{RowKey}";
    }
}

public class InterlockRollList : List<InterlockRollEntity>
{
    public InterlockRollList(IEnumerable<InterlockRollEntity> list) : base(list)
    {
    }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
