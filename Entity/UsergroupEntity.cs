namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class UsergroupEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string UsergroupId { get; set; } = default!;
    public string UsergroupName { get; set; } = default!;
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{UsergroupId},{UsergroupName}";
    }
}

public class UsergroupList : List<UsergroupEntity>
{
    public UsergroupList(IEnumerable<UsergroupEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
