namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ParamModelEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
	public string ModelCode { get; set; } = default!;
	public string ParamId { get; set; } = default!;
	public int OperationSeqNo { get; set; } = default!;
	public string? OperationCode { get; set; }
	public string? WorkcenterCode { get; set; }
	public string? EqpCode { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }
	public string? ApproveYn { get; set; }
   

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ModelCode},{OperationSeqNo},{ParamId},{EqpCode}";
    }
}

public class ParamModelList : List<ParamModelEntity>
{
    public ParamModelList(IEnumerable<ParamModelEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
