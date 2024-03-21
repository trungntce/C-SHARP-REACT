namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class RecipeModelEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
	public string ModelCode { get; set; } = default!;
    public int OperationSeqNo { get; set; } = default!;
	public string? OperationCode { get; set; }
	public string? WorkcenterCode { get; set; }
	public string RecipeCode { get; set; } = default!;
	public string? EqpCode { get; set; }
	public string? CategoryCode { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }
	public string? ApproveYn { get; set; }
   

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ModelCode},{OperationSeqNo},{RecipeCode}";
    }
}

public class RecipModelList : List<RecipeModelEntity>
{
    public RecipModelList(IEnumerable<RecipeModelEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
