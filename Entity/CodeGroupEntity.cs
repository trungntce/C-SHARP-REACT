namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class CodegroupEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string CodegroupId { get; set; } = default!;
    public string CodegroupName { get; set; } = default!;
    public char UseYn { get; set; }
    public int Sort { get; set; }
    public string? Remark { get; set; }
    public int CodeCount { get; set; }
    public int MaxSort { get; set; }
    public DateTime CreateDt { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime UpdateDt { get; set; }
    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{CodegroupId},{CodegroupName}";
    }
}

public class CodegroupList : List<CodegroupEntity>
{
    public CodegroupList(IEnumerable<CodegroupEntity> list) : base(list) { }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
