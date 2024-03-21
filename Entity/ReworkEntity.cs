namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ReworkEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string CodeId { get; set; } = default!;
    public string CodeName { get; set; } = default!;
    public string? Remark { get; set; }
    public char? UseYn { get; set; }
    public string? CreateUser { get; set; }
    public DateTime? CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime? UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{CodeId},{CodeName}";
    }
}

public class ReworkList : List<ReworkEntity>
{
    public ReworkList(IEnumerable<ReworkEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
