namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EqpOffsetEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string ExtId { get; set; } = default!;
	public string? EqpCode { get; set; }
	public int? EqpareagroupSeq { get; set; }
	public string? EqpareagroupCode { get; set; }
	public int? EqpareaSeq { get; set; }
	public string? EqpareaCode { get; set; }
	public float? ExtMm { get; set; }
	public string? ExtMmStack { get; set; }
	public string? SpeedParamId { get; set; }
	public string? Remark { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }

	public override string ToString()
	{
		return $"{CorpId},{FacId},{ExtId}";
	}
}

public class EqpOffsetList : List<EqpOffsetEntity>
{
	public EqpOffsetList(IEnumerable<EqpOffsetEntity> list) : base(list)
	{
	}

	public override string ToString()
	{
		return string.Join(Environment.NewLine, this);
	}
}
