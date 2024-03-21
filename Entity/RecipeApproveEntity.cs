namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ApproveEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ApproveKey { get; set; } = default!;
	public string ModelCode { get; set; } = default!;
	public string? ApproveYn { get; set; }
	public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }
	public string? Gubun { get; set; }
   

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ApproveKey},{ModelCode}";
    }
}

public class RecipApproveList : List<ApproveEntity>
{
    public RecipApproveList(IEnumerable<ApproveEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
