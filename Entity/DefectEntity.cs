namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class DefectEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string DefectgroupCode { get; set; } = default!;
    public string DefectgroupName { get; set; } = default!;
    public string DefectCode { get; set; } = default!;
    public string DefectName { get; set; } = default!;
    public char UseYn { get; set; }
    public int Sort { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{DefectgroupCode},{DefectCode},{DefectName}";
    }
}

public class DefectList : List<DefectEntity>
{
    public DefectList(IEnumerable<DefectEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
