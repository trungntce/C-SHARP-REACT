namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class ModelRegistedHistoryEntity : BaseEntity
{
	public string CorpId { get; set; } = default!;
	public string FacId { get; set; } = default!;
	public string ModelCode { get; set; } = default!;
	public string Laser { get; set; } = default!;
	public string Copper { get; set; } = default!;
	public string Pt { get; set; } = default!;
    public string Hp { get; set; } = default!;
    public string Psr { get; set; } = default!;
    public string Ir { get; set; } = default!;
    public string Surface { get; set; } = default!;
    public string Backend { get; set; } = default!;
    public DateTime CreateDt { get; set; }
	public string CreateUser { get; set; } = default!;
	public DateTime UpdateDt { get; set; }
    public string? UpdateUser { get; set; }
    public string? Usergroup { get; set; }
}

public class ModelRegistedHistoryList : List<ModelRegistedHistoryEntity>
{
    public ModelRegistedHistoryList(IEnumerable<ModelRegistedHistoryEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}