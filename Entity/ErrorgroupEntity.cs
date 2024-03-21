namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ErrorgroupEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ErrorgroupCode { get; set; } = default!;
    public string ErrorgroupName { get; set; } = default!;
    public char UseYn { get; set; }
    public int Sort { get; set; }
    public string? Remark { get; set; }
    public int ErrorCount { get; set; }
    public int MaxSort { get; set; }
    public DateTime CreateDt { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime UpdateDt { get; set; }
    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ErrorgroupCode},{ErrorgroupName}";
    }
}

public class ErrorgroupList : List<ErrorgroupEntity>
{
    public ErrorgroupList(IEnumerable<ErrorgroupEntity> list) : base(list) { }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
