namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EqpareagroupEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string EqpCode { get; set; } = default!;
	public string EqpareagroupCode { get; set; } = default!;
	public string EqpareagroupName { get; set; } = default!;
	public char UseYn { get; set; }
	public int Sort { get; set; }
	public string? Remark { get; set; }
	public int EqpCount { get; set; }
	public int MaxSort { get; set; }
	public DateTime CreateDt { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime UpdateDt { get; set; }
	public string? UsergroupId { get; set; }
    public string? UpdateUser { get; set; }
    public string? eqpName { get; set; }
    public string? recipeCode { get; set; }
    public string? recipeName { get; set; }

    public override string ToString()
	{
		return $"{CorpId},{FacId},{EqpCode},{EqpareagroupCode},{EqpareagroupName}";
	}
}

public class EqpareagroupList : List<EqpareagroupEntity>
{
	public EqpareagroupList(IEnumerable<EqpareagroupEntity> list) : base(list) { }

	public override string ToString()
	{
		return string.Join(Environment.NewLine, this);
	}
}
