namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class DefectPanelEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int PanelDefectId { get; set; } = default!;
    public string? RollId { get; set; }
    public string? PanelId { get; set; }
    public string? DefectCode { get; set; }
    public string? DefectName { get; set; }
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
        return $"{CorpId},{FacId},{PanelDefectId}";
    }
}

public class DefectPanelList : List<DefectPanelEntity>
{
    public DefectPanelList(IEnumerable<DefectPanelEntity> list) : base(list)
    {
    }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
