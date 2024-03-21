namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class SpcRuleEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;

    public int  RowNo { get; set; }
    public string OperCode { get; set; }
    public string InspectionDesc { get; set; }
    public string EqpCode { get; set; }
    public string ItemCode { get; set; }
    public string JudgeRule1R { get; set; }
	public string JudgeRule1X { get; set; }
	public string JudgeRule2 { get; set; }
	public string JudgeRule3 { get; set; }
	public string JudgeRule4 { get; set; }
	public string JudgeRule5 { get; set; }
	public string JudgeRule6 { get; set; }
	public string JudgeRule7 { get; set; }
	public string JudgeRule8 { get; set; }
    public string Remark { get; set; }


    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime? UpdateDt { get; set; }


    public override string ToString()
    {
        return $"{CorpId},{FacId}";
    }
}

public class SpcRuleSetEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
    public string OperCode { get; set; }
    public string InspectionDesc { get; set; }
    public string EqpCode { get; set; }
    public string ItemCode { get; set; }
    public string JudgeRule1R { get; set; }
    public string JudgeRule1X { get; set; }
    public string JudgeRule2 { get; set; }
    public string JudgeRule3 { get; set; }
    public string JudgeRule4 { get; set; }
    public string JudgeRule5 { get; set; }
    public string JudgeRule6 { get; set; }
    public string JudgeRule7 { get; set; }
    public string JudgeRule8 { get; set; }
    public string Remark { get; set; }
    public string CreateUser { get; set; } = default!;
	public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }



    public override string ToString()
	{
		return $"{CorpId},{FacId}";
	}
}

