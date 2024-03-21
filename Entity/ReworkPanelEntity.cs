namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ReworkPanelEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int PanelReworkId { get; set; } = default!;
    public char ReworkApproveYn { get; set; } = default!;
    public string OperSeq { get; set; } = default!;
    public string OperCode { get; set; } = default!;
    public string OperName { get; set; } = default!;
    public string? RollId { get; set; }
    public string? PanelId { get; set; }
    public string? PutRemark { get; set; }
    public string? RefuseRemark { get; set; }
    public string? ApproveRemark { get; set; }
    public string? ReworkCode { get; set; }
    public string? ReworkName { get; set; }
    public string? PutUpdateUser { get; set; }
    public string? PutUserName { get; set; }
    public string? RefuseUpdateUser { get; set; }
    public string? RefuseUserName { get; set; }
    public string? ApproveUpdateUser { get; set; }
    public string? ApproveUserName { get; set; }
    public DateTime? PutDt { get; set; }
    public DateTime? RefuseDt { get; set; }
    public DateTime? ApproveDt { get; set; } 

    public override string ToString()
    {
        return $"{CorpId},{FacId},{PanelReworkId}";
    }
}

public class ReworkPanelList : List<ReworkPanelEntity>
{
    public ReworkPanelList(IEnumerable<ReworkPanelEntity> list) : base(list)
    {
    }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
