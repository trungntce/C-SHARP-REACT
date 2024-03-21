namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class MenuAuthEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string MenuId { get; set; } = default!;
    public string TargetId { get; set; } = default!;
    public char TargetType { get; set; }
    public int Auth { get; set; } = default!;
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public string? UsergroupName { get; set; } = default!;
    public string? UsergroupRemark { get; set; }

    public string? UserName { get; set; } = default!;
    public string? UserRemark { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{TargetId},{TargetType}";
    }
}

public class MenuAuthList : List<MenuAuthEntity>
{
    public MenuAuthList(IEnumerable<MenuAuthEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
