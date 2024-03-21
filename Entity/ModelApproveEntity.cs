namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ModelApproveEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string RequestId { get; set; } = default!;
    public string? RevCode { get; set; }
	public string ModelCode { get; set; } = default!;
	public string? ModelName { get; set; }
	public string? Type { get; set; }
	public string? Filelocation { get; set; }
	public string? Val1 { get; set; }
    public string? Val2 { get; set; }
    public string? Val3 { get; set; }
    public string ApproveYn { get; set; } = default!;
    public string? RevNote { get; set; }
    public string? ReasonNote { get; set; }
    public string? Note { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? ApproveUser { get; set; }
    public DateTime ApproveDt { get; set; }
    public string? Content { get; set; }
    public string? UpdateType { get; set; }
}

public class ModelApproveEntityList : List<ModelApproveEntity>
{
    public ModelApproveEntityList(IEnumerable<ModelApproveEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}