namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ReworkRollEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string RollReworkId { get; set; } = default!;
    public char ReworkApproveYn { get; set; } = default!;
    public string OperSeq { get; set; } = default!;
    public string OperCode { get; set; } = default!;
    public string OperName { get; set; } = default!;
    public string ParentRollId { get; set; } = default!;
    public string RollId { get; set; } = default!;
    public string? PutRemark { get; set; }
    public string? RefuseRemark { get; set; }
    public string? ApproveRemark { get; set; }
    public string? ReworkCode { get; set; }
    public string? ReworkName { get; set; }
    public string? PutUpdateUser { get; set; }
    public string? RefuseUpdateUser { get; set; }
    public string? ApproveUpdateUser { get; set; }
    public DateTime? PutDt { get; set; }
    public DateTime? RefuseDt { get; set; }
    public DateTime? ApproveDt { get; set; }
    public string TranOperName { get; set; } = default!;

    public override string ToString()
    {
        return $"{CorpId},{FacId},{RollReworkId}";
    }
}

public class ReworkRollList : List<ReworkRollEntity>
{
    public ReworkRollList(IEnumerable<ReworkRollEntity> list) : base(list)
    {
    }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
