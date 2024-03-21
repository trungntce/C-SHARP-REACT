namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class RecipeEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string EqpCode { get; set; } = default!;
    public string RecipeCode { get; set; } = default!;
    public string GroupCode { get; set; } = default!;
    public string RecipeName { get; set; } = default!;
	public float? BaseVal { get; set; }
    public string? RawType { get; set; }
	public string? Val1 { get; set; }
	public string? InterlockYn { get; set; }
    public string? AlarmYn { get; set; }
    public string? Remark { get; set; }
	public string? TableName { get; set; }
	public string? ColumnName { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public int? StartTime { get; set; }
	public int? EndTime { get; set; }
    public string? JudgeYn { get; set; }  //판정 여부


    public override string ToString()
    {
        return $"{CorpId},{FacId},{EqpCode},{RecipeCode}, {RecipeName}";
    }
}

public class RecipeSetEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string EqpCode { get; set; } = default!;
	public List<string> EqpCodeList { get; set; } = default!;
	public string RecipeCode { get; set; } = default!;
	public string GroupCode { get; set; } = default!;
	public string RecipeName { get; set; } = default!;
	public float? BaseVal { get; set; }
	public string? RawType { get; set; }
	public string? Val1 { get; set; }
	public string? InterlockYn { get; set; }
	public string? AlarmYn { get; set; }
	public string? Remark { get; set; }
	public string? TableName { get; set; }
	public string? ColumnName { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime CreateDt { get; set; }
	public string? Gubun { get; set; }
	public int? StartTime { get; set; } 
	public int? EndTime { get; set; }
    public string? JudgeYn { get; set; }


    public override string ToString()
	{
		return $"{CorpId},{FacId},{EqpCode},{RecipeCode}, {RecipeName}";
	}
}


public class RecipList : List<RecipeEntity>
{
    public RecipList(IEnumerable<RecipeEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
