namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class FavoriteEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public string MenuId { get; set; } = default!;
    public string? MenuName { get; set; }
    public char? MenuType { get; set; }
    public string? MenuBody { get; set; }
    public string? Icon { get; set; }
    public int Sort { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{UserId},{MenuId}";
    }
}

public class FavoriteList : List<FavoriteEntity>
{
    public FavoriteList(IEnumerable<FavoriteEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
