namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EqpareaEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string EqpareagroupCode { get; set; } = default!;
	public string EqpareaCode { get; set; } = default!;
	public string EqpareaName { get; set; } = default!;
	public char UseYn { get; set; }
	public int Sort { get; set; }
	public string? Remark { get; set; }
	public DateTime CreateDt { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime UpdateDt { get; set; }
	public string? UpdateUser { get; set; }

	public override string ToString()
	{
		return $"{CorpId},{FacId},{EqpareagroupCode},{EqpareaCode}";
	}
}

public class EqpareaList : List<EqpareaEntity>
{
	public EqpareaList(IEnumerable<EqpareaEntity> list) : base(list) { }

	public override string ToString()
	{
		return string.Join(Environment.NewLine, this);
	}
}
