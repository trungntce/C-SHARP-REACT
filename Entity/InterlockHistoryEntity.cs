namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class InterlockHistoryEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string PanelInterlockId { get; set; } = default!;
    //public string ItemKey { get; set; } = default!;
    public string RollId { get; set; } = default!;
    public string PanelId { get; set; } = default!;
    public string? InterlockCode { get; set; }
    public string? InterlockName { get; set; }
    public char? AutoYn { get; set; } = default!;
    public string? OnRemark { get; set; }
    public string? OffRemark { get; set; }
    public string? OnUpdateUser { get; set; }
    public string? OnUserName { get; set; }
    public string? OffUpdateUser { get; set; }
    public string? OffUserName { get; set; }
    public DateTime? OnDt { get; set; }
    public DateTime? OffDt { get; set; } 

    public override string ToString()
    {
        return $"{CorpId},{FacId},{PanelInterlockId}";
    }
}

public class InterlockHistoryList : List<InterlockHistoryEntity>
{
    public InterlockHistoryList(IEnumerable<InterlockHistoryEntity> list) : base(list)
    {
    }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
