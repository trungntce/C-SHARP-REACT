namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class CodeEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string CodegroupId { get; set; } = default!;
	public string CodegroupName { get; set; } = default!;
	public string CodeId { get; set; } = default!;
	public string CodeName { get; set; } = default!;
	public string? StartVal { get; set; }
	public string? EndVal { get; set; }
	public string? RuleVal { get; set; }
	public string? DefaultVal { get; set; }
	public char UseYn { get; set; }
	public int Sort { get; set; }
	public string? Remark { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }

	public override string ToString()
	{
		return $"{CorpId},{FacId},{CodegroupId},{CodeId},{CodeName}";
	}
}

public class CodeList : List<CodeEntity>
{
	public CodeList(IEnumerable<CodeEntity> list) : base(list)
	{
	}

	public override string ToString()
	{
		return string.Join(Environment.NewLine, this);
	}
}
