namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class DefectgroupEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string DefectgroupCode { get; set; } = default!;
    public string DefectgroupName { get; set; } = default!;
    public char UseYn { get; set; }
    public int Sort { get; set; }
    public string? Remark { get; set; }
    public int DefectCount { get; set; }
    public int MaxSort { get; set; }
    public DateTime CreateDt { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime UpdateDt { get; set; }
    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{DefectgroupCode},{DefectgroupName}";
    }
}

public class DefectgroupList : List<DefectgroupEntity>
{
    public DefectgroupList(IEnumerable<DefectgroupEntity> list) : base(list) { }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
