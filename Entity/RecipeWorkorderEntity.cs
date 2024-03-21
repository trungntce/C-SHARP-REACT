namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class RecipeWorkorderEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string? EqpCode { get; set; }
	public string? EqpDescription { get; set; }
	public string RecipeCode { get; set; } = default!;
	public string Workorder { get; set; } = default!;
	public string ModelCode { get; set; } = default!;
	public string? WorkcenterCode { get; set; }
	public string? WorkcenterDescription { get; set; }
	public string CategoryCode { get; set; } = default!;
    public string? BaseVal { get; set; }
    public string? Val1 { get; set; }
    public string? Val2 { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
   

    public override string ToString()
    {
        return $"{CorpId},{FacId},{RecipeCode},{Workorder},{ModelCode},{CategoryCode}";
    }
}

public class RecipWorkorderList : List<RecipeWorkorderEntity>
{
    public RecipWorkorderList(IEnumerable<RecipeWorkorderEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
