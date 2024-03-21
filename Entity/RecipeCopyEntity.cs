using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

namespace WebApp;

//MADE BY SIFLEX
public class RecipeCopyEntity : BaseEntity
{
    public string ModelCode { get; set; } = default!;
    public int OperationSeqNo { get; set; } = default!;
    public string OperationCode { get; set; } = default!;
    public string EqpCode { get; set; } = default!;
    public string? RecipeCode { get; set; } = default!;
    public string? GroupCode { get; set; } = default!;
    public string? GroupName { get; set; } = default!;
    public string? RecipeName { get; set; } = default!;
    public string? EqpDesc { get; set; } = default!;
    public string? WorkcenterCode { get; set; } = default!;
    public string? WorkcenterDesc { get; set; } = default!;
    public float? BaseVal { get; set; } = default!;
    public string? ParamId { get; set; } = default!;
    public string? ParamName { get; set; } = default!;
    public float? Unit { get; set; } = default!;
    public float? Std { get; set; } = default!;
    public float? Lcl { get; set; } = default!;
    public float? Ucl { get; set; } = default!;
    public float? Lsl { get; set; } = default!;
    public float? Usl { get; set; } = default!;
}


public class RecipeCopyList : List<RecipeCopyEntity>
{
    public RecipeCopyList(IEnumerable<RecipeCopyEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}