namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;
using Newtonsoft.Json;

public class RecipeParamMapEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ModelCode { get; set; } = default!;
    public int OperationSeqNo { get; set; }
    public string OperationCode { get; set; } = default!;
    public string EqpCode { get; set; } = default!;
    public char InterlockYn { get; set; }    
    public string? GroupCode { get; set; }
    public RecipeEntity Recipe { get; set; } = default!;
    public string RecipeJson
    {
        get
        {
            if (Recipe == null)
                return string.Empty;

            return JsonConvert.SerializeObject(Recipe);
        }
    }

    public ParamEntity Params { get; set; } = default!;
    public string ParamJson
    {
        get
        {
            if (Params == null)
                return string.Empty;

            return JsonConvert.SerializeObject(Params);
        }
    }

    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
   

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ModelCode},{OperationSeqNo},{OperationCode},{EqpCode}";
    }
}
