namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class OperInspEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string OperCode { get; set; } = default!;
    public int RowNo { get; set; } = default!;
    public string? MaterialYn { get; set; } 
    public string? ToolYn { get; set; }
    public string? WorkerYn { get; set; }
    public string? SamplingYn { get; set; }
    public string? TotalInspYn { get; set; }
    public string? SpcYn { get; set; }
	public string? QtimeYn { get; set; }
    public string? ChemYn { get; set; }
	public string? RecipeYn { get; set; }
    public string? ParamYn { get; set; }
    public string? PanelYn { get; set; }
    public string? Remark { get; set; }
	public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime? UpdateDt { get; set; }


    //public override string ToString()
    //{
    //    return $"{CorpId},{FacId},{OperCode}";
    //}
}