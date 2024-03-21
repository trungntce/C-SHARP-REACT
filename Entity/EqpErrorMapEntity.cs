namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EqpErrorMapEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
	public string? EqpCode { get; set; }
	public string? EqpDesc { get; set; }
	public string EqpErrorCode { get; set; } = default!;
	public string? ErrorCode { get; set; }
	public string? ErrorMessage { get; set; }
	public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{EqpErrorCode}";
    }
}

public class EqpErrorMapList : List<EqpErrorMapEntity>
{
    public EqpErrorMapList(IEnumerable<EqpErrorMapEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
