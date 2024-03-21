namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class OperCapaEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public int RowNo { get; set; } = default!;
    public int? OperSeqNo { get; set; }
    public string? OperGroupCode { get; set; } 
    public string? OperGroupName { get; set; }
    public int? InCapaVal { get; set; }
    public string? Unit { get; set; }
    public string? Gubun { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime CreateDt { get; set; }
	public string? UpdateUser { get; set; }
	public DateTime UpdateDt { get; set; }

	public override string ToString()
    {
        return $"{CorpId},{FacId},{RowNo}";
    }
}

public class OperCapaList : List<OperCapaEntity>
{
    public OperCapaList(IEnumerable<OperCapaEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
