namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ParamEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string EqpCode { get; set; } = default!;
    public string ParamId { get; set; } = default!;
    public string? GroupCode { get; set; } 
    public string? GroupName { get; set; }
    public string? Gubun1 { get; set; }
    public string? Gubun2 { get; set; }
    public string? ParamName { get; set; }
    public string? ParamShortName { get; set; }
	public string? CateName { get; set; }
    public string? Unit { get; set; }
	public float? Std { get; set; }
	public float? Lcl { get; set; }
	public float? Ucl { get; set; }
	public float? Lsl { get; set; }
	public float? Usl { get; set; }
	public string? RawType { get; set; }
	public string? Remark { get; set; }
	public string? InterlockYn { get; set; }
	public string? AlarmYn { get; set; }
	public string? TableName { get; set; }
	public string? ColumnName { get; set; }
	public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }
	public int? StartTime { get; set; }
	public int? EndTime { get; set; }
    public string? JudgeYn { get; set; }  //판정 여부


    public override string ToString()
    {
        return $"{CorpId},{FacId},{EqpCode},{ParamId}";
    }
}

public class ParamSetEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string EqpCode { get; set; } = default!;
	public List<string> EqpCodeList { get; set; } = default!;
	public string ParamId { get; set; } = default!;
	public string? GroupCode { get; set; }
	public string? GroupName { get; set; }
	public string? Gubun1 { get; set; }
	public string? Gubun2 { get; set; }
	public string? ParamName { get; set; }
	public string? ParamShortName { get; set; }
	public string? CateName { get; set; }
	public string? Unit { get; set; }
	public float? Std { get; set; }
	public float? Lcl { get; set; }
	public float? Ucl { get; set; }
	public float? Lsl { get; set; }
	public float? Usl { get; set; }
	public string? RawType { get; set; }
	public string? Remark { get; set; }
	public string? InterlockYn { get; set; }
	public string? AlarmYn { get; set; }
	public string? TableName { get; set; }
	public string? ColumnName { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }
	public int? StartTime { get; set; }
	public int? EndTime { get; set; }
    public string? JudgeYn { get; set; }


    public override string ToString()
	{
		return $"{CorpId},{FacId},{EqpCode},{ParamId}";
	}
}

public class ParamList : List<ParamEntity>
{
    public ParamList(IEnumerable<ParamEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
